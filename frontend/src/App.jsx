import React, { useState, useEffect } from 'react';
import { TranslationProvider } from './hooks/useTranslation';
import { FontSizeProvider } from './hooks/useFontSize';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { NotificationDrawer } from './components/NotificationDrawer';
import { HealthRiskPredictorModal } from './components/HealthRiskPredictorModal';
import { LogActivityModal } from './components/LogActivityModal';
import { AddMedicineModal } from './components/AddMedicineModal';

import { DashboardView } from './pages/DashboardView';
import { HealthMonitoringView } from './pages/HealthMonitoringView';
import { MedicationsView } from './pages/MedicationsView';
import { AppointmentsView } from './pages/AppointmentsView';
import { AnalysisView } from './pages/AnalysisView';
import { SettingsView } from './pages/SettingsView';

import { api } from './services/api';
import './styles/style.css';

function MainLayout() {
  const [activeView, setActiveView] = useState('dashboard');
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [role, setRole] = useState('senior');
  const [isNotifsOpen, setIsNotifsOpen] = useState(false);

  // Modals
  const [isMLModalOpen, setIsMLModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isAddMedModalOpen, setIsAddMedModalOpen] = useState(false);

  // Dashboard Data State
  const [dashboardData, setDashboardData] = useState(null);
  const [alerts, setAlerts] = useState([]);

  const loadData = async () => {
    try {
      const data = await api.getDashboardSummary();
      setDashboardData(data);
      setAlerts(data?.alerts || []);
    } catch {
      // Offline fallback state preserving prototype values
      setDashboardData({
        user_name: 'Meera Patel',
        role: 'senior',
        vitals: {
          heart_rate_bpm: 72,
          blood_pressure: '120/80',
          blood_oxygen_pct: 98,
          temperature_f: 98.4,
        },
        today_medications: [
          {
            schedule_id: 1,
            medicine_id: 1,
            medicine_name: 'Amlodipine (Blood Pressure)',
            dosage: '5 mg',
            time_of_day: 'morning',
            scheduled_time: '08:00 AM',
            meal_relation: 'With breakfast',
            status: 'taken',
          },
          {
            schedule_id: 2,
            medicine_id: 2,
            medicine_name: 'Multivitamin & Calcium',
            dosage: '1 Tablet',
            time_of_day: 'afternoon',
            scheduled_time: '01:00 PM',
            meal_relation: 'After lunch',
            status: 'pending',
          },
          {
            schedule_id: 3,
            medicine_id: 3,
            medicine_name: 'Metformin (Glucose Control)',
            dosage: '500 mg',
            time_of_day: 'evening',
            scheduled_time: '08:00 PM',
            meal_relation: 'With dinner',
            status: 'pending',
          },
        ],
        activity_summary: {
          total_steps: 1420,
          goal_steps: 2000,
          total_minutes: 20,
          goal_minutes: 30,
          step_progress_pct: 71.0,
          minute_progress_pct: 66.7,
          encouragement_message: 'Great progress! You completed 71% of your daily movement goal.',
        },
        alerts: [
          { id: '1', type: 'medication', title: 'Medication Reminder', description: 'Afternoon multivitamin due at 1:00 PM.', is_urgent: true },
          { id: '2', type: 'appointment', title: 'Upcoming Appointment', description: 'Check-up with Dr. Sharma tomorrow at 10:30 AM.', is_urgent: false },
          { id: '3', type: 'message', title: 'Message from Rahul (Son)', description: '"Hi Mom, I will come by at 5:00 PM today!"', is_urgent: false },
        ]
      });
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleMarkMedTaken = async (scheduleId, newStatus) => {
    // Optimistic UI update
    setDashboardData(prev => {
      if (!prev) return prev;
      const updatedMeds = prev.today_medications.map(m =>
        m.schedule_id === scheduleId ? { ...m, status: newStatus } : m
      );
      return { ...prev, today_medications: updatedMeds };
    });

    try {
      await api.logMedicationStatus(scheduleId, newStatus);
    } catch {
      // Keep optimistic change
    }
  };

  const handleClearNotifs = () => {
    setAlerts([]);
    setIsNotifsOpen(false);
  };

  return (
    <div className="app-layout">
      {/* Skip to main content link for accessibility */}
      <a href="#main-content" className="skip-link">Skip to main content</a>

      {/* Accessible Sidebar Navigation */}
      <Sidebar
        activeView={activeView}
        setActiveView={setActiveView}
        isMobileOpen={isMobileOpen}
        setIsMobileOpen={setIsMobileOpen}
        role={role}
        setRole={setRole}
      />

      {/* Main Content Area */}
      <main className="main-wrapper" id="main-content">
        {/* Top Header */}
        <Header
          setIsMobileOpen={setIsMobileOpen}
          notifCount={alerts.length}
          toggleNotifs={() => setIsNotifsOpen(prev => !prev)}
          isNotifsOpen={isNotifsOpen}
          userName={dashboardData?.user_name}
          role={role}
        />

        {/* Notifications Dropdown */}
        <NotificationDrawer
          isOpen={isNotifsOpen}
          alerts={alerts}
          onClear={handleClearNotifs}
        />

        {/* View Router */}
        {activeView === 'dashboard' && (
          <DashboardView
            dashboardData={dashboardData}
            onMarkMedTaken={handleMarkMedTaken}
            onNavigateView={setActiveView}
            onOpenMLModal={() => setIsMLModalOpen(true)}
            onOpenActivityModal={() => setIsActivityModalOpen(true)}
          />
        )}

        {activeView === 'health' && (
          <HealthMonitoringView
            vitals={dashboardData?.vitals}
            onOpenMLModal={() => setIsMLModalOpen(true)}
          />
        )}

        {activeView === 'medications' && (
          <MedicationsView
            medications={dashboardData?.today_medications}
            onMarkMedTaken={handleMarkMedTaken}
            onOpenAddMedModal={() => setIsAddMedModalOpen(true)}
          />
        )}

        {activeView === 'appointments' && (
          <AppointmentsView />
        )}

        {activeView === 'analysis' && (
          <AnalysisView
            onOpenMLModal={() => setIsMLModalOpen(true)}
          />
        )}

        {activeView === 'emergency' && (
          <DashboardView
            dashboardData={dashboardData}
            onMarkMedTaken={handleMarkMedTaken}
            onNavigateView={setActiveView}
            onOpenMLModal={() => setIsMLModalOpen(true)}
            onOpenActivityModal={() => setIsActivityModalOpen(true)}
          />
        )}

        {activeView === 'settings' && (
          <SettingsView role={role} setRole={setRole} />
        )}
      </main>

      {/* Interactive Modals */}
      <HealthRiskPredictorModal
        isOpen={isMLModalOpen}
        onClose={() => setIsMLModalOpen(false)}
        onPredictionSaved={loadData}
      />

      <LogActivityModal
        isOpen={isActivityModalOpen}
        onClose={() => setIsActivityModalOpen(false)}
        onActivityLogged={loadData}
      />

      <AddMedicineModal
        isOpen={isAddMedModalOpen}
        onClose={() => setIsAddMedModalOpen(false)}
        onMedicineAdded={loadData}
      />
    </div>
  );
}

export default function App() {
  return (
    <TranslationProvider>
      <FontSizeProvider>
        <MainLayout />
      </FontSizeProvider>
    </TranslationProvider>
  );
}
