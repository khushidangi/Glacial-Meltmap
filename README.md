# 🌍 Glacial MeltMap - AI-Driven Lake Evolution Dashboard

An interactive geospatial visualization and analytics platform for tracking and predicting glacial lake evolution across multiple regions (Himalayas, Andes, Alps).

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![React](https://img.shields.io/badge/React-18+-blue)

---

## 📋 Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Project Structure](#project-structure)
- [Data Integration](#data-integration)
- [API Documentation](#api-documentation)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

---

## ✨ Features

### **Map Visualization**
- ✅ Interactive timeline slider (2008-2017)
- ✅ KML support for Google Earth integration
- ✅ GeoJSON rendering with Leaflet
- ✅ Multi-year lake boundary overlay
- ✅ Real-time polygon visualization

### **Analytics Dashboard**
- 📊 Area evolution charts
- 📈 Growth rate analysis
- 🎯 Risk assessment indicators
- 🔮 AI predictions (2018-2030)
- 📋 Comparative lake analysis

### **Story Mode**
- 📖 Narrative-driven exploration
- 🎬 Scene-based storytelling
- 🔊 Voice narration support (planned)
- 🌐 360° orbit views (planned)

### **Predictive Intelligence**
- 🤖 Machine learning models (Polynomial & Random Forest)
- 📉 Trend analysis
- 🔐 Confidence scoring
- 📡 Real-time predictions

---

## 🚀 Quick Start

### **Prerequisites**

- Node.js 16+
- Python 3.8+
- Git
- GDAL/OGR libraries

### **Installation**

#### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/glacial-meltmap.git
cd glacial-meltmap
```

#### **2. Backend Setup**

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create data directories
mkdir -p data/shapefiles models output

# Train models (optional - if you have shapefile data)
python3 models/train_model.py
```

#### **3. Frontend Setup**

```bash
# Navigate to root directory
cd ..

# Install dependencies
npm install

# Create .env file
echo "REACT_APP_API_URL=http://localhost:5000" > .env
```

#### **4. Run the Application**

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python3 app.py
```

**Terminal 2 - Frontend:**
```bash
npm start
```

Visit `http://localhost:3000` in your browser.

---

## 📁 Project Structure

```
glacial-meltmap/
├── backend/
│   ├── app.py                           # Flask API server
│   ├── requirements.txt                 # Python dependencies
│   ├── models/
│   │   ├── glacier_predictor.py        # Prediction model
│   │   ├── train_model.py              # Training script
│   │   └── *.pkl                       # Saved models
│   ├── utils/
│   │   ├── geospatial_processor.py    # QGIS data processor
│   │   └── kml_generator.py           # KML conversion
│   └── data/
│       └── shapefiles/                 # Your QGIS shapefiles
│
├── src/
│   ├── components/
│   │   ├── Header.js                   # Top navigation
│   │   └── Sidebar.js                  # Side menu
│   ├── pages/
│   │   ├── HomePage.js                 # Landing page
│   │   ├── RegionSelector.js          # Region selection
│   │   ├── LakeSelector.js            # Lake browsing
│   │   ├── MapViewer.js               # Map with timeline
│   │   ├── Analytics.js               # Charts & analysis
│   │   └── StoryMode.js               # Narrative mode
│   ├── styles/
│   │   └── App.css                    # Global styling
│   ├── App.js                         # Main app component
│   └── index.js                       # React entry point
│
├── public/
│   └── index.html                     # HTML template
│
├── package.json                       # Node dependencies
├── tailwind.config.js                # Tailwind configuration
├── QGIS_INTEGRATION_GUIDE.md          # Complete integration guide
└── README.md                          # This file
```

---

## 📊 Data Integration

### **Step 1: Prepare Shapefiles from QGIS**

1. Open your Hi-MAG dataset in QGIS
2. Organize layers by year
3. Export each layer:
   ```
   Layer → Export As → Shapefile Format
   Naming: {lake_name}_{year}.shp
   ```

4. Place all shapefiles in `backend/data/shapefiles/`

### **Step 2: Process Shapefiles**

```bash
cd backend

# Verify data
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

# Print summary
summary = processor.get_all_lakes_summary()
for lake_id, data in summary.items():
    print(f"{data['name']}: {data['growth_percent']:.1f}% growth")
EOF
```

### **Step 3: Generate KML for Google Earth**

```bash
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

# Export KML for each lake
for lake_id in processor.lakes_data.keys():
    processor.export_kml(lake_id, f'output/kml/{lake_id}_evolution.kml', multi_year=True)
    processor.export_geojson(lake_id, f'output/geojson/{lake_id}.geojson')
EOF
```

### **Step 4: Train Prediction Models**

```bash
python3 models/train_model.py
```

This will:
- Extract area data from shapefiles
- Train polynomial & random forest models
- Generate predictions for 2018-2030
- Save models for API use

---

## 🔌 API Documentation

### **Base URL:** `http://localhost:5000`

### **Endpoints**

#### **1. Get Historical Data**
```
GET /api/lakes/{lake_id}/historical

Response:
[
  { "year": 2008, "area": 0.02 },
  { "year": 2009, "area": 0.05 },
  ...
]
```

#### **2. Get Predictions**
```
GET /api/lakes/{lake_id}/predict?years=5

Response:
[
  { "year": 2018, "area": 1.45, "confidence": 0.91 },
  { "year": 2019, "area": 1.62, "confidence": 0.87 },
  ...
]
```

#### **3. Get Lake Analysis**
```
GET /api/lakes/{lake_id}/analysis

Response:
{
  "lake_name": "Imja Tsho",
  "elevation": 5010,
  "initial_area_2008": 0.02,
  "final_area_2017": 1.28,
  "total_growth_percent": 6200,
  "risk_level": "VERY HIGH",
  "projected_2025_area": 1.85
}
```

#### **4. Get KML**
```
GET /api/kml/{lake_id}?year=2017

Returns: KML file (for Google Earth)
```

#### **5. Get GeoJSON**
```
GET /api/geojson/{lake_id}

Response: GeoJSON FeatureCollection
```

#### **6. Compare Lakes**
```
POST /api/comparison

Body: { "lakes": ["imja", "tsho"] }

Response: Comparative analysis
```

#### **7. Global Statistics**
```
GET /api/stats

Response: Global metrics across all lakes
```

---

## 🌐 Google Earth Integration

### **Option 1: Manual KML Import**

1. Export KML from dashboard:
   ```bash
   curl http://localhost:5000/api/kml/imja -o imja_evolution.kml
   ```

2. Open Google Earth Pro
3. File → Import KML → Select file
4. Toggle years on/off in left panel

### **Option 2: Web-Based Integration**

Update `MapViewer.js` to use Google Earth API:

```javascript
// Load Google Earth API
import * as GoogleEarthEngineAPI from '@/apis/google-earth';

// Initialize map
const ge = await GoogleEarthEngineAPI.initialize('map');

// Load KML
const kml = await fetch(`/api/kml/${lake.id}?year=${year}`);
ge.fetchKml(kml, (kmlObject) => {
  ge.getFeatures().appendChild(kmlObject);
});
```

---

## 🐳 Docker Deployment

### **Build Docker Image**

```bash
docker build -t glacial-meltmap:latest .

docker run -p 3000:3000 -p 5000:5000 \
  -v $(pwd)/backend/data:/app/backend/data \
  glacial-meltmap:latest
```

### **Docker Compose**

```bash
docker-compose up -d
```

---

## 📈 Model Training & Evaluation

### **Train New Models**

```bash
cd backend
python3 models/train_model.py
```

### **Model Metrics**

After training, check `models/training_reports.json`:

```json
{
  "imja": {
    "model_type": "polynomial",
    "r_squared": 0.9876,
    "training_period": "2008-2017",
    "predictions": [...]
  }
}
```

### **Evaluate Predictions**

```python
from models.glacier_predictor import GlacierPredictor

predictor = GlacierPredictor()
predictions = predictor.predict_growth('imja', years=10)

for pred in predictions:
    print(f"{pred['year']}: {pred['area']:.2f} km²")
```

---

## 🔧 Configuration

### **.env (Environment Variables)**

```bash
# Backend
FLASK_ENV=development
FLASK_DEBUG=True
DATABASE_URL=sqlite:///glacial_meltmap.db

# Frontend
REACT_APP_API_URL=http://localhost:5000
REACT_APP_MAP_API_KEY=your_google_maps_key_here
REACT_APP_ENVIRONMENT=development
```

### **tailwind.config.js**

Customize colors, fonts, and theme in `tailwind.config.js`

---

## 📚 Documentation

- **[QGIS Integration Guide](./QGIS_INTEGRATION_GUIDE.md)** - Complete data workflow
- **[API Docs](./docs/API.md)** - Detailed endpoint reference
- **[Model Training](./docs/MODELS.md)** - ML model documentation

---

## 🐛 Troubleshooting

### **Backend Issues**

**Problem:** `ModuleNotFoundError: No module named 'geopandas'`
```bash
# Solution
pip install geopandas gdal fiona
```

**Problem:** `Shapefile not found`
```bash
# Solution
ls backend/data/shapefiles/
# Ensure files follow naming: {lake_id}_{year}.shp
```

### **Frontend Issues**

**Problem:** `Cannot GET /api/...`
```bash
# Solution: Ensure backend is running
cd backend && python3 app.py
```

**Problem:** Maps not rendering
```bash
# Check if Leaflet CSS is loaded in index.html
# Verify API URL in .env
```

### **Data Issues**

**Problem:** KML won't open in Google Earth
```bash
# Validate KML
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor
processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()
kml = processor.generate_kml_for_lake('imja', 2017)
print(kml[:500])
EOF
```

---

## 📦 Dependencies

### **Backend**
- Flask 2.3+
- GeoPandas 0.13+
- Scikit-learn 1.3+
- GDAL 3.7+

### **Frontend**
- React 18+
- Tailwind CSS 3+
- Recharts 2.10+
- Leaflet 1.9+
- Framer Motion 10+

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

---

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file for details.

---

## 🙋 Support

- **Issues:** GitHub Issues
- **Discussions:** GitHub Discussions
- **Email:** support@glacialmeltmap.org

---

## 🙏 Acknowledgments

- Hi-MAG Dataset (Himalayan Glacier Lake Inventory)
- QGIS Community
- Thapar Institute of Engineering and Technology

---

## 📞 Contact

**Author:** Glacial MeltMap Development Team  
**Email:** dev@glacialmeltmap.org  
**Website:** https://glacialmeltmap.org

---

**Last Updated:** April 2026  
**Version:** 1.0.0
