# 🗺️ QGIS → Google Earth → Dashboard Integration Guide
## Complete Workflow for Glacial Lake Geospatial Data

---

## **PART 1: QGIS DATA PREPARATION**

### **Step 1.1: Organizing Shapefiles by Year**

Your Hi-MAG dataset should have the following structure:

```
data/
├── shapefiles/
│   ├── imja_2008.shp
│   ├── imja_2008.dbf
│   ├── imja_2008.shx
│   ├── imja_2009.shp
│   ├── imja_2009.dbf
│   ├── imja_2009.shx
│   ├── ... (continue for all years)
│   ├── imja_2017.shp
│   ├── imja_2017.dbf
│   ├── imja_2017.shx
│   ├── tsho_2008.shp
│   ├── ... (repeat for all lakes and years)
```

**Naming Convention:** `{lake_name}_{year}.shp`
- `lake_name`: lowercase, no spaces (imja, tsho, pho, etc.)
- `year`: 4-digit year (2008, 2009, ..., 2017)

### **Step 1.2: Loading Data into QGIS**

1. **Create a new QGIS project**
   ```
   File → New Project
   Set CRS to: EPSG:4326 (WGS 84)
   ```

2. **Add all shapefiles**
   ```
   Layer → Add Layer → Add Vector Layer
   Select all .shp files for a lake
   ```

3. **Organize Layers by Year**
   - Rename layers: `Lake_2008`, `Lake_2009`, etc.
   - Group by year in the Layers panel

4. **Verify Spatial Alignment**
   ```
   Use Vector → Geometry Tools → Check Geometry
   Ensure all polygons are valid
   ```

### **Step 1.3: Attribute Table Enrichment**

Each shapefile should have attributes:
```
Field Name        | Type   | Example
─────────────────────────────────────
Name              | String | Imja Tsho
Year              | Int    | 2013
Area_km2          | Float  | 0.45
Elevation         | Int    | 5010
Region            | String | Himalayas
Perimeter_km      | Float  | 12.5
Glacier_Distance  | Float  | 2.3
```

**To add fields in QGIS:**
```
Right-click layer → Toggle Editing
Attributes toolbar → New Field
Add fields above
Save & Toggle Off Editing
```

### **Step 1.4: Verify Data Quality**

```python
# Use this Python script in QGIS Console to validate
from qgis.core import QgsProject, QgsVectorLayer
import math

project = QgsProject.instance()
for layer in project.mapLayers().values():
    if layer.type() == QgsMapLayer.VectorLayer:
        for feature in layer.getFeatures():
            geom = feature.geometry()
            # Check if polygon is valid
            if not geom.isGeosValid():
                print(f"Invalid geometry in {layer.name()}")
            # Check area
            area = geom.area()
            print(f"{layer.name()}: {area / 1e6:.2f} km²")
```

---

## **PART 2: EXPORTING FROM QGIS TO KML**

### **Step 2.1: Single-Year KML Export**

1. **Right-click layer → Export As**
2. **Format:** Keyhole Markup Language [KML]
3. **Output:** `imja_2013.kml`
4. **Options:**
   - Coordinate precision: 8 decimals
   - Include style: ✓
   - Symbology export: ✓

### **Step 2.2: Temporal KML (Recommended)**

Create a multi-year KML with color-coded boundaries:

```python
# In QGIS Python Console or Backend Script
from qgis.core import *
import os

project = QgsProject.instance()
lakes = {}

# Collect all layers by lake
for layer in project.mapLayers().values():
    if layer.type() != QgsMapLayer.VectorLayer:
        continue
    
    lake_name = layer.name().split('_')[0]
    year = int(layer.name().split('_')[1])
    
    if lake_name not in lakes:
        lakes[lake_name] = {}
    lakes[lake_name][year] = layer

# Export temporal KML for each lake
for lake_name, years_dict in lakes.items():
    # Create group with color gradient
    # Year 1 = Blue (old), Year N = Red (new)
    years = sorted(years_dict.keys())
    
    for i, year in enumerate(years):
        layer = years_dict[year]
        color_ratio = i / len(years)
        
        # Blue to Red gradient
        r = int(255 * color_ratio)
        b = 255 - r
        hex_color = f"#{r:02x}00{b:02x}"
        
        # Export with this color
        output_path = f"./kml/{lake_name}_{year}.kml"
        layer.exportToKML(output_path)
        print(f"Exported: {output_path}")
```

