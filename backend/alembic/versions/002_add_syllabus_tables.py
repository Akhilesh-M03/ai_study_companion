"""Add syllabus and syllabus_topic tables.

Revision ID: 002_add_syllabus_tables
Revises: 001_initial_schema
Create Date: 2026-03-24 00:00:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "002_add_syllabus_tables"
down_revision: Union[str, None] = "001_initial_schema"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "syllabi",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.String(), nullable=False),
        sa.Column("source_filename", sa.String(), nullable=False),
        sa.Column("source_filetype", sa.String(), nullable=False),
        sa.Column("raw_text", sa.Text(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.Column(
            "updated_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_syllabi_id"), "syllabi", ["id"], unique=False)
    op.create_index(op.f("ix_syllabi_user_id"), "syllabi", ["user_id"], unique=False)

    op.create_table(
        "syllabus_topics",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("syllabus_id", sa.Integer(), nullable=False),
        sa.Column("subject", sa.String(), nullable=False),
        sa.Column("topic", sa.String(), nullable=False),
        sa.Column(
            "created_at",
            sa.DateTime(),
            server_default=sa.text("now()"),
            nullable=False,
        ),
        sa.ForeignKeyConstraint(["syllabus_id"], ["syllabi.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(
        op.f("ix_syllabus_topics_id"),
        "syllabus_topics",
        ["id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_syllabus_topics_syllabus_id"),
        "syllabus_topics",
        ["syllabus_id"],
        unique=False,
    )
    op.create_index(
        op.f("ix_syllabus_topics_subject"),
        "syllabus_topics",
        ["subject"],
        unique=False,
    )
    op.create_index(
        op.f("ix_syllabus_topics_topic"),
        "syllabus_topics",
        ["topic"],
        unique=False,
    )


def downgrade() -> None:
    op.drop_index(op.f("ix_syllabus_topics_topic"), table_name="syllabus_topics")
    op.drop_index(op.f("ix_syllabus_topics_subject"), table_name="syllabus_topics")
    op.drop_index(op.f("ix_syllabus_topics_syllabus_id"), table_name="syllabus_topics")
    op.drop_index(op.f("ix_syllabus_topics_id"), table_name="syllabus_topics")
    op.drop_table("syllabus_topics")

    op.drop_index(op.f("ix_syllabi_user_id"), table_name="syllabi")
    op.drop_index(op.f("ix_syllabi_id"), table_name="syllabi")
    op.drop_table("syllabi")
