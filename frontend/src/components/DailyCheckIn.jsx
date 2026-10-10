import React, { useState } from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function DailyCheckIn() {
  const { t } = useTranslation();
  const [selectedFeeling, setSelectedFeeling] = useState(null);
  const [feedbackVisible, setFeedbackVisible] = useState(false);

  const handleSelect = (feeling) => {
    setSelectedFeeling(feeling);
    setFeedbackVisible(true);
  };

  return (
    <article className="bento-card span-5" aria-labelledby="card-checkin-title">
      <div>
        <div className="card-header-row">
          <div className="card-title-group">
            <span className="card-header-icon" aria-hidden="true">🌻</span>
            <h3 className="card-title" id="card-checkin-title">{t('daily_checkin')}</h3>
          </div>
          <div className="status-badge info">
            <span className="badge-dot"></span>
            <span>{t('today_status')}</span>
          </div>
        </div>

        <p className="checkin-prompt">{t('how_feeling')}</p>

        <div className="feelings-buttons-group" role="group" aria-label="Daily feeling selection">
          <button
            className={`feeling-btn ${selectedFeeling === 'good' ? 'active' : ''}`}
            onClick={() => handleSelect('good')}
            aria-pressed={selectedFeeling === 'good'}
          >
            <span className="feeling-emoji" aria-hidden="true">😊</span>
            <span>{t('feeling_good')}</span>
          </button>

          <button
            className={`feeling-btn ${selectedFeeling === 'okay' ? 'active' : ''}`}
            onClick={() => handleSelect('okay')}
            aria-pressed={selectedFeeling === 'okay'}
          >
            <span className="feeling-emoji" aria-hidden="true">😐</span>
            <span>{t('feeling_okay')}</span>
          </button>

          <button
            className={`feeling-btn ${selectedFeeling === 'unwell' ? 'active' : ''}`}
            onClick={() => handleSelect('unwell')}
            aria-pressed={selectedFeeling === 'unwell'}
          >
            <span className="feeling-emoji" aria-hidden="true">😟</span>
            <span>{t('feeling_unwell')}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {feedbackVisible && (
          <div className="checkin-feedback-box active" style={{ display: 'flex', marginTop: '12px' }}>
            <span aria-hidden="true">✓</span>
            <span>{t('checkin_recorded')}</span>
          </div>
        )}
      </div>

      <div className="card-footer-note" style={{ marginTop: '14px' }}>
        <span>{t('caregiver_informed')}</span>
      </div>
    </article>
  );
}
