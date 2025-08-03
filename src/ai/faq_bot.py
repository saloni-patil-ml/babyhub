from fuzzywuzzy import fuzz
from typing import Dict, Optional, List

class FAQBot:
    def __init__(self):
        # Initialize with common baby product FAQs in English and Hindi
        self.faqs = {
            "diaper_change": {
                "questions": {
                    "en": [
                        "How often should I change diapers?",
                        "When to change baby diaper?",
                        "Diaper change frequency",
                        "How many times to change diaper?",
                        "How many diaper changes per day?",
                        "When should I change my baby's diaper?",
                        "How long can baby wear same diaper?",
                        "Diaper changing schedule",
                        "How often do babies need diaper change?"
                    ],
                    "hi": [
                        "डायपर कितनी बार बदलें?",
                        "बच्चे का डायपर कब बदलें?",
                        "डायपर बदलने का समय",
                        "एक दिन में कितनी बार डायपर बदलें?",
                        "डायपर कितने समय में बदलना चाहिए?",
                        "बच्चे का डायपर कितनी देर में बदलें?"
                    ]
                },
                "answer": {
                    "en": "Change diapers every 2-3 hours or immediately when wet/soiled. Newborns may need 10-12 changes per day, while older babies typically need 6-8 changes. Always change immediately after bowel movements. Signs that indicate a change is needed: the diaper feels heavy, there's a bowel movement, or it's been 2-3 hours since the last change.",
                    "hi": "हर 2-3 घंटे में या गीला होने पर तुरंत डायपर बदलें। नवजात शिशुओं को दिन में 10-12 बार डायपर बदलने की आवश्यकता हो सकती है, जबकि बड़े बच्चों को 6-8 बार। मल त्याग के बाद तुरंत बदलें। डायपर बदलने के संकेत: डायपर भारी महसूस हो, मल त्याग हुआ हो, या पिछले बदलाव के 2-3 घंटे हो गए हों।"
                }
            },
            "diaper_size": {
                "questions": {
                    "en": [
                        "How to choose diaper size?",
                        "What size diaper should I buy?",
                        "Diaper sizing guide",
                        "How do I know if diaper size is right?",
                        "When to change diaper size?",
                        "Baby diaper size chart",
                        "Which size diaper for my baby?"
                    ],
                    "hi": [
                        "डायपर का साइज कैसे चुनें?",
                        "कौन सा डायपर साइज खरीदें?",
                        "डायपर साइज गाइड",
                        "सही डायपर साइज कैसे पता करें?",
                        "डायपर का साइज कब बदलें?",
                        "बच्चे के लिए कौन सा डायपर साइज?"
                    ]
                },
                "answer": {
                    "en": "Choose diaper size based on baby's weight: Newborn (<10 lbs), Size 1 (8-14 lbs), Size 2 (12-18 lbs), Size 3 (16-28 lbs). Signs the diaper is too small: red marks on skin, leaks, or difficulty fastening. Signs it's too big: gaps around legs, frequent leaks. Always check the fit around legs and waist.",
                    "hi": "बच्चे के वजन के अनुसार डायपर का साइज चुनें: नवजात (<4.5 किग्रा), साइज 1 (4-6 किग्रा), साइज 2 (5-8 किग्रा), साइज 3 (7-13 किग्रा)। छोटा होने के संकेत: त्वचा पर लाल निशान, लीक, या बांधने में कठिनाई। बड़ा होने के संकेत: पैरों के आसपास गैप, बार-बार लीक। हमेशा पैरों और कमर के आसपास फिट की जांच करें।"
                }
            },
            "stroller_age": {
                "questions": {
                    "en": [
                        "When can baby use stroller?",
                        "At what age can I use a stroller?",
                        "Stroller age recommendation",
                        "When is it safe to use stroller?",
                        "How old for stroller use?",
                        "Can newborn use stroller?",
                        "Best age to start stroller"
                    ],
                    "hi": [
                        "बच्चे के लिए स्ट्रॉलर कब इस्तेमाल करें?",
                        "किस उम्र में स्ट्रॉलर का उपयोग कर सकते हैं?",
                        "स्ट्रॉलर की सही उम्र",
                        "स्ट्रॉलर कब से शुरू करें?",
                        "नवजात बच्चे के लिए स्ट्रॉलर?",
                        "स्ट्रॉलर के लिए सही उम्र क्या है?"
                    ]
                },
                "answer": {
                    "en": "Most strollers are suitable from birth, especially those that recline fully. For jogging strollers, wait until baby is 6-8 months old and has good head/neck control. Always use the newborn recline position and ensure proper head support for babies under 3 months. Check stroller weight limits and safety features before use.",
                    "hi": "ज्यादातर स्ट्रॉलर जन्म से ही उपयुक्त होते हैं, खासकर वो जो पूरी तरह से झुक जाते हैं। जॉगिंग स्ट्रॉलर के लिए, बच्चे के 6-8 महीने का होने और सिर/गर्दन का नियंत्रण अच्छा होने तक प्रतीक्षा करें। 3 महीने से छोटे बच्चों के लिए हमेशा नवजात झुकाव स्थिति का उपयोग करें और सिर का उचित समर्थन सुनिश्चित करें।"
                }
            }
        }

    def get_answer(self, question: str, language: str = "en") -> Optional[Dict[str, str]]:
        """Get answer for a question in specified language."""
        best_match = None
        highest_score = 0

        # Clean and normalize the input question
        clean_question = question.lower().strip().replace('?', '')

        for faq_id, faq in self.faqs.items():
            # Check each question variant
            for q in faq["questions"][language]:
                # Clean and normalize the FAQ question
                clean_q = q.lower().strip().replace('?', '')
                
                # Try different matching methods
                ratio = fuzz.ratio(clean_question, clean_q)
                partial_ratio = fuzz.partial_ratio(clean_question, clean_q)
                token_sort_ratio = fuzz.token_sort_ratio(clean_question, clean_q)
                
                # Use the highest score from any method
                score = max(ratio, partial_ratio, token_sort_ratio)
                
                if score > highest_score and score > 60:  # Lower threshold to 60%
                    highest_score = score
                    best_match = {
                        "question": q,
                        "answer": faq["answer"][language],
                        "confidence": score
                    }

        # If no good match found, try keyword matching
        if not best_match:
            keywords = clean_question.split()
            for faq_id, faq in self.faqs.items():
                for q in faq["questions"][language]:
                    clean_q = q.lower().strip().replace('?', '')
                    # Check if any keywords match
                    if any(keyword in clean_q for keyword in keywords):
                        return {
                            "question": q,
                            "answer": faq["answer"][language],
                            "confidence": 60
                        }

        return best_match

    def add_faq(self, faq_id: str, questions: Dict[str, List[str]], answers: Dict[str, str]) -> None:
        """Add a new FAQ to the bot."""
        self.faqs[faq_id] = {
            "questions": questions,
            "answer": answers
        }

    def get_all_faqs(self, language: str = "en") -> List[Dict[str, str]]:
        """Get all FAQs in specified language."""
        return [
            {
                "id": faq_id,
                "questions": faq["questions"][language],
                "answer": faq["answer"][language]
            }
            for faq_id, faq in self.faqs.items()
        ]

    def get_supported_languages(self) -> List[str]:
        """Get list of supported languages."""
        return ["en", "hi"]  # English and Hindi

def create_faq_bot() -> FAQBot:
    """Helper function to create a FAQ bot instance."""
    return FAQBot()
