from typing import List, Dict, Any
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

class ProductRecommender:
    def __init__(self, products: List[Dict[str, Any]]):
        self.products = {str(p['id']): p for p in products}
        self.vectorizer = TfidfVectorizer(stop_words='english')
        
        # Create product features for similarity calculation
        product_features = [
            f"{p['name']} {p['description']} {p['category']} {p['brand']}"
            for p in products
        ]
        
        # Calculate similarity matrix
        self.tfidf_matrix = self.vectorizer.fit_transform(product_features)
        self.similarity_matrix = cosine_similarity(self.tfidf_matrix)
        
        # Store product indices for lookup
        self.product_indices = {str(p['id']): idx for idx, p in enumerate(products)}

    def get_recommendations(self, product_id: str, num_recommendations: int = 3) -> List[Dict[str, Any]]:
        """Get product recommendations based on content similarity."""
        try:
            # Get the index of the product
            product_idx = self.product_indices.get(str(product_id))
            if product_idx is None:
                return []

            # Get similarity scores for the product
            similarity_scores = self.similarity_matrix[product_idx]
            
            # Get indices of most similar products (excluding the product itself)
            similar_indices = similarity_scores.argsort()[::-1][1:num_recommendations + 1]
            
            # Get the product IDs from indices
            recommended_products = []
            for idx in similar_indices:
                product_id = next(
                    (pid for pid, index in self.product_indices.items() if index == idx),
                    None
                )
                if product_id and product_id in self.products:
                    recommended_products.append(self.products[product_id])
            
            return recommended_products
        except Exception as e:
            print(f"Error generating recommendations: {str(e)}")
            return []

def create_recommender(products: List[Dict[str, Any]]) -> ProductRecommender:
    """Create and return a product recommender instance."""
    return ProductRecommender(products)
