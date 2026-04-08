# 📚 Glacial MeltMap - Complete Project Index

## **Project Overview**

Glacial MeltMap is a full-stack geospatial analytics platform for tracking and predicting glacial lake evolution. It integrates QGIS data processing, Python machine learning, React visualization, and Google Earth integration.

---

## **📂 PROJECT STRUCTURE**

### **Root Level**

```
glacial-meltmap/
├── README.md                          ← Start here for complete documentation
├── QUICKSTART.md                      ← 5-minute setup guide
├── WORKFLOW.md                        ← Complete QGIS→Python→Dashboard flow
├── QGIS_INTEGRATION_GUIDE.md          ← Detailed QGIS data integration
├── package.json                       ← Node.js/React dependencies
├── tailwind.config.js                 ← Tailwind CSS configuration
├── postcss.config.js                  ← PostCSS configuration
├── Dockerfile                         ← Docker container definition
├── docker-compose.yml                 ← Multi-container orchestration
├── .env.example                       ← Environment variables template
├── .gitignore                         ← Git ignore rules
└── [Other config files]
```

---

## **🎨 FRONTEND (React Application)**

### **src/ Directory**

```
src/
├── App.js                             ← Main app with routing
├── index.js                           ← React entry point
├── styles/
│   └── App.css                        ← Global styles, animations, themes
├── components/
│   ├── Header.js                      ← Top navigation bar
│   └── Sidebar.js                     ← Side menu with navigation
└── pages/
    ├── HomePage.js                    ← Landing page with features/stats
    ├── RegionSelector.js              ← Browse Himalayas, Andes, Alps
    ├── LakeSelector.js                ← Browse and filter lakes
    ├── MapViewer.js                   ← Interactive map with timeline slider
    ├── Analytics.js                   ← Charts, trends, predictions
    └── StoryMode.js                   ← Narrative-driven exploration
```

### **public/ Directory**

```
public/
├── index.html                         ← HTML template
└── favicon                            ← Website icon
```

### **Key Features**

- **Dark modern UI** - Blue/orange theme with smooth animations
- **Timeline slider** - Year-by-year exploration (2008-2017)
- **Interactive charts** - Recharts visualization library
- **Responsive design** - Works on desktop, tablet, mobile
- **Story mode** - 5-scene narrative exploration
- **Analytics dashboard** - Growth rates, predictions, risk levels

---

## **⚙️ BACKEND (Python/Flask)**

### **backend/ Directory**

```
backend/
├── app.py                             ← Flask API server (main)
├── requirements.txt                   ← Python dependencies
├── init.sql                           ← PostgreSQL database schema
├── __init__.py                        ← Package initialization
├── models/
│   ├── __init__.py
│   ├── glacier_predictor.py           ← ML prediction model
│   ├── train_model.py                 ← Model training script
│   └── *.pkl                          ← Saved trained models
├── utils/
│   ├── __init__.py
│   └── geospatial_processor.py        ← QGIS shapefile processing
└── data/
    ├── shapefiles/                    ← Your QGIS exports go here
    │   ├── imja_2008.shp
    │   ├── imja_2009.shp
    │   └── ... (all lakes & years)
    └── output/
        ├── kml/                       ← Generated KML files
        ├── geojson/                   ← Generated GeoJSON files
        └── reports/                   ← Analysis reports
```

### **Key Components**

#### **app.py** - Flask API Server
- RESTful API endpoints for data retrieval
- KML/GeoJSON serving
- Prediction generation
- Analysis endpoints
- CORS-enabled for frontend access

**Main endpoints:**
```
GET  /api/health                              → Server health check
GET  /api/lakes/{id}/historical              → Historical data (2008-2017)
GET  /api/lakes/{id}/predict                 → AI predictions
GET  /api/lakes/{id}/analysis                → Detailed analysis
GET  /api/kml/{id}?year=2017                → KML export for Google Earth
GET  /api/geojson/{id}                      → GeoJSON for web maps
GET  /api/regions/{region}/lakes            → All lakes in region
POST /api/comparison                        → Compare multiple lakes
GET  /api/stats                             → Global statistics
```

#### **glacier_predictor.py** - Prediction Model
- Loads and processes historical data
- Polynomial regression for growth prediction
- Confidence scoring
- Lake metrics calculation
- KML generation for visualization

**Key classes:**
- `GlacierPredictor` - Main predictor class
- Methods: `predict_growth()`, `analyze_lake()`, `get_historical_data()`

