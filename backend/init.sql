-- Glacial MeltMap Database Initialization
-- Creates necessary tables and indexes

-- ====================================
-- Lakes Table
-- ====================================
CREATE TABLE IF NOT EXISTS lakes (
    id SERIAL PRIMARY KEY,
    lake_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100) NOT NULL,
    elevation INTEGER,
    latitude FLOAT,
    longitude FLOAT,
    country VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_lakes_region ON lakes(region);
CREATE INDEX idx_lakes_lake_id ON lakes(lake_id);

-- ====================================
-- Lake Data (Historical & Predicted)
-- ====================================
CREATE TABLE IF NOT EXISTS lake_data (
    id SERIAL PRIMARY KEY,
    lake_id INTEGER NOT NULL REFERENCES lakes(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    area_km2 FLOAT NOT NULL,
    perimeter_km FLOAT,
    feature_count INTEGER,
    data_type VARCHAR(20) NOT NULL, -- 'historical' or 'predicted'
    confidence FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(lake_id, year, data_type)
);

CREATE INDEX idx_lake_data_year ON lake_data(year);
CREATE INDEX idx_lake_data_type ON lake_data(data_type);

-- ====================================
-- Models Table (for tracking trained models)
-- ====================================
CREATE TABLE IF NOT EXISTS models (
    id SERIAL PRIMARY KEY,
    lake_id INTEGER NOT NULL REFERENCES lakes(id) ON DELETE CASCADE,
    model_type VARCHAR(50) NOT NULL, -- 'polynomial', 'random_forest', etc.
    r_squared FLOAT,
    training_years VARCHAR(255),
    trained_at TIMESTAMP,
    accuracy FLOAT,
    notes TEXT
);

CREATE INDEX idx_models_lake_id ON models(lake_id);

-- ====================================
-- Geospatial Data (KML/GeoJSON boundaries)
-- ====================================
CREATE TABLE IF NOT EXISTS geospatial_data (
    id SERIAL PRIMARY KEY,
    lake_id INTEGER NOT NULL REFERENCES lakes(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    geometry_type VARCHAR(50),
    kml_data TEXT,
    geojson_data JSONB,
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_geospatial_year ON geospatial_data(year);

-- ====================================
-- Analysis & Metrics
-- ====================================
CREATE TABLE IF NOT EXISTS lake_metrics (
    id SERIAL PRIMARY KEY,
    lake_id INTEGER NOT NULL REFERENCES lakes(id) ON DELETE CASCADE,
    period_start INTEGER NOT NULL,
    period_end INTEGER NOT NULL,
    initial_area FLOAT,
    final_area FLOAT,
    total_growth_percent FLOAT,
    avg_annual_growth FLOAT,
    trend VARCHAR(50),
    risk_level VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ====================================
-- Users & Permissions (Optional)
-- ====================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) DEFAULT 'viewer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ====================================
-- Audit Log
-- ====================================
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INTEGER,
    old_values JSONB,
    new_values JSONB,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_log_user ON audit_log(user_id);
CREATE INDEX idx_audit_log_timestamp ON audit_log(timestamp);

-- ====================================
-- Sample Data
-- ====================================
INSERT INTO lakes (lake_id, name, region, elevation, latitude, longitude, country)
VALUES 
    ('imja', 'Imja Tsho', 'himalayas', 5010, 27.95, 86.95, 'Nepal'),
    ('tsho', 'Tsho Rolpa', 'himalayas', 4580, 27.92, 86.85, 'Nepal'),
    ('pho', 'Pho Chu', 'himalayas', 4800, 28.10, 86.75, 'Nepal'),
    ('pam', 'Palcacocha', 'andes', 4580, -12.05, -75.32, 'Peru'),
    ('oeschinen', 'Oeschinen', 'alps', 1680, 46.45, 7.55, 'Switzerland')
ON CONFLICT (lake_id) DO NOTHING;

-- ====================================
-- Views for easier querying
-- ====================================
CREATE OR REPLACE VIEW v_lake_summary AS
SELECT 
    l.lake_id,
    l.name,
    l.region,
    l.elevation,
    COUNT(DISTINCT ld.year) as data_points,
    MIN(ld.year) as first_year,
    MAX(ld.year) as last_year,
    MIN(CASE WHEN ld.data_type = 'historical' THEN ld.area_km2 END) as initial_area,
    MAX(CASE WHEN ld.data_type = 'historical' THEN ld.area_km2 END) as max_area
FROM lakes l
LEFT JOIN lake_data ld ON l.id = ld.lake_id
GROUP BY l.id, l.lake_id, l.name, l.region, l.elevation;

-- ====================================
-- Functions for common operations
-- ====================================
CREATE OR REPLACE FUNCTION update_lake_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_lakes_timestamp
BEFORE UPDATE ON lakes
FOR EACH ROW
EXECUTE FUNCTION update_lake_updated_at();

CREATE TRIGGER trigger_update_users_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_lake_updated_at();
