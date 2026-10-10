import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function ImportantAlerts({ alerts }) {
  const { t } = useTranslation();

  return (
    <article className="bento-card span-6" aria-labelledby="card-alerts-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">🔔</span>
            <h3 className="card-title" id="card-alerts-title">{t('important_alerts')}</h3>
          </div>
          <span className="status-badge warning">{alerts?.length || 3} Alerts</span>
        </div>

        <div className="alerts-list">
          {alerts && alerts.length > 0 ? (
            alerts.map((a, idx) => (
              <div key={a.id || idx} className={`alert-item ${a.is_urgent ? 'urgent' : (a.type === 'message' ? 'message' : '')}`}>
                <span className="alert-icon" aria-hidden="true">
                  {a.type === 'medication' ? '💊' : (a.type === 'appointment' ? '📅' : (a.type === 'message' ? '💬' : '🔔'))}
                </span>
                <div>
                  <div className="alert-title">{a.title}</div>
                  <div className="alert-desc">{a.description}</div>
                </div>
              </div>
            ))
          ) : (
            <p style={{ padding: '12px', color: 'var(--text-muted)' }}>No urgent alerts today.</p>
          )}
        </div>
      </div>

      <div className="card-footer-note" style={{ marginTop: '14px' }}>
        <span>All notifications are automatically backed up.</span>
      </div>
    </article>
  );
}
