-- =====================================================================
-- CarePulse AI - MySQL Workbench Read-Only Diagnostic & Audit Queries
-- Database: elderly_care_db
-- =====================================================================

USE elderly_care_db;

-- 1. List all tables in the application database
SHOW FULL TABLES;

-- 2. Inspect table schemas and column structures
DESCRIBE users;
DESCRIBE medicine_library;
DESCRIBE medicine_schedules;
DESCRIBE medicine_logs;
DESCRIBE activity_logs;
DESCRIBE health_predictions;

-- 3. View user accounts and accessibility preferences
SELECT 
    id, 
    email, 
    full_name, 
    age, 
    role, 
    preferred_language, 
    font_size_preference, 
    daily_step_goal, 
    emergency_contact_name, 
    emergency_contact_phone, 
    created_at 
FROM users 
ORDER BY id ASC;

-- 4. View medicine library catalog
SELECT 
    m.id, 
    m.name AS medicine_name, 
    m.dosage, 
    m.form, 
    m.purpose, 
    m.doctor_name, 
    m.refill_days_remaining, 
    u.full_name AS patient_name 
FROM medicine_library m
JOIN users u ON m.user_id = u.id
ORDER BY m.name ASC;

-- 5. View today's active medicine schedules with patient details
SELECT 
    s.id AS schedule_id,
    u.full_name AS patient,
    m.name AS medicine_name,
    m.dosage,
    s.time_of_day,
    s.scheduled_time,
    s.meal_relation,
    s.days_of_week,
    s.start_date,
    s.end_date,
    s.is_active
FROM medicine_schedules s
JOIN medicine_library m ON s.medicine_id = m.id
JOIN users u ON s.user_id = u.id
WHERE s.is_active = 1
ORDER BY s.scheduled_time ASC;

-- 6. View medication adherence logs and reminder statuses (taken, skipped, pending)
SELECT 
    l.id AS log_id,
    u.full_name AS patient,
    m.name AS medicine_name,
    s.time_of_day,
    l.status AS adherence_status,
    l.scheduled_for,
    l.logged_at,
    l.notes
FROM medicine_logs l
JOIN medicine_schedules s ON l.schedule_id = s.id
JOIN medicine_library m ON s.medicine_id = m.id
JOIN users u ON l.user_id = u.id
ORDER BY l.logged_at DESC
LIMIT 50;

-- 7. View daily activity records and exercise sessions
SELECT 
    a.id,
    u.full_name AS user_name,
    a.activity_type,
    a.duration_minutes,
    a.step_count,
    a.calories_burned,
    a.is_automatic,
    a.recorded_date,
    a.recorded_at,
    a.notes
FROM activity_logs a
JOIN users u ON a.user_id = u.id
ORDER BY a.recorded_date DESC, a.recorded_at DESC
LIMIT 50;

-- 8. Calculate daily activity totals and progress against goals
SELECT 
    a.recorded_date,
    u.full_name,
    u.daily_step_goal,
    SUM(a.step_count) AS total_daily_steps,
    SUM(a.duration_minutes) AS total_daily_minutes,
    ROUND((SUM(a.step_count) / u.daily_step_goal) * 100, 1) AS step_goal_percentage
FROM activity_logs a
JOIN users u ON a.user_id = u.id
GROUP BY a.recorded_date, u.id, u.full_name, u.daily_step_goal
ORDER BY a.recorded_date DESC;

-- 9. View machine learning health risk & stress prediction history
SELECT 
    p.id AS prediction_id,
    u.full_name AS patient,
    p.model_name,
    p.heart_rate_bpm,
    p.blood_oxygen_level AS spo2_pct,
    p.step_count,
    p.sleep_duration_hours,
    p.activity_level,
    p.stress_level,
    p.prediction AS predicted_class,
    p.label AS risk_label,
    p.health_risk_score,
    p.risk_tier,
    p.risk_assessment,
    p.created_at AS prediction_timestamp
FROM health_predictions p
JOIN users u ON p.user_id = u.id
ORDER BY p.created_at DESC
LIMIT 50;

-- 10. Filter all records belonging to a specific user (e.g. user_id = 1)
SELECT * FROM users WHERE id = 1;
SELECT * FROM medicine_library WHERE user_id = 1;
SELECT * FROM medicine_schedules WHERE user_id = 1;
SELECT * FROM medicine_logs WHERE user_id = 1 ORDER BY logged_at DESC;
SELECT * FROM activity_logs WHERE user_id = 1 ORDER BY recorded_date DESC;
SELECT * FROM health_predictions WHERE user_id = 1 ORDER BY created_at DESC;
