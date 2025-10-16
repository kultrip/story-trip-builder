const apiCall = {
  getItinerary: async ({ id }: { id: number }) => {
    // Placeholder implementation - always return mock itinerary for local testing
    return {
      itinerary: [
        {
          id: id,
          destination: "Paris",
          inspiration: "Emily in Paris",
          durationOfTrip: "5",
          travelerType: "solo",
          tripSummary_en: "Experience the charm of Paris through the lens of your favorite story. From iconic landmarks to hidden gems, this journey blends culture, history, and the magic of storytelling.",
          googleMapsApiKey: "",
          result: {
            dailyItineraries: [
              {
                day: 1,
                date: new Date().toISOString().split('T')[0],
                weather: {
                  icon: "sun",
                  description: "Sunny",
                  temperature: 22,
                },
                places: [
                  {
                    name_en: "Eiffel Tower",
                    description_en: "The iconic iron lattice tower on the Champ de Mars. A must-see landmark that offers breathtaking views of Paris.",
                    address_en: "Champ de Mars, 5 Avenue Anatole France, 75007 Paris",
                    opening_hours_en: "9:30 AM - 11:45 PM",
                    website_en: "https://www.toureiffel.paris",
                    contact: "+33 892 70 12 39",
                    reviews_summary_en: "Amazing views and a true symbol of Paris!",
                    images: [],
                    mapCoordinates: {
                      lat: 48.8584,
                      lng: 2.2945,
                    },
                  },
                  {
                    name_en: "Louvre Museum",
                    description_en: "The world's largest art museum and a historic monument in Paris. Home to thousands of works of art, including the Mona Lisa.",
                    address_en: "Rue de Rivoli, 75001 Paris",
                    opening_hours_en: "9:00 AM - 6:00 PM (Closed Tuesdays)",
                    website_en: "https://www.louvre.fr",
                    contact: "+33 1 40 20 50 50",
                    reviews_summary_en: "An incredible collection of art and history.",
                    images: [],
                    mapCoordinates: {
                      lat: 48.8606,
                      lng: 2.3376,
                    },
                  },
                ],
              },
              {
                day: 2,
                date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
                weather: {
                  icon: "cloud",
                  description: "Partly Cloudy",
                  temperature: 20,
                },
                places: [
                  {
                    name_en: "Montmartre",
                    description_en: "A historic and artistic neighborhood known for its bohemian past, charming streets, and the stunning Sacré-Cœur Basilica.",
                    address_en: "Montmartre, 75018 Paris",
                    opening_hours_en: "Open 24 hours",
                    website_en: "",
                    contact: "",
                    reviews_summary_en: "Beautiful area with amazing views and artistic vibe.",
                    images: [],
                    mapCoordinates: {
                      lat: 48.8867,
                      lng: 2.3431,
                    },
                  },
                ],
              },
            ],
          },
        },
      ],
    };
  },
  reimburseCredits: async ({ id }: { id: number }) => {
    // Placeholder implementation
    return { success: true };
  },
};

export default apiCall;
