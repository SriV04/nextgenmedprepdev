# ✅ Sitemap Implementation Checklist

## Pre-Deployment Checklist

### Environment Setup
- [ ] Set `NEXT_PUBLIC_BASE_URL` in `.env.local` (development)
- [ ] Set `NEXT_PUBLIC_BASE_URL` in production environment
- [ ] Verify environment variable is accessible in route handlers

### Testing - Local Development
- [ ] Visit `http://localhost:3000/sitemap.xml` - Should show XML
- [ ] Visit `http://localhost:3000/sitemap` - Should show visual sitemap
- [ ] Visit `http://localhost:3000/robots.txt` - Should show robots directives
- [ ] Test all links on visual sitemap page
- [ ] Test expand/collapse functionality
- [ ] Test search bar (if implemented)
- [ ] Verify responsive design on mobile

### Code Quality
- [ ] No TypeScript errors (`npm run type-check`)
- [ ] No ESLint warnings (`npm run lint`)
- [ ] All imports resolved correctly
- [ ] Framer Motion animations working
- [ ] Lucide React icons displaying

### Content Verification
- [ ] All 23 pages listed in XML sitemap
- [ ] All 23 pages listed in visual sitemap
- [ ] Descriptions accurate and helpful
- [ ] Priorities correctly assigned (0.5-1.0)
- [ ] Change frequencies realistic
- [ ] All paths start with `/`
- [ ] All URLs are absolute in XML

## Deployment Checklist

### Build & Deploy
- [ ] Build succeeds without errors (`npm run build`)
- [ ] Production build tested locally (`npm run start`)
- [ ] Deploy to production
- [ ] Verify deployment successful

### Post-Deployment Testing
- [ ] XML sitemap accessible: `https://nextgenmedprep.com/sitemap.xml`
- [ ] Visual sitemap accessible: `https://nextgenmedprep.com/sitemap`
- [ ] Robots.txt accessible: `https://nextgenmedprep.com/robots.txt`
- [ ] All internal links work correctly
- [ ] No 404 errors in browser console
- [ ] HTTPS certificates valid

