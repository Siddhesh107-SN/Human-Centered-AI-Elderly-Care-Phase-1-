import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useTranslation } from '../hooks/useTranslation';

export function AnalysisView({ onOpenMLModal }) {
  const { t } = useTranslation();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const data = await api.getPredictionHistory(10);
      setHistory(data);
    } catch {
      setHistory([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <section className="view-container view-section active-view" aria-labelledby="analysis-page-heading">
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h2 className="view-title" id="analysis-page-heading">Health Risk & AI Analysis</h2>
          <p className="view-subtitle">Historical physiological predictions, biomarker trends, and explainability.</p>
        </div>
        <button
          className="btn-secondary"
          onClick={onOpenMLModal}
          style={{ background: 'var(--primary)', color: '#fff', fontWeight: 700 }}
        >
          🤖 New ML Risk Assessment
        </button>
      </div>

      <div className="bento-grid">
        {/* ML Model Overview Card */}
        <article className="bento-card span-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🧠</span>
              <h3 className="card-title">Supported ML Models</h3>
            </div>
            <span className="status-badge good">Trained & Validated</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', margin: '14px 0' }}>
            <div style={{ padding: '12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800 }}>1. XGBoost Classifier (Primary Engine)</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Gradient-boosted decision trees optimized for non-linear multi-biometric interactions.</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800 }}>2. Random Forest Classifier</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Ensemble bagging method providing robust stability against physiological noise.</div>
            </div>
            <div style={{ padding: '12px', background: 'var(--bg-card-subtle)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontWeight: 800 }}>3. Decision Tree & Logistic Regression</div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Interpretable baseline algorithms for fast linear validation and decision rule audits.</div>
            </div>
          </div>

          <div className="card-footer-note">
            <span>Features evaluated: Heart Rate, SpO2, Steps, Sleep Duration, Activity Level, Stress Biomarker.</span>
          </div>
        </article>

        {/* Explainability & Safe AI Principles */}
        <article className="bento-card span-6">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">🛡️</span>
              <h3 className="card-title">Human-Centered Safety Principles</h3>
            </div>
            <span className="status-badge info">Strict Protocol</span>
          </div>

          <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.6', margin: '14px 0' }}>
            <p style={{ marginBottom: '10px' }}>
              ✓ <strong>Zero Mock Predictions:</strong> Every assessment runs through the genuine pre-trained scikit-learn / XGBoost pipeline.
            </p>
            <p style={{ marginBottom: '10px' }}>
              ✓ <strong>SHAP Local Explainability:</strong> Features are attributed with directional impacts to explain exactly why a score was generated.
            </p>
            <p style={{ marginBottom: '10px' }}>
              ✓ <strong>Clinical Boundary Checks:</strong> Inputs outside validated biological bounds (e.g. SpO2 &lt; 50% or Heart Rate &gt; 250 BPM) are rejected.
            </p>
          </div>

          <div className="card-footer-note">
            <span>Data stored exclusively in MySQL under authenticated user isolation.</span>
          </div>
        </article>

        {/* Prediction History Table */}
        <article className="bento-card span-12">
          <div className="card-header-row">
            <div className="card-title-group">
              <span className="card-header-icon" aria-hidden="true">📜</span>
              <h3 className="card-title">Recent Assessment History (MySQL Records)</h3>
            </div>
            <button className="a11y-size-btn" onClick={fetchHistory}>🔄 Refresh</button>
          </div>

          <div style={{ overflowX: 'auto', margin: '14px 0' }}>
            {history && history.length > 0 ? (
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                    <th style={{ padding: '8px 12px' }}>Timestamp</th>
                    <th style={{ padding: '8px 12px' }}>Model</th>
                    <th style={{ padding: '8px 12px' }}>Heart Rate</th>
                    <th style={{ padding: '8px 12px' }}>SpO₂</th>
                    <th style={{ padding: '8px 12px' }}>Steps</th>
                    <th style={{ padding: '8px 12px' }}>Prediction Label</th>
                    <th style={{ padding: '8px 12px' }}>Risk Tier</th>
                    <th style={{ padding: '8px 12px' }}>Score</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((rec) => (
                    <tr key={rec.id} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                      <td style={{ padding: '10px 12px' }}>{new Date(rec.created_at).toLocaleString()}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700 }}>{rec.model_name}</td>
                      <td style={{ padding: '10px 12px' }}>{rec.heart_rate_bpm} bpm</td>
                      <td style={{ padding: '10px 12px' }}>{rec.blood_oxygen_level}%</td>
                      <td style={{ padding: '10px 12px' }}>{rec.step_count}</td>
                      <td style={{ padding: '10px 12px', fontWeight: 700, color: rec.prediction === 0 ? 'var(--status-good)' : 'var(--status-urgent)' }}>
                        {rec.label}
                      </td>
                      <td style={{ padding: '10px 12px' }}>
                        <span className={`status-badge ${rec.prediction === 0 ? 'good' : 'warning'}`}>
                          {rec.risk_tier || 'Normal'}
                        </span>
                      </td>
                      <td style={{ padding: '10px 12px', fontWeight: 800 }}>{rec.health_risk_score ?? Math.round(rec.probability * 100)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                {loading ? 'Loading predictions from MySQL...' : 'No historical predictions found. Click "+ New ML Risk Assessment" to evaluate your first biometric reading.'}
              </div>
            )}
          </div>

          <div className="card-footer-note">
            <span>Results are informational estimates and are securely backed up in MySQL <code>health_predictions</code> table.</span>
          </div>
        </article>
      </div>
    </section>
  );
}
