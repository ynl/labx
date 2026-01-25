# CLAUDE.md - LabX Project Guide

This document provides guidance for AI assistants working with the LabX codebase.

## Project Overview

**LabX** is a showcase platform for AI-powered creative experiments. It serves as a unified gallery for discovering and experiencing innovative AI product prototypes and creative ideas. The current primary experiment is **Smart Bill Recognition** (receipt scanning with AI for bill splitting).

- **Website**: https://ynl.github.io/labx/
- **Contact**: yilin@tencent.com
- **Nature**: Experimental demonstration platform (not production-ready)

## Repository Structure

```
labx/
├── index.html      # Privacy Policy page (bilingual EN/ZH)
├── support.html    # Support & Documentation page (bilingual EN/ZH)
├── README.md       # Basic project identifier
└── CLAUDE.md       # This file - AI assistant guidance
```

This is a **minimal static website** with no build system, dependencies, or complex tooling.

## Technology Stack

| Technology | Purpose |
|------------|---------|
| HTML5 | Page structure |
| CSS (inline) | Styling (embedded in `<style>` tags) |
| JavaScript (vanilla) | Language switching functionality |
| GitHub Pages | Hosting platform |

**Third-party services (referenced in docs, not in this repo)**:
- Supabase - Authentication & database
- Expo - Mobile app development & push notifications
- Sentry - Error monitoring
- PostHog - Analytics

## Development Workflow

### No Build Process Required

This is a static site. Simply edit HTML files directly:

```bash
# View changes locally
open index.html
# or
python -m http.server 8000
```

### Deployment

The site is deployed via GitHub Pages from the repository root. Any push to the main branch will automatically update the live site at `https://ynl.github.io/labx/`.

## Code Conventions

### HTML Structure

Each page follows a consistent structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>LabX [Page Name]</title>
    <style>/* Embedded CSS */</style>
</head>
<body>
    <div class="container">
        <div class="header"><!-- Logo + title --></div>
        <div class="lang-switch"><!-- EN/ZH toggle --></div>
        <div class="content">
            <div id="en" class="section active"><!-- English content --></div>
            <div id="zh" class="section"><!-- Chinese content --></div>
        </div>
        <div class="footer"><!-- Links + copyright --></div>
    </div>
    <script>/* Language switch logic */</script>
</body>
</html>
```

### CSS Conventions

- **No external stylesheets** - All CSS is embedded in `<style>` tags
- **CSS Reset** - Uses `* { margin: 0; padding: 0; box-sizing: border-box; }`
- **System fonts** - `-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`
- **Brand colors**:
  - Primary Green: `#07C160`
  - Accent Blue: `#10AEFF`
  - Gradient: `linear-gradient(135deg, #07C160, #10AEFF)`
- **Responsive breakpoint**: `600px` (mobile-first)
- **Class naming**: Kebab-case, BEM-like (`lang-btn`, `faq-item`, `contact-card`)

### JavaScript Conventions

- **Vanilla JS only** - No frameworks or libraries
- **ES5/ES6 compatible** - No transpilation needed
- **Minimal functionality** - Only used for language switching

Language switch pattern:
```javascript
function switchLang(lang) {
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    document.getElementById(lang).classList.add('active');
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
}
```

### Bilingual Content Pattern

All content is duplicated in English and Chinese:

```html
<div id="en" class="section active">
    <!-- English content -->
</div>
<div id="zh" class="section">
    <!-- Chinese content (simplified) -->
</div>
```

**Important**: When updating content, ensure both language sections are updated to maintain consistency.

## Design System

### Layout
- Max container width: `800px`
- Container padding: `40px 20px` (desktop), `20px 16px` (mobile)
- Content card: White background with `border-radius: 12px` and shadow

### Typography
- H1: `28px` (desktop), `24px` (mobile)
- H2: `20px`, color `#07C160`, with bottom border
- H3: `16px`, color `#333`
- Body: `line-height: 1.6`, color `#555`

### Components
- **Logo**: 80x80px rounded square with gradient background
- **Language buttons**: Pill-shaped with hover/active states
- **FAQ items**: Gray background cards (`#f9f9f9`)
- **Contact card**: Green gradient background with white text

## File Modification Guidelines

### When editing `index.html` (Privacy Policy)
- Update both EN and ZH sections
- Update "Last Updated" date in the header
- Maintain legal accuracy for privacy compliance

### When editing `support.html` (Support Page)
- Update both EN and ZH sections
- Keep FAQ answers concise
- Maintain consistency with privacy policy claims

### Adding New Pages
1. Copy the structure from an existing page
2. Update `<title>` and header content
3. Add navigation links in footer of all pages
4. Maintain bilingual support

## Important Notes

1. **No build tools** - Do not add package.json, webpack, etc. unless explicitly requested
2. **No external dependencies** - Keep the site self-contained
3. **Bilingual parity** - Always update both EN and ZH content together
4. **Experimental nature** - The platform showcases demos, not production features
5. **Privacy-conscious** - The mobile app referenced handles sensitive data; update docs carefully

## Quick Commands

```bash
# Start local server
python -m http.server 8000

# View in browser
open http://localhost:8000

# Check git status
git status

# Deploy (push to main)
git push origin main
```

## Contact

For questions about the LabX project:
- Email: yilin@tencent.com