### SEO Setup
- [ ] Validate XML sitemap: [XML Sitemap Validator](https://www.xml-sitemaps.com/validate-xml-sitemap.html)
- [ ] Submit to Google Search Console
- [ ] Submit to Bing Webmaster Tools
- [ ] Verify sitemap indexed in GSC
- [ ] Check robots.txt in GSC

## Post-Launch Monitoring

### Week 1
- [ ] Monitor Google Search Console for crawl errors
- [ ] Check indexing status daily
- [ ] Verify no broken links reported
- [ ] Review server logs for sitemap requests
- [ ] Ensure no 500 errors on sitemap endpoints

### Week 2-4
- [ ] Track indexed pages count
- [ ] Monitor crawl frequency
- [ ] Review Coverage report in GSC
- [ ] Check for duplicate content issues
- [ ] Analyze top performing pages

### Monthly Tasks
- [ ] Update lastModified dates for changed pages
- [ ] Add new pages to sitemap
- [ ] Remove deprecated pages
- [ ] Review and adjust priorities
- [ ] Update change frequencies if needed
- [ ] Check sitemap performance in analytics

## Maintenance Checklist

### Adding New Pages
1. [ ] Add to XML sitemap (`/app/sitemap.xml/route.ts`)
   ```typescript
   {
     url: `${baseUrl}/new-page`,
     lastModified: currentDate,
     changeFrequency: 'weekly',
     priority: 0.7,
   }
   ```

2. [ ] Add to visual sitemap (`/app/sitemap/page.tsx`)
   ```typescript
   {
     title: 'New Page',
     path: '/new-page',
     icon: <Icon />,
     description: 'Description',
   }
   ```

3. [ ] Test locally
4. [ ] Deploy
5. [ ] Verify in production
6. [ ] Allow 1-2 days for indexing

### Removing Pages
1. [ ] Remove from XML sitemap
2. [ ] Remove from visual sitemap
3. [ ] Set up 301 redirect if needed
4. [ ] Update in GSC (mark as permanently moved)
5. [ ] Monitor for 404 errors

### Updating Priorities
- [ ] Review Google Analytics traffic data
- [ ] Identify high-traffic pages
- [ ] Adjust priorities accordingly
- [ ] Deploy changes
- [ ] Monitor ranking changes

## Integration Checklist

### Footer Integration
- [ ] Import SitemapLink component
- [ ] Add to footer navigation
- [ ] Test footer link works
- [ ] Verify styling matches site theme

### Navigation Menu
- [ ] Add "Site Map" to main navigation (optional)
- [ ] Add to mobile menu
- [ ] Test on all devices

### 404 Page
- [ ] Add sitemap link to 404 page
- [ ] Help users find correct page
- [ ] Test 404 flow

## Performance Checklist

### Speed Optimization
- [ ] XML sitemap loads in < 200ms
- [ ] Visual sitemap LCP < 2.5s
- [ ] No layout shifts (CLS < 0.1)
- [ ] First Input Delay < 100ms
- [ ] Enable caching headers
- [ ] Compress responses (gzip/brotli)

### Monitoring
- [ ] Set up uptime monitoring for `/sitemap.xml`
- [ ] Monitor response times
- [ ] Track error rates
- [ ] Set up alerts for failures

## Accessibility Checklist

### WCAG Compliance
- [ ] Color contrast passes WCAG AA
- [ ] Keyboard navigation works
- [ ] Screen reader tested
- [ ] ARIA labels present
- [ ] Focus indicators visible
- [ ] No keyboard traps

### Testing Tools
- [ ] Test with axe DevTools
- [ ] Test with Lighthouse
- [ ] Test with NVDA/JAWS
- [ ] Test with VoiceOver (Mac)
- [ ] Manual keyboard testing

## Documentation Checklist

### Team Documentation
- [ ] README updated with sitemap info
- [ ] Contributing guidelines include sitemap updates
- [ ] Architecture docs reference sitemap
- [ ] Onboarding includes sitemap training

### External Documentation
- [ ] SEO documentation updated
- [ ] API documentation (if relevant)
- [ ] Help center articles
- [ ] User guides

## Advanced Features (Optional)

### Future Enhancements
- [ ] Image sitemap
- [ ] Video sitemap
- [ ] News sitemap
- [ ] Multi-language support
- [ ] Dynamic sitemap generation
- [ ] Sitemap index for large sites
- [ ] Category-based sitemaps
- [ ] Auto-update from CMS

### Analytics Integration
- [ ] Track sitemap page views
- [ ] Monitor link clicks
- [ ] A/B test sitemap designs
- [ ] Analyze user navigation patterns
- [ ] Set up conversion goals

## Troubleshooting Checklist

### Common Issues

#### XML Sitemap Not Loading
- [ ] Check file exists: `/app/sitemap.xml/route.ts`
- [ ] Verify GET function exports
- [ ] Check environment variable
- [ ] Clear `.next` cache
- [ ] Restart dev server

#### Visual Sitemap Errors
- [ ] Check TypeScript errors
- [ ] Verify all imports
- [ ] Check for missing dependencies
- [ ] Review browser console
- [ ] Test with JavaScript disabled

#### SEO Issues
- [ ] Validate XML format
- [ ] Check absolute URLs
- [ ] Verify protocol (https://)
- [ ] Review GSC errors
- [ ] Check robots.txt syntax

#### Performance Issues
- [ ] Enable caching
- [ ] Optimize animations
- [ ] Lazy load components
- [ ] Compress responses
- [ ] Use CDN if available

## Sign-Off Checklist

### Development Team
- [ ] Developer reviewed code
- [ ] QA tested all functionality
- [ ] Tech lead approved implementation
- [ ] Security review completed

### SEO Team
- [ ] SEO specialist reviewed structure
- [ ] Keywords optimized
- [ ] Metadata verified
- [ ] Search console configured

### Product Team
- [ ] Product owner approved
- [ ] UX designer reviewed
- [ ] Content team verified descriptions
- [ ] Stakeholders notified

### Launch
- [ ] All checklists completed
- [ ] Backup created
- [ ] Rollback plan ready
- [ ] Monitoring enabled
- [ ] Team notified
- [ ] **Ready for Production! 🚀**

---

## Quick Reference

### File Locations
```
/apps/frontend/app/sitemap.xml/route.ts    # XML Sitemap
/apps/frontend/app/sitemap/page.tsx        # Visual Sitemap
/apps/frontend/app/sitemap/layout.tsx      # Sitemap Metadata
/apps/frontend/app/robots.ts               # Robots.txt
/apps/frontend/components/SitemapLink.tsx  # Link Component
/docs/SITEMAP.md                           # Documentation
```

### URLs
- XML: `/sitemap.xml`
- Visual: `/sitemap`
- Robots: `/robots.txt`

### Priority Guide
- 1.0: Homepage only
- 0.9: Key conversion pages
- 0.8: Main service categories
- 0.7: Resources and guides
- 0.6: Sub-resources
- 0.5: Payment/checkout pages
