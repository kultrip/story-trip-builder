-- Create itineraries table to store generated trip itineraries
CREATE TABLE public.itineraries (
  id SERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  destination TEXT NOT NULL,
  inspiration TEXT NOT NULL,
  duration_of_trip TEXT NOT NULL,
  traveler_type TEXT NOT NULL,
  trip_summary_en TEXT,
  google_maps_api_key TEXT,
  result JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;

-- Create policies for itinerary access
-- Allow users to view their own itineraries
CREATE POLICY "Users can view their own itineraries" 
ON public.itineraries 
FOR SELECT 
USING (auth.uid() = user_id);

-- Allow public read access to itineraries (for sharing functionality)
CREATE POLICY "Public can view itineraries" 
ON public.itineraries 
FOR SELECT 
USING (true);

-- Allow users to insert their own itineraries
CREATE POLICY "Users can insert their own itineraries" 
ON public.itineraries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own itineraries
CREATE POLICY "Users can update their own itineraries" 
ON public.itineraries 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create indexes for better query performance
CREATE INDEX idx_itineraries_user_id ON public.itineraries(user_id);
CREATE INDEX idx_itineraries_created_at ON public.itineraries(created_at DESC);
CREATE INDEX idx_itineraries_destination ON public.itineraries(destination);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_itineraries_updated_at
  BEFORE UPDATE ON public.itineraries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
