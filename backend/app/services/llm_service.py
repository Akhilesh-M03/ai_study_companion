"""Groq-backed LLM service helpers."""

import json
import re
from typing import Any, Dict, Optional, Sequence

from groq import Groq

from app.core.config import GROQ_API_KEY, GROQ_MODEL_NAME

SYSTEM_PROMPT = (
    "You are an AI Study Companion that generates quiz questions and explains "
    "answers simply."
)

CHAT_HISTORY_LIMIT = 8


def _get_client() -> Groq:
    """Create a Groq client and fail clearly when config is missing."""

    if not GROQ_API_KEY:
        raise RuntimeError("GROQ_API_KEY is not configured")
    return Groq(api_key=GROQ_API_KEY)


def safe_parse_json(raw_text: str) -> Optional[Dict[str, Any]]:
    """Safely parse a JSON object from model output text."""

    if not raw_text:
        return None

    cleaned = raw_text.strip()
    if cleaned.startswith("```"):
        cleaned = re.sub(r"^```(?:json)?", "", cleaned, flags=re.IGNORECASE).strip()
        cleaned = re.sub(r"```$", "", cleaned).strip()

    try:
        parsed = json.loads(cleaned)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        pass

    start = cleaned.find("{")
    end = cleaned.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return None

    candidate = cleaned[start : end + 1]
    try:
        parsed = json.loads(candidate)
        return parsed if isinstance(parsed, dict) else None
    except json.JSONDecodeError:
        return None


def _strip_think_sections(text: str) -> str:
    """Remove hidden model reasoning blocks if present."""

    return re.sub(r"<think\\b[^>]*>[\\s\\S]*?</think>", "", text, flags=re.IGNORECASE)


def _build_chat_messages(
    prompt: str,
    history: Optional[Sequence[Any]] = None,
) -> list[dict[str, str]]:
    """Build a bounded chat payload with validated prior turns."""

    messages: list[dict[str, str]] = [{"role": "system", "content": SYSTEM_PROMPT}]

    if history:
        cleaned_history = []
        for item in history[-CHAT_HISTORY_LIMIT:]:
            if isinstance(item, dict):
                role = item.get("role")
                content = item.get("content")
            else:
                role = getattr(item, "role", None)
                content = getattr(item, "content", None)
            if role not in {"user", "assistant"}:
                continue
            if not isinstance(content, str):
                continue
            normalized = content.strip()
            if not normalized:
                continue
            if role == "assistant":
                normalized = _strip_think_sections(normalized).strip()
                if not normalized:
                    continue
            cleaned_history.append({"role": role, "content": normalized})

        messages.extend(cleaned_history)

    messages.append({"role": "user", "content": prompt})
    return messages


def ask_llm(prompt: str, history: Optional[Sequence[Any]] = None) -> str:
    """Send a plain chat prompt to the model and return text output."""

    client = _get_client()
    response = client.chat.completions.create(
        messages=_build_chat_messages(prompt=prompt, history=history),
        model=GROQ_MODEL_NAME,
        temperature=0.3,
    )
    return _strip_think_sections(response.choices[0].message.content or "").strip()


def _validate_quiz_question_payload(question_data: Dict[str, Any]) -> Dict[str, Any]:
    """Validate one generated MCQ object and return normalized values."""

    question = question_data.get("question")
    options = question_data.get("options")
    correct_idx = question_data.get("correct_option_index")
    explanation = question_data.get("explanation")

    if not isinstance(question, str) or not question.strip():
        raise RuntimeError("LLM response missing valid 'question'")
    if not isinstance(explanation, str) or not explanation.strip():
        raise RuntimeError("LLM response missing valid 'explanation'")
    if (
        not isinstance(options, list)
        or len(options) != 4
        or not all(isinstance(opt, str) and opt.strip() for opt in options)
    ):
        raise RuntimeError("LLM response must contain exactly 4 non-empty options")
    if not isinstance(correct_idx, int) or correct_idx < 0 or correct_idx > 3:
        raise RuntimeError("LLM response has invalid 'correct_option_index'")

    return {
        "question": question.strip(),
        "options": [opt.strip() for opt in options],
        "correct_option_index": correct_idx,
        "explanation": explanation.strip(),
    }


