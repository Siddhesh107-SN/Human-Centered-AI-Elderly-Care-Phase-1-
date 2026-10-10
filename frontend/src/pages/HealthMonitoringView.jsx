import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function HealthMonitoringView({ vitals, onOpenMLModal }) {
  const { t } = useTranslation();

  return (
    <section className="view-container view-section active-view" aria-labelledby="health-page-heading">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="view-title" id="health-page-heading">Detailed Health Monitoring</h2>
          <p className="view-subtitle">Continuous physiological signals and baseline trends tracked remotely.</p>
        </div>
        <button
          className="btn-secondary"
          onClick={onOpenMLModal}
          style={{ background: 'var(--primary)', color: '#fff', fontWeight: 700 }}
        >
          🤖 Run AI Risk Prediction
        </button>
      </div>

      <div className="bento-grid">
        {/* Heart Rate Detailed Card */}
        <article className="bento-card span-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">❤️</span>
              <h3 className="card-title">Heart Rate History</h3>
            </div>
            <span className="status-badge good">Average: {vitals?.heart_rate_bpm || 72} bpm</span>
          </div>
          <div style={{ margin: '16px 0' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Today's range: <strong>65 – 84 bpm</strong> (Resting baseline: 68 bpm)
            </p>
            {/* SVG Visual Trend Line */}
            <div style={{ background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <svg viewBox="0 0 400 120" style={{ width: '100%', height: '100px' }} aria-label="Heart rate trend graph showing steady normal rhythm">
                <polyline fill="none" stroke="rgba(15, 118, 110, 0.2)" strokeWidth="2" strokeDasharray="4" points="0,60 400,60" />
                <polyline
                  fill="none"
                  stroke="var(--primary)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  points="20,70 70,62 120,68 170,55 220,74 270,65 320,60 370,64"
                />
                <circle cx="370" cy="64" r="6" fill="var(--primary)" />
              </svg>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                <span>6:00 AM</span>
                <span>9:00 AM</span>
                <span>12:00 PM</span>
                <span>3:00 PM</span>
                <span>Now</span>
              </div>
            </div>
          </div>
          <div className="card-footer-note">
            <span>Status: Rhythm is regular and within your healthy baseline.</span>
          </div>
        </article>

        {/* Blood Pressure Detailed Card */}
        <article className="bento-card span-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🩸</span>
              <h3 className="card-title">Blood Pressure</h3>
            </div>
            <span className="status-badge good">Latest: {vitals?.blood_pressure || '120/80'}</span>
          </div>
          <div style={{ margin: '16px 0' }}>
            <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
              Systolic / Diastolic baseline: <strong>Stable over past 7 days</strong>
            </p>
            <div style={{ display: 'flex', gap: '14px' }}>
              <div style={{ flex: 1, background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Morning</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>120/80</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-good)', fontWeight: 700 }}>✓ Optimal</span>
              </div>
              <div style={{ flex: 1, background: 'var(--bg-card-subtle)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 700 }}>Yesterday Evening</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-main)' }}>122/82</div>
                <span style={{ fontSize: '0.85rem', color: 'var(--status-good)', fontWeight: 700 }}>✓ Normal</span>
              </div>
            </div>
          </div>
          <div className="card-footer-note">
            <span>Next cuff check suggested at 7:00 PM tonight.</span>
          </div>
        </article>

        {/* SpO2 Oxygen */}
        <article className="bento-card span-4">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🫁</span>
              <h3 className="card-title">Blood Oxygen (SpO₂)</h3>
            </div>
            <span className="status-badge good">{vitals?.blood_oxygen_pct || 98}%</span>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Healthy range is 95% – 100%. Your lungs and blood oxygen levels are strong and consistent.
          </p>
          <div className="card-footer-note">
            <span>Continuous pulse-ox monitoring is active.</span>
          </div>
        </article>

        {/* Body Temperature */}
        <article className="bento-card span-4">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🌡️</span>
              <h3 className="card-title">Body Temperature</h3>
            </div>
            <span className="status-badge good">{vitals?.temperature_f || 98.4} °F</span>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Normal range: 97.0°F – 99.0°F. No fever detected.
          </p>
          <div className="card-footer-note">
            <span>Checked automatically via wearable sensor.</span>
          </div>
        </article>

        {/* Sleep Quality Card */}
        <article className="bento-card span-4">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🌙</span>
              <h3 className="card-title">Sleep Rest</h3>
            </div>
            <span className="status-badge good">7h 45m</span>
          </div>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Restful Score: <strong>88 / 100 (Peaceful)</strong>. Calm and undisturbed sleep last night.
          </p>
          <div className="card-footer-note">
            <span>Bedtime: 10:15 PM · Wake up: 6:00 AM</span>
          </div>
        </article>
      </div>
    </section>
  );
}