#### **train_model.py** - Model Training Script
- Reads actual shapefile data from disk
- Trains polynomial & random forest models
- Generates predictions with confidence scores
- Saves models for API use
- Produces training reports

**Usage:**
```bash
python3 models/train_model.py
```

#### **geospatial_processor.py** - Data Processing
- Loads QGIS shapefiles
- Extracts lake boundaries and metrics
- Generates KML files (single and multi-year)
- Generates GeoJSON for web mapping
- Calculates area changes and growth rates

**Key classes:**
- `GeoSpatialProcessor` - Main processor
- Methods: `load_shapefile()`, `export_kml()`, `export_geojson()`, `calculate_metrics()`

---

## **📊 API ENDPOINTS**

### **Detailed Reference**

#### **GET /api/health**
Check if backend is running.
```bash
curl http://localhost:5000/api/health
→ { "status": "healthy", "version": "1.0.0" }
```

#### **GET /api/lakes/{lake_id}/historical**
Get historical area data for a lake.
```bash
curl http://localhost:5000/api/lakes/imja/historical
→ [
    { "year": 2008, "area": 0.02 },
    { "year": 2009, "area": 0.05 },
    ...
    { "year": 2017, "area": 1.28 }
  ]
```

#### **GET /api/lakes/{lake_id}/predict?years=10**
Get predictions for future years.
```bash
curl http://localhost:5000/api/lakes/imja/predict?years=10
→ [
    { "year": 2018, "area_km2": 1.45, "confidence": 0.91 },
    ...
    { "year": 2027, "area_km2": 2.15, "confidence": 0.71 }
  ]
```

#### **GET /api/kml/{lake_id}?year=2017**
Export KML for Google Earth.
```bash
curl http://localhost:5000/api/kml/imja > imja.kml
# Then open in Google Earth Pro
```

#### **GET /api/geojson/{lake_id}**
Get GeoJSON for web mapping.
```bash
curl http://localhost:5000/api/geojson/imja
→ {
    "type": "FeatureCollection",
    "features": [...]
  }
```

#### **GET /api/stats**
Global statistics across all lakes.
```bash
curl http://localhost:5000/api/stats
→ {
    "total_lakes_tracked": 5,
    "total_area_2008": 2.15,
    "total_area_2017": 7.42,
    "total_growth_percent": 244.65
  }
```

---

## **🚀 SETUP & DEPLOYMENT**

### **Quick Start (5 minutes)**

```bash
# 1. Clone & navigate
git clone https://github.com/yourusername/glacial-meltmap.git
cd glacial-meltmap

# 2. Backend
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python3 app.py

# 3. Frontend (new terminal)
npm install
npm start

# 4. Visit http://localhost:3000
```

### **Docker Deployment (Production)**

```bash
# Build and run
docker-compose up -d

# Access at http://localhost
```

---

## **📖 DOCUMENTATION FILES**

### **README.md**
- Complete project overview
- Installation instructions
- Feature list
- API documentation
- Troubleshooting guide
- **Read this first!**

### **QUICKSTART.md**
- 5-minute setup guide
- Step-by-step instructions
- Common issues & fixes
- Next steps after setup

### **QGIS_INTEGRATION_GUIDE.md**
- Complete QGIS workflow
- Data preparation in QGIS
- Exporting to KML/shapefile
- Google Earth integration
- Python processing examples
- **Most important for your data!**

### **WORKFLOW.md**
- Full end-to-end workflow
- QGIS → Python → Dashboard → Google Earth
- Step-by-step guide with examples
- Command references
- Common tasks & troubleshooting

---

## **🔧 CONFIGURATION FILES**

### **package.json**
Node.js project manifest with dependencies:
- React, React DOM
- Tailwind CSS, PostCSS
- Recharts (charting)
- Leaflet (maps)
- Framer Motion (animations)
- Axios (HTTP client)

### **tailwind.config.js**
Tailwind CSS customization:
- Custom color palette (blue/orange theme)
- Font families (Poppins, Outfit)
- Animation definitions
- Shadow & glow effects

### **requirements.txt**
Python dependencies:
- Flask, Flask-CORS
- GeoPandas, Shapely (geospatial)
- Scikit-learn (ML)
- GDAL (raster/vector processing)
- Pandas, NumPy

### **.env.example**
Environment variables template:
- Flask configuration
- React API URL
- Google Maps/Earth keys
- Feature flags
- Defaults

---

## **🗺️ DATA INTEGRATION GUIDE**

