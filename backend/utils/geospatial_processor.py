"""
Geospatial Data Processing Module
Handles shapefile conversion, KML generation, and temporal data processing
"""

import geopandas as gpd
import pandas as pd
from shapely.geometry import mapping, shape
import json
import os
from pathlib import Path
from datetime import datetime
import fiona

class GeoSpatialProcessor:
    """
    Processes QGIS shapefiles and converts them to web-compatible formats
    """
    
    def __init__(self, shapefiles_dir='./data/shapefiles'):
        """Initialize processor with shapefiles directory"""
        self.shapefiles_dir = Path(shapefiles_dir)
        self.lakes_data = {}
        
    def load_shapefile(self, shapefile_path, year):
        """Load a shapefile and extract lake features"""
        try:
            gdf = gpd.read_file(shapefile_path)
            print(f"✓ Loaded {shapefile_path} with {len(gdf)} features")
            
            # Process each lake polygon
            for idx, row in gdf.iterrows():
                lake_name = row.get('Name') or row.get('name') or f'Lake_{idx}'
                lake_id = lake_name.lower().replace(' ', '_')
                
                if lake_id not in self.lakes_data:
                    self.lakes_data[lake_id] = {
                        'name': lake_name,
                        'geometry': {},
                        'properties': {}
                    }
                
                # Store geometry for this year
                self.lakes_data[lake_id]['geometry'][year] = {
                    'type': 'Polygon',
                    'coordinates': [list(row.geometry.exterior.coords)],
                    'area_km2': row.geometry.area / 1e6  # Convert to km²
                }
                
                # Store properties
                self.lakes_data[lake_id]['properties'][year] = dict(row)
            
            return True
        except Exception as e:
            print(f"✗ Error loading shapefile: {e}")
            return False
    
    def load_all_shapefiles(self):
        """Load all shapefiles from directory following naming pattern: lake_YYYY.shp"""
        if not self.shapefiles_dir.exists():
            print(f"✗ Directory {self.shapefiles_dir} does not exist")
            return False
        
        shapefiles = sorted(self.shapefiles_dir.glob('*.shp'))
        print(f"Found {len(shapefiles)} shapefiles")
        
        for shp_file in shapefiles:
            # Extract year from filename (e.g., 'imja_2013.shp' -> 2013)
            try:
                year = int(shp_file.stem.split('_')[-1])
                self.load_shapefile(str(shp_file), year)
            except ValueError:
                print(f"⚠ Skipping {shp_file.name} - cannot extract year from filename")
                continue
        
        return len(self.lakes_data) > 0
    
    def generate_kml_for_lake(self, lake_id, year):
        """Generate KML for a specific lake and year"""
        if lake_id not in self.lakes_data or year not in self.lakes_data[lake_id]['geometry']:
            return None
        
        lake = self.lakes_data[lake_id]
        geometry = lake['geometry'][year]
        area = geometry['area_km2']
        
        # Create KML string
        kml = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{lake['name']} - {year}</name>
    <description>Glacial Lake Boundary - {year}</description>
    
    <Style id="lakeStyle">
      <PolyStyle>
        <color>880055ff</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
      <LineStyle>
        <color>ff0000ff</color>
        <width>2</width>
      </LineStyle>
    </Style>
    
    <Folder>
      <name>{lake['name']}</name>
      <Placemark>
        <name>{lake['name']} ({year})</name>
        <description>
          <![CDATA[
            <h3>{lake['name']}</h3>
            <p><b>Year:</b> {year}</p>
            <p><b>Area:</b> {area:.2f} km²</p>
            <p><b>Last Updated:</b> {datetime.now().strftime('%Y-%m-%d')}</p>
          ]]>
        </description>
        <styleUrl>#lakeStyle</styleUrl>
        <Polygon>
          <extrude>0</extrude>
          <tessellate>1</tessellate>
          <altitudeMode>relativeToGround</altitudeMode>
          <outerBoundaryIs>
            <LinearRing>
              <coordinates>
"""
        
        # Add coordinates
        coords = geometry['coordinates'][0]
        for lon, lat in coords:
            kml += f"                {lon},{lat},0\n"
        
        kml += """              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
    </Folder>
  </Document>
