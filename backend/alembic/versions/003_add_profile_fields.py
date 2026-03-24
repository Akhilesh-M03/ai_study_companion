"""Add profile fields to users table.

Revision ID: 003_add_profile_fields
Revises: 002_add_syllabus_tables
Create Date: 2026-03-24 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "003_add_profile_fields"
down_revision: Union[str, None] = "002_add_syllabus_tables"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("users", sa.Column("student_id", sa.String(), nullable=True))
    op.create_index(op.f("ix_users_student_id"), "users", ["student_id"], unique=True)
    op.add_column(
        "users",
        sa.Column(
            "daily_study_hours",
            sa.Integer(),
            server_default=sa.text("1"),
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "dsa_problems_per_day",
            sa.Integer(),
            server_default=sa.text("5"),
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "revision_minutes_per_day",
            sa.Integer(),
            server_default=sa.text("30"),
            nullable=False,
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "weekly_streak", sa.Integer(), server_default=sa.text("0"), nullable=False
        ),
    )
    op.add_column(
        "users",
        sa.Column(
            "quizzes_completed",
            sa.Integer(),
            server_default=sa.text("0"),
            nullable=False,
        ),
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_users_student_id"), table_name="users")
    op.drop_column("users", "quizzes_completed")
    op.drop_column("users", "weekly_streak")
    op.drop_column("users", "revision_minutes_per_day")
    op.drop_column("users", "dsa_problems_per_day")
    op.drop_column("users", "daily_study_hours")
    op.drop_column("users", "student_id")
