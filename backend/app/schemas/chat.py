"""AI chat request schemas."""

from typing import Literal

from pydantic import BaseModel, Field


class ChatHistoryMessage(BaseModel):
    """One historical chat turn from user or assistant."""

    role: Literal["user", "assistant"]
    content: str


class ChatRequest(BaseModel):
    """Incoming chat message payload."""

    message: str
    history: list[ChatHistoryMessage] = Field(default_factory=list)
