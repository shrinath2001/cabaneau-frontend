# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cabaneau is a Next.js 16 cabin rental website built with React 19, TypeScript, and Tailwind CSS 4. The application showcases various cabins with detailed information, services, activities, and location details.

## Development Commands

### Running the Application
```bash
npm run dev      # Start development server on http://localhost:3000
npm run build    # Build production bundle
npm start        # Start production server
```

### Code Quality
```bash
npm run lint     # Run ESLint to check code quality
```

Note: The working directory for development is `cabaneau-app/`, not the repository root.

## Architecture

### Route Structure
The application uses Next.js App Router with a custom layout pattern:

- **Root Layout** (`app/layout.tsx`): Client-side layout that conditionally renders `Header` (home) or `Header2` (other pages) based on pathname
- **Pages Group** (`app/(pages)/`): Contains route segments with shared `Header2` and `Footer` via `layout.tsx`
  - `/cabins` - Cabin listing page
  - `/cabins/[id]` - Dynamic single cabin detail page
  - `/activities` - Activities page
  - `/eat-drink` - Food & drink page
- **Home Page** (`app/page.tsx`): Composed of multiple section components

### Component Organization

**Page Sections** (used on home page):
- `CabinsSection` - Featured cabins carousel/grid
- `ServicesSection` - Amenities and services offered
- `ActivitiesSection` - Available activities
- `HostsSection` - Information about hosts
- `LocationSection` - Location and contact details

**Reusable Components**:
- `Header` - Home page header with navigation
- `Header2` - Secondary header for inner pages
- `Footer` - Site footer
- `CabinCard` - Individual cabin preview card
- `ActivityCard` - Activity item card
- `ServiceCard` - Service/amenity card
- `Features` - Feature highlights component

### Data Layer
Cabin data is centralized in `app/data/cabins.ts` containing:
- Multiple cabin entries with id, images, title, rating, area, capacity, price
- Detailed cabin information (guests, bedrooms, bathrooms, features, amenities, offers)
- Currently some cabins (id: 2-5) have incomplete data and need to be populated

### Styling Architecture

Uses **Tailwind CSS 4** with custom CSS variables defined in `app/globals.css`:

**Custom Fonts**:
- `--font-heading`: Jost (Google Fonts)
- `--font-body`: Raleway (Google Fonts)
- `--font-custom`: Logga (local custom font in `/public/fonts`)

**Custom Colors**:
- `--bg-customgreen`: #495D4D (primary green)
- `--bg-button1`: #939D92 (button background)
- `--bg-hoverorange`: #F49A4A (hover state)
- `--text-customyellow`: #F0E8C6 (accent text)
- `--bg-tint`: #F0E8C64D (background tint)

**Utility Classes**: `.font-heading`, `.font-body`, `.font-custom`, `.bg-customgreen`, `.bg-button1`, `.bg-hoverorange`, `.text-customyellow`, `.bg-tint`

### Static Assets
- Images: `/public/assets/` - cabin and activity images
- Icons: `/public/*.svg` - feature icons (food-drink, full-privacy, pets-welcomed, sheets-towels)
- Fonts: `/public/fonts/` - Logga custom font family

## TypeScript Configuration

- Path alias `@/*` maps to project root for clean imports: `import { cabins } from '@/app/data/cabins'`
- Target: ES2017
- JSX: react-jsx (React 19 automatic runtime)

## Key Technical Details

- **Client Components**: Root layout uses `"use client"` for pathname detection with `usePathname()` hook
- **Dynamic Routing**: Cabin detail pages use `useParams()` to fetch cabin by ID from static data
- **Image Optimization**: Uses standard `<img>` tags (not Next.js Image component) - consider migrating for performance
- **Responsive Design**: Mobile-first with Tailwind breakpoints (md, lg)
