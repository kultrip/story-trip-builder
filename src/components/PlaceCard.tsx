import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Clock, Globe, Phone, MapPin, Star } from 'lucide-react';
import PhotoGallery from './PhotoGallery';
import MapEmbed from './MapEmbed';
import { Place } from '@/utils/types';
import { processPlaceImages } from '@/utils/googleMapsPhotos';

interface PlaceCardProps {
  place: Place;
  googleMapsApiKey?: string;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place, googleMapsApiKey }) => {
  const [isPracticalOpen, setIsPracticalOpen] = useState(false);

  // Process images to convert Google photo references to full URLs
  const processedImages = processPlaceImages(place.images, googleMapsApiKey);
  
  // Get hero image (first from images array or use placeholder)
  const heroImage = processedImages.length > 0 
    ? processedImages[0] 
    : undefined;

  // Format description with bold literary references
  const formatDescription = (text?: string) => {
    if (!text) return null;
    
    // Look for text in quotes or italics and make it bold
    const parts = text.split(/(\*\*.*?\*\*|".*?")/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="text-kultrip-purple">{part.slice(2, -2)}</strong>;
      } else if (part.startsWith('"') && part.endsWith('"')) {
        return <strong key={i} className="text-kultrip-purple italic">{part}</strong>;
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Hero Image with Gallery */}
      {heroImage && (
        <PhotoGallery 
          images={processedImages} 
          heroImage={heroImage}
          alt={place.name_en}
        />
      )}

      <CardContent className="p-6 space-y-4">
        {/* Place Name */}
        <h3 className="font-serif text-2xl font-bold text-gray-900">
          {place.name_en}
        </h3>

        {/* Description */}
        {place.description_en && (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>{formatDescription(place.description_en)}</p>
          </div>
        )}

        {/* Always Visible: Address */}
        {place.address_en && (
          <div className="flex items-start gap-2 text-gray-600">
            <MapPin className="w-5 h-5 text-kultrip-purple flex-shrink-0 mt-0.5" />
            <span className="text-sm">{place.address_en}</span>
          </div>
        )}

        {/* Always Visible: Interactive Map */}
        {place.mapCoordinates && (
          <div className="space-y-2">
            <MapEmbed 
              coordinates={place.mapCoordinates} 
              name={place.name_en}
              className="shadow-md"
            />
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${place.mapCoordinates.lat},${place.mapCoordinates.lng}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-kultrip-purple hover:text-kultrip-orange transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Open in Google Maps
            </a>
          </div>
        )}

        {/* Collapsible Practical Details */}
        <Collapsible open={isPracticalOpen} onOpenChange={setIsPracticalOpen}>
          <CollapsibleTrigger asChild>
            <Button
              variant="outline"
              className="w-full flex items-center justify-between bg-kultrip-purple/5 hover:bg-kultrip-purple/10 border-kultrip-purple/20"
            >
              <span className="font-semibold text-kultrip-purple">Practical Information</span>
              {isPracticalOpen ? (
                <ChevronUp className="w-5 h-5 text-kultrip-purple" />
              ) : (
                <ChevronDown className="w-5 h-5 text-kultrip-purple" />
              )}
            </Button>
          </CollapsibleTrigger>
          
          <CollapsibleContent className="mt-4 space-y-4 animate-in slide-in-from-top-2">
            <div className="bg-gray-50 rounded-lg p-4 space-y-4">
              {/* Opening Hours */}
              {place.opening_hours_en && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-kultrip-purple/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-kultrip-purple" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
                    <div className="text-sm text-gray-600 space-y-1">
                      {place.opening_hours_en.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Website */}
              {place.website_en && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-kultrip-purple/10 flex items-center justify-center flex-shrink-0">
                    <Globe className="w-5 h-5 text-kultrip-purple" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Website</h4>
                    <a
                      href={place.website_en}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-kultrip-purple hover:text-kultrip-orange hover:underline transition-colors inline-flex items-center gap-1"
                    >
                      Visit Website
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              )}

              {/* Contact */}
              {place.contact && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-kultrip-purple/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-kultrip-purple" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Contact</h4>
                    <a
                      href={`tel:${place.contact}`}
                      className="text-sm text-kultrip-purple hover:text-kultrip-orange hover:underline transition-colors"
                    >
                      {place.contact}
                    </a>
                  </div>
                </div>
              )}

              {/* Reviews Summary */}
              {place.reviews_summary_en && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-kultrip-orange/10 flex items-center justify-center flex-shrink-0">
                    <Star className="w-5 h-5 text-kultrip-orange" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-1">Reviews</h4>
                    <p className="text-sm text-gray-600 italic">{place.reviews_summary_en}</p>
                  </div>
                </div>
              )}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default PlaceCard;
