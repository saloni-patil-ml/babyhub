from typing import Dict, List, Optional

class SEOGenerator:
    def __init__(self):
        self.templates = {
            "title": {
                "en": {
                    "default": "{product_name} - {category} | BabyHub India",
                    "sale": "{product_name} - {discount}% Off | BabyHub India",
                    "new": "New! {product_name} for Babies | BabyHub India"
                },
                "hi": {
                    "default": "{product_name} - {category} | बेबीहब इंडिया",
                    "sale": "{product_name} - {discount}% छूट | बेबीहब इंडिया",
                    "new": "नया! बच्चों के लिए {product_name} | बेबीहब इंडिया"
                }
            },
            "description": {
                "en": {
                    "default": "Buy {brand} {product_name} for babies. ✓Best Price ✓Quality Assured ✓Fast Delivery across India. {key_feature}",
                    "sale": "Special Offer! Get {discount}% off on {brand} {product_name}. ✓Limited Time ✓Free Shipping ✓Genuine Products",
                    "new": "New Arrival! {brand} {product_name} now available. {key_feature}. Shop now for best deals!"
                },
                "hi": {
                    "default": "{brand} {product_name} खरीदें। ✓बेस्ट प्राइस ✓गुणवत्ता की गारंटी ✓तेज डिलीवरी। {key_feature}",
                    "sale": "स्पेशल ऑफर! {brand} {product_name} पर {discount}% की छूट। ✓सीमित समय ✓फ्री शिपिंग",
                    "new": "नई आइटम! {brand} {product_name} अब उपलब्ध है। {key_feature}। अभी खरीदें!"
                }
            },
            "keywords": {
                "en": [
                    "buy {product_name}",
                    "baby {category}",
                    "{brand} {category}",
                    "{product_name} price",
                    "best {category} for babies",
                    "{product_name} online india"
                ],
                "hi": [
                    "{product_name} खरीदें",
                    "बेबी {category}",
                    "{brand} {category}",
                    "{product_name} कीमत",
                    "बच्चों के लिए {category}",
                    "{product_name} ऑनलाइन"
                ]
            }
        }

        # Category-specific features for better SEO
        self.category_features = {
            "Diapers": {
                "en": ["Super absorbent", "Leak protection", "Soft material"],
                "hi": ["सुपर एब्जॉर्बेंट", "लीक प्रोटेक्शन", "सॉफ्ट मटीरियल"]
            },
            "Strollers": {
                "en": ["Easy fold", "Comfortable seat", "Storage basket"],
                "hi": ["आसानी से फोल्ड", "आरामदायक सीट", "स्टोरेज बास्केट"]
            },
            "Toys": {
                "en": ["Educational", "Safe materials", "Age appropriate"],
                "hi": ["शैक्षिक", "सुरक्षित सामग्री", "उम्र के अनुसार"]
            }
        }

    def generate_seo(
        self,
        product: Dict,
        language: str = "en",
        template_type: str = "default"
    ) -> Dict[str, str]:
        """Generate SEO metadata for a product."""
        
        # Get category features
        category_features = self.category_features.get(product.get('category', ''), {
            "en": [], "hi": []
        })
        
        # Create context with all variables
        context = {
            "product_name": product.get("name", ""),
            "brand": product.get("brand", ""),
            "category": product.get("category", ""),
            "discount": product.get("discount", ""),
            "key_feature": category_features[language][0] if category_features[language] else ""
        }

        # Generate title
        title = self.templates["title"][language][template_type].format(**context)
        
        # Generate description
        description = self.templates["description"][language][template_type].format(**context)
        
        # Generate keywords
        keywords = [
            keyword.format(**context)
            for keyword in self.templates["keywords"][language]
        ]
        
        # Add category-specific keywords
        keywords.extend(category_features[language])

        # Ensure title and description lengths are appropriate for SEO
        title = self._truncate_title(title)
        description = self._truncate_description(description)

        return {
            "title": title,
            "description": description,
            "keywords": ", ".join(keywords),
            "og:title": title,
            "og:description": description,
            "og:type": "product",
            "og:image": product.get("image", ""),
            "twitter:card": "product",
            "twitter:title": title,
            "twitter:description": description,
            "twitter:image": product.get("image", "")
        }

    def _truncate_title(self, title: str, max_length: int = 60) -> str:
        """Truncate title to appropriate length for SEO."""
        if len(title) <= max_length:
            return title
        return title[:max_length-3] + "..."

    def _truncate_description(self, description: str, max_length: int = 160) -> str:
        """Truncate description to appropriate length for SEO."""
        if len(description) <= max_length:
            return description
        return description[:max_length-3] + "..."

    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return ["en", "hi"]

    def get_template_types(self) -> List[str]:
        """Get list of available template types."""
        return ["default", "sale", "new"]

def create_seo_generator() -> SEOGenerator:
    """Helper function to create a SEO generator instance."""
    return SEOGenerator()
