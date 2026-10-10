import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function NextAppointment({ onNavigateView }) {
  const { t } = useTranslation();

  return (
    <article className="bento-card span-6" aria-labelledby="card-appt-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">📅</span>
            <h3 className="card-title" id="card-appt-title">{t('next_appointment')}</h3>
          </div>
          <div className="status-badge info">
            <span className="badge-dot"></span>
            <span>{t('tomorrow')}</span>
          </div>
        </div>

        <div className="appointment-detail-box">
          <div className="doctor-profile-row">
            <div className="doctor-avatar" aria-hidden="true">👨‍⚕️</div>
            <div>
              <h4 className="doctor-name">{t('dr_sharma')}</h4>
              <p className="doctor-spec">{t('dr_sharma_spec')}</p>
            </div>
          </div>

          <div className="appt-time-pill">
            <span aria-hidden="true">⏰</span>
            <span>{t('appt_time')}</span>
          </div>

          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            📍 <strong>Wellness Family Health Clinic</strong> (Room 204) or Video Telehealth available.
          </p>
        </div>

        <button
          className="btn-secondary"
          onClick={() => onNavigateView('appointments')}
          aria-label="View appointment details with Dr. Sharma"
        >
          <span>{t('view_appt_details')}</span>
          <span aria-hidden="true">→</span>
        </button>
      </div>

      <div className="card-footer-note" style={{ marginTop: '14px' }}>
        <span>{t('caregiver_accompany')}</span>
      </div>
    </article>
  );
}
