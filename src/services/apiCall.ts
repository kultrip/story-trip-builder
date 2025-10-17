import { supabase } from "@/integrations/supabase/client";

const apiCall = {
  getItinerary: async ({ id }: { id: number }) => {
    // Fetch itinerary from Supabase
    const { data, error } = await supabase
      .from('itineraries')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error("Error fetching itinerary:", error);
      throw new Error(error.message || "Failed to fetch itinerary");
    }

    if (!data) {
      throw new Error("Itinerary not found");
    }

    // Transform database result to match expected format
    return {
      itinerary: [
        {
          id: data.id,
          destination: data.destination,
          inspiration: data.inspiration,
          durationOfTrip: data.duration_of_trip,
          travelerType: data.traveler_type,
          tripSummary_en: data.trip_summary_en,
          googleMapsApiKey: data.google_maps_api_key,
          result: data.result,
        },
      ],
    };
  },
  reimburseCredits: async ({ id }: { id: number }) => {
    // Placeholder implementation
    console.log("Reimbursing credits for itinerary:", id);
    return { success: true };
  },
};

export default apiCall;