### **Step 2.3: Using the Python Script Directly**

```bash
# Navigate to backend directory
cd backend

# Run the geospatial processor
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

# Export all lakes
for lake_id in processor.lakes_data.keys():
    processor.export_kml(lake_id, f'./output/kml/{lake_id}_evolution.kml', multi_year=True)
    print(f"✓ Exported {lake_id}")

# Print summary
print("\n=== SUMMARY ===")
summary = processor.get_all_lakes_summary()
for lake_id, data in summary.items():
    print(f"{data['name']}: {data['growth_percent']:.1f}% growth")
EOF
```

---

## **PART 3: INTEGRATING WITH GOOGLE EARTH**

### **Step 3.1: Manual Google Earth Integration**

1. **Open Google Earth Pro**
2. **File → Import KML file**
3. **Select:** `imja_evolution.kml`
4. **View Results:**
   - Toggle years on/off in left panel
   - View 3D terrain with lake boundaries
   - Measure distances and areas

### **Step 3.2: Google Earth Web API Integration**

**In your React dashboard (MapViewer.js), replace the map placeholder:**

```javascript
// src/pages/MapViewer.js (Updated)
import { useEffect, useRef } from 'react';

export default function MapViewer({ lake, region, year, onYearChange }) {
  const mapRef = useRef(null);
  const [earthApi, setEarthApi] = useState(null);

  useEffect(() => {
    // Load Google Earth API
    const script = document.createElement('script');
    script.src = 'https://www.google.com/earth/api/api.js';
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      google.earth.createInstance('map', initCallback, failureCallback);
    };
    
    document.body.appendChild(script);
  }, []);

  const initCallback = (instance) => {
    const ge = instance;
    ge.getWindow().setVisibility(true);
    setEarthApi(ge);
    
    // Load KML
    const kmlUrl = `/api/kml/${lake.id}?year=${year}`;
    ge.fetchKml(kmlUrl, (kmlObject) => {
      if (kmlObject) {
        ge.getFeatures().appendChild(kmlObject);
      }
    });
  };

  const failureCallback = (errorInfo) => {
    console.error('Earth API failed:', errorInfo);
  };

  return (
    <div>
      <div id="map" style={{ width: '100%', height: '600px' }}></div>
      {/* Rest of component */}
    </div>
  );
}
```

### **Step 3.3: KML Serving from Backend**

**Update backend/app.py:**

```python
@app.route('/api/kml/<lake_id>', methods=['GET'])
def get_lake_kml(lake_id):
    """Serve KML for specific lake and year"""
    year = request.args.get('year', 2017, type=int)
    
    try:
        processor = GeoSpatialProcessor('./data/shapefiles')
        processor.load_all_shapefiles()
        
        kml_content = processor.generate_kml_for_lake(lake_id, year)
        
        if kml_content:
            response = app.response_class(
                response=kml_content,
                status=200,
                mimetype='application/vnd.google-earth.kml+xml'
            )
            response.headers['Content-Disposition'] = f'attachment; filename={lake_id}_{year}.kml'
            return response
        
        return jsonify({'error': 'KML not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
```

---

## **PART 4: LEAFLET MAP INTEGRATION (SIMPLER ALTERNATIVE)**

If Google Earth API has limitations, use Leaflet with GeoJSON:

```javascript
// src/pages/MapViewer.js (Leaflet Version)
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import axios from 'axios';

export default function MapViewer({ lake, year }) {
  const [geoData, setGeoData] = useState(null);

  useEffect(() => {
    // Fetch GeoJSON from backend
    axios.get(`/api/geojson/${lake.id}`)
      .then(res => {
        // Filter by year
        const filtered = {
          ...res.data,
          features: res.data.features.filter(f => f.properties.year === year)
        };
        setGeoData(filtered);
      })
      .catch(err => console.error(err));
  }, [lake.id, year]);

  return (
    <MapContainer center={[27.95, 86.95]} zoom={11} style={{ height: '400px', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {geoData && <GeoJSON data={geoData} />}
    </MapContainer>
  );
}
```