### **Step 1: Prepare QGIS Data**
- Organize Hi-MAG shapefiles by lake and year
- Export each layer: `{lake_name}_{year}.shp`
- Place in `backend/data/shapefiles/`

### **Step 2: Process Shapefiles**
```bash
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()
processor.export_kml('imja', './output/imja_evolution.kml')
EOF
```

### **Step 3: Train Models**
```bash
python3 models/train_model.py
```

### **Step 4: Use Dashboard**
- Run backend and frontend
- Select region → lake → view timeline & analytics

### **Step 5: Google Earth**
- Download KML: `curl /api/kml/imja -o imja.kml`
- Open in Google Earth Pro
- Toggle years in left panel

---

## **💡 KEY CONCEPTS**

### **Timeline Slider**
- Smooth year-by-year exploration (2008-2017)
- Connected to map visualization
- Updates all metrics in real-time

### **Prediction Models**
- **Polynomial regression** - Fits polynomial curve to growth
- **Random forest** - Ensemble ML method
- **Confidence scoring** - Decreases for distant predictions
- Based on actual shapefile area data

### **KML Integration**
- Multi-year color-coded boundaries
- Importable to Google Earth Pro
- Shows temporal evolution visually
- Compatible with 3D terrain visualization

### **Analytics**
- Area evolution charts
- Growth rate analysis
- Risk assessment (high/moderate/low)
- Comparative lake analysis

---

## **🎯 TYPICAL USER FLOWS**

### **Flow 1: Explore Historical Data**
1. Home → Select Region → Choose Lake
2. MapViewer: Adjust timeline slider
3. Watch lake boundary change year by year
4. View area metrics in sidebar

### **Flow 2: View Predictions**
1. Select lake → Go to Analytics
2. Scroll to "AI Predictions" section
3. See predictions for 2018-2030
4. Check confidence scores

### **Flow 3: Use Google Earth**
1. Select lake → Click "Export KML"
2. Open file in Google Earth Pro
3. Toggle years in left panel
4. View in 3D with terrain

### **Flow 4: Compare Lakes**
1. Analytics → "Comparison Tool"
2. Select multiple lakes
3. View side-by-side analysis
4. Compare growth patterns

---

## **🔐 SECURITY NOTES**

### **For Development**
- Uses SQLite (file-based)
- Secret key not set (add to .env)
- CORS allows localhost only

### **For Production**
- Use PostgreSQL (see docker-compose.yml)
- Set strong SECRET_KEY in .env
- Configure CORS for your domain
- Use HTTPS/SSL certificates
- Enable rate limiting
- Implement authentication

---

## **📞 SUPPORT & TROUBLESHOOTING**

### **Common Issues**

**"ModuleNotFoundError: geopandas"**
```bash
pip install geopandas gdal fiona
```

**"Port 5000 already in use"**
```bash
# Use different port
export FLASK_PORT=5001
python3 app.py
```

**"Cannot GET /api/..."**
- Ensure backend is running on http://localhost:5000
- Check API URL in .env

**Shapefiles not loading**
- Verify naming: `{lake_name}_{year}.shp`
- Ensure .dbf and .shx files present
- Check file permissions

---

## **🎓 LEARNING RESOURCES**

- **QGIS:** https://qgis.org/
- **GeoPandas:** https://geopandas.org/
- **Leaflet:** https://leafletjs.com/
- **Recharts:** https://recharts.org/
- **Flask:** https://flask.palletsprojects.com/

---

## **📋 CHECKLIST FOR FIRST RUN**

- [ ] Clone repository
- [ ] Install Node dependencies (`npm install`)
- [ ] Install Python dependencies (`pip install -r requirements.txt`)
- [ ] Add your shapefiles to `backend/data/shapefiles/`
- [ ] Run `python3 models/train_model.py`
- [ ] Start backend (`python3 app.py`)
- [ ] Start frontend (`npm start`)
- [ ] Visit http://localhost:3000
- [ ] Verify data loads in dashboard
- [ ] Export KML and test in Google Earth

---

## **🚀 NEXT STEPS**

1. **Add Your Data** - Follow QGIS_INTEGRATION_GUIDE.md
2. **Train Models** - Run train_model.py with your shapefiles
3. **Customize** - Edit colors, add features, modify pages
4. **Deploy** - Use Docker or cloud services
5. **Extend** - Add authentication, database, more ML models

---

**Version:** 1.0.0  
**Last Updated:** April 2026  
**Created for:** Thapar Institute of Engineering and Technology

🌍 **Tracking glacial lakes for a better future** 🏔️
