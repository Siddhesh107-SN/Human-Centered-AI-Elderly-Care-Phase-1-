import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function ActivityMeterCard({ activitySummary, onOpenLogModal }) {
  const { t } = useTranslation();

  const totalSteps = activitySummary?.total_steps ?? 1420;
  const goalSteps = activitySummary?.goal_steps ?? 2000;
  const totalMinutes = activitySummary?.total_minutes ?? 20;
  const goalMinutes = activitySummary?.goal_minutes ?? 30;
  const stepProgress = activitySummary?.step_progress_pct ?? 71;
  const encouragement = activitySummary?.encouragement_message ?? "Great progress! Keep building a routine that feels comfortable for you.";

  return (
    <article className="bento-card span-6" aria-labelledby="card-activity-meter-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">🚶</span>
            <h3 className="card-title" id="card-activity-meter-title">{t('daily_activity_meter')}</h3>
          </div>
          <button
            className="a11y-size-btn"
            style={{ background: 'var(--primary-subtle)', color: 'var(--primary-dark)', fontWeight: 700 }}
            onClick={onOpenLogModal}
          >
            {t('record_activity_btn')}
          </button>
        </div>

        {/* Big Numbers & Goal Progress */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', margin: '14px 0' }}>
          <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Today's Steps</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
              {totalSteps.toLocaleString()} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>/ {goalSteps.toLocaleString()}</span>
            </div>
          </div>
          <div style={{ background: 'var(--bg-card-subtle)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 700 }}>Movement Time</span>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)' }}>
              {totalMinutes} <span style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>mins</span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div style={{ margin: '10px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', fontWeight: 600, marginBottom: '6px' }}>
            <span>Progress: {stepProgress}%</span>
            <span>{totalSteps >= goalSteps ? '🎉 Goal Achieved!' : `${goalSteps - totalSteps} steps to goal`}</span>
          </div>
          <div style={{ width: '100%', height: '14px', background: 'var(--border-subtle)', borderRadius: '10px', overflow: 'hidden' }}>
            <div
              style={{
                width: `${Math.min(stepProgress, 100)}%`,
                height: '100%',
                background: stepProgress >= 100 ? 'var(--status-good)' : 'var(--primary)',
                borderRadius: '10px',
                transition: 'width 0.4s ease'
              }}
            />
          </div>
        </div>

        {/* Personalized Encouragement Box */}
        <div style={{
          background: 'rgba(15, 118, 110, 0.08)',
          borderLeft: '4px solid var(--primary)',
          padding: '10px 14px',
          borderRadius: '0 var(--radius-sm) var(--radius-sm) 0',
          marginTop: '12px',
          fontSize: '0.95rem',
          lineHeight: '1.4',
          color: 'var(--text-main)'
        }}>
          💬 <em>"{encouragement}"</em>
        </div>
      </div>

      <div className="card-footer-note" style={{ marginTop: '14px' }}>
        <span>Distinguishes gentle walking from rest. Listen to your body and move at your own pace.</span>
      </div>
    </article>
  );
}
