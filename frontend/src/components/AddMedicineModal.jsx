import React, { useState } from 'react';
import { api } from '../services/api';

export function AddMedicineModal({ isOpen, onClose, onMedicineAdded }) {
  const [name, setName] = useState('');
  const [purpose, setPurpose] = useState('');
  const [dosage, setDosage] = useState('1 Tablet');
  const [formType, setFormType] = useState('tablet');
  const [instructions, setInstructions] = useState('Take with water after food');
  const [timeOfDay, setTimeOfDay] = useState('morning');
  const [scheduledTime, setScheduledTime] = useState('08:00');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create medicine in library
      const med = await api.createMedicine({
        name,
        purpose,
        dosage,
        form: formType,
        instructions,
        refill_days_remaining: 30,
      });

      // 2. Create default schedule
      await api.createSchedule({
        medicine_id: med.id,
        time_of_day: timeOfDay,
        scheduled_time: scheduledTime,
        days_of_week: 'mon,tue,wed,thu,fri,sat,sun',
        meal_relation: 'after_food',
        start_date: new Date().toISOString().split('T')[0],
      });

      if (onMedicineAdded) onMedicineAdded();
      onClose();
    } catch (err) {
      alert('Failed to add medication: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
    }}>
      <div className="modal-content" style={{
        background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', maxWidth: '520px', width: '100%', padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', border: '1px solid var(--border-subtle)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>💊 Add Prescription Medication</h3>
          <button onClick={onClose} className="a11y-size-btn" style={{ borderRadius: '50%' }}>✕</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Medicine Name:</label>
            <input
              type="text"
              placeholder="e.g., Amlodipine"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
              required
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Purpose / Indication:</label>
              <input
                type="text"
                placeholder="e.g., Blood Pressure"
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Dosage:</label>
              <input
                type="text"
                placeholder="e.g., 5 mg"
                value={dosage}
                onChange={(e) => setDosage(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Time of Day:</label>
              <select
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
              >
                <option value="morning">Morning (☀️)</option>
                <option value="afternoon">Afternoon (🍽️)</option>
                <option value="evening">Evening (🌙)</option>
                <option value="night">Night (🛌)</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Scheduled Time:</label>
              <input
                type="text"
                placeholder="08:00 AM"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 700, marginBottom: '4px' }}>Instructions:</label>
            <input
              type="text"
              placeholder="e.g., Take with a full glass of water after breakfast"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-secondary"
            style={{ width: '100%', background: 'var(--primary)', color: '#fff', fontWeight: 700, padding: '10px' }}
          >
            {loading ? 'Saving Prescription...' : 'Save & Set Reminder'}
          </button>
        </form>
      </div>
    </div>
  );
}
