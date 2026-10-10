import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function RecentActivity({ activities }) {
  const { t } = useTranslation();

  return (
    <article className="bento-card span-6" aria-labelledby="card-activity-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">📝</span>
            <h3 className="card-title" id="card-activity-title">{t('recent_activity')}</h3>
          </div>
          <span className="status-badge good">Live</span>
        </div>

        <div className="activity-timeline">
          {activities && activities.length > 0 ? (
            activities.map((item, idx) => (
              <div key={item.id || idx} className="timeline-item">
                <div className={`timeline-bullet ${item.is_check ? '' : 'scheduled'}`}>
                  {item.icon || '✓'}
                </div>
                <div className="timeline-content">
                  <span className="timeline-text">{item.text}</span>
                  <span className="timeline-time">{item.time}</span>
                </div>
              </div>
            ))
          ) : (
            <>
              <div className="timeline-item">
                <div className="timeline-bullet">✓</div>
                <div className="timeline-content">
                  <span className="timeline-text">Morning check-in completed</span>
                  <span className="timeline-time">Today · 8:15 AM</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-bullet">✓</div>
                <div className="timeline-content">
                  <span className="timeline-text">Morning medicine taken</span>
                  <span className="timeline-time">Today · 8:02 AM</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-bullet scheduled">🚶</div>
                <div className="timeline-content">
                  <span className="timeline-text">Daily activity recorded (1,420 steps)</span>
                  <span className="timeline-time">Today · 9:30 AM</span>
                </div>
              </div>
              <div className="timeline-item">
                <div className="timeline-bullet scheduled">📅</div>
                <div className="timeline-content">
                  <span className="timeline-text">Appointment scheduled with Dr. Sharma</span>
                  <span className="timeline-time">Yesterday · 4:10 PM</span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="card-footer-note" style={{ marginTop: '14px' }}>
        <span>Updated automatically with recorded logs.</span>
      </div>
    </article>
  );
}
