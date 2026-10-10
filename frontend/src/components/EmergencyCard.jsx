import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function EmergencyCard() {
  const { t } = useTranslation();
  const [triggered, setTriggered] = useState(false);

  const handleHelp = () => {
    setTriggered(true);
  };

  return (
    <article className="bento-card span-12 emergency-card" aria-labelledby="card-emergency-title">
      <div className="emergency-action-box">
        <div className="emergency-info-side">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '2rem' }} aria-hidden="true">🆘</span>
            <h3 className="emergency-heading" id="card-emergency-title">{t('need_help_now')}</h3>
          </div>
          <p className="emergency-contact-detail">
            {t('emergency_contact_label')}
          </p>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            {t('emergency_subtext')}
          </p>
        </div>

        <div>
          <button
            className="emergency-get-help-btn"
            onClick={handleHelp}
            aria-label="Get Help Now - Emergency assistance"
            style={triggered ? { background: '#991b1b' } : {}}
          >
            <span aria-hidden="true">🚨</span>
            <span>{triggered ? 'Alert Sent ✓' : t('get_help_btn')}</span>
          </button>
        </div>
      </div>

      {triggered && (
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid var(--status-urgent)',
          borderRadius: 'var(--radius-md)',
          color: 'var(--status-urgent)',
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <span>🔔</span>
          <span>Emergency alert triggered! Rahul has received your high-priority signal. Keep calm, assistance is on the way.</span>
        </div>
      )}
    </article>
  );
}
