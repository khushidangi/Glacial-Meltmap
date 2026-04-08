"""
Glacial MeltMap Backend API
AI-driven visualization system for glacial lake evolution
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import numpy as np
from datetime import datetime
import json
import os

app = Flask(__name__)
CORS(app)

# Initialize prediction model
from models.glacier_predictor import GlacierPredictor

predictor = GlacierPredictor()

# ==================== ROUTES ====================

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'version': '1.0.0'
    })

@app.route('/api/lakes/<lake_id>/historical', methods=['GET'])
def get_historical_data(lake_id):
    """Get historical lake data"""
    try:
        data = predictor.get_historical_data(lake_id)
        return jsonify({
            'success': True,
            'lake_id': lake_id,
            'data': data
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/lakes/<lake_id>/predict', methods=['GET'])
def predict_lake_growth(lake_id):
    """Get predictions for a lake"""
    try:
        years = request.args.get('years', 5, type=int)
        predictions = predictor.predict_growth(lake_id, years)
        
        return jsonify({
            'success': True,
            'lake_id': lake_id,
            'predictions': predictions,
            'confidence': 0.92
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/lakes/<lake_id>/analysis', methods=['GET'])
def analyze_lake(lake_id):
    """Get detailed analysis for a lake"""
    try:
        analysis = predictor.analyze_lake(lake_id)
        
        return jsonify({
            'success': True,
            'lake_id': lake_id,
            'analysis': analysis
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/regions/<region>/lakes', methods=['GET'])
def get_region_lakes(region):
    """Get all lakes in a region"""
    try:
        lakes = predictor.get_region_lakes(region)
        return jsonify({
            'success': True,
            'region': region,
            'lakes': lakes,
            'total': len(lakes)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/export/<lake_id>', methods=['GET'])
def export_lake_report(lake_id):
    """Export comprehensive report for a lake"""
    try:
        file_format = request.args.get('format', 'json')
        report = predictor.generate_report(lake_id, file_format)
        
        return jsonify({
            'success': True,
            'lake_id': lake_id,
            'report': report,
            'format': file_format
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/comparison', methods=['POST'])
def compare_lakes():
    """Compare multiple lakes"""
    try:
        data = request.json
        lake_ids = data.get('lakes', [])
        
        if not lake_ids:
            return jsonify({'success': False, 'error': 'No lakes specified'}), 400
        
        comparison = predictor.compare_lakes(lake_ids)
        
        return jsonify({
            'success': True,
            'comparison': comparison,
            'lake_count': len(lake_ids)
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/kml/<lake_id>', methods=['GET'])
def get_kml(lake_id):
    """Get KML data for lake boundaries (for Google Earth integration)"""
    try:
        year = request.args.get('year', 2017, type=int)
        kml_data = predictor.generate_kml(lake_id, year)
        
        response = app.response_class(
            response=kml_data,
            status=200,
            mimetype='application/vnd.google-earth.kml+xml'
        )
        response.headers['Content-Disposition'] = f'attachment; filename={lake_id}_{year}.kml'
        return response
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/api/stats', methods=['GET'])
def get_global_stats():
    """Get global statistics"""
    try:
        stats = predictor.get_global_stats()
        return jsonify({
            'success': True,
            'stats': stats
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

# ==================== ERROR HANDLING ====================

@app.errorhandler(404)
def not_found(error):
    return jsonify({
        'success': False,
        'error': 'Endpoint not found'
    }), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({
        'success': False,
        'error': 'Internal server error'
    }), 500

# ==================== MAIN ====================

if __name__ == '__main__':
    # Development server - use production server in deployment
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True,
        use_reloader=False
    )
