import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function MedicationCard({ medications, onMarkTaken, onNavigateView }) {
  const { t } = useTranslation();

  return (
    <article className="bento-card span-6" aria-labelledby="card-med-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">💊</span>
            <h3 className="card-title" id="card-med-title">{t('todays_medication')}</h3>
          </div>
          <button
            className="a11y-size-btn"
            style={{ textDecoration: 'underline' }}
            onClick={() => onNavigateView('medications')}
          >
            {t('full_schedule_link')}
          </button>
        </div>

        <div className="med-list">
          {medications && medications.length > 0 ? (
            medications.map((med, idx) => {
              const isTaken = med.status === 'taken';
              const icon = med.time_of_day === 'morning' ? '☀️' : (med.time_of_day === 'afternoon' ? '🍽️' : (med.time_of_day === 'night' ? '🛌' : '🌙'));

              return (
                <div key={med.schedule_id || idx} className="med-item">
                  <div className="med-info">
                    <div className="med-icon-box" aria-hidden="true">{icon}</div>
                    <div>
                      <div className="med-name">{med.medicine_name}</div>
                      <div className="med-meta">
                        {med.dosage} · {med.scheduled_time} · {med.meal_relation || 'With water'}
                      </div>
                    </div>
                  </div>
                  <button
                    className={`med-action-btn ${isTaken ? 'taken' : ''}`}
                    onClick={() => onMarkTaken(med.schedule_id, isTaken ? 'pending' : 'taken')}
                    aria-label={`Mark ${med.medicine_name} as ${isTaken ? 'pending' : 'taken'}`}
                  >
                    {isTaken ? t('taken_btn') : t('mark_as_taken')}
                  </button>
                </div>
              );
            })
          ) : (
            <p style={{ padding: '12px', color: 'var(--text-muted)' }}>No medicines scheduled for today.</p>
          )}
        </div>
      </div>

      <div className="card-footer-note">
        <span>{t('next_dose_label')} <strong>Multivitamin at 1:00 PM</strong></span>
      </div>
    </article>
  );
}
