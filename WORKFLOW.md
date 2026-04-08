# 🔄 COMPLETE WORKFLOW: QGIS → Python → Dashboard → Google Earth

A step-by-step guide to integrate your Hi-MAG QGIS data with the Glacial MeltMap system.

---

## **PHASE 1: PREPARE DATA IN QGIS** (30-45 minutes)

### **1.1 Organize Your Shapefiles**

Your Hi-MAG dataset structure should look like:
```
Hi-MAG-Dataset/
├── Himalayas/
│   ├── imja_2008.shp (.dbf, .shx)
│   ├── imja_2009.shp (.dbf, .shx)
│   ├── ... 
│   ├── imja_2017.shp (.dbf, .shx)
│   ├── tsho_2008.shp (.dbf, .shx)
│   └── ... (continue for all lakes)
├── Andes/
│   └── ... (similar structure)
└── Alps/
    └── ... (similar structure)
```

### **1.2 Load into QGIS**

1. **Create new QGIS project:**
   ```
   File → New Project
   Set CRS: EPSG:4326 (WGS 84)
   ```

2. **Add all shapefiles (one lake at a time):**
   ```
   Layer → Add Layer → Add Vector Layer
   Select: imja_2008.shp
   Repeat for all years
   ```

3. **Organize layers in panel:**
   ```
   Right-click layer → Rename: "Imja 2008"
   Drag to group: "Imja Tsho"
   Repeat for all lakes
   ```

### **1.3 Verify Data Quality**

Run in QGIS Python Console:
```python
from qgis.core import QgsProject

project = QgsProject.instance()
for layer in project.mapLayers().values():
    for feature in layer.getFeatures():
        geom = feature.geometry()
        if not geom.isGeosValid():
            print(f"⚠ Invalid geometry in {layer.name()}")
        else:
            area_km2 = geom.area() / 1e6
            print(f"✓ {layer.name()}: {area_km2:.2f} km²")
```

### **1.4 Enhance Attributes**

Add fields to each shapefile for tracking:
```
Field Name        | Type   | Value
──────────────────────────────────────
Name              | String | Imja Tsho
Year              | Int    | 2013
Region            | String | Himalayas
Elevation         | Int    | 5010
Country           | String | Nepal
Area_km2          | Float  | 0.45 (calculated)
Perimeter_km      | Float  | 12.5 (calculated)
```

**To add:**
1. Right-click layer → Toggle Editing
2. Click "New Field" button
3. Name: `Area_km2`, Type: `Decimal`
4. For each feature: `area_km2 = $area / 1000000`

---

## **PHASE 2: EXPORT FROM QGIS** (20-30 minutes)

### **2.1 Export Individual Shapefiles**

For each layer:
```
Right-click Layer → Export As → Shapefile
Naming: {lake_name}_{year}.shp
Location: glacial-meltmap/backend/data/shapefiles/
```

### **2.2 Verify Exports**

```bash
ls -la backend/data/shapefiles/ | grep "\.shp"

# Should see files like:
# imja_2008.shp
# imja_2009.shp
# ...
# imja_2017.shp
# tsho_2008.shp
# etc.
```

### **2.3 Alternative: Bulk Export (Script)**

```python
# In QGIS Python Console
from qgis.core import QgsProject
import os

project = QgsProject.instance()
output_dir = "/path/to/glacial-meltmap/backend/data/shapefiles/"

for layer in project.mapLayers().values():
    if layer.type() != QgsMapLayer.VectorLayer:
        continue
    
    # Extract lake name and year from layer name
    parts = layer.name().split()
    lake_name = parts[0].lower()
    year = parts[-1]
    
    output_file = f"{output_dir}{lake_name}_{year}.shp"
    
    # Export
    error = QgsVectorFileWriter.writeAsVectorFormat(
        layer,
        output_file,
        "utf-8",
        layer.crs()
    )
    
    if error[0] == QgsVectorFileWriter.NoError:
        print(f"✓ Exported: {output_file}")
    else:
        print(f"✗ Error: {output_file} - {error[1]}")
```

---

## **PHASE 3: PROCESS WITH PYTHON** (10-15 minutes)

### **3.1 Verify Data Loading**

