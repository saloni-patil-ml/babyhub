# BabyHub - Baby Products Aggregator

A modern, SEO-optimized website for displaying baby products with affiliate links. Built with Next.js, Tailwind CSS, and AI-powered features.

## Features

- Clean and responsive product grid layout
- Product filtering by category and price range
- SEO-optimized with meta tags and semantic HTML
- Pagination for product listings
- Admin interface for managing products
- Google Analytics integration
- Affiliate link support
- AI-powered features:
  - Smart product recommendations
  - Multilingual FAQ chatbot (English & Hindi)
  - Image optimization
  - SEO metadata generation
  - Review analysis and sentiment scoring

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Headless UI Components
- React GA4 for analytics
- Python Flask for AI backend
- scikit-learn for ML models
- Flask-CORS for API integration

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/babyhub.git
cd babyhub
```

2. Install dependencies:
```bash
# Install Node.js dependencies
npm install

# Create and activate Python virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt
```

3. Create a `.env.local` file in the root directory and add your Google Analytics ID:
```
NEXT_PUBLIC_GA_ID=your-ga4-id
```

4. Start the development servers:
```bash
# Option 1: Start both servers with one command
./dev.sh

# Option 2: Start servers separately
# Terminal 1 - AI Server
python run_ai_server.py

# Terminal 2 - Next.js Server
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

- `/src/app` - Next.js app router pages
- `/src/components` - React components
- `/src/data` - Product data in JSON format
- `/src/types` - TypeScript type definitions
- `/src/utils` - Utility functions
- `/src/ai` - AI backend services:
  - `api.py` - Flask API endpoints
  - `recommendation.py` - Product recommendation engine
  - `faq_bot.py` - Multilingual FAQ chatbot
  - `image_optimizer.py` - Image optimization service
  - `seo_generator.py` - SEO metadata generator
  - `review_analyzer.py` - Review analysis engine

## AI Features Usage

### Product Recommendations
The system automatically suggests related products based on the current product being viewed. Recommendations are generated using collaborative filtering and content-based approaches.

### FAQ Chatbot
Users can ask questions in English or Hindi. The chatbot uses natural language processing to understand questions and provide relevant answers about products, shipping, returns, etc.

### Image Optimization
Automatically optimizes product images for web delivery:
- Converts to modern formats (WebP)
- Compresses without quality loss
- Resizes for different viewports

### SEO Generation
Automatically generates SEO-friendly:
- Meta descriptions
- Title tags
- Product descriptions
- Alt text for images

### Review Analysis
Analyzes product reviews to provide:
- Sentiment scores
- Key feature extraction
- Common pros/cons
- Review summaries

## Deployment

### Deploying to Vercel

1. Push your code to GitHub
2. Visit [Vercel](https://vercel.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_GA_ID`
5. Deploy

### Deploying to Netlify

1. Push your code to GitHub
2. Visit [Netlify](https://netlify.com)
3. Import your repository
4. Add environment variables:
   - `NEXT_PUBLIC_GA_ID`
5. Deploy with the following settings:
   - Build command: `npm run build`
   - Publish directory: `.next`

## Customization

### Adding Products

1. Navigate to `/admin` route
2. Fill in the product details
3. Submit the form

In a production environment, you would want to:
- Add authentication to the admin route
- Implement an API endpoint to save products
- Use a database or CMS instead of JSON file

### Modifying Styles

- Edit `tailwind.config.js` for theme customization
- Modify component classes for specific styling changes

### SEO Optimization

- Update meta tags in `src/app/layout.tsx`
- Add more structured data as needed
- Create an `og-image.jpg` in the public directory

Thanks for reading.

## License

MIT
