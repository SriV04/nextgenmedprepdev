# Site Map Documentation

## Overview
This documentation covers the sitemap implementation for Next Gen Med Prep website.

## Files Created

### 1. XML Sitemap (`/app/sitemap.xml/route.ts`)
- **Purpose**: SEO-optimized XML sitemap for search engines
- **Access URL**: `https://nextgenmedprep.com/sitemap.xml`
- **Features**:
  - Automatically generated list of all public pages
  - Includes priority, change frequency, and last modified date
  - Cached for 1 hour for performance
  - Standard sitemap protocol compliant

### 2. Visual Sitemap Page (`/app/sitemap/page.tsx`)
- **Purpose**: User-friendly, interactive sitemap for navigation
- **Access URL**: `https://nextgenmedprep.com/sitemap`
- **Features**:
  - Expandable/collapsible sections
  - Visual icons for each section
  - Descriptions for all pages
  - Direct links to all pages
  - Expand All/Collapse All functionality
  - Responsive design

### 3. Robots.txt (`/app/robots.ts`)
- **Purpose**: Guide search engine crawlers
- **Access URL**: `https://nextgenmedprep.com/robots.txt`
- **Features**:
  - References the XML sitemap
  - Blocks sensitive routes (/api/, /admin/, etc.)
  - Allows all other pages to be crawled

## Site Structure

### Main Pages
1. **Home** (`/`)
2. **About** (`/about`)
   - Join The Team (`/about/join-the-team`)
3. **Get Started** (`/get-started`)

### Core Services
4. **Prometheus Question Bank** (`/prometheus`)
   - Prometheus Satellite (`/prometheus-2`)
5. **Interview Preparation** (`/interviews`)
   - MMI Practice (`/interviews/mmis`)
   - Panel Interviews (`/interviews/panel-interviews`)
   - Payment (`/interviews/payment`)
6. **Personal Statements** (`/personal-statements`)
   - Payment (`/personal-statements/payment`)
7. **UCAT Preparation** (`/ucat`)
   - Payment (`/ucat/payment`)

### Events & Bookings
8. **Events** (`/events`)
   - Event Booking (`/event-pay`)
   - Career Consultation (`/career-consultation-pay`)

### Resources & Guides
9. **Resources** (`/resources`)
   - Medicine Application Guide (`/resources/ultimate-medicine-application-guide`)
   - Dentistry Application Guide (`/resources/ultimate-dentistry-application-guide`)
   - Ethics Guide (`/resources/ultimate-ethics-guide`)
   - Medical Hot Topics (`/resources/ultimate-medical-hot-topics`)
   - UCAT Prep Guide (`/resources/ultimate-ucat-prep-guide`)
   - MMI Resources (`/resources/mmi`)
   - Panel Interview Resources (`/resources/panel-interviews`)

## Priority Levels

The sitemap uses the following priority scheme:

- **1.0**: Homepage - Highest priority
- **0.9**: Primary service pages (Get Started, Prometheus)
- **0.8**: Main service categories (Interviews, Personal Statements, UCAT, About)
- **0.7**: Resource guides and secondary pages
- **0.6**: Tertiary pages (sub-resources)
- **0.5**: Payment and checkout pages

## Change Frequency

- **Weekly**: Main services, Prometheus, Hot Topics (frequently updated)
- **Monthly**: Resources, guides, about pages (occasional updates)

## SEO Benefits

1. **Improved Crawlability**: Search engines can easily discover all pages
2. **Better Indexing**: Priority and change frequency help search engines optimize crawling
3. **User Navigation**: Visual sitemap helps users find content
4. **Mobile Friendly**: Responsive design works on all devices

## Maintenance

### Adding New Pages
When adding new pages to the site:

1. **Update XML Sitemap** (`/app/sitemap.xml/route.ts`):
   ```typescript
   {
     url: `${baseUrl}/new-page`,
     lastModified: currentDate,
     changeFrequency: 'weekly', // or 'monthly'
     priority: 0.7, // based on importance
   }
   ```

2. **Update Visual Sitemap** (`/app/sitemap/page.tsx`):
   ```typescript
   {
     title: 'New Page',
     path: '/new-page',
     icon: <Icon className="w-5 h-5" />,
     description: 'Description of the page',
     children: [], // if it has sub-pages
   }
   ```

### Updating Change Frequencies
Review and update change frequencies quarterly based on actual content update patterns.

### Testing
- XML Sitemap: Visit `/sitemap.xml` and validate with [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- Visual Sitemap: Visit `/sitemap` and test all links
- Robots.txt: Visit `/robots.txt` and verify it references the sitemap

## Environment Variables

Add to `.env.local`:
```
NEXT_PUBLIC_BASE_URL=https://nextgenmedprep.com
```

For development:
```
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Search Console Setup

After deployment:
1. Submit sitemap to Google Search Console: `https://nextgenmedprep.com/sitemap.xml`
2. Submit to Bing Webmaster Tools
3. Monitor indexing status regularly

## Performance

- XML sitemap is cached for 1 hour
- Visual sitemap uses client-side rendering for interactivity
- Lazy loading of icons and animations
- Optimized for Core Web Vitals

## Accessibility

- Keyboard navigation supported
- ARIA labels on interactive elements
- Semantic HTML structure
- Color contrast meets WCAG standards

## Future Enhancements

1. **Dynamic Sitemap**: Auto-generate from route structure
2. **Multilingual Support**: Add language variants
3. **Image Sitemap**: Include important images
4. **Video Sitemap**: If video content is added
5. **News Sitemap**: For time-sensitive content like medical hot topics
