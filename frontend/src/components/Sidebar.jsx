import React from 'react';
import { useTranslation } from '../hooks/useTranslation';

export function Sidebar({ activeView, setActiveView, isMobileOpen, setIsMobileOpen, role, setRole }) {
  const { t } = useTranslation();

  const navItems = [
    { id: 'dashboard', label: t('nav_dashboard'), icon: '🏠' },
    { id: 'health', label: t('nav_health'), icon: '❤️' },
    { id: 'medications', label: t('nav_medications'), icon: '💊' },
    { id: 'appointments', label: t('nav_appointments'), icon: '📅' },
    { id: 'analysis', label: t('nav_analysis'), icon: '📊' },
    { id: 'emergency', label: t('nav_emergency'), icon: '🆘', isEmergency: true },
    { id: 'settings', label: t('nav_settings'), icon: '⚙️' },
  ];

  const toggleRole = () => {
    setRole(prev => prev === 'senior' ? 'caregiver' : 'senior');
  };

  return (
    <>
      {isMobileOpen && (
        <div
          className="sidebar-backdrop active"
          onClick={() => setIsMobileOpen(false)}
          aria-hidden="true"
        />
      )}
      <aside className={`sidebar ${isMobileOpen ? 'mobile-open' : ''}`} aria-label="Main Navigation">
        <div className="brand-section">
          <div className="brand-icon-box" aria-hidden="true">🌱</div>
          <div>
            <h1 className="brand-title">{t('brand_name')}</h1>
            <span className="brand-subtitle">{t('brand_subtitle')}</span>
          </div>
        </div>

        <nav>
          <ul className="nav-menu" role="menubar">
            {navItems.map((item) => (
              <li key={item.id} role="none">
                <button
                  className={`nav-link ${activeView === item.id ? 'active' : ''} ${item.isEmergency ? 'emergency-nav' : ''}`}
                  onClick={() => {
                    setActiveView(item.id);
                    setIsMobileOpen(false);
                  }}
                  role="menuitem"
                  aria-current={activeView === item.id ? 'page' : undefined}
                >
                  <span className="nav-icon" aria-hidden="true">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        {/* Role Switcher */}
        <div className="sidebar-footer">
          <div className="mode-switch-card">
            <div className="mode-badge">
              <span aria-hidden="true">👤</span>
              <span>{role === 'senior' ? t('active_senior') : t('active_caregiver')}</span>
            </div>
            <button
              className="mode-btn"
              onClick={toggleRole}
              aria-label="Switch between senior and caregiver view"
            >
              <span>{role === 'senior' ? t('switch_to_caregiver') : t('switch_to_senior')}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