```bash
cd glacial-meltmap/backend

python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

print("\n=== DATA LOADED ===")
summary = processor.get_all_lakes_summary()

for lake_id, data in summary.items():
    print(f"\n{data['name']}:")
    print(f"  Years: {data['years_covered']}")
    print(f"  Initial area: {data['initial_area']:.3f} km²")
    print(f"  Final area: {data['final_area']:.3f} km²")
    print(f"  Growth: {data['growth_percent']:.1f}%")
EOF
```

**Expected output:**
```
=== DATA LOADED ===

Imja Tsho:
  Years: (2008, 2017)
  Initial area: 0.020 km²
  Final area: 1.280 km²
  Growth: 6300.0%

Tsho Rolpa:
  Years: (2008, 2017)
  Initial area: 0.800 km²
  Final area: 1.540 km²
  Growth: 92.5%
```

### **3.2 Generate KML Files**

```python
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

# Export KML for each lake
for lake_id in processor.lakes_data.keys():
    processor.export_kml(
        lake_id,
        f'./output/kml/{lake_id}_evolution.kml',
        multi_year=True
    )
    processor.export_geojson(
        lake_id,
        f'./output/geojson/{lake_id}.geojson'
    )
    
    print(f"✓ Exported {lake_id}")
```

Files created:
```
output/kml/imja_evolution.kml
output/kml/tsho_evolution.kml
output/geojson/imja.geojson
output/geojson/tsho.geojson
...
```

### **3.3 Calculate Metrics**

```python
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

for lake_id in processor.lakes_data.keys():
    metrics = processor.calculate_metrics(lake_id)
    print(f"\n{metrics['name']}:")
    print(f"  Total change: {metrics['total_change_km2']:.2f} km²")
    print(f"  Avg annual change: {metrics['average_annual_change_km2']:.3f} km²/year")
    print(f"  Trend: {metrics['trend']}")
```

---

## **PHASE 4: TRAIN PREDICTION MODELS** (5-10 minutes)

### **4.1 Train Models**

```bash
python3 models/train_model.py
```

**Output:**
```
==================================================
🏔️  GLACIAL LAKE PREDICTION MODEL TRAINER
==================================================

Training: IMJA
==================================================
  ✓ Loaded 2008: 0.020 km²
  ✓ Loaded 2009: 0.050 km²
  ...
  ✓ Loaded 2017: 1.280 km²

  Training polynomial regression (degree=2)...
  Data points: 10
  Training R²: 0.9876

  Training random forest...
  Training R²: 0.9834

  ✓ Saved to ./models/imja_model.pkl

📊 Report for IMJA:
  Period: 2008-2017
  Data points: 10
  Model R²: 0.9876
  Growth: 0.02 → 1.28 km²
  Total growth: 6300.0%

  Predictions:
    2018: 1.45 km² (conf: 98.8%)
    2019: 1.62 km² (conf: 94.2%)
    2020: 1.81 km² (conf: 89.7%)

✓ Training complete!
✓ Models saved to ./models
```

### **4.2 Verify Models**

```bash
ls -la models/
# Should see: imja_model.pkl, tsho_model.pkl, ...
```

---

## **PHASE 5: RUN THE DASHBOARD** (3-5 minutes)

### **5.1 Start Backend**

```bash
# Terminal 1
cd backend
source venv/bin/activate
python3 app.py

# Output:
#  * Running on http://127.0.0.1:5000
#  * WARNING: This is a development server...
```

### **5.2 Start Frontend**

```bash
# Terminal 2
npm start

# Output:
# webpack compiled...
# > Local:   http://localhost:3000
```

### **5.3 Open Dashboard**

Visit: **`http://localhost:3000`**

---

## **PHASE 6: INTEGRATE WITH GOOGLE EARTH** (10-15 minutes)

### **6.1 Download KML Files**

```bash
# Download KML for a specific lake
curl http://localhost:5000/api/kml/imja -o imja_evolution.kml
curl http://localhost:5000/api/kml/tsho -o tsho_evolution.kml
```

### **6.2 Import into Google Earth Pro**

1. **Open Google Earth Pro**
2. **File → Import KML File**
3. **Select:** `imja_evolution.kml`
4. **Toggle years in left panel** to see evolution

### **6.3 View in Dashboard**

The dashboard automatically loads KML data:
- Go to **MapViewer**
- Select a lake
- Use timeline slider
- KML boundaries display in map

