/**
 * CarePulse AI - API Service Layer
 * Connects React UI to FastAPI Backend & ML Pipeline
 */

const API_BASE = '/api/v1';

async function fetchJSON(url, options = {}) {
  const defaultHeaders = {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };

  const token = localStorage.getItem('carepulse_token');
  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`;
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    if (!res.ok) {
      const errBody = await res.json().catch(() => ({}));
      throw new Error(errBody.detail || errBody.error || `HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (error) {
    console.warn(`API call failed for ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  // Health & Readiness
  getHealth: () => fetchJSON('/health'),
  getReadiness: () => fetchJSON('/health/ready'),

  // Dashboard Aggregation
  getDashboardSummary: () => fetchJSON(`${API_BASE}/dashboard/summary`),

  // Machine Learning Health Risk Predictions
  predictStress: (payload, model = 'xgboost') =>
    fetchJSON(`${API_BASE}/predictions/stress?model=${model}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  predictAllModels: (payload) =>
    fetchJSON(`${API_BASE}/predictions/all`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  explainPrediction: (payload, model = 'xgboost') =>
    fetchJSON(`${API_BASE}/predictions/explain?model=${model}`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  getPredictionHistory: (limit = 20) =>
    fetchJSON(`${API_BASE}/predictions/history?limit=${limit}`),

  // Medications
  getTodayMedications: () => fetchJSON(`${API_BASE}/medicines/today`),
  getAllMedicines: () => fetchJSON(`${API_BASE}/medicines/`),
  createMedicine: (data) =>
    fetchJSON(`${API_BASE}/medicines/`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getSchedules: () => fetchJSON(`${API_BASE}/medicines/schedules`),
  createSchedule: (data) =>
    fetchJSON(`${API_BASE}/medicines/schedules`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  logMedicationStatus: (scheduleId, status, scheduledFor = new Date().toISOString()) =>
    fetchJSON(`${API_BASE}/medicines/logs`, {
      method: 'POST',
      body: JSON.stringify({
        schedule_id: scheduleId,
        status: status,
        scheduled_for: scheduledFor,
      }),
    }),

  // Activity Tracker
  getTodayActivity: () => fetchJSON(`${API_BASE}/activities/summary/today`),
  getWeeklyActivity: () => fetchJSON(`${API_BASE}/activities/summary/weekly`),
  recordActivity: (activityData) =>
    fetchJSON(`${API_BASE}/activities/`, {
      method: 'POST',
      body: JSON.stringify(activityData),
    }),

  // Profile & Settings
  getUserProfile: () => fetchJSON(`${API_BASE}/auth/me`),
  updateUserProfile: (data) =>
    fetchJSON(`${API_BASE}/auth/me`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};
