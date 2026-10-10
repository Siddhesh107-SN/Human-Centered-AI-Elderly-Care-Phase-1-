import React from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { VitalsGrid } from '../components/VitalsGrid';
import { DailyCheckIn } from '../components/DailyCheckIn';
import { MedicationCard } from '../components/MedicationCard';
import { NextAppointment } from '../components/NextAppointment';
import { ImportantAlerts } from '../components/ImportantAlerts';
import { ActivityMeterCard } from '../components/ActivityMeterCard';
import { RecentActivity } from '../components/RecentActivity';
import { EmergencyCard } from '../components/EmergencyCard';

export function DashboardView({
  dashboardData,
  onMarkMedTaken,
  onNavigateView,
  onOpenMLModal,
  onOpenActivityModal,
}) {
  const { t } = useTranslation();

  return (
    <section className="view-container view-section active-view" aria-labelledby="dashboard-heading">
      <div className="view-header">
        <h2 className="view-title" id="dashboard-heading">{t('today_overview')}</h2>
        <p className="view-subtitle">{t('today_subtitle')}</p>
      </div>

      <div className="bento-grid">
        {/* Bento 1: Health Overview */}
        <VitalsGrid vitals={dashboardData?.vitals} onOpenMLModal={onOpenMLModal} />

        {/* Bento 2: Daily Check-In */}
        <DailyCheckIn />

        {/* Bento 3: Today's Medication */}
        <MedicationCard
          medications={dashboardData?.today_medications}
          onMarkTaken={onMarkMedTaken}
          onNavigateView={onNavigateView}
        />

        {/* Bento 4: Next Appointment */}
        <NextAppointment onNavigateView={onNavigateView} />

        {/* Bento 5: Activity Meter & Encouragement */}
        <ActivityMeterCard
          activitySummary={dashboardData?.activity_summary}
          onOpenLogModal={onOpenActivityModal}
        />

        {/* Bento 6: Important Alerts */}
        <ImportantAlerts alerts={dashboardData?.alerts} />

        {/* Bento 7: Recent Activity Timeline */}
        <RecentActivity activities={dashboardData?.recent_activities} />

        {/* Bento 8: Emergency & Help */}
        <EmergencyCard />
      </div>
    </section>
  );
}
