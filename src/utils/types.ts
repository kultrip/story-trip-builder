export interface Location {
  lat: number;
  lng: number;
  name: string;
  address?: string;
  image?: string;
  images?: string[];
  openingHours?: string | string[];
  pricing?: string;
  website?: string;
  inspirationReference?: string;
}

export interface Activity {
  id: string;
  title: string;
  description: string;
  time: string;
  image?: string;
  images?: string[];
  location?: Location;
  bookingUrl?: string;
}

export interface DayPlan {
  day: number;
  date: string;
  weatherInfo?: {
    description?: string | string[];
    temperature?: number;
  };
  morningActivities: Activity[];
  afternoonActivities: Activity[];
  eveningActivities: Activity[];
}

export interface Itinerary {
  id: number;
  destination: string;
  inspiration: string;
  durationOfTrip: string;
  travelerType: string;
  tripSummary_en?: string;
  googleMapsApiKey?: string;
  days?: DayPlan[];
  result?: {
    dailyItineraries?: DailyItinerary[];
  };
}

export interface Place {
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

export interface DailyItinerary {
  day: number;
  date: string;
  weather?: {
    icon?: string;
    description?: string;
    temperature?: number;
  };
  places?: Place[];
  morningActivities?: Activity[];
  afternoonActivities?: Activity[];
  eveningActivities?: Activity[];
}