### **6.4 Create Google Earth Tour (Optional)**

```
In Google Earth Pro:
Edit → Create Tour
Record your exploration
File → Save → Save Tour
```

---

## **PHASE 7: USE PREDICTIONS** (5 minutes)

### **7.1 View Predictions in Dashboard**

1. Select a lake → Go to Analytics
2. Scroll to "AI Predictions" section
3. See predictions for 2018-2030
4. View confidence scores

### **7.2 Get Predictions via API**

```bash
curl http://localhost:5000/api/lakes/imja/predict?years=10

# Response:
# {
#   "predictions": [
#     {"year": 2018, "area_km2": 1.45, "confidence": 0.988},
#     {"year": 2019, "area_km2": 1.62, "confidence": 0.942},
#     ...
#   ]
# }
```

### **7.3 Export Report**

```bash
curl http://localhost:5000/api/export/imja -o imja_report.json
```

---

## **WORKFLOW DIAGRAM**

```
┌─────────────────┐
│ QGIS Project    │
│ (Hi-MAG Data)   │
└────────┬────────┘
         │
         ├─ Export Shapefiles (2008-2017)
         │
┌────────▼────────────────────┐
│ backend/data/shapefiles/    │
│ ├─ imja_2008.shp            │
│ ├─ imja_2009.shp            │
│ └─ ... (all lakes & years)  │
└────────┬────────────────────┘
         │
         ├─ GeoSpatialProcessor loads all shapefiles
         │
┌────────▼──────────────────────────┐
│ Extract Metrics & Generate Files  │
│ ├─ KML (Multi-year boundaries)    │
│ ├─ GeoJSON (For web mapping)      │
│ └─ Metrics (Area, growth rate)    │
└────────┬──────────────────────────┘
         │
         ├─ Train ML Models (Polynomial & RF)
         │
┌────────▼──────────────────────┐
│ models/                       │
│ ├─ imja_model.pkl            │
│ ├─ tsho_model.pkl            │
│ └─ training_reports.json     │
└────────┬──────────────────────┘
         │
         ├─ Flask Backend API (app.py)
         │
┌────────▼────────────────────────────┐
│ /api/lakes/{id}/historical          │
│ /api/lakes/{id}/predict             │
│ /api/kml/{id}                       │
│ /api/geojson/{id}                   │
│ /api/lakes/{id}/analysis            │
└────────┬────────────────────────────┘
         │
    ┌────┴────┐
    │          │
    ▼          ▼
┌────────┐  ┌─────────────────────┐
│ React  │  │ Google Earth Pro    │
│ Dash   │  │ (KML visualization) │
└────────┘  └─────────────────────┘
```

---

## **COMMON TASKS**

### **Add New Lake**

1. Export shapefiles from QGIS: `newlake_2008.shp`, `newlake_2009.shp`, etc.
2. Place in `backend/data/shapefiles/`
3. Run: `python3 models/train_model.py`
4. Dashboard auto-loads new lake

### **Update Predictions**

```bash
# Retrain models after getting new year data
python3 models/train_model.py

# Get new predictions
curl http://localhost:5000/api/lakes/imja/predict
```

### **Export All Data**

```bash
python3 << 'EOF'
from utils.geospatial_processor import GeoSpatialProcessor

processor = GeoSpatialProcessor('./data/shapefiles')
processor.load_all_shapefiles()

# Export all to GeoJSON
for lake_id in processor.lakes_data.keys():
    processor.export_geojson(lake_id, f'export/{lake_id}.geojson')
EOF
```

---

## **TROUBLESHOOTING**

| Problem | Solution |
|---------|----------|
| "No shapefiles found" | Check naming: `{lake_name}_{year}.shp` |
| Invalid geometry | Use QGIS → Vector → Simplify Geometries |
| KML won't open in Google Earth | Verify CRS is EPSG:4326 |
| Predictions inaccurate | Ensure you have 5+ years of data |
| API 404 error | Check if backend is running on port 5000 |

---

## **NEXT: DEPLOYMENT**

Ready to deploy? See:
- **Docker:** Use `docker-compose up`
- **Cloud:** Deploy to AWS/GCP/Azure
- **Production:** See `README.md` deployment section

---

**You now have a complete geospatial analytics system! 🎉**