</kml>"""
        
        return kml
    
    def generate_multi_year_kml(self, lake_id):
        """Generate KML with all years as separate placemarks"""
        if lake_id not in self.lakes_data:
            return None
        
        lake = self.lakes_data[lake_id]
        years = sorted(lake['geometry'].keys())
        
        # Color progression from blue (old) to red (new)
        colors = {
            years[0]: 'ff0000ff',  # Blue
            years[-1]: 'ff0000ff',  # Red
        }
        # Interpolate colors
        for i, year in enumerate(years):
            if year not in colors:
                r = int(255 * (i / len(years)))
                b = 255 - r
                colors[year] = f'ff{r:02x}00{b:02x}'
        
        kml = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{lake['name']} - Temporal Evolution</name>
    <description>Glacial Lake Boundary Evolution ({years[0]}-{years[-1]})</description>
"""
        
        # Create styles for each year
        for year in years:
            color = colors.get(year, 'ff0000ff')
            kml += f"""
    <Style id="style{year}">
      <PolyStyle>
        <color>{color}</color>
        <fill>1</fill>
        <outline>1</outline>
        <outlineColor>ff000000</outlineColor>
      </PolyStyle>
      <LineStyle>
        <color>ff000000</color>
        <width>2</width>
      </LineStyle>
    </Style>
"""
        
        kml += """
    <Folder>
      <name>Lake Evolution</name>
"""
        
        # Add placemarks for each year
        for year in years:
            geometry = lake['geometry'][year]
            area = geometry['area_km2']
            
            kml += f"""
      <Placemark>
        <name>{lake['name']} {year}</name>
        <description>
          <![CDATA[
            <h3>{lake['name']}</h3>
            <p><b>Year:</b> {year}</p>
            <p><b>Area:</b> {area:.2f} km²</p>
          ]]>
        </description>
        <styleUrl>#style{year}</styleUrl>
        <Polygon>
          <extrude>0</extrude>
          <tessellate>1</tessellate>
          <altitudeMode>relativeToGround</altitudeMode>
          <outerBoundaryIs>
            <LinearRing>
              <coordinates>
"""
            
            coords = geometry['coordinates'][0]
            for lon, lat in coords:
                kml += f"                {lon},{lat},0\n"
            
            kml += """              </coordinates>
            </LinearRing>
          </outerBoundaryIs>
        </Polygon>
      </Placemark>
"""
        
        kml += """    </Folder>
  </Document>
</kml>"""
        
        return kml
    
    def generate_geojson_for_lake(self, lake_id):
        """Generate GeoJSON for a specific lake (all years)"""
        if lake_id not in self.lakes_data:
            return None
        
        lake = self.lakes_data[lake_id]
        features = []
        
        for year, geometry in lake['geometry'].items():
            feature = {
                'type': 'Feature',
                'properties': {
                    'name': lake['name'],
                    'year': year,
                    'area_km2': geometry['area_km2']
                },
                'geometry': geometry
            }
            features.append(feature)
        
        geojson = {
            'type': 'FeatureCollection',
            'features': features
        }
        
        return geojson
    
    def export_kml(self, lake_id, output_path, multi_year=True):
        """Export KML file for a lake"""
        if multi_year:
            kml_content = self.generate_multi_year_kml(lake_id)
        else:
            kml_content = self.generate_kml_for_lake(lake_id, max(self.lakes_data[lake_id]['geometry'].keys()))
        
        if kml_content:
            with open(output_path, 'w') as f:
                f.write(kml_content)
            print(f"✓ Exported KML to {output_path}")
            return True
        return False
    
    def export_geojson(self, lake_id, output_path):
        """Export GeoJSON file for a lake"""
        geojson = self.generate_geojson_for_lake(lake_id)
        
        if geojson:
            with open(output_path, 'w') as f:
                json.dump(geojson, f, indent=2)
            print(f"✓ Exported GeoJSON to {output_path}")
            return True
        return False
    
    def get_lake_timeline(self, lake_id):
        """Get area progression timeline for a lake"""
        if lake_id not in self.lakes_data:
            return None
        
        timeline = []
        for year in sorted(self.lakes_data[lake_id]['geometry'].keys()):
            area = self.lakes_data[lake_id]['geometry'][year]['area_km2']
            timeline.append({'year': year, 'area_km2': area})
        
        return timeline
    
    def get_all_lakes_summary(self):
        """Get summary of all loaded lakes"""
        summary = {}
        for lake_id, lake_data in self.lakes_data.items():
            years = sorted(lake_data['geometry'].keys())
            initial_area = lake_data['geometry'][years[0]]['area_km2']
            final_area = lake_data['geometry'][years[-1]]['area_km2']
            growth = ((final_area - initial_area) / initial_area) * 100
            
            summary[lake_id] = {
                'name': lake_data['name'],
                'years_covered': (years[0], years[-1]),
                'initial_area': initial_area,
                'final_area': final_area,
                'growth_percent': growth
            }
        
        return summary
    
    def calculate_metrics(self, lake_id):
        """Calculate comprehensive metrics for a lake"""
        if lake_id not in self.lakes_data:
            return None
        
        timeline = self.get_lake_timeline(lake_id)
        areas = [t['area_km2'] for t in timeline]
        years = [t['year'] for t in timeline]
        
        # Calculate statistics
        annual_changes = []
        for i in range(1, len(areas)):
            change = areas[i] - areas[i-1]
            annual_changes.append(change)
        
        metrics = {
            'lake_id': lake_id,
            'name': self.lakes_data[lake_id]['name'],
            'time_period': f"{years[0]}-{years[-1]}",
            'initial_area_km2': areas[0],
            'final_area_km2': areas[-1],
            'total_change_km2': areas[-1] - areas[0],
            'total_change_percent': ((areas[-1] - areas[0]) / areas[0]) * 100,
            'average_annual_change_km2': sum(annual_changes) / len(annual_changes),
            'max_annual_change_km2': max(annual_changes),
            'min_annual_change_km2': min(annual_changes),
            'trend': 'expanding' if areas[-1] > areas[0] else 'shrinking'
        }
        
        return metrics


# ==================== EXAMPLE USAGE ====================

if __name__ == '__main__':
    # Initialize processor
    processor = GeoSpatialProcessor('./data/shapefiles')
    
    # Load all shapefiles
    processor.load_all_shapefiles()
    
    # Export KMLs
    for lake_id in processor.lakes_data.keys():
        processor.export_kml(lake_id, f'./output/kml/{lake_id}_evolution.kml')
        processor.export_geojson(lake_id, f'./output/geojson/{lake_id}.geojson')
        
        # Print metrics
        metrics = processor.calculate_metrics(lake_id)
        print(json.dumps(metrics, indent=2))
