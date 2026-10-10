import React, { useState } from 'react';
import { api } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

export function HealthRiskPredictorModal({ isOpen, onClose, onPredictionSaved }) {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    heart_rate_bpm: 75.0,
    blood_oxygen_level: 98.0,
    step_count: 3500.0,
    sleep_duration_hours: 7.5,
    activity_level: 'active',
    stress_level: 3.5,
  });

  const [selectedModel, setSelectedModel] = useState('xgboost');
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [multiModelResults, setMultiModelResults] = useState(null);
  const [explanation, setExplanation] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'activity_level' ? value : parseFloat(value) || 0
    }));
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage('');
    setPredictionResult(null);

    try {
      const res = await api.predictStress(formData, selectedModel);
      setPredictionResult(res);
      if (onPredictionSaved) onPredictionSaved(res);
    } catch (err) {
      setErrorMessage(err.message || 'Failed to complete ML prediction.');
    } finally {
      setLoading(false);
    }
  };

  const handleCompareAll = async () => {
    setLoading(true);
    setErrorMessage('');
    try {
      const res = await api.predictAllModels(formData);
      setMultiModelResults(res.predictions);
    } catch (err) {
      setErrorMessage(err.message || 'Multi-model comparison failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleExplain = async () => {
    setLoading(true);
    try {
      const res = await api.explainPrediction(formData, selectedModel);
      setExplanation(res.explanation);
    } catch (err) {
      setErrorMessage(err.message || 'SHAP explanation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '16px'
    }}>
      <div className="modal-content" style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-lg)',
        maxWidth: '680px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        padding: '24px',
        boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1), 0 8px 10px -6px rgba(0,0,0,0.1)',
        border: '1px solid var(--border-subtle)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span>🤖</span> {t('ai_risk_assessment_title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              {t('ai_risk_subtitle')}
            </p>
          </div>
          <button
            onClick={onClose}
            className="a11y-size-btn"
            style={{ fontSize: '1.2rem', padding: '4px 10px', borderRadius: '50%' }}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        {/* Biometrics Form */}
        <form onSubmit={handlePredict}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            {/* Heart Rate */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                ❤️ Heart Rate (30–250 BPM):
              </label>
              <input
                type="number"
                min="30"
                max="250"
                step="0.5"
                value={formData.heart_rate_bpm}
                onChange={(e) => handleChange('heart_rate_bpm', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>

            {/* Blood Oxygen Level */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                🫁 Blood Oxygen (50–100 %):
              </label>
              <input
                type="number"
                min="50"
                max="100"
                step="0.5"
                value={formData.blood_oxygen_level}
                onChange={(e) => handleChange('blood_oxygen_level', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>

            {/* Daily Steps */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                🚶 Daily Step Count:
              </label>
              <input
                type="number"
                min="0"
                max="150000"
                step="100"
                value={formData.step_count}
                onChange={(e) => handleChange('step_count', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>

            {/* Sleep Duration */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                🌙 Sleep Duration (hours):
              </label>
              <input
                type="number"
                min="0"
                max="24"
                step="0.5"
                value={formData.sleep_duration_hours}
                onChange={(e) => handleChange('sleep_duration_hours', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>

            {/* Activity Level */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                🏃 Activity Level:
              </label>
              <select
                value={formData.activity_level}
                onChange={(e) => handleChange('activity_level', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
              >
                <option value="sedentary">Sedentary (Low movement)</option>
                <option value="active">Active (Regular walking)</option>
                <option value="highly active">Highly Active</option>
              </select>
            </div>

            {/* Stress Level */}
            <div>
              <label style={{ fontSize: '0.9rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                🧠 Stress Biomarker Score (0–10):
              </label>
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={formData.stress_level}
                onChange={(e) => handleChange('stress_level', e.target.value)}
                style={{ width: '100%', padding: '8px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)' }}
                required
              />
            </div>
          </div>

          {/* Model Selection */}
          <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <label style={{ fontSize: '0.95rem', fontWeight: 700 }}>{t('model_label')}:</label>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              style={{ padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', background: 'var(--bg-card-subtle)', fontWeight: 600 }}
            >
              <option value="xgboost">XGBoost Classifier (Recommended)</option>
              <option value="random_forest">Random Forest Classifier</option>
              <option value="decision_tree">Decision Tree</option>
              <option value="logistic_regression">Logistic Regression</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <button
              type="submit"
              disabled={loading}
              className="btn-secondary"
              style={{ flex: 1, background: 'var(--primary)', color: '#ffffff', fontWeight: 700, padding: '10px 16px' }}
            >
              {loading ? 'Processing ML...' : t('run_prediction_btn')}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={handleCompareAll}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
            >
              Benchmark All 4 Models
            </button>
            <button
              type="button"
              disabled={loading || !predictionResult}
              onClick={handleExplain}
              className="btn-secondary"
              style={{ padding: '10px 14px' }}
            >
              SHAP Attribution
            </button>
          </div>
        </form>

        {/* Error Alert */}
        {errorMessage && (
          <div style={{ padding: '12px', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--status-urgent)', borderRadius: 'var(--radius-sm)', marginBottom: '16px' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        {/* Single Prediction Result */}
        {predictionResult && (
          <div style={{
            background: 'var(--bg-card-subtle)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                Result: <span style={{ color: predictionResult.prediction === 0 ? 'var(--status-good)' : 'var(--status-urgent)' }}>
                  {predictionResult.label}
                </span>
              </span>
              <span className={`status-badge ${predictionResult.prediction === 0 ? 'good' : 'warning'}`}>
                Tier: {predictionResult.risk_tier} ({predictionResult.health_risk_score}%)
              </span>
            </div>

            <p style={{ fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '8px' }}>
              <strong>{t('clinical_advisory')}:</strong> {predictionResult.risk_assessment}
            </p>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Evaluated with model: <code>{predictionResult.model}</code> · Confidence: {Math.round(predictionResult.probability * 100)}%
            </div>
          </div>
        )}

        {/* Multi-Model Comparison Table */}
        {multiModelResults && (
          <div style={{ marginBottom: '16px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}>Multi-Model Benchmark:</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
              {Object.entries(multiModelResults).map(([modName, modDetail]) => (
                <div key={modName} style={{ padding: '8px', background: 'var(--bg-card)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>{modName}</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 800, color: modDetail.prediction === 0 ? 'var(--status-good)' : 'var(--status-urgent)' }}>
                    {modDetail.risk_tier || modDetail.label}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {modDetail.health_risk_score}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SHAP Explanation */}
        {explanation && (
          <div style={{ marginBottom: '16px', background: 'var(--bg-card-subtle)', padding: '12px', borderRadius: 'var(--radius-md)' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, marginBottom: '8px' }}>SHAP Local Feature Contributions:</h4>
            {explanation.map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <span>{item.feature}: <strong>{item.value}</strong></span>
                <span style={{ color: item.impact === 'positive' ? 'var(--status-urgent)' : 'var(--status-good)', fontWeight: 700 }}>
                  {item.impact === 'positive' ? '▲ Increases Risk' : (item.impact === 'negative' ? '▼ Lowers Risk' : '• Neutral')} ({item.shap_value})
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Medical Disclaimer */}
        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4', background: 'rgba(0,0,0,0.02)', padding: '8px 12px', borderRadius: 'var(--radius-sm)' }}>
          ⚖️ {t('medical_disclaimer')}
        </div>
      </div>
    </div>
  );
}