**Backend endpoint:**

```python
@app.route('/api/geojson/<lake_id>', methods=['GET'])
def get_lake_geojson(lake_id):
    """Serve GeoJSON for specific lake"""
    processor = GeoSpatialProcessor('./data/shapefiles')
    processor.load_all_shapefiles()
    
    geojson = processor.generate_geojson_for_lake(lake_id)
    return jsonify(geojson)
```

---

## **PART 5: PREDICTIVE MODELING INTEGRATION**

### **Step 5.1: Train Prediction Model on Real Data**

```python
# backend/models/train_model.py
import geopandas as gpd
import numpy as np
from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
import pickle
from pathlib import Path

def train_model_from_shapefiles(shapefiles_dir, lake_id):
    """Train prediction model using actual shapefile data"""
    
    shapefiles = sorted(Path(shapefiles_dir).glob(f'{lake_id}_*.shp'))
    
    data = {}
    for shp in shapefiles:
        try:
            year = int(shp.stem.split('_')[-1])
            gdf = gpd.read_file(str(shp))
            
            # Calculate total area
            total_area = gdf.geometry.area.sum() / 1e6  # Convert to km²
            data[year] = total_area
            
            print(f"✓ {lake_id} {year}: {total_area:.2f} km²")
        except Exception as e:
            print(f"✗ Error processing {shp}: {e}")
    
    if len(data) < 3:
        raise ValueError("Need at least 3 years of data")
    
    # Prepare training data
    years = np.array(sorted(data.keys())).reshape(-1, 1)
    areas = np.array([data[y] for y in sorted(data.keys())])
    
    # Fit polynomial model (degree 2 for non-linear growth)
    poly = PolynomialFeatures(degree=2)
    X_poly = poly.fit_transform(years)
    
    model = LinearRegression()
    model.fit(X_poly, areas)
    
    # Make predictions
    future_years = np.array(range(2018, 2031)).reshape(-1, 1)
    future_years_poly = poly.transform(future_years)
    predictions = model.predict(future_years_poly)
    
    # Save model
    model_path = f'./models/{lake_id}_model.pkl'
    Path(model_path).parent.mkdir(exist_ok=True)
    
    with open(model_path, 'wb') as f:
        pickle.dump({
            'model': model,
            'poly': poly,
            'lake_id': lake_id,
            'training_years': sorted(data.keys())
        }, f)
    
    print(f"\n=== PREDICTIONS FOR {lake_id.upper()} ===")
    for year, pred in zip(range(2018, 2031), predictions):
        print(f"{year}: {max(0, pred):.2f} km²")
    
    return model, predictions

# Train for all lakes
if __name__ == '__main__':
    lakes = ['imja', 'tsho', 'pho', 'pam', 'oeschinen']
    
    for lake_id in lakes:
        try:
            train_model_from_shapefiles('./data/shapefiles', lake_id)
        except Exception as e:
            print(f"✗ Failed to train {lake_id}: {e}")
```

### **Step 5.2: Use Model in Backend API**

```python
# backend/app.py (Updated)
import pickle
from pathlib import Path

# Load all trained models on startup
loaded_models = {}

def load_models():
    model_dir = Path('./models')
    for model_file in model_dir.glob('*_model.pkl'):
        lake_id = model_file.stem.split('_')[0]
        with open(model_file, 'rb') as f:
            loaded_models[lake_id] = pickle.load(f)
        print(f"✓ Loaded model for {lake_id}")

load_models()

@app.route('/api/predict/<lake_id>', methods=['GET'])
def predict_lake(lake_id):
    """Get predictions for a lake using trained model"""
    
    if lake_id not in loaded_models:
        return jsonify({'error': f'Model not found for {lake_id}'}), 404
    
    model_data = loaded_models[lake_id]
    model = model_data['model']
    poly = model_data['poly']
    
    # Predict next 10 years
    future_years = np.array(range(2018, 2028)).reshape(-1, 1)
    future_years_poly = poly.transform(future_years)
    predictions = model.predict(future_years_poly)
    
    result = [
        {
            'year': int(year[0]),
            'area_km2': float(max(0, pred)),
            'confidence': 0.95 - (i * 0.04)
        }
        for i, (year, pred) in enumerate(zip(future_years, predictions))
    ]
    
    return jsonify({
        'success': True,
        'lake_id': lake_id,
        'predictions': result
    })
```

