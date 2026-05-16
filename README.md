# Lemaire Clothing

A modern, responsive, and interactive website for **Lemaire Clothing**, a premier boutique in Konongo specializing in authentic Ankara designs and hand-sown African elegance.

## Features

- **Premium Design**: Dark-themed, glassmorphic UI with vibrant primary accents.
- **Dynamic Hero Section**:
    - **Desktop**: High-impact feature image with floating badges.
    - **Mobile**: Automated cross-fade slideshow of featured collections.
- **Interactive Gallery**: Staggered reveal animations with a lightbox modal for viewing designs in detail.
- **Direct Contact**: Integrated WhatsApp link for instant communication.
- **Location Services**: Embedded Google Maps for easy store discovery.
- **SEO Optimized**: Includes Open Graph tags, Twitter cards, and JSON-LD structured data for local business visibility.

## Technology Stack

- **HTML5**: Semantic structure.
- **CSS3**: Vanilla CSS with modern layout techniques (Flexbox, Grid), custom properties, and advanced animations.
- **JavaScript**: Lightweight vanilla JS for interactive elements (Intersection Observer, Modals, Smooth Scrolling).
- **Vite**: Modern frontend tooling for local development and optimized production builds.

## Setup and Development

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run Locally**:
   ```bash
   npm run dev
   ```

3. **Build for Production**:
   ```bash
   npm run build
   ```

## Project Structure

```text
├── assets/
│   ├── images/       # Core site assets (logo, hero)
│   ├── featured/     # Gallery and collection images
│   └── slideshow/    # Mobile-specific slideshow assets
├── index.html        # Main entry point
├── style.css         # Global styles and responsive queries
├── script.js        # Interactive logic
└── vite.config.js    # Vite configuration
```

## SEO Optimization

The project follows modern SEO best practices:
- **Semantic HTML**: Uses appropriate `<header>`, `<section>`, `<nav>`, and `<footer>` tags.
- **Meta Tags**: Optimized title, description, and social sharing tags.
- **Structured Data**: Includes JSON-LD `ClothingStore` schema to help search engines understand the business details.
- **Performance**: Leveraging Vite for optimized asset loading.

---
&copy; 2026 Lemaire Clothing. All rights reserved.
