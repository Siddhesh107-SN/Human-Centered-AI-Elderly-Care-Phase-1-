from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from backend.app.api.deps import get_db, get_current_user
from backend.app.models.user import User
from backend.app.models.prediction import HealthPrediction
from backend.app.schemas.dashboard import (
    DashboardSummary,
    DashboardVitals,
    DashboardAlertItem,
)
from backend.app.schemas.prediction import PredictionResponse
from backend.app.api.v1.endpoints.medicines import get_today_medications
from backend.app.api.v1.endpoints.activities import get_today_activity_summary

router = APIRouter()


@router.get("/summary", response_model=DashboardSummary, summary="Integrated Dashboard Summary")
def get_dashboard_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    # Today's medicines
    meds = get_today_medications(db=db, current_user=current_user)
    taken_count = sum(1 for m in meds if m.status == "taken")
    total_count = len(meds)

    # Today's activity
    activity = get_today_activity_summary(db=db, current_user=current_user)

    latest_pred = None
    try:
        latest_pred_record = (
            db.query(HealthPrediction)
            .filter(HealthPrediction.user_id == current_user.id)
            .order_by(HealthPrediction.created_at.desc())
            .first()
        )

        if latest_pred_record:
            latest_pred = PredictionResponse(
                success=True,
                model=latest_pred_record.model_name,
                prediction=latest_pred_record.prediction,
                label=latest_pred_record.label,
                probability=latest_pred_record.probability,
                health_risk_score=latest_pred_record.health_risk_score,
                risk_tier=latest_pred_record.risk_tier,
                risk_assessment=latest_pred_record.risk_assessment,
                id=latest_pred_record.id,
                created_at=latest_pred_record.created_at,
            )
    except Exception:
        pass

    alerts = [
        DashboardAlertItem(
            id="notif-1",
            type="medication",
            title="Medication Reminder",
            description="Afternoon multivitamin due at 1:00 PM.",
            is_urgent=True,
        ),
        DashboardAlertItem(
            id="notif-2",
            type="appointment",
            title="Upcoming Appointment",
            description="Check-up with Dr. Sharma tomorrow at 10:30 AM.",
            is_urgent=False,
        ),
        DashboardAlertItem(
            id="notif-3",
            type="message",
            title="Message from Rahul (Son)",
            description='"Hi Mom, I will come by at 5:00 PM today!"',
            is_urgent=False,
        ),
    ]

    return DashboardSummary(
        user_name=current_user.full_name if current_user else "Meera Patel",
        greeting=f"Good morning, {current_user.full_name.split()[0] if current_user and current_user.full_name else 'Meera'} 👋",
        role=current_user.role if current_user else "senior",
        vitals=DashboardVitals(),
        today_medications=meds,
        medications_taken_count=taken_count,
        medications_total_count=total_count,
        activity_summary=activity,
        latest_prediction=latest_pred,
        alerts=alerts,
    )
