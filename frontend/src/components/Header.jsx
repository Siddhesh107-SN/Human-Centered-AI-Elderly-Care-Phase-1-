import React, { useState, useEffect } from 'react';
import { useTranslation } from '../hooks/useTranslation';
import { useFontSize } from '../hooks/useFontSize';

export function Header({ setIsMobileOpen, notifCount, toggleNotifs, isNotifsOpen, userName, role }) {
  const { lang, changeLanguage, t } = useTranslation();
  const { scale, changeFontSize } = useFontSize();
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const now = new Date();
    const options = { weekday: 'long', month: 'long', day: 'numeric' };
    try {
      const loc = lang === 'hi' ? 'hi-IN' : (lang === 'mr' ? 'mr-IN' : 'en-US');
      setCurrentDate(now.toLocaleDateString(loc, options));
    } catch {
      setCurrentDate(now.toLocaleDateString('en-US', options));
    }
  }, [lang]);

  const greetingName = userName ? userName.split(' ')[0] : (role === 'senior' ? 'Meera' : 'Rahul');

  return (
    <header className="top-header">
      <button
        className="mobile-menu-toggle"
        onClick={() => setIsMobileOpen(prev => !prev)}
        aria-label="Open navigation menu"
      >
        ☰
      </button>

      <div className="header-greeting-wrap">
        <span className="header-date">{currentDate}</span>
        <h2 className="header-greeting">
          {lang === 'hi' ? `नमस्ते, ${greetingName} 👋` : (lang === 'mr' ? `नमस्कार, ${greetingName} 👋` : `Good morning, ${greetingName} 👋`)}
        </h2>
      </div>

      <div className="header-actions">
        {/* Multilingual Selector */}
        <div className="language-selector-wrap" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 600 }} aria-hidden="true">🌐</span>
          <select
            className="language-select-dropdown"
            value={lang}
            onChange={(e) => changeLanguage(e.target.value)}
            aria-label={t('language_label')}
            style={{
              padding: '6px 10px',
              borderRadius: 'var(--radius-pill)',
              border: '1px solid var(--border-subtle)',
              background: 'var(--bg-card)',
              color: 'var(--text-main)',
              fontSize: '0.9rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिंदी (Hindi)</option>
            <option value="mr">मराठी (Marathi)</option>
          </select>
        </div>

        {/* Text Size Adjuster */}
        <div className="a11y-pill-group" role="group" aria-label="Text size control">
          <span className="a11y-label">{t('text_size_label')}</span>
          <button
            className={`a11y-size-btn ${scale === 1.0 ? 'active' : ''}`}
            onClick={() => changeFontSize(1.0)}
            aria-label="Default text size"
          >
            {t('text_default')}
          </button>
          <button
            className={`a11y-size-btn ${scale === 1.15 ? 'active' : ''}`}
            onClick={() => changeFontSize(1.15)}
            aria-label="Large text size"
          >
            {t('text_large')}
          </button>
          <button
            className={`a11y-size-btn ${scale === 1.3 ? 'active' : ''}`}
            onClick={() => changeFontSize(1.3)}
            aria-label="Extra large text size"
          >
            {t('text_xlarge')}
          </button>
        </div>

        {/* Notification Bell */}
        <button
          className="header-icon-btn"
          onClick={toggleNotifs}
          aria-label={`Notifications, ${notifCount} new alerts`}
          aria-expanded={isNotifsOpen}
        >
          <span aria-hidden="true">🔔</span>
          {notifCount > 0 && (
            <span className="notification-badge">{notifCount}</span>
          )}
        </button>

        {/* User Profile Badge */}
        <div
          className="user-profile-badge"
          tabIndex={0}
          role="button"
          aria-label={`User profile: ${userName || 'Meera Patel'}, 72 years old`}
        >
          <div className="profile-avatar">{greetingName[0]}</div>
          <span className="profile-name">{userName || (role === 'senior' ? 'Meera Patel' : 'Rahul Patel')}</span>
        </div>
      </div>
    </header>
  );
}
