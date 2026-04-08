"""
Glacier Lake Predictor Model
Uses historical data and AI to predict glacial lake evolution
"""

import numpy as np
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import json
from datetime import datetime

class GlacierPredictor:
    
    def __init__(self):
        """Initialize the predictor with sample data"""
        self.lakes_data = self._load_lakes_data()
        self.regions_data = self._load_regions_data()
    
    def _load_lakes_data(self):
        """Load or generate lake data"""
        return {
            'imja': {
                'name': 'Imja Tsho',
                'region': 'himalayas',
                'elevation': 5010,
                'coordinates': [27.95, 86.95],
                'historical': {
                    2008: 0.02, 2009: 0.05, 2010: 0.12, 2011: 0.19, 2012: 0.32,
                    2013: 0.45, 2014: 0.62, 2015: 0.89, 2016: 1.12, 2017: 1.28
                }
            },
            'tsho': {
                'name': 'Tsho Rolpa',
                'region': 'himalayas',
                'elevation': 4580,
                'coordinates': [27.92, 86.85],
                'historical': {
                    2008: 0.80, 2009: 0.92, 2010: 1.02, 2011: 1.15, 2012: 1.28,
                    2013: 1.35, 2014: 1.42, 2015: 1.48, 2016: 1.51, 2017: 1.54
                }
            },
            'pho': {
                'name': 'Pho Chu',
                'region': 'himalayas',
                'elevation': 4800,
                'coordinates': [28.10, 86.75],
                'historical': {
                    2008: 0.15, 2009: 0.22, 2010: 0.32, 2011: 0.45, 2012: 0.58,
                    2013: 0.72, 2014: 0.87, 2015: 1.02, 2016: 1.18, 2017: 1.32
                }
            },
            'pam': {
                'name': 'Palcacocha',
                'region': 'andes',
                'elevation': 4580,
                'coordinates': [-12.05, -75.32],
                'historical': {
                    2008: 0.10, 2009: 0.15, 2010: 0.20, 2011: 0.28, 2012: 0.38,
                    2013: 0.48, 2014: 0.58, 2015: 0.70, 2016: 0.82, 2017: 0.95
                }
            },
            'oeschinen': {
                'name': 'Oeschinen',
                'region': 'alps',
                'elevation': 1680,
                'coordinates': [46.45, 7.55],
                'historical': {
                    2008: 0.35, 2009: 0.36, 2010: 0.37, 2011: 0.38, 2012: 0.39,
                    2013: 0.40, 2014: 0.41, 2015: 0.42, 2016: 0.42, 2017: 0.42
                }
            }
        }
    
    def _load_regions_data(self):
        """Load region metadata"""
        return {
            'himalayas': {
                'name': 'Himalayas',
                'subtitle': 'Hindu Kush Karakoram Region',
                'lake_count': '500+',
                'bounds': [[25.0, 84.0], [29.0, 88.0]],
                'avg_growth_rate': 0.124
            },
            'andes': {
                'name': 'Andes',
                'subtitle': 'South American Range',
                'lake_count': '300+',
                'bounds': [[-23.0, -72.0], [-2.0, -67.0]],
                'avg_growth_rate': 0.065
            },
            'alps': {
                'name': 'Alps',
                'subtitle': 'European Alpine Region',
                'lake_count': '150+',
                'bounds': [[43.0, 4.0], [49.0, 16.0]],
                'avg_growth_rate': 0.025
            }
        }
    
    def get_historical_data(self, lake_id):
        """Get historical data for a lake"""
        if lake_id not in self.lakes_data:
            raise ValueError(f"Lake {lake_id} not found")
        
        lake = self.lakes_data[lake_id]
        historical = lake['historical']
        
        return [{
            'year': year,
            'area': area
        } for year, area in sorted(historical.items())]
    
    def predict_growth(self, lake_id, years=5):
        """Predict future lake growth"""
        if lake_id not in self.lakes_data:
            raise ValueError(f"Lake {lake_id} not found")
        
        lake = self.lakes_data[lake_id]
        historical = lake['historical']
        
        # Prepare training data
        X = np.array(list(historical.keys())).reshape(-1, 1)
        y = np.array(list(historical.values()))
        
        # Fit polynomial model (degree 2)
        poly = PolynomialFeatures(degree=2)
        X_poly = poly.fit_transform(X)
        
        model = LinearRegression()
        model.fit(X_poly, y)
        
        # Predict future years
        future_years = np.array(range(2018, 2018 + years)).reshape(-1, 1)
        future_years_poly = poly.transform(future_years)
        predictions = model.predict(future_years_poly)
        
        return [{
            'year': int(year[0]),
            'area': float(max(0, pred)),
            'confidence': 0.92 - (i * 0.03)  # Confidence decreases over time
        } for i, (year, pred) in enumerate(zip(future_years, predictions))]
    
    def analyze_lake(self, lake_id):
        """Perform comprehensive analysis on a lake"""
        if lake_id not in self.lakes_data:
            raise ValueError(f"Lake {lake_id} not found")
        
        lake = self.lakes_data[lake_id]
        historical = lake['historical']
        
        years = list(historical.keys())
        areas = list(historical.values())
        
        # Calculate statistics
        initial_area = areas[0]
        final_area = areas[-1]
        total_growth = ((final_area - initial_area) / initial_area) * 100
        
        # Calculate annual growth rate
        annual_growth = np.diff(areas) / np.array(areas[:-1]) * 100
        avg_annual_growth = np.mean(annual_growth)
        
        # Determine risk level
        if avg_annual_growth > 10:
            risk = 'VERY HIGH'
        elif avg_annual_growth > 7:
            risk = 'HIGH'
        elif avg_annual_growth > 3:
            risk = 'MODERATE'
        else:
            risk = 'LOW'
        
        return {
            'lake_name': lake['name'],
            'elevation': lake['elevation'],
            'initial_area_2008': initial_area,
            'final_area_2017': final_area,
            'total_growth_percent': round(total_growth, 2),
            'avg_annual_growth_percent': round(avg_annual_growth, 2),
            'risk_level': risk,
            'trend': 'accelerating' if annual_growth[-1] > avg_annual_growth else 'stable',
            'projected_2025_area': round(final_area * (1 + (avg_annual_growth / 100) * 8), 2),
            'monitoring_recommendations': [
                'Monthly satellite monitoring',
                'Annual field surveys',
                'Hydrological impact assessment',
                'Community alert system establishment'
            ]
        }
    
    def get_region_lakes(self, region):
        """Get all lakes in a region"""
        if region not in self.regions_data:
            raise ValueError(f"Region {region} not found")
        
        region_lakes = [
            {
                'id': lake_id,
                'name': lake['name'],
                'elevation': lake['elevation'],
                'current_area': lake['historical'][2017],
                'growth_percent': round(((lake['historical'][2017] - lake['historical'][2008]) / lake['historical'][2008]) * 100, 1)
            }
            for lake_id, lake in self.lakes_data.items()
            if lake['region'] == region
        ]
        
        return sorted(region_lakes, key=lambda x: x['current_area'], reverse=True)
    
    def compare_lakes(self, lake_ids):
        """Compare multiple lakes"""
        comparison = []
        
        for lake_id in lake_ids:
            if lake_id in self.lakes_data:
                lake = self.lakes_data[lake_id]
                historical = lake['historical']
                
                comparison.append({
                    'lake_id': lake_id,
                    'name': lake['name'],
                    'initial_area': historical[2008],
                    'final_area': historical[2017],
                    'growth_percent': round(((historical[2017] - historical[2008]) / historical[2008]) * 100, 2)
                })
        
        return sorted(comparison, key=lambda x: x['growth_percent'], reverse=True)
    
    def generate_kml(self, lake_id, year):
        """Generate KML data for Google Earth visualization"""
        if lake_id not in self.lakes_data:
            raise ValueError(f"Lake {lake_id} not found")
        
        lake = self.lakes_data[lake_id]
        coords = lake['coordinates']
        
        kml = f"""<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>{lake['name']} - {year}</name>
    <description>Glacial Lake Evolution Data</description>
    <Style id="lakeStyle">
      <PolyStyle>
        <color>ff0000ff</color>
        <fill>1</fill>
        <outline>1</outline>
      </PolyStyle>
    </Style>
    <Placemark>
      <name>{lake['name']}</name>
      <description>
        <![CDATA[
          <h2>{lake['name']}</h2>
          <p>Year: {year}</p>
          <p>Elevation: {lake['elevation']}m</p>
          <p>Area: {lake['historical'].get(year, 0):.2f} km²</p>
        ]]>
      </description>
      <Point>
        <coordinates>{coords[1]},{coords[0]},0</coordinates>
      </Point>
    </Placemark>
  </Document>
</kml>"""
        
        return kml
    
    def generate_report(self, lake_id, file_format='json'):
        """Generate comprehensive report for a lake"""
        analysis = self.analyze_lake(lake_id)
        historical = self.get_historical_data(lake_id)
        predictions = self.predict_growth(lake_id, 5)
        
        report = {
            'metadata': {
                'generated': datetime.now().isoformat(),
                'lake_id': lake_id,
                'format_version': '1.0'
            },
            'analysis': analysis,
            'historical_data': historical,
            'predictions': predictions
        }
        
        if file_format == 'json':
            return report
        elif file_format == 'csv':
            # Simple CSV conversion
            lines = ['Year,Area (km²),Type']
            for item in historical:
                lines.append(f"{item['year']},{item['area']},Historical")
            for item in predictions:
                lines.append(f"{item['year']},{item['area']},Predicted")
            return '\n'.join(lines)
        
        return report
    
    def get_global_stats(self):
        """Get global statistics across all lakes"""
        total_lakes = len(self.lakes_data)
        
        all_areas_2008 = []
        all_areas_2017 = []
        
        for lake in self.lakes_data.values():
            all_areas_2008.append(lake['historical'][2008])
            all_areas_2017.append(lake['historical'][2017])
        
        total_growth = ((sum(all_areas_2017) - sum(all_areas_2008)) / sum(all_areas_2008)) * 100
        
        return {
            'total_lakes_tracked': total_lakes,
            'total_area_2008': round(sum(all_areas_2008), 2),
            'total_area_2017': round(sum(all_areas_2017), 2),
            'total_growth_percent': round(total_growth, 2),
            'regions_covered': list(self.regions_data.keys())
        }
