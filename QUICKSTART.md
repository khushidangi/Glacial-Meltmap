# 🚀 QUICKSTART GUIDE

Get Glacial MeltMap running in 5 minutes!

---

## **Step 1: Clone & Navigate** (30 seconds)

```bash
git clone https://github.com/yourusername/glacial-meltmap.git
cd glacial-meltmap
```

---

## **Step 2: Backend Setup** (2 minutes)

```bash
# Navigate to backend
cd backend

# Create virtual environment
python3 -m venv venv

# Activate it
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create directories
mkdir -p data/shapefiles models output
```

---

## **Step 3: Frontend Setup** (2 minutes)

```bash
# Go back to root
cd ..

# Install Node dependencies
npm install

# Create .env file
cp .env.example .env
```

---

## **Step 4: Run the Application**

### **Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
python3 app.py
```

**Expected output:**
```
 * Running on http://127.0.0.1:5000
 * WARNING: This is a development server. Do not use it in production.
```

### **Terminal 2 - Frontend:**
```bash
npm start
```

**Expected output:**
```
webpack compiled with ... warning
> Local:   http://localhost:3000
```

---

## **Step 5: Open in Browser**

Visit: **`http://localhost:3000`**

✅ **You're done!**

---

## **Next Steps**

### **Add Your Own Data**

1. **Prepare shapefiles from QGIS:**
   ```
   Place them in: backend/data/shapefiles/
   Naming: {lake_name}_{year}.shp (+ .dbf, .shx)
   ```

2. **Process shapefiles:**
   ```bash
   cd backend
   python3 << 'EOF'
   from utils.geospatial_processor import GeoSpatialProcessor
   processor = GeoSpatialProcessor('./data/shapefiles')
   processor.load_all_shapefiles()
   processor.export_kml('imja', './output/imja_evolution.kml')
   EOF
   ```

3. **Train prediction models:**
   ```bash
   python3 models/train_model.py
   ```

### **Use Google Earth**

```bash
# Export KML
curl http://localhost:5000/api/kml/imja -o imja.kml

# Open in Google Earth Pro
# File → Import KML → Select imja.kml
```

---

## **Common Issues**

### **"ModuleNotFoundError: No module named 'geopandas'"**
```bash
pip install geopandas gdal
```

### **"Cannot GET /api/..."**
Check if backend is running on `http://localhost:5000`

### **"Port 3000/5000 already in use"**
```bash
# Change ports in .env
REACT_APP_API_URL=http://localhost:5001
```

Then run:
```bash
PORT=3001 npm start
```

---

## **Using Docker (Alternative)**

```bash
# Build and run with Docker
docker-compose up -d

# Access at http://localhost
```

---

## **File Structure Overview**

```
glacial-meltmap/
├── backend/               # Python Flask API
│   ├── app.py            # Main server
│   ├── models/           # ML models
│   └── data/             # Your shapefiles
├── src/                  # React components
│   ├── pages/            # Page components
│   └── styles/           # CSS
├── public/               # Static files
├── package.json          # Node dependencies
└── README.md             # Full documentation
```

---

## **API Quick Reference**

| Endpoint | Purpose |
|----------|---------|
| `GET /api/health` | Check if backend is running |
| `GET /api/lakes/imja/historical` | Get lake data (2008-2017) |
| `GET /api/lakes/imja/predict` | Get AI predictions |
| `GET /api/kml/imja` | Export KML for Google Earth |
| `GET /api/stats` | Global statistics |

---

## **Features Available**

✅ **Interactive timeline slider** - Explore 2008-2017  
✅ **Analytics charts** - See growth trends  
✅ **Predictions** - AI forecasts for future  
✅ **Story mode** - Narrative exploration  
✅ **Multiple regions** - Himalayas, Andes, Alps  
✅ **KML export** - Use with Google Earth  

---

## **Need Help?**

- 📖 Read the [QGIS Integration Guide](./QGIS_INTEGRATION_GUIDE.md)
- 🔍 Check [README.md](./README.md) for detailed docs
- 💬 Open an issue on GitHub

---

## **What's Next?**

1. **Customize the dashboard** - Edit `src/pages/*.js`
2. **Add your data** - Follow data integration steps
3. **Deploy to production** - Use Docker or cloud services
4. **Add Google Earth** - Enable in `QGIS_INTEGRATION_GUIDE.md`

---

**Happy exploring! 🏔️🌊**
