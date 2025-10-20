-- Sample itinerary data for testing
-- This script inserts a test itinerary into the database

INSERT INTO public.itineraries (
  id,
  user_id,
  destination,
  inspiration,
  duration_of_trip,
  traveler_type,
  trip_summary_en,
  google_maps_api_key,
  result
) VALUES (
  410,
  NULL, -- Can be NULL for public access
  'Paris',
  'Emily in Paris',
  '3',
  'solo',
  'Experience the charm of Paris through the lens of your favorite story. From iconic landmarks to hidden gems, this journey blends culture, history, and the magic of storytelling.',
  '',
  '{
    "dailyItineraries": [
      {
        "day": 1,
        "date": "2025-10-20",
        "weather": {
          "icon": "sun",
          "description": "Sunny",
          "temperature": 22
        },
        "morningActivities": [
          {
            "id": "1-morning-1",
            "title": "Eiffel Tower Visit",
            "description": "Start your day at the iconic **Eiffel Tower**, the iron lattice tower that inspired countless romantic scenes in literature and film. Experience breathtaking views of Paris from its observation decks.",
            "time": "9:00 AM - 11:00 AM",
            "images": [],
            "location": {
              "lat": 48.8584,
              "lng": 2.2945,
              "name": "Eiffel Tower",
              "address": "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
              "openingHours": "9:30 AM - 11:45 PM",
              "website": "https://www.toureiffel.paris",
              "pricing": "€26.10 for adults (top floor)"
            }
          }
        ],
        "afternoonActivities": [
          {
            "id": "1-afternoon-1",
            "title": "Louvre Museum Exploration",
            "description": "Discover the world''s largest art museum, home to the **Mona Lisa** and thousands of other masterpieces. Walk through halls that have inspired artists and writers for centuries.",
            "time": "2:00 PM - 5:00 PM",
            "images": [],
            "location": {
              "lat": 48.8606,
              "lng": 2.3376,
              "name": "Louvre Museum",
              "address": "Rue de Rivoli, 75001 Paris",
              "openingHours": "9:00 AM - 6:00 PM (Closed Tuesdays)",
              "website": "https://www.louvre.fr",
              "pricing": "€17 for adults"
            }
          }
        ],
        "eveningActivities": [
          {
            "id": "1-evening-1",
            "title": "Seine River Cruise",
            "description": "End your day with a magical cruise along the **Seine River**, enjoying panoramic views of illuminated landmarks including Notre-Dame and the Musée d''Orsay.",
            "time": "7:30 PM - 9:00 PM",
            "images": [],
            "location": {
              "lat": 48.8584,
              "lng": 2.2945,
              "name": "Seine River - Port de la Bourdonnais",
              "address": "Port de la Bourdonnais, 75007 Paris",
              "openingHours": "Various departure times",
              "website": "https://www.bateaux-parisiens.com",
              "pricing": "€15 for adults"
            }
          }
        ]
      },
      {
        "day": 2,
        "date": "2025-10-21",
        "weather": {
          "icon": "cloud",
          "description": "Partly Cloudy",
          "temperature": 20
        },
        "morningActivities": [
          {
            "id": "2-morning-1",
            "title": "Montmartre & Sacré-Cœur",
            "description": "Explore the artistic neighborhood of **Montmartre**, where Picasso and Van Gogh once lived. Visit the stunning Sacré-Cœur Basilica with its panoramic city views.",
            "time": "9:00 AM - 12:00 PM",
            "images": [],
            "location": {
              "lat": 48.8867,
              "lng": 2.3431,
              "name": "Montmartre & Sacré-Cœur",
              "address": "Montmartre, 75018 Paris",
              "openingHours": "Open 24 hours (Basilica: 6:00 AM - 10:30 PM)",
              "website": "https://www.sacre-coeur-montmartre.com",
              "pricing": "Free entry to the basilica"
            }
          }
        ],
        "afternoonActivities": [
          {
            "id": "2-afternoon-1",
            "title": "Latin Quarter Stroll",
            "description": "Wander through the historic **Latin Quarter**, famous for its bohemian atmosphere, bookshops, and cafés. Visit Shakespeare and Company, the legendary English bookshop.",
            "time": "2:00 PM - 5:00 PM",
            "images": [],
            "location": {
              "lat": 48.8529,
              "lng": 2.3469,
              "name": "Latin Quarter",
              "address": "5th Arrondissement, Paris",
              "openingHours": "Open 24 hours",
              "pricing": "Free to explore"
            }
          }
        ],
        "eveningActivities": [
          {
            "id": "2-evening-1",
            "title": "Moulin Rouge Show",
            "description": "Experience the glamour and excitement of the world-famous **Moulin Rouge** cabaret show, a Parisian icon since 1889 featuring stunning performances.",
            "time": "9:00 PM - 11:00 PM",
            "images": [],
            "location": {
              "lat": 48.8841,
              "lng": 2.3322,
              "name": "Moulin Rouge",
              "address": "82 Boulevard de Clichy, 75018 Paris",
              "openingHours": "Shows at 9:00 PM and 11:00 PM",
              "website": "https://www.moulinrouge.fr",
              "pricing": "€87+ per person (varies by package)"
            }
          }
        ]
      },
      {
        "day": 3,
        "date": "2025-10-22",
        "weather": {
          "icon": "sun",
          "description": "Sunny",
          "temperature": 23
        },
        "morningActivities": [
          {
            "id": "3-morning-1",
            "title": "Versailles Palace Tour",
            "description": "Journey to the magnificent **Palace of Versailles**, the opulent former royal residence. Explore the Hall of Mirrors, the Royal Apartments, and the stunning gardens.",
            "time": "9:00 AM - 1:00 PM",
            "images": [],
            "location": {
              "lat": 48.8049,
              "lng": 2.1204,
              "name": "Palace of Versailles",
              "address": "Place d''Armes, 78000 Versailles",
              "openingHours": "9:00 AM - 6:30 PM (Closed Mondays)",
              "website": "https://www.chateauversailles.fr",
              "pricing": "€19.50 for Palace, €27 for full access"
            }
          }
        ],
        "afternoonActivities": [
          {
            "id": "3-afternoon-1",
            "title": "Champs-Élysées Shopping",
            "description": "Stroll down the famous **Champs-Élysées** avenue, lined with luxury boutiques, cafés, and theaters. Don''t miss the Arc de Triomphe at the top of the avenue.",
            "time": "3:00 PM - 6:00 PM",
            "images": [],
            "location": {
              "lat": 48.8698,
              "lng": 2.3078,
              "name": "Champs-Élysées",
              "address": "Avenue des Champs-Élysées, 75008 Paris",
              "openingHours": "Open 24 hours (shops vary)",
              "pricing": "Free to walk"
            }
          }
        ],
        "eveningActivities": [
          {
            "id": "3-evening-1",
            "title": "Farewell Dinner at Le Jules Verne",
            "description": "Conclude your Parisian adventure with an elegant dinner at **Le Jules Verne**, the Michelin-starred restaurant located in the Eiffel Tower, offering gourmet French cuisine and spectacular views.",
            "time": "7:30 PM - 10:00 PM",
            "images": [],
            "location": {
              "lat": 48.8584,
              "lng": 2.2945,
              "name": "Le Jules Verne - Eiffel Tower",
              "address": "Eiffel Tower, Avenue Gustave Eiffel, 75007 Paris",
              "openingHours": "12:00 PM - 1:30 PM, 7:00 PM - 9:30 PM",
              "website": "https://www.lejulesverne-paris.com",
              "pricing": "€190-250 per person"
            },
            "bookingUrl": "https://www.lejulesverne-paris.com/reservation"
          }
        ]
      }
    ]
  }'::jsonb
) ON CONFLICT (id) DO UPDATE SET
  destination = EXCLUDED.destination,
  inspiration = EXCLUDED.inspiration,
  duration_of_trip = EXCLUDED.duration_of_trip,
  traveler_type = EXCLUDED.traveler_type,
  trip_summary_en = EXCLUDED.trip_summary_en,
  google_maps_api_key = EXCLUDED.google_maps_api_key,
  result = EXCLUDED.result,
  updated_at = now();
