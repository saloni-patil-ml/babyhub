from textblob import TextBlob
from collections import Counter
from typing import List, Dict, Tuple, Optional
import re

class ReviewAnalyzer:
    def __init__(self):
        self.min_phrase_length = 3
        self.max_phrase_length = 5
        self.min_phrase_frequency = 2
        self.sentiment_threshold = 0.1

        # Common positive and negative words in both English and Hindi
        self.sentiment_words = {
            "en": {
                "positive": ["good", "great", "excellent", "perfect", "comfortable", "quality", "recommend", "best", "love", "amazing"],
                "negative": ["bad", "poor", "uncomfortable", "expensive", "difficult", "hard", "waste", "disappointed", "broken", "cheap"]
            },
            "hi": {
                "positive": ["अच्छा", "बढ़िया", "उत्कृष्ट", "सही", "आरामदायक", "गुणवत्ता", "सिफारिश", "बेस्ट", "पसंद", "शानदार"],
                "negative": ["खराब", "घटिया", "असुविधाजनक", "महंगा", "मुश्किल", "कठिन", "बेकार", "निराश", "टूटा", "सस्ता"]
            }
        }

    def analyze_reviews(
        self,
        reviews: List[Dict[str, str]],
        language: str = "en"
    ) -> Dict[str, any]:
        """
        Analyze a list of reviews and extract key insights.
        
        Args:
            reviews: List of review dictionaries with 'text' and optional 'rating' keys
            language: Language of reviews ('en' or 'hi')
            
        Returns:
            Dictionary containing analysis results
        """
        if not reviews:
            return {
                "summary": {"pros": [], "cons": []},
                "sentiment_score": 0,
                "rating_distribution": {},
                "total_reviews": 0
            }

        # Extract text and ratings
        review_texts = [r['text'] for r in reviews]
        ratings = [r.get('rating', None) for r in reviews]
        
        # Analyze sentiment and extract phrases
        sentiments = []
        all_phrases = []
        
        for text in review_texts:
            # Get sentiment
            blob = TextBlob(text)
            sentiment = blob.sentiment.polarity
            sentiments.append(sentiment)
            
            # Extract phrases
            phrases = self._extract_phrases(text, language)
            all_phrases.extend(phrases)

        # Separate positive and negative phrases
        positive_phrases = []
        negative_phrases = []
        
        for phrase, count in Counter(all_phrases).most_common():
            if count >= self.min_phrase_frequency:
                # Check if phrase contains sentiment words
                is_positive = any(word in phrase.lower() for word in self.sentiment_words[language]["positive"])
                is_negative = any(word in phrase.lower() for word in self.sentiment_words[language]["negative"])
                
                if is_positive and not is_negative:
                    positive_phrases.append((phrase, count))
                elif is_negative and not is_positive:
                    negative_phrases.append((phrase, count))

        # Calculate rating distribution
        rating_dist = Counter(r for r in ratings if r is not None)
        
        # Calculate average sentiment
        avg_sentiment = sum(sentiments) / len(sentiments) if sentiments else 0

        return {
            "summary": {
                "pros": positive_phrases[:3],  # Top 3 positive phrases
                "cons": negative_phrases[:3]   # Top 3 negative phrases
            },
            "sentiment_score": round(avg_sentiment, 2),
            "rating_distribution": dict(rating_dist),
            "total_reviews": len(reviews),
            "language": language
        }

    def _extract_phrases(self, text: str, language: str) -> List[str]:
        """Extract meaningful phrases from text."""
        # Clean text
        text = re.sub(r'[^\w\s]', ' ', text)
        words = text.split()
        
        phrases = []
        for i in range(len(words)):
            for j in range(self.min_phrase_length, self.max_phrase_length + 1):
                if i + j <= len(words):
                    phrase = ' '.join(words[i:i+j])
                    # Only add phrases containing sentiment words
                    if any(word in phrase.lower() for word in self.sentiment_words[language]["positive"]) or \
                       any(word in phrase.lower() for word in self.sentiment_words[language]["negative"]):
                        phrases.append(phrase)
        
        return phrases

    def generate_summary(
        self,
        analysis_result: Dict[str, any],
        language: str = "en"
    ) -> str:
        """Generate a human-readable summary from analysis results."""
        templates = {
            "en": {
                "intro": "Based on {total} reviews:",
                "sentiment": "Overall sentiment is {sentiment}.",
                "pros": "Pros: {pros}",
                "cons": "Cons: {cons}",
                "positive": "positive",
                "negative": "negative",
                "neutral": "neutral"
            },
            "hi": {
                "intro": "{total} समीक्षाओं के आधार पर:",
                "sentiment": "समग्र प्रतिक्रिया {sentiment} है।",
                "pros": "फायदे: {pros}",
                "cons": "नुकसान: {cons}",
                "positive": "सकारात्मक",
                "negative": "नकारात्मक",
                "neutral": "तटस्थ"
            }
        }

        t = templates[language]
        
        # Determine sentiment text
        sentiment_score = analysis_result["sentiment_score"]
        if sentiment_score > 0.1:
            sentiment_text = t["positive"]
        elif sentiment_score < -0.1:
            sentiment_text = t["negative"]
        else:
            sentiment_text = t["neutral"]

        # Format pros and cons
        pros = [p[0] for p in analysis_result["summary"]["pros"]]
        cons = [c[0] for c in analysis_result["summary"]["cons"]]

        summary_parts = [
            t["intro"].format(total=analysis_result["total_reviews"]),
            t["sentiment"].format(sentiment=sentiment_text)
        ]

        if pros:
            summary_parts.append(t["pros"].format(pros=", ".join(pros)))
        if cons:
            summary_parts.append(t["cons"].format(cons=", ".join(cons)))

        return "\n".join(summary_parts)

def create_review_analyzer() -> ReviewAnalyzer:
    """Helper function to create a review analyzer instance."""
    return ReviewAnalyzer()
