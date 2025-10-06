-- Create leads table for tracking agency leads
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  agency_id UUID NOT NULL,
  traveler_name TEXT NOT NULL,
  traveler_email TEXT NOT NULL,
  traveler_phone TEXT,
  story_theme TEXT NOT NULL,
  destination TEXT,
  guide_generated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  status TEXT DEFAULT 'new',
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policies for agency access to their own leads
CREATE POLICY "Agencies can view their own leads" 
ON public.leads 
FOR SELECT 
USING (auth.uid() = agency_id);

CREATE POLICY "Agencies can insert their own leads" 
ON public.leads 
FOR INSERT 
WITH CHECK (auth.uid() = agency_id);

CREATE POLICY "Agencies can update their own leads" 
ON public.leads 
FOR UPDATE 
USING (auth.uid() = agency_id);

-- Create index for better query performance
CREATE INDEX idx_leads_agency_id ON public.leads(agency_id);
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);