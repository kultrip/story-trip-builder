import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Clock, Globe, MapPin } from 'lucide-react';
import PhotoGallery from './PhotoGallery';
import MapEmbed from './MapEmbed';
import { Activity } from '@/utils/types';
import { processPlaceImages } from '@/utils/googleMapsPhotos';

interface ActivityCardProps {
  activity: Activity;
  googleMapsApiKey?: string;
  timeOfDay?: 'morning' | 'afternoon' | 'evening';
}

const ActivityCard: React.FC<ActivityCardProps> = ({ activity, googleMapsApiKey, timeOfDay }) => {
  const [isPracticalOpen, setIsPracticalOpen] = useState(false);

  // Process images to convert Google photo references to full URLs
  const processedImages = processPlaceImages(activity.images, googleMapsApiKey);
  
  // Get hero image (first from images array or use placeholder)
  const heroImage = processedImages.length > 0 
    ? processedImages[0] 
    : activity.image;

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

  const getTimeOfDayBadge = (tod?: string) => {
    if (!tod) return null;
    
    const colors = {
      morning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      afternoon: 'bg-orange-100 text-orange-800 border-orange-300',
      evening: 'bg-purple-100 text-purple-800 border-purple-300'
    };
    
    return (
      <div className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${colors[tod as keyof typeof colors]}`}>
        {tod.charAt(0).toUpperCase() + tod.slice(1)}
      </div>
    );
  };

  return (
    <Card className="border-0 shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Hero Image with Gallery */}
      {heroImage && (
        <PhotoGallery 
          images={processedImages.length > 0 ? processedImages : (heroImage ? [heroImage] : [])} 
          heroImage={heroImage}
          alt={activity.title}
        />
      )}

      <CardContent className="p-6 space-y-4">
        {/* Time Badge */}
        <div className="flex items-center justify-between">
          {timeOfDay && getTimeOfDayBadge(timeOfDay)}
          {activity.time && (
            <div className="flex items-center text-gray-600 text-sm">
              <Clock className="w-4 h-4 mr-1" />
              {activity.time}
            </div>
          )}
        </div>

        {/* Activity Title */}
        <h3 className="font-serif text-2xl font-bold text-gray-900">
          {activity.title}
        </h3>

        {/* Description */}
        {activity.description && (
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
            <p>{formatDescription(activity.description)}</p>
          </div>
        )}

        {/* Location Information */}
        {activity.location && (
          <>
            {/* Address */}
            {activity.location.address && (
              <div className="flex items-start gap-2 text-gray-600">
                <MapPin className="w-5 h-5 text-kultrip-purple flex-shrink-0 mt-0.5" />
                <span className="text-sm">{activity.location.address}</span>
              </div>
            )}

            {/* Interactive Map */}
            {activity.location.lat && activity.location.lng && (
              <div className="space-y-2">
                <MapEmbed 
                  coordinates={{ lat: activity.location.lat, lng: activity.location.lng }} 
                  name={activity.location.name || activity.title}
                  className="shadow-md"
                />
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${activity.location.lat},${activity.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-kultrip-purple hover:text-kultrip-orange transition-colors"
                >
                  <MapPin className="w-4 h-4" />
                  Open in Google Maps
                </a>
              </div>
            )}
          </>
        )}

        {/* Collapsible Practical Details */}
        {(activity.location?.openingHours || activity.location?.website || activity.location?.pricing || activity.bookingUrl) && (
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
                {activity.location?.openingHours && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-kultrip-purple/10 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-kultrip-purple" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Opening Hours</h4>
                      <div className="text-sm text-gray-600 space-y-1">
                        {typeof activity.location.openingHours === 'string' 
                          ? activity.location.openingHours.split('\n').map((line, i) => <div key={i}>{line}</div>)
                          : activity.location.openingHours.map((line, i) => <div key={i}>{line}</div>)
                        }
                      </div>
                    </div>
                  </div>
                )}

                {/* Website */}
                {(activity.location?.website || activity.bookingUrl) && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-kultrip-purple/10 flex items-center justify-center flex-shrink-0">
                      <Globe className="w-5 h-5 text-kultrip-purple" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Website</h4>
                      <a
                        href={activity.bookingUrl || activity.location?.website}
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

                {/* Pricing */}
                {activity.location?.pricing && (
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-kultrip-orange/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-kultrip-orange font-bold">€</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">Pricing</h4>
                      <p className="text-sm text-gray-600">{activity.location.pricing}</p>
                    </div>
                  </div>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCard;