### **Step 5.3: Visualize Predictions in Dashboard**

```javascript
// src/pages/Analytics.js (Updated)
const [predictions, setPredictions] = useState([]);

useEffect(() => {
  axios.get(`/api/predict/${lake.id}`)
    .then(res => setPredictions(res.data.predictions))
    .catch(err => console.error(err));
}, [lake.id]);

// In chart:
<AreaChart data={[...historicalData, ...predictions]}>
  <Area dataKey="area_km2" stroke="#0ea5e9" fill="url(#colorArea)" />
</AreaChart>
```

---

## **PART 6: COMPLETE WORKFLOW SUMMARY**

### **Data Flow Diagram:**

```
QGIS Project
    ↓
Shapefiles (2008-2017)
    ↓
Extract Geometry & Attributes
    ↓
    ├─→ KML Export (Google Earth)
    └─→ GeoJSON Export (Web Maps)
           ↓
    React Dashboard
           ↓
    ├─→ Leaflet/Google Maps Visualization
    ├─→ Timeline Slider (2008-2017)
    └─→ Analytics Panel
           ↓
Python Backend
    ├─→ Geospatial Processing
    ├─→ Metric Calculation
    └─→ Prediction Model
           ↓
    API Endpoints
    (/api/kml, /api/geojson, /api/predict)
           ↓
    Frontend Consumption
    (Maps, Charts, Analytics)
```

### **Data Structure:**

```
Lake Data JSON:
{
  "lake_id": "imja",
  "name": "Imja Tsho",
  "region": "himalayas",
  "coordinates": [27.95, 86.95],
  "elevation": 5010,
  "historical": {
    "2008": {"area_km2": 0.02, "geometry": {...}},
    "2009": {"area_km2": 0.05, "geometry": {...}},
    ...
    "2017": {"area_km2": 1.28, "geometry": {...}}
  },
  "predictions": {
    "2018": {"area_km2": 1.45, "confidence": 0.91},
    "2019": {"area_km2": 1.62, "confidence": 0.87},
    ...
    "2027": {"area_km2": 2.15, "confidence": 0.71}
  }
}
```

---

## **PART 7: COMMAND REFERENCE**

### **Setup Shapefiles:**
```bash
# Create directory structure
mkdir -p data/shapefiles
mkdir -p data/kml
mkdir -p data/geojson
mkdir -p output/kml
mkdir -p output/geojson

# Copy your shapefiles (from QGIS exports)
cp ~/Downloads/*.shp data/shapefiles/
cp ~/Downloads/*.dbf data/shapefiles/
cp ~/Downloads/*.shx data/shapefiles/
```

### **Process Shapefiles:**
```bash
cd backend

# Install dependencies
pip install -r requirements.txt

# Train models
python3 models/train_model.py

# Validate data
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor
processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()
processor.export_kml('imja', './output/imja_multi_year.kml')
EOF
```

### **Run Dashboard:**
```bash
# Backend
python3 app.py

# Frontend (in new terminal)
cd ../
npm install
npm start
```

---

## **PART 8: GOOGLE EARTH PRO TIPS**

1. **Toggle visibility:** Click eye icon in left panel
2. **Measure areas:** Tools → Measure → Draw polygon
3. **Take screenshots:** File → Save Image
4. **Create tours:** Edit → Create Tour
5. **Export as KMZ:** File → Save → Save As
6. **Use time slider:** View → Historical Imagery

---

## **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| "Invalid geometry" | Use Vector → Geometry Tools → Fix Geometries |
| KML not showing in Google Earth | Check CRS is EPSG:4326 (WGS 84) |
| Performance slow with many years | Simplify geometries: Vector → Simplify |
| Shapefiles not loading | Ensure all .shp, .dbf, .shx files present |
| Predictions inaccurate | Need more training years (>5 recommended) |

---

This is your complete roadmap! 🚀
