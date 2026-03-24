"""Memory storage and learning insight routes."""

from fastapi import APIRouter, Depends, HTTPException, status

from app.api.deps import get_current_user
from app.schemas.auth import TokenData
from app.schemas.memory import StoreMemoryBatchRequest, StoreMemoryRequest
from app.services.memory_service import (
    calculate_insights,
    filter_weak_topics,
    get_memories,
    recommend_topics,
    store_memory,
)

router = APIRouter()


def _validate_user_scope(requested_user_id: str, current_user: TokenData) -> str:
    clean_user_id = requested_user_id.strip()
    if not clean_user_id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="user_id cannot be empty",
        )

    if current_user.username != clean_user_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to access data for this user_id",
        )

    return clean_user_id


@router.post("/store-memory-batch", response_model=dict)
async def store_memory_batch(
    payload: StoreMemoryBatchRequest,
    current_user: TokenData = Depends(get_current_user),
):
    """Store exactly two quiz attempts in memory."""

    clean_user_id = _validate_user_scope(payload.user_id, current_user)
    stored_count = 0
    for attempt in payload.attempts:
        success = await store_memory(
            {
                "user_id": clean_user_id,
                "topic": attempt.topic,
                "mistake_type": attempt.mistake_type,
                "difficulty": attempt.difficulty,
                "score": attempt.score,
                "question_id": attempt.question_id,
                "subtopic": attempt.subtopic,
                "confidence": attempt.confidence,
                "time_spent_seconds": attempt.time_spent_seconds,
                "source": attempt.source,
                "session_id": attempt.session_id,
                "user_answer": attempt.user_answer,
                "correct_answer": attempt.correct_answer,
            }
        )
        if success:
            stored_count += 1

    if stored_count != 2:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Stored {stored_count}/2 attempts in memory",
        )

    return {
        "message": "Memory updated for 2 attempts",
        "stored_count": stored_count,
        "status": "success",
    }


@router.post("/store-memory")
async def store_quiz_memory(
    quiz_data: StoreMemoryRequest,
    current_user: TokenData = Depends(get_current_user),
):
    """Store one quiz attempt for later insight generation."""

    _validate_user_scope(quiz_data.user_id, current_user)
    success = await store_memory(quiz_data.model_dump())

    if success:
        return {"message": "Quiz memory stored successfully", "status": "success"}

    raise HTTPException(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        detail="Failed to store memory",
    )


@router.get("/weak-topics/{user_id}")
async def get_weak_topics(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Return unique topics where the user has weak quiz performance."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    memories = await get_memories(clean_user_id)
    if not memories:
        return {
            "user_id": clean_user_id,
            "weak_topics": [],
            "message": "No quiz records found for this user",
        }

    weak_topics = filter_weak_topics(memories)
    return {
        "user_id": clean_user_id,
        "weak_topics": weak_topics,
        "count": len(weak_topics),
    }


@router.get("/mistakes/{user_id}")
async def get_past_mistakes(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Return detailed list of past mistakes for a user."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    memories = await get_memories(clean_user_id)
    if not memories:
        return {
            "user_id": clean_user_id,
            "mistakes": [],
            "message": "No quiz records found for this user",
        }

    mistakes = []
    for memory in memories:
        if memory.get("score", 0) < 100:
            mistakes.append(
                {
                    "topic": memory.get("topic"),
                    "mistake_type": memory.get("mistake_type"),
                    "score": memory.get("score"),
                    "difficulty": memory.get("difficulty"),
                    "timestamp": memory.get("timestamp"),
                }
            )

    return {
        "user_id": clean_user_id,
        "mistakes": mistakes,
        "total_mistakes": len(mistakes),
    }


@router.get("/insights/{user_id}")
async def get_learning_insights(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Return aggregate learning insights computed from memory history."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    memories = await get_memories(clean_user_id)
    if not memories:
        return {
            "user_id": clean_user_id,
            "insights": {
                "weak_topics": [],
                "strong_topics": [],
                "most_common_mistake_type": None,
            },
            "message": "No quiz records found for this user",
        }

    insights = calculate_insights(memories)
    return {
        "user_id": clean_user_id,
        "insights": insights,
        "total_records": len(memories),
    }


@router.get("/recommendations/{user_id}")
async def get_topic_recommendations(
    user_id: str,
    current_user: TokenData = Depends(get_current_user),
):
    """Return prioritized next topics and actions based on learning memory."""

    clean_user_id = _validate_user_scope(user_id, current_user)

    memories = await get_memories(clean_user_id)
    if not memories:
        return {
            "user_id": clean_user_id,
            "recommendations": [],
            "message": "No quiz records found for this user",
        }

    recommendations = recommend_topics(memories)
    return {
        "user_id": clean_user_id,
        "recommendations": recommendations,
        "total_records": len(memories),
    }
