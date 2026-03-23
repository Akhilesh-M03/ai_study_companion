"""Chat and quiz generation endpoints."""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.chat import ChatRequest
from app.schemas.quiz import GenerateQuestionRequest, GenerateQuestionResponse
from app.core.database import get_db
from app.services.llm_service import ask_llm, generate_quiz_questions
from app.services.memory_service import get_memories, recommend_topics
from app.services.syllabus_service import get_user_topics

router = APIRouter()


@router.post("/chat", response_model=dict)
async def chat_with_ai(chat_request: ChatRequest):
    """Forward a user message to the configured LLM provider."""

    if not chat_request.message or not chat_request.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Message cannot be empty",
        )

    try:
        reply = ask_llm(chat_request.message.strip())
        return {"reply": reply}
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="Failed to get response from AI provider",
        )


@router.post("/generate-question", response_model=GenerateQuestionResponse)
async def generate_question(
    payload: GenerateQuestionRequest,
    db: Session = Depends(get_db),
):
    """Generate two MCQs for a given topic and difficulty."""

    try:
        topic = payload.topic.strip()
        difficulty = payload.difficulty
        recommendation_applied = False
        recommendation_reason = None

        allowed_topics: set[str] = set()
        if payload.user_id:
            user_id = payload.user_id.strip()
            syllabus_topics, _ = get_user_topics(db, user_id)
            allowed_topics = {item.lower() for item in syllabus_topics}

        if payload.user_id and payload.use_recommendations:
            memories = await get_memories(payload.user_id.strip())
            recommendations = recommend_topics(memories, limit=1)
            if recommendations:
                top_pick = recommendations[0]
                recommended_topic = (top_pick.get("topic") or "").strip()
                recommended_difficulty = (
                    (top_pick.get("recommended_difficulty") or "").strip().lower()
                )

                if recommended_topic and (
                    not allowed_topics or recommended_topic.lower() in allowed_topics
                ):
                    topic = recommended_topic

                if recommended_difficulty in {"easy", "medium", "hard"}:
                    difficulty = recommended_difficulty

                recommendation_applied = True
                recommendation_reason = top_pick.get("reason")

        if allowed_topics and topic.lower() not in allowed_topics:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Requested topic is not in user's uploaded syllabus",
            )

        question_data = generate_quiz_questions(
            topic=topic,
            difficulty=difficulty,
            count=payload.question_count,
        )
        return GenerateQuestionResponse.model_validate(
            {
                "topic": topic,
                "difficulty": difficulty,
                "batch_size": payload.question_count,
                "questions": question_data.get("questions", []),
                "recommendation_applied": recommendation_applied,
                "recommendation_reason": recommendation_reason,
            }
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=str(exc),
        ) from exc
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Unexpected error: {exc}",
        ) from exc
