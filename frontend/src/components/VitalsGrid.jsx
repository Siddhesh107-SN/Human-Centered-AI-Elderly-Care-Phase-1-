import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function VitalsGrid({ vitals, onOpenMLModal }) {
  const { t } = useTranslation();

  const heartRate = vitals?.heart_rate_bpm ?? 72;
  const bloodPressure = vitals?.blood_pressure ?? '120/80';
  const spo2 = vitals?.blood_oxygen_pct ?? 98;
  const temp = vitals?.temperature_f ?? 98.4;

  return (
    <article className="bento-card span-7" aria-labelledby="card-health-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">🩺</span>
            <h3 className="card-title" id="card-health-title">{t('health_overview')}</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <div className="status-badge good">
              <span className="badge-dot"></span>
              <span>{t('status_good')}</span>
            </div>
            {onOpenMLModal && (
              <button
                className="a11y-size-btn"
                onClick={onOpenMLModal}
                style={{ background: 'var(--primary-subtle)', color: 'var(--primary-dark)', fontWeight: 700 }}
                title="Run AI Stress & Health Risk Assessment"
              >
                🤖 AI Risk Check
              </button>
            )}
          </div>
        </div>

        {/* 4 Vital Health Metrics Grid */}
        <div className="vitals-grid">
          {/* Heart Rate */}
          <div className="vital-box">
            <div className="vital-header">
              <span className="vital-emoji" aria-hidden="true">❤️</span>
              <span className="vital-label">{t('heart_rate')}</span>
            </div>
            <div className="vital-value-wrap">
              <span className="vital-value">{heartRate}</span>
              <span className="vital-unit">bpm</span>
            </div>
            <span className="vital-state">{t('heart_rate_state')}</span>
          </div>

          {/* Blood Pressure */}
          <div className="vital-box">
            <div className="vital-header">
              <span className="vital-emoji" aria-hidden="true">🩸</span>
              <span className="vital-label">{t('blood_pressure')}</span>
            </div>
            <div className="vital-value-wrap">
              <span className="vital-value">{bloodPressure}</span>
              <span className="vital-unit">mmHg</span>
            </div>
            <span className="vital-state">{t('bp_state')}</span>
          </div>

          {/* SpO2 */}
          <div className="vital-box">
            <div className="vital-header">
              <span className="vital-emoji" aria-hidden="true">🫁</span>
              <span className="vital-label">{t('spo2')}</span>
            </div>
            <div className="vital-value-wrap">
              <span className="vital-value">{spo2}</span>
              <span className="vital-unit">%</span>
            </div>
            <span className="vital-state">{t('spo2_state')}</span>
          </div>

          {/* Temperature */}
          <div className="vital-box">
            <div className="vital-header">
              <span className="vital-emoji" aria-hidden="true">🌡️</span>
              <span className="vital-label">{t('temperature')}</span>
            </div>
            <div className="vital-value-wrap">
              <span className="vital-value">{temp}</span>
              <span className="vital-unit">°F</span>
            </div>
            <span className="vital-state">{t('temp_state')}</span>
          </div>
        </div>
      </div>

      <div className="card-footer-note">
        <span>{t('sensor_sync_note')}</span>
        <span style={{ fontWeight: 600 }}>{t('prototype_note')}</span>
      </div>
    </article>
  );
}
