import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function AppointmentsView() {
  const { t } = useTranslation();

  return (
    <section className="view-container view-section active-view" aria-labelledby="appt-page-heading">
      <div className="view-header">
        <h2 className="view-title" id="appt-page-heading">Appointments & Consultations</h2>
        <p className="view-subtitle">Upcoming medical reviews, transport arrangements, and telehealth links.</p>
      </div>

      <div className="bento-grid">
        {/* Main Appointment Detail */}
        <article className="bento-card span-8">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">📅</span>
              <h3 className="card-title">Next Visit: Dr. Sharma</h3>
            </div>
            <span className="status-badge info">Tomorrow</span>
          </div>

          <div className="appointment-detail-box" style={{ margin: '16px 0' }}>
            <div className="doctor-profile-row">
              <div className="doctor-avatar" aria-hidden="true">👨‍⚕️</div>
              <div>
                <h4 className="doctor-name">Dr. Sharma</h4>
                <p className="doctor-spec">Senior Geriatrician · General Check-up & Vitals Review</p>
              </div>
            </div>

            <div className="appt-time-pill" style={{ margin: '14px 0' }}>
              <span aria-hidden="true">⏰</span>
              <span>Tomorrow (Thursday) · 10:30 AM – 11:15 AM</span>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', marginBottom: '12px' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Location & Access:</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                📍 <strong>Wellness Family Health Clinic</strong>, 4th Floor, Room 204.<br />
                Wheelchair ramp and senior drop-off available at Main Entrance Gate 2.
              </p>
            </div>

            <div style={{ background: 'var(--bg-card)', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700, marginBottom: '4px' }}>Telehealth Video Option:</div>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', margin: 0 }}>
                If you prefer not to travel, a 1-click secure HD video room will activate 15 minutes before the appointment.
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className="btn-secondary"
              style={{ background: 'var(--primary)', color: '#fff', fontWeight: 700 }}
              onClick={() => alert('Clinic transport confirmed for tomorrow at 9:45 AM.')}
            >
              🚗 Confirm Clinic Transport
            </button>
            <button
              className="btn-secondary"
              onClick={() => alert('Telehealth link: Ready 15 mins before start time.')}
            >
              📹 Join Video Room
            </button>
          </div>

          <div className="card-footer-note" style={{ marginTop: '16px' }}>
            <span>Rahul (Son) is confirmed as your accompanying companion.</span>
          </div>
        </article>

        {/* Doctor Contact Card */}
        <article className="bento-card span-4">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">📞</span>
              <h3 className="card-title">Care Team</h3>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', margin: '14px 0' }}>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700 }}>Dr. Sharma's Office</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Clinic Line: (555) 012-3490</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontWeight: 700 }}>Nurse Helpline (24/7)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Direct Line: (555) 018-9922</div>
            </div>
          </div>

          <div className="card-footer-note">
            <span>For medical emergencies, please press the Get Help button immediately.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
