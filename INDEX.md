# Glacial MeltMap

A geospatial intelligence platform for monitoring, analyzing, and forecasting glacial lake expansion across the Himalayan region using geospatial data, Earth observation imagery, and machine learning.

---

## Overview

Glacial MeltMap combines historical glacial lake inventories, satellite imagery, and predictive analytics to enable temporal analysis of lake evolution and assess future expansion risks.

The platform transforms static geospatial datasets into an interactive decision-support system that helps visualize historical change, quantify lake growth, and forecast future expansion trends associated with climate change.

---

## Problem Statement

Accelerated glacier retreat is contributing to the formation and rapid growth of glacial lakes across the Himalayas. Many of these lakes pose increasing risks of Glacial Lake Outburst Floods (GLOFs), threatening downstream communities, infrastructure, and ecosystems.

While historical lake inventories provide valuable information, they often lack intuitive visualization, temporal analysis, and forecasting capabilities. Glacial MeltMap addresses this gap through interactive geospatial exploration and predictive modeling.

---

## Key Features

### Geospatial Visualization

* Multi-year glacial lake visualization (2008–2017)
* Interactive map-based exploration
* Temporal comparison using timeline controls
* GeoJSON rendering for web visualization
* KML export for Google Earth integration
* Layer-based geospatial analysis

### Earth Observation Integration

* Google Earth Engine integration
* Sentinel-2 satellite imagery support
* Landsat imagery overlays
* Historical imagery comparison
* Lake boundary validation using remote sensing data

### Analytics Dashboard

* Historical lake area analysis
* Annual growth-rate computation
* Comparative lake analysis
* Trend visualization
* Risk assessment indicators

### Predictive Intelligence

* Forecasting lake expansion through 2030
* Polynomial Regression models
* Random Forest Regression models
* Confidence-aware predictions
* Longitudinal trend analysis

---

## Dataset

The project utilizes historical Himalayan glacial lake inventories consisting of annual lake-boundary shapefiles, geospatial metadata, Earth observation imagery, and derived lake-area time-series data.

### Data Sources

* Hi-MAG Himalayan Glacial Lake Inventory
* Historical lake-boundary shapefiles (2008–2017)
* Sentinel-2 satellite imagery
* Landsat imagery archives
* Google Earth Engine datasets
* Derived area time-series records

### Approximate Dataset Size

5–20 GB depending on study region and imagery coverage.

---

## System Architecture


                    ┌─────────────────────┐
                    │ Historical Datasets │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │        QGIS         │
                    │ Data Preprocessing  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ GeoPandas + Flask   │
                    │ Backend Processing  │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
      ┌─────────────────┐         ┌─────────────────┐
      │ Machine Learning│         │ Google Earth    │
      │ Forecasting     │         │ Engine          │
      └─────────────────┘         └─────────────────┘
                │                             │
                └──────────────┬──────────────┘
                               ▼
                    ┌─────────────────────┐
                    │ React Dashboard     │
                    └─────────────────────┘
```

---

## Methodology

### 1. Geospatial Data Preparation

Historical glacial lake inventories are imported into QGIS for preprocessing and validation.

Tasks performed include:

* Geometry validation
* Boundary correction
* Coordinate reference system normalization
* Polygon area extraction
* Attribute cleaning
* Multi-year dataset organization
* Conversion between Shapefile, GeoJSON, and KML formats

### 2. Earth Observation Analysis

Satellite imagery is accessed through Google Earth Engine and aligned with historical inventory datasets.

This enables:

* Visual verification of lake boundaries
* Historical imagery comparison
* Water-body analysis
* Temporal change assessment

### 3. Feature Engineering

For each lake, annual metrics are generated including:

* Surface area
* Area growth
* Expansion rate
* Multi-year trends
* Percentage change

### 4. Predictive Modeling

Historical observations are used to train forecasting models capable of estimating future lake expansion.

Models evaluated include:

* Polynomial Regression
* Random Forest Regression

### 5. Risk Assessment

Forecasted lake expansion is combined with historical growth trends to identify lakes demonstrating elevated expansion rates and potential future risk.

---

## Results

The platform enables:

* Visualization of glacial lake evolution over a ten-year period
* Automated growth-rate computation
* Interactive exploration of historical datasets
* Forecasting of lake expansion through 2030
* Quantitative risk assessment for rapidly expanding lakes
---

## Technology Stack

### Frontend

* React
* Tailwind CSS

### Backend

* Flask
* GeoPandas
* Scikit-learn

### Geospatial Tools

* QGIS
* Google Earth Engine
* GeoJSON
* KML

### Machine Learning

* Polynomial Regression
* Random Forest Regression
* Time-Series Forecasting

---

## Applications

* Climate change monitoring
* Glacial lake evolution studies
* Environmental risk assessment
* Disaster preparedness planning
* Geospatial decision-support systems
* Research and academic workflows

---

## License

MIT License

---

## Author

**Khushi Dangi**

Geospatial AI • Climate Analytics • Earth Observation • Predictive Modeling
