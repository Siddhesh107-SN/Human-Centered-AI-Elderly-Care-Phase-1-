import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function MedicationsView({ medications, onMarkMedTaken, onOpenAddMedModal }) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMeds = (medications || []).filter(m =>
    m.medicine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (m.purpose && m.purpose.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const takenCount = (medications || []).filter(m => m.status === 'taken').length;
  const totalCount = (medications || []).length || 3;

  return (
    <section className="view-container view-section active-view" aria-labelledby="meds-page-heading">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="view-title" id="meds-page-heading">Daily Medication Schedule</h2>
          <p className="view-subtitle">Clear dosages, verified timings, and simple one-tap confirmation.</p>
        </div>
        <button
          className="btn-secondary"
          onClick={onOpenAddMedModal}
          style={{ background: 'var(--primary)', color: '#fff', fontWeight: 700 }}
        >
          + Add Medication
        </button>
      </div>

      <div className="bento-grid">
        {/* Full Schedule List Card */}
        <article className="bento-card span-8">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">💊</span>
              <h3 className="card-title">Today's Prescriptions</h3>
            </div>
            <span className="status-badge good">
              {takenCount} of {totalCount} taken today
            </span>
          </div>

          {/* Search Bar */}
          <div style={{ margin: '14px 0' }}>
            <input
              type="text"
              placeholder="🔍 Search medicine by name or condition..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                background: 'var(--bg-card-subtle)',
                fontSize: '0.95rem'
              }}
            />
          </div>

          <div className="med-list">
            {filteredMeds.length > 0 ? (
              filteredMeds.map((med, idx) => {
                const isTaken = med.status === 'taken';
                const icon = med.time_of_day === 'morning' ? '☀️' : (med.time_of_day === 'afternoon' ? '🍽️' : (med.time_of_day === 'night' ? '🛌' : '🌙'));

                return (
                  <div key={med.schedule_id || idx} className="med-item">
                    <div className="med-info">
                      <div className="med-icon-box" aria-hidden="true">{icon}</div>
                      <div>
                        <div className="med-name">{med.medicine_name}</div>
                        <div className="med-meta">{med.dosage} · {med.scheduled_time} · {med.meal_relation || 'After meals'}</div>
                        <div style={{
                          fontSize: '0.85rem',
                          color: isTaken ? 'var(--status-good)' : 'var(--status-warning)',
                          fontWeight: 700,
                          marginTop: '4px'
                        }}>
                          {isTaken ? '✓ Taken today' : '⏰ Due / Pending'}
                        </div>
                      </div>
                    </div>
                    <button
                      className={`med-action-btn ${isTaken ? 'taken' : ''}`}
                      onClick={() => onMarkMedTaken(med.schedule_id, isTaken ? 'pending' : 'taken')}
                    >
                      {isTaken ? t('taken_btn') : t('mark_as_taken')}
                    </button>
                  </div>
                );
              })
            ) : (
              <p style={{ padding: '16px', color: 'var(--text-muted)' }}>No medications matching search.</p>
            )}
          </div>

          <div className="card-footer-note">
            <span>All prescriptions verified by your primary care doctor. Follow physician instructions.</span>
          </div>
        </article>

        {/* Pharmacy Refill Card */}
        <article className="bento-card span-4">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">📦</span>
              <h3 className="card-title">Pharmacy Refills</h3>
            </div>
            <span className="status-badge info">Active</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', margin: '14px 0' }}>
            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700 }}>Amlodipine 5mg</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>22 days remaining in pill dispenser</div>
            </div>

            <div style={{ background: 'var(--bg-card-subtle)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 700 }}>Metformin 500mg</div>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>18 days remaining</div>
            </div>

            <button
              className="btn-secondary"
              onClick={() => alert('Refill request sent to MedPlus Care Pharmacy. Contact confirmed.')}
            >
              <span>Request Refill Delivery</span>
            </button>
          </div>

          <div className="card-footer-note">
            <span>Preferred Pharmacy: MedPlus Care, 2nd Avenue.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
