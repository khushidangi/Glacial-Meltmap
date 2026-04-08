#!/usr/bin/env python3
"""
Glacier Lake Prediction Model Training Script
Trains models from real shapefile data
"""

import sys
from pathlib import Path
import numpy as np
import geopandas as gpd
from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.linear_model import LinearRegression
from sklearn.ensemble import RandomForestRegressor
import pickle
import json
from datetime import datetime

class ModelTrainer:
    """Train prediction models from actual shapefile data"""
    
    def __init__(self, shapefiles_dir):
        self.shapefiles_dir = Path(shapefiles_dir)
        self.models = {}
        self.training_data = {}
    
    def extract_data_from_shapefiles(self, lake_id):
        """Extract area data from shapefiles for a specific lake"""
        
        shapefiles = sorted(self.shapefiles_dir.glob(f'{lake_id}_*.shp'))
        
        if not shapefiles:
            print(f"✗ No shapefiles found for {lake_id}")
            return None
        
        data = {}
        
        for shp_file in shapefiles:
            try:
                year = int(shp_file.stem.split('_')[-1])
                
                # Load shapefile
                gdf = gpd.read_file(str(shp_file))
                
                # Calculate total area in km²
                total_area = gdf.geometry.area.sum() / 1e6
                
                # Store additional properties
                perimeter = gdf.geometry.length.sum() / 1e3  # in km
                
                data[year] = {
                    'area_km2': total_area,
                    'perimeter_km': perimeter,
                    'feature_count': len(gdf),
                    'geometry_valid': all(gdf.geometry.is_valid)
                }
                
                print(f"  ✓ {year}: {total_area:.3f} km² (n={len(gdf)})")
                
            except Exception as e:
                print(f"  ✗ Error processing {shp_file}: {e}")
                continue
        
        if not data:
            return None
        
        self.training_data[lake_id] = data
        return data
    
    def train_polynomial_model(self, lake_id, degree=2):
        """Train polynomial regression model"""
        
        if lake_id not in self.training_data:
            print(f"✗ No training data for {lake_id}")
            return None
        
        data = self.training_data[lake_id]
        years = np.array(sorted(data.keys())).reshape(-1, 1)
        areas = np.array([data[y]['area_km2'] for y in sorted(data.keys())])
        
        if len(years) < 3:
            print(f"✗ Need at least 3 years, have {len(years)}")
            return None
        
        print(f"\n  Training polynomial regression (degree={degree})...")
        print(f"  Data points: {len(years)}")
        
        # Fit polynomial model
        poly = PolynomialFeatures(degree=degree)
        X_poly = poly.fit_transform(years)
        
        model = LinearRegression()
        model.fit(X_poly, areas)
        
        # Evaluate on training data
        train_score = model.score(X_poly, areas)
        print(f"  Training R²: {train_score:.4f}")
        
        self.models[lake_id] = {
            'type': 'polynomial',
            'model': model,
            'poly': poly,
            'degree': degree,
            'training_years': sorted(data.keys()),
            'r_squared': train_score
        }
        
        return model
    
    def train_random_forest_model(self, lake_id):
        """Train random forest model with additional features"""
        
        if lake_id not in self.training_data:
            print(f"✗ No training data for {lake_id}")
            return None
        
        data = self.training_data[lake_id]
        years = np.array(sorted(data.keys()))
        
        # Feature engineering
        X = np.column_stack([
            years,
            years ** 2,  # Quadratic term
            np.arange(len(years)),  # Sequential index
        ])
        
        areas = np.array([data[y]['area_km2'] for y in years])
        
        if len(years) < 4:
            print(f"⚠ Warning: Only {len(years)} years for random forest")
        
        print(f"\n  Training random forest...")
        
        model = RandomForestRegressor(
            n_estimators=100,
            max_depth=5,
            random_state=42,
            min_samples_split=2
        )
        
        model.fit(X, areas)
        train_score = model.score(X, areas)
        
        print(f"  Training R²: {train_score:.4f}")
        
        self.models[lake_id] = {
            'type': 'random_forest',
            'model': model,
            'training_years': years.tolist(),
            'r_squared': train_score
        }
        
        return model
    
    def predict_future(self, lake_id, future_years=None, model_type='polynomial'):
        """Make predictions for future years"""
        
        if lake_id not in self.models:
            print(f"✗ No trained model for {lake_id}")
            return None
        
        if future_years is None:
            future_years = list(range(2018, 2031))  # Up to 2030
        
        model_data = self.models[lake_id]
        model = model_data['model']
        
        if model_type == 'polynomial' or model_data['type'] == 'polynomial':
            poly = model_data['poly']
            future_years_array = np.array(future_years).reshape(-1, 1)
            future_years_poly = poly.transform(future_years_array)
            predictions = model.predict(future_years_poly)
        else:
            # Random forest
            future_years_array = np.array(future_years)
            X_future = np.column_stack([
                future_years_array,
                future_years_array ** 2,
                np.arange(len(future_years_array)),
            ])
            predictions = model.predict(X_future)
        
        # Calculate confidence (decreases with time)
        base_confidence = model_data['r_squared']
        predictions_with_confidence = []
        
        for i, (year, pred) in enumerate(zip(future_years, predictions)):
            # Confidence decreases as we predict further
            years_ahead = year - max(model_data['training_years'])
            confidence = base_confidence * (0.95 ** years_ahead)
            
            predictions_with_confidence.append({
                'year': int(year),
                'area_km2': float(max(0, pred)),  # No negative areas
                'confidence': float(max(0, min(1, confidence)))
            })
        
        return predictions_with_confidence
    
    def save_model(self, lake_id, output_dir='./models'):
        """Save trained model to disk"""
        
        if lake_id not in self.models:
            print(f"✗ No model to save for {lake_id}")
            return False
        
        output_dir = Path(output_dir)
        output_dir.mkdir(exist_ok=True)
        
        model_data = self.models[lake_id]
        model_path = output_dir / f'{lake_id}_model.pkl'
        
        try:
            with open(model_path, 'wb') as f:
                pickle.dump(model_data, f)
            print(f"  ✓ Saved to {model_path}")
            return True
        except Exception as e:
            print(f"  ✗ Error saving model: {e}")
            return False
    
    def generate_report(self, lake_id):
        """Generate training report"""
        
        if lake_id not in self.training_data or lake_id not in self.models:
            return None
        
        data = self.training_data[lake_id]
        model_data = self.models[lake_id]
        
        years = sorted(data.keys())
        areas = [data[y]['area_km2'] for y in years]
        
        initial_area = areas[0]
        final_area = areas[-1]
        total_growth = ((final_area - initial_area) / initial_area) * 100
        
        report = {
            'lake_id': lake_id,
            'training_period': f"{years[0]}-{years[-1]}",
            'data_points': len(years),
            'model_type': model_data['type'],
            'r_squared': round(model_data['r_squared'], 4),
            'initial_area_km2': round(initial_area, 3),
            'final_area_km2': round(final_area, 3),
            'total_growth_percent': round(total_growth, 2),
            'avg_annual_growth_percent': round(total_growth / len(years), 2),
            'predictions': self.predict_future(lake_id),
            'generated_at': datetime.now().isoformat()
        }
        
        return report
    
    def train_all_lakes(self, lake_ids):
        """Train models for multiple lakes"""
        
        results = {}
        
        for lake_id in lake_ids:
            print(f"\n{'='*50}")
            print(f"Training: {lake_id.upper()}")
            print(f"{'='*50}")
            
            # Extract data
            data = self.extract_data_from_shapefiles(lake_id)
            if not data:
                print(f"⚠ Skipped {lake_id}: No data")
                continue
            
            # Train polynomial model
            self.train_polynomial_model(lake_id, degree=2)
            
            # Train random forest model
            self.train_random_forest_model(lake_id)
            
            # Save models
            self.save_model(lake_id)
            
            # Generate report
            report = self.generate_report(lake_id)
            results[lake_id] = report
            
            # Print report
            print(f"\n📊 Report for {lake_id.upper()}:")
            print(f"  Period: {report['training_period']}")
            print(f"  Data points: {report['data_points']}")
            print(f"  Model R²: {report['r_squared']}")
            print(f"  Growth: {report['initial_area_km2']:.2f} → {report['final_area_km2']:.2f} km²")
            print(f"  Total growth: {report['total_growth_percent']:.1f}%")
            print(f"  Avg. annual growth: {report['avg_annual_growth_percent']:.1f}%")
            
            # Show first 5 predictions
            print(f"\n  Predictions:")
            for pred in report['predictions'][:5]:
                print(f"    {pred['year']}: {pred['area_km2']:.2f} km² (conf: {pred['confidence']:.1%})")
        
        return results


def main():
    """Main execution"""
    
    print("\n" + "="*60)
    print("🏔️  GLACIAL LAKE PREDICTION MODEL TRAINER")
    print("="*60)
    
    # Configuration
    shapefiles_dir = Path('./data/shapefiles')
    output_dir = Path('./models')
    
    if not shapefiles_dir.exists():
        print(f"✗ Shapefiles directory not found: {shapefiles_dir}")
        print(f"  Create it and add your .shp files")
        sys.exit(1)
    
    # List of lakes to train
    lakes = ['imja', 'tsho', 'pho', 'pam', 'oeschinen']
    
    # Initialize trainer
    trainer = ModelTrainer(shapefiles_dir)
    
    # Train all models
    results = trainer.train_all_lakes(lakes)
    
    # Save all reports to JSON
    output_dir.mkdir(exist_ok=True)
    reports_path = output_dir / 'training_reports.json'
    
    with open(reports_path, 'w') as f:
        json.dump(results, f, indent=2)
    
    print(f"\n✓ Training complete!")
    print(f"✓ Models saved to {output_dir}")
    print(f"✓ Reports saved to {reports_path}")
    print("\n" + "="*60 + "\n")


if __name__ == '__main__':
    main()
