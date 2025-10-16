# Interactive Itinerary Layout - Implementation Guide

## Overview

This document describes the new interactive itinerary layout implementation that replaces the previous Markdown view in Results.tsx.

## Components Created

### 1. PlaceCard Component (`/src/components/PlaceCard.tsx`)

The PlaceCard component displays detailed information about each place in the itinerary with the following features:

- **Hero Image**: First image from the place's images array, fetched from Google Maps Place Photos API
- **Name**: Place name in English (`name_en`)
- **Description**: Formatted description with bold highlighting for literary/inspiration references
- **Address**: Always visible, displays `address_en`
- **Interactive Map**: Embedded Mapbox map with clickable Google Maps link
- **Photo Gallery**: Clicking the hero image opens a lightbox/carousel showing all images
- **Collapsible Practical Panel**: Contains:
  - Opening hours (`opening_hours_en`) - displayed as vertical list
  - Website (`website_en`) - clickable link
  - Contact (`contact`) - clickable phone link
  - Reviews summary (`reviews_summary_en`)

**Icons used**: ⏰ (Clock), 📞 (Phone), 🌐 (Globe), 📍 (MapPin), ⭐ (Star)

### 2. PhotoGallery Component (`/src/components/PhotoGallery.tsx`)

Displays a hero image with a gallery indicator and opens a lightbox when clicked.

**Features**:
- Uses `yet-another-react-lightbox` library
- Displays image count badge on hero image
- Hover effect with zoom icon
- Full-screen carousel navigation in lightbox

### 3. MapEmbed Component (`/src/components/MapEmbed.tsx`)

Renders an interactive Mapbox map for each place.

**Features**:
- Uses Mapbox GL JS
- Custom purple marker matching the theme
- Popup showing place name
- Navigation controls (zoom, rotate)
- 15x default zoom level

**Configuration**: Requires `VITE_MAPBOX_ACCESS_TOKEN` environment variable

### 4. Google Maps Photos Utility (`/src/utils/googleMapsPhotos.ts`)

Provides utilities to process Google Maps photo references into full URLs.

**Functions**:
- `getGooglePlacePhotoUrl()`: Constructs URL from photo reference
- `processPlaceImages()`: Converts array of photo references to full URLs

## Data Structure

The new layout uses the `dailyItineraries` structure:

```typescript
interface Itinerary {
  id: number;
  destination: string;
  inspiration: string;
  durationOfTrip: string;
  travelerType: string;
  tripSummary_en?: string;
  googleMapsApiKey?: string;
  result?: {
    dailyItineraries?: DailyItinerary[];
  };
}

interface DailyItinerary {
  day: number;
  date: string;
  weather?: {
    icon?: string;
    description?: string;
    temperature?: number;
  };
  places: Place[];
}

interface Place {
  name_en: string;
  description_en?: string;
  address_en?: string;
  opening_hours_en?: string;
  website_en?: string;
  contact?: string;
  reviews_summary_en?: string;
  images?: string[];
  mapCoordinates?: {
    lat: number;
    lng: number;
  };
}
```

## Layout Structure

### Fixed Header
- Logo/branding
- Prominent trip title
- Subtitle showing theme/inspiration
- Metadata badges: duration, type, theme
- Action buttons: Edit, Share, Download

### Daily Itinerary Sections
Each day is a visually distinct card with:
- **Day Header**: Gradient background (purple to orange) with:
  - Day number and date
  - Weather icon and info
  - Expand/collapse button
- **Day Content**: 
  - List of PlaceCard components
  - Each place has full details as described above

### Sidebar
- Trip Overview card
- Weather Forecast (first 3 days)
- Quick Actions (Print, Save)

## Visual Style

### Color Palette (Lisboa/Literary Theme)
- **Primary Purple**: `kultrip-purple` (#9333ea)
- **Accent Orange**: `kultrip-orange` 
- **Gradients**: Purple to orange for headers and CTAs

### Typography
- **Sans-serif**: Default for body text
- **Serif**: `font-serif` for place names (elegant touch)
- **Display**: `font-display` for headings

### Layout
- **Responsive**: Uses Tailwind's responsive classes (sm:, md:, lg:)
- **Grid**: 4-column grid on large screens (1 col sidebar + 3 cols content)
- **Cards**: Shadow-lg with hover effects
- **Spacing**: Consistent padding and gaps (p-6, space-y-6)

## Interactive Features

1. **Collapsible Day Sections**: Click chevron to expand/collapse full day
2. **Collapsible Practical Details**: Toggle practical info panel in each PlaceCard
3. **Photo Lightbox**: Click hero image to view gallery
4. **Interactive Maps**: Pan, zoom, click marker for popup
5. **Clickable Links**: 
   - Website links open in new tab
   - Phone numbers are tel: links
   - Map coordinates link to Google Maps

## Dependencies Added

```json
{
  "mapbox-gl": "^latest",
  "yet-another-react-lightbox": "^latest",
  "@types/mapbox-gl": "^latest" (dev)
}
```

## Environment Variables

```
VITE_MAPBOX_ACCESS_TOKEN=your_mapbox_token_here
```

## Removed/Refactored Code

- **Removed**: 
  - Old ActivityCard component
  - Morning/Afternoon/Evening activity sections
  - Manual image carousel implementation
  - Old Map component implementation

- **Kept**:
  - Hero section with destination image
  - Share and download functionality
  - PDF generation trigger
  - Error handling and loading states

## Testing

To test with real data, ensure your itinerary JSON has this structure:

```json
{
  "itinerary": [{
    "id": 1,
    "destination": "Lisboa",
    "inspiration": "Emily in Paris",
    "durationOfTrip": "3",
    "travelerType": "solo",
    "googleMapsApiKey": "your_key_here",
    "result": {
      "dailyItineraries": [
        {
          "day": 1,
          "date": "2025-10-20",
          "weather": {
            "icon": "sun",
            "description": "Sunny",
            "temperature": 24
          },
          "places": [
            {
              "name_en": "Belém Tower",
              "description_en": "A historic tower that featured in **Emily in Paris** season 2...",
              "address_en": "Av. Brasília, 1400-038 Lisboa",
              "opening_hours_en": "Monday-Sunday: 10:00-18:00",
              "website_en": "https://example.com",
              "contact": "+351 21 362 0034",
              "reviews_summary_en": "Beautiful historic site with stunning views",
              "images": ["photo_reference_1", "photo_reference_2"],
              "mapCoordinates": {
                "lat": 38.6916,
                "lng": -9.2159
              }
            }
          ]
        }
      ]
    }
  }]
}
```

## Responsive Behavior

- **Mobile** (<640px): Single column, full-width cards
- **Tablet** (640-1024px): Adjusted padding, stacked layout
- **Desktop** (>1024px): Sidebar + main content grid

## Accessibility

- Semantic HTML structure
- ARIA labels on interactive elements
- Keyboard navigation support in lightbox
- Focus indicators on buttons
- Alt text on images
