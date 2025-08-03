# BabyHub Knowledge Transfer Document

## Project Overview
BabyHub is a product aggregator website that displays baby products with affiliate links and AI-powered features. The project uses Next.js with TypeScript and Tailwind CSS for the frontend, and Python with Flask for the AI backend.

## Tech Stack Explanation
- **Next.js**: A React framework that provides:
  - Server-side rendering (SSR)
  - File-based routing
  - Image optimization
  - API routes
- **TypeScript**: Adds static typing to JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Headless UI**: For accessible UI components
- **Python/Flask**: AI backend server
  - Product recommendations
  - FAQ bot
  - Image optimization

## Project Structure
```
src/
├── ai/                  # AI backend services
│   ├── api.py          # Flask API endpoints
│   ├── recommendation.py # Product recommendation engine
│   ├── faq_bot.py      # FAQ chatbot
│   └── image_optimizer.py # Image optimization service
├── app/                 # Next.js app router pages
│   ├── page.tsx        # Main product listing page
│   ├── product/[id]/   # Product detail pages
│   ├── admin/          # Admin section
│   └── layout.tsx      # Root layout with meta tags
├── components/         # Reusable React components
│   ├── ProductCard.tsx # Individual product display
│   ├── ProductRecommendations.tsx # AI recommendations
│   ├── FAQSection.tsx  # FAQ chatbot interface
│   ├── Filters.tsx    # Category and price filters
│   └── Pagination.tsx # Page navigation
├── data/              # Static data files
│   └── products.json  # Product information
├── types/             # TypeScript type definitions
│   └── index.ts      # Shared types
└── utils/             # Helper functions
    ├── api.ts        # API utilities for AI features
    ├── products.ts   # Product data management
    └── format.ts     # Formatting utilities
```

## AI Features Integration

### 1. Product Recommendations
- **Component**: `src/components/ProductRecommendations.tsx`
- **API Integration**: `src/utils/api.ts`
- **Backend**: `src/ai/recommendation.py`
- **Usage**:
  ```typescript
  // In product detail page
  <ProductRecommendations productId={product.id} />
  ```
- **Maintenance Notes**:
  - Update product features in recommendation engine when adding new products
  - Monitor recommendation quality
  - Adjust similarity thresholds if needed

### 2. FAQ Chatbot
- **Component**: `src/components/FAQSection.tsx`
- **API Integration**: `src/utils/api.ts`
- **Backend**: `src/ai/faq_bot.py`
- **Features**:
  - Multilingual support (English/Hindi)
  - Context-aware responses
  - Product-specific answers
- **Maintenance Notes**:
  - Regularly update FAQ database
  - Monitor question patterns
  - Add new languages as needed

### 3. Image Optimization
- **Backend**: `src/ai/image_optimizer.py`
- **Integration**: Automatic for product images
- **Features**:
  - WebP conversion
  - Automatic resizing
  - Quality optimization
- **Maintenance Notes**:
  - Monitor image quality
  - Update optimization parameters
  - Check storage usage

## Development Environment Setup

### 1. Frontend Setup
```bash
npm install
```

### 2. AI Backend Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Start Development Servers
```bash
# Start both servers
./dev.sh

# Or start separately:
# Terminal 1 - AI Server
python run_ai_server.py

# Terminal 2 - Next.js Server
npm run dev
```

## Component Architecture

### ProductRecommendations Component
```typescript
interface ProductRecommendationsProps {
  productId: string;
}

// Usage in product detail page
<ProductRecommendations productId={product.id} />
```

### FAQSection Component
```typescript
// Usage in layout or page
<FAQSection />
```

## API Integration

### Frontend API Utilities
```typescript
// src/utils/api.ts
const AI_API_BASE = 'http://127.0.0.1:5001/api';

export async function getRecommendations(productId: string) {
  const response = await fetch(`${AI_API_BASE}/recommend?product_id=${productId}`);
  return await response.json();
}

export async function getFAQAnswer(question: string, language: string = 'en') {
  const response = await fetch(
    `${AI_API_BASE}/faq?question=${question}&language=${language}`
  );
  return await response.json();
}
```

### Backend API Endpoints
```python
# src/ai/api.py
@app.route('/api/recommend', methods=['GET'])
def get_recommendations():
    product_id = request.args.get('product_id')
    return jsonify({'recommendations': recommender.get_recommendations(product_id)})

@app.route('/api/faq', methods=['GET'])
def get_faq_answer():
    question = request.args.get('question')
    language = request.args.get('language', 'en')
    return jsonify(faq_bot.get_answer(question, language))
```

## Deployment

### Environment Variables
Required variables:
```
NEXT_PUBLIC_GA_ID=your-google-analytics-id
NEXT_PUBLIC_AI_API_BASE=your-ai-server-url
```

### Build Process
```bash
# Build frontend
npm run build
npm run start  # for production

# Run AI server
gunicorn -w 4 -b 0.0.0.0:5001 run_ai_server:app
```

### Deployment Checklist
1. Update metadataBase URL
2. Set environment variables
3. Test all AI features
4. Verify API endpoints
5. Check CORS configuration
6. Test multilingual support

## Troubleshooting

### Common Issues
1. **AI Server Connection**
   - Check AI server is running
   - Verify CORS settings
   - Check API base URL

2. **Recommendation Issues**
   - Check product ID format
   - Verify recommendation engine initialization
   - Monitor similarity scores

3. **FAQ Bot Issues**
   - Check language support
   - Verify question format
   - Monitor response quality

## Performance Considerations

### AI Features
- Use proper caching for recommendations
- Implement rate limiting
- Monitor memory usage
- Log API performance

### Frontend Integration
- Implement loading states
- Handle errors gracefully
- Cache API responses
- Use proper error boundaries

## Future Improvements
1. Add more languages to FAQ bot
2. Implement review analysis
3. Add SEO metadata generation
4. Implement product categorization
5. Add image enhancement features

## Support and Resources
- [Next.js Documentation](https://nextjs.org/docs)
- [Flask Documentation](https://flask.palletsprojects.com/)
- [scikit-learn Documentation](https://scikit-learn.org/stable/)
- Project Repository: [Repository URL] 