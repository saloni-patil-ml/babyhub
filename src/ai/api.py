from flask import Flask, request, jsonify
from flask_cors import CORS
from .recommendation import create_recommender
from .faq_bot import create_faq_bot
from .image_optimizer import create_optimizer
from .seo_generator import create_seo_generator
from .review_analyzer import create_review_analyzer
import json
from typing import Dict, Any
import os

app = Flask(__name__)
# Enable CORS for development
CORS(app, resources={
    r"/api/*": {
        "origins": [
            "http://localhost:3000",
            "http://127.0.0.1:3000",
            "http://localhost:5001",
            "http://127.0.0.1:5001"
        ],
        "methods": ["GET", "POST", "OPTIONS"],
        "allow_headers": ["Content-Type", "Accept"],
        "supports_credentials": True
    }
})

# Initialize AI components
recommender = None
faq_bot = create_faq_bot()
image_optimizer = create_optimizer()
seo_generator = create_seo_generator()
review_analyzer = create_review_analyzer()

def load_products() -> Dict[str, Any]:
    """Load products from JSON file."""
    try:
        products_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'products.json')
        print(f"Loading products from: {products_path}")
        with open(products_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
            print(f"Loaded {len(data.get('products', []))} products")
            return data
    except Exception as e:
        print(f"Error loading products: {e}")
        return {"products": [], "categories": []}

# Initialize recommender with products
try:
    products_data = load_products()
    if products_data['products']:
        print("Initializing recommender with products...")
        recommender = create_recommender(products_data['products'])
        print("Recommender initialized successfully")
    else:
        print("No products found to initialize recommender")
except Exception as e:
    print(f"Error initializing recommender: {e}")

@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    """Get product recommendations."""
    try:
        product_id = request.args.get('product_id')
        print(f"Received recommendation request for product_id: {product_id}")
        
        if not product_id:
            return jsonify({'error': 'Product ID is required'}), 400
        
        if not recommender:
            print("Error: Recommender not initialized")
            return jsonify({'error': 'Recommender not initialized'}), 500
            
        recommendations = recommender.get_recommendations(product_id)
        print(f"Generated recommendations: {recommendations}")
        
        return jsonify({'recommendations': recommendations})
    except Exception as e:
        print(f"Error generating recommendations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/faq', methods=['GET'])
def get_faq_answer():
    """Get answer for a FAQ question."""
    try:
        question = request.args.get('question')
        language = request.args.get('language', 'en')
        
        if not question:
            return jsonify({'error': 'Question is required'}), 400
        
        answer = faq_bot.get_answer(question, language)
        return jsonify(answer if answer else {'error': 'No answer found'})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/optimize-image', methods=['POST'])
def optimize_image():
    """Optimize an uploaded image."""
    try:
        if 'image' not in request.files:
            return jsonify({'error': 'No image file provided'}), 400
        
        image_file = request.files['image']
        image_data = image_file.read()
        
        format = request.form.get('format', 'WEBP')
        quality = int(request.form.get('quality', '85'))
        
        result = image_optimizer.optimize_image(
            image_data,
            quality=quality,
            format=format
        )
        
        # Remove binary data from response
        response_data = {k: v for k, v in result.items() if k != 'data'}
        return jsonify(response_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/generate-seo', methods=['POST'])
def generate_seo():
    """Generate SEO metadata for a product."""
    try:
        data = request.get_json()
        if not data or 'product' not in data:
            return jsonify({'error': 'Product data is required'}), 400
        
        language = data.get('language', 'en')
        template_type = data.get('template_type', 'default')
        
        seo_data = seo_generator.generate_seo(
            data['product'],
            language=language,
            template_type=template_type
        )
        return jsonify(seo_data)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/analyze-reviews', methods=['POST'])
def analyze_reviews():
    """Analyze product reviews."""
    try:
        data = request.get_json()
        if not data or 'reviews' not in data:
            return jsonify({'error': 'Reviews data is required'}), 400
        
        language = data.get('language', 'en')
        
        analysis = review_analyzer.analyze_reviews(
            data['reviews'],
            language=language
        )
        
        summary = review_analyzer.generate_summary(
            analysis,
            language=language
        )
        
        return jsonify({
            'analysis': analysis,
            'summary': summary
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint."""
    return jsonify({
        'status': 'healthy',
        'services': {
            'recommender': recommender is not None,
            'faq_bot': True,
            'image_optimizer': True,
            'seo_generator': True,
            'review_analyzer': True
        }
    })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5001) 