def generate_quiz_questions(
    topic: str, difficulty: str = "medium", count: int = 2
) -> Dict[str, Any]:
    """Generate a strict JSON batch of MCQs for a topic."""

    if count <= 0:
        raise RuntimeError("count must be greater than 0")

    client = _get_client()
    prompt = (
        f"Generate exactly {count} multiple-choice questions as strict JSON only.\n"
        "Do not include markdown, prose, or code fences.\n"
        "Schema:\n"
        '{"questions":[{"question":"string","options":["a","b","c","d"],"correct_option_index":0,"explanation":"string"}]}\n'
        f"Topic: {topic}\n"
        f"Difficulty: {difficulty}\n"
        "Rules:\n"
        f"- return exactly {count} questions\n"
        "- options must contain exactly 4 concise options\n"
        "- correct_option_index must be an integer 0..3\n"
        "- explanation must be 1-2 simple sentences for beginners\n"
        "- exactly one correct answer\n"
        "- return JSON object only"
    )

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            model=GROQ_MODEL_NAME,
            temperature=0.2,
            max_tokens=950,
        )
    except Exception as exc:
        raise RuntimeError(f"Groq API error while generating questions: {exc}") from exc

    raw = (response.choices[0].message.content or "").strip()
    parsed = safe_parse_json(raw)
    if not parsed:
        raise RuntimeError("Failed to parse JSON from LLM response")

    questions = parsed.get("questions")
    if not isinstance(questions, list) or len(questions) != count:
        raise RuntimeError(f"LLM response must contain exactly {count} questions")

    cleaned_questions = []
    for item in questions:
        if not isinstance(item, dict):
            raise RuntimeError("Each question must be a JSON object")
        cleaned_questions.append(_validate_quiz_question_payload(item))

    return {"questions": cleaned_questions}


def generate_quiz_question(topic: str, difficulty: str = "medium") -> Dict[str, Any]:
    """Backward-compatible helper returning one generated question."""

    result = generate_quiz_questions(topic=topic, difficulty=difficulty, count=1)
    return result["questions"][0]


def extract_subject_topic_outline(text: str) -> Dict[str, Any]:
    """Extract structured subject/topic outline from raw syllabus text."""

    trimmed = (text or "").strip()
    if not trimmed:
        raise RuntimeError("Syllabus text is empty")

    # Keep prompt size bounded for reliability and lower latency/cost.
    if len(trimmed) > 12000:
        trimmed = trimmed[:12000]

    client = _get_client()
    prompt = (
        "Extract subjects and topics from the syllabus text. Return strict JSON only.\n"
        "No markdown, no explanation.\n"
        "Schema:\n"
        '{"subjects":[{"name":"string","topics":["string"]}]}\n'
        "Rules:\n"
        "- subjects must be unique and concise\n"
        "- topics should be specific and unique within each subject\n"
        "- if only one broad subject is present, still return one subject object\n"
        "- output JSON object only\n"
        f"Syllabus text:\n{trimmed}"
    )

    try:
        response = client.chat.completions.create(
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": prompt},
            ],
            model=GROQ_MODEL_NAME,
            temperature=0.1,
            max_tokens=900,
        )
    except Exception as exc:
        raise RuntimeError(f"Groq API error while extracting syllabus: {exc}") from exc

    raw = (response.choices[0].message.content or "").strip()
    parsed = safe_parse_json(raw)
    if not parsed:
        raise RuntimeError("Failed to parse syllabus JSON from LLM response")

    subjects = parsed.get("subjects")
    if not isinstance(subjects, list) or not subjects:
        raise RuntimeError("LLM response missing valid 'subjects' list")

    normalized_subjects = []
    for subject in subjects:
        if not isinstance(subject, dict):
            continue

        name = (subject.get("name") or "").strip()
        topics = subject.get("topics")
        if not name or not isinstance(topics, list):
            continue

        clean_topics = []
        seen = set()
        for topic in topics:
            if not isinstance(topic, str):
                continue
            clean = topic.strip()
            if not clean:
                continue
            lower = clean.lower()
            if lower in seen:
                continue
            seen.add(lower)
            clean_topics.append(clean)

        if clean_topics:
            normalized_subjects.append({"name": name, "topics": clean_topics})

    if not normalized_subjects:
        raise RuntimeError("LLM response did not contain usable subjects/topics")

    return {"subjects": normalized_subjects}
