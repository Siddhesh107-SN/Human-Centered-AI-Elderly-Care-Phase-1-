"""Initial normalized schema for CarePulse AI Elderly Care

Revision ID: 001_initial_schema
Revises: 
Create Date: 2026-10-09 12:00:00.000000

"""
from alembic import op
import sqlalchemy as sa

revision = '001_initial_schema'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # 1. users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('full_name', sa.String(length=255), nullable=False, server_default='Senior User'),
        sa.Column('age', sa.Integer(), nullable=True, server_default='70'),
        sa.Column('role', sa.String(length=50), nullable=False, server_default='senior'),
        sa.Column('emergency_contact_name', sa.String(length=255), nullable=True, server_default='Rahul (Son)'),
        sa.Column('emergency_contact_phone', sa.String(length=50), nullable=True, server_default='(555) 019-2834'),
        sa.Column('preferred_language', sa.String(length=10), nullable=False, server_default='en'),
        sa.Column('font_size_preference', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('daily_step_goal', sa.Integer(), nullable=False, server_default='2000'),
        sa.Column('daily_activity_goal_minutes', sa.Integer(), nullable=False, server_default='30'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.Column('updated_at', sa.DateTime(), nullable=False),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_users_email'), 'users', ['email'], unique=True)
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # 2. medicine_library table
    op.create_table(
        'medicine_library',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=255), nullable=False),
        sa.Column('purpose', sa.String(length=255), nullable=True),
        sa.Column('dosage', sa.String(length=100), nullable=False),
        sa.Column('form', sa.String(length=50), nullable=False, server_default='tablet'),
        sa.Column('instructions', sa.Text(), nullable=True),
        sa.Column('doctor_name', sa.String(length=255), nullable=True, server_default='Dr. Sharma'),
        sa.Column('refill_days_remaining', sa.Integer(), nullable=True, server_default='30'),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_medicine_library_id'), 'medicine_library', ['id'], unique=False)
    op.create_index(op.f('ix_medicine_library_name'), 'medicine_library', ['name'], unique=False)
    op.create_index(op.f('ix_medicine_library_user_id'), 'medicine_library', ['user_id'], unique=False)

    # 3. medicine_schedules table
    op.create_table(
        'medicine_schedules',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('medicine_id', sa.Integer(), nullable=False),
        sa.Column('time_of_day', sa.String(length=50), nullable=False, server_default='morning'),
        sa.Column('scheduled_time', sa.String(length=20), nullable=False, server_default='08:00'),
        sa.Column('days_of_week', sa.String(length=100), nullable=False, server_default='mon,tue,wed,thu,fri,sat,sun'),
        sa.Column('meal_relation', sa.String(length=100), nullable=True, server_default='after_food'),
        sa.Column('start_date', sa.Date(), nullable=False),
        sa.Column('end_date', sa.Date(), nullable=True),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default=sa.text('1')),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['medicine_id'], ['medicine_library.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_medicine_schedules_id'), 'medicine_schedules', ['id'], unique=False)
    op.create_index(op.f('ix_medicine_schedules_medicine_id'), 'medicine_schedules', ['medicine_id'], unique=False)
    op.create_index(op.f('ix_medicine_schedules_user_id'), 'medicine_schedules', ['user_id'], unique=False)

    # 4. medicine_logs table
    op.create_table(
        'medicine_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('schedule_id', sa.Integer(), nullable=False),
        sa.Column('status', sa.String(length=50), nullable=False, server_default='pending'),
        sa.Column('scheduled_for', sa.DateTime(), nullable=False),
        sa.Column('logged_at', sa.DateTime(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['schedule_id'], ['medicine_schedules.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_medicine_logs_id'), 'medicine_logs', ['id'], unique=False)
    op.create_index(op.f('ix_medicine_logs_scheduled_for'), 'medicine_logs', ['scheduled_for'], unique=False)
    op.create_index(op.f('ix_medicine_logs_user_id'), 'medicine_logs', ['user_id'], unique=False)

    # 5. activity_logs table
    op.create_table(
        'activity_logs',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('activity_type', sa.String(length=100), nullable=False, server_default='walking'),
        sa.Column('duration_minutes', sa.Integer(), nullable=False, server_default='15'),
        sa.Column('step_count', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('calories_burned', sa.Float(), nullable=True, server_default='0.0'),
        sa.Column('is_automatic', sa.Boolean(), nullable=False, server_default=sa.text('0')),
        sa.Column('recorded_date', sa.Date(), nullable=False),
        sa.Column('recorded_at', sa.DateTime(), nullable=False),
        sa.Column('notes', sa.Text(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_activity_logs_id'), 'activity_logs', ['id'], unique=False)
    op.create_index(op.f('ix_activity_logs_recorded_date'), 'activity_logs', ['recorded_date'], unique=False)
    op.create_index(op.f('ix_activity_logs_user_id'), 'activity_logs', ['user_id'], unique=False)

    # 6. health_predictions table
    op.create_table(
        'health_predictions',
        sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('model_name', sa.String(length=100), nullable=False, server_default='xgboost'),
        sa.Column('heart_rate_bpm', sa.Float(), nullable=False),
        sa.Column('blood_oxygen_level', sa.Float(), nullable=False),
        sa.Column('step_count', sa.Float(), nullable=False),
        sa.Column('sleep_duration_hours', sa.Float(), nullable=False),
        sa.Column('activity_level', sa.String(length=50), nullable=False),
        sa.Column('stress_level', sa.Float(), nullable=False),
        sa.Column('prediction', sa.Integer(), nullable=False),
        sa.Column('label', sa.String(length=100), nullable=False),
        sa.Column('probability', sa.Float(), nullable=False),
        sa.Column('health_risk_score', sa.Float(), nullable=True),
        sa.Column('risk_tier', sa.String(length=50), nullable=True),
        sa.Column('risk_assessment', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_health_predictions_created_at'), 'health_predictions', ['created_at'], unique=False)
    op.create_index(op.f('ix_health_predictions_id'), 'health_predictions', ['id'], unique=False)
    op.create_index(op.f('ix_health_predictions_user_id'), 'health_predictions', ['user_id'], unique=False)


def downgrade() -> None:
    op.drop_table('health_predictions')
    op.drop_table('activity_logs')
    op.drop_table('medicine_logs')
    op.drop_table('medicine_schedules')
    op.drop_table('medicine_library')
    op.drop_table('users')
