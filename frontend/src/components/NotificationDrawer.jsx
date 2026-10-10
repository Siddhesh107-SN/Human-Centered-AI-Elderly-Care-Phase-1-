import React from 'react';

export function NotificationDrawer({ isOpen, alerts, onClear }) {
  if (!isOpen) return null;

  return (
    <div className="notifications-panel active" role="region" aria-label="Notifications panel">
      <div className="notif-panel-header">
        <h3 className="notif-panel-title">Notifications</h3>
        <button className="a11y-size-btn" onClick={onClear}>Clear</button>
      </div>
      <div className="alerts-list">
        {alerts && alerts.length > 0 ? (
          alerts.map((alert, idx) => (
            <div key={alert.id || idx} className={`alert-item ${alert.is_urgent ? 'urgent' : (alert.type === 'message' ? 'message' : '')}`}>
              <span className="alert-icon" aria-hidden="true">
                {alert.type === 'medication' ? '💊' : (alert.type === 'appointment' ? '📅' : (alert.type === 'message' ? '💬' : '🔔'))}
              </span>
              <div>
                <div className="alert-title">{alert.title}</div>
                <div className="alert-desc">{alert.description}</div>
              </div>
            </div>
          ))
        ) : (
          <p style={{ padding: '16px', color: 'var(--text-muted)', fontSize: '0.95rem' }}>No new notifications.</p>
        )}
      </div>
    </div>
  );
}
