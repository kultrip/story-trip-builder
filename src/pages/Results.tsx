import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import PlaceCard from "@/components/PlaceCard";
import { generateItineraryPDF } from "@/utils/generateItineraryPDF"
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import apiCall from "@/services/apiCall";
import {
  MapPin,
  Calendar,
  Users,
  Sun,
  Cloud,
  CloudRain,
  Sparkles,
  Clock,
  Download,
  Share2,
  Edit,
  BookOpen,
  Film,
  Heart,
  Star,
  ChevronDown,
  ChevronUp,
  Compass
} from "lucide-react";
import { Itinerary } from "@/utils/types";
import { searchImages } from "@/services/imageService";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [destinationImage, setDestinationImage] = useState("");
  const [expandedDays, setExpandedDays] = useState<{[key: number]: boolean}>({});
  const [retryCount, setRetryCount] = useState(0);

  // For PDF loading overlay
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [pdfStep, setPdfStep] = useState(0);
  const pdfSteps = [
    "Creating your beautiful travel guide...",
    "Adding story connections and cultural insights...",
    "Formatting maps and location details...",
    "Your magical journey is ready!",
  ];

  // Dialog management
  const [showDialog, setShowDialog] = useState(false);
  const [reimbursed, setReimbursed] = useState(false);

  const { data: itinerary, isLoading, error, refetch } = useQuery({
    queryKey: ["itinerary", id, retryCount],
    queryFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      const itineraryData = await apiCall.getItinerary({ id: parseInt(id) });

      if (
        itineraryData?.error ||
        itineraryData?.message ||
        itineraryData?.itinerary === undefined ||
        (Array.isArray(itineraryData?.itinerary) && itineraryData.itinerary.length === 0)
      ) {
        throw new Error(
          itineraryData?.message ||
          itineraryData?.error ||
          "Itinerary data is empty or invalid."
        );
      }

      const isEmpty =
        !itineraryData ||
        !itineraryData.itinerary ||
        !Array.isArray(itineraryData.itinerary) ||
        itineraryData.itinerary.length === 0 ||
        !itineraryData.itinerary[0] ||
        Object.keys(itineraryData.itinerary[0]).length === 0 ||
        !itineraryData.itinerary[0].destination;

      if (isEmpty) {
        throw new Error("Itinerary data is empty");
      }

      const result = itineraryData.itinerary[0];
      return {
        ...result.result,
        ...result,
      };
    },
    retry: false,
  });

  useEffect(() => {
    if (error) {
      setShowDialog(true);
      if (!reimbursed) {
        apiCall
          .reimburseCredits({ id: parseInt(id) })
          .then(() => {
            setReimbursed(true);
            toast.success("Your credits have been reimbursed.");
          })
          .catch(() => toast.error("Could not reimburse credits automatically. Please contact support."));
      }
    }
  }, [error, id, reimbursed]);

  const handleRetry = () => {
    setShowDialog(false);
    setReimbursed(false);
    setRetryCount((prev) => prev + 1);
    refetch();
  };

  const handleShare = async () => {
    if (!itinerary) return;
    const itineraryId = itinerary.id;
    const shareOptions = [
      {
        name: "Link",
        action: async () => {
          const link = `${window.location.origin}/results/${itineraryId}`;
          await navigator.clipboard.writeText(link);
          toast.success("Link copied to clipboard!");
        },
      },
      {
        name: "Email",
        action: () => {
          const subject = encodeURIComponent(
            `Check out this itinerary: ${itinerary.destination}`
          );
          const body = encodeURIComponent(
            `Hi,\n\nI wanted to share this amazing itinerary with you:\n\n${window.location.origin}/results/${itineraryId}\n\nEnjoy!`
          );
          window.open(`mailto:?subject=${subject}&body=${body}`, "_blank");
        },
      },
      {
        name: "WhatsApp",
        action: () => {
          const message = encodeURIComponent(
            `Check out this amazing itinerary for ${itinerary.destination}: ${window.location.origin}/results/${itineraryId}`
          );
          window.open(`https://wa.me/?text=${message}`, "_blank");
        },
      },
    ];

    toast.custom(
      (t) => (
        <div className="bg-white shadow-lg rounded-lg p-4">
          <h4 className="font-semibold mb-2">Share Itinerary</h4>
          <div className="space-y-2">
            {shareOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full"
                style={
                  option.name === "Link"
                    ? { backgroundColor: "#6cb3ee" }
                    : option.name === "Email"
                    ? { backgroundColor: "#a57eeb" }
                    : { backgroundColor: "#128c7e" }
                }
                onClick={() => {
                  option.action();
                  toast.dismiss(t.id);
                }}
              >
                Share via {option.name}
              </Button>
            ))}
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  const handleDownload = async () => {
    setIsGeneratingPDF(true);
    setPdfStep(0);

    const intervalId = setInterval(() => {
      setPdfStep((prevStep) => {
        if (prevStep < pdfSteps.length - 1) {
          return prevStep + 1;
        }
        return prevStep;
      });
    }, 1500);

    try {
      await generateItineraryPDF(
        itinerary,
        "/lovable-uploads/d71f9161-cfc9-4205-9f10-0ddf0c11d2b2.png"
      );
    } finally {
      clearInterval(intervalId);
      setIsGeneratingPDF(false);
      setPdfStep(0);
    }
  };

  const handleEdit = async () => {
    const url = window.location.href.split("/");
    const lastSegment = url[url.length - 1];
    navigate("/generator?id=" + lastSegment);
  };

  const toggleDay = (dayNumber: number) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayNumber]: !prev[dayNumber]
    }));
  };

  useEffect(() => {
    if (itinerary) {
      const fetchDestinationImage = async () => {
        try {
          const images = await searchImages(itinerary.destination, 1);
          if (images && images.length > 0) {
            setDestinationImage(images[0].url);
          }
        } catch (error) {
          console.error("Error fetching destination image:", error);
        }
      };

      fetchDestinationImage();
    }
  }, [itinerary]);

  // Dialog logic: open if error
  useEffect(() => {
    setShowDialog(!!error);
  }, [error]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-kultrip-purple/5 to-kultrip-orange/5">
          <div className="text-center max-w-md mx-auto px-6">
            <div className="relative mb-8">
              <div className="w-20 h-20 border-4 border-t-kultrip-purple border-gray-200 rounded-full animate-spin mx-auto"></div>
              <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-8 w-8 text-kultrip-purple animate-pulse" />
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Crafting Your Story-Driven Adventure</h3>
            <p className="text-kultrip-purple font-medium mb-4">Connecting your destination to its stories...</p>
            <p className="text-gray-500 text-sm">This may take a moment as we create something magical for you.</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !itinerary) {
    return (
      <>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogContent>
            <DialogTitle>Oops! Could not load your itinerary</DialogTitle>
            <DialogDescription>
              <span className="text-kultrip-orange font-medium">
                {error?.message || "Sorry, something went wrong!"}
              </span>
              <br />
              {reimbursed && (
                <span className="text-green-700 font-medium">
                  Your credits have been reimbursed.
                  <br />
                </span>
              )}
              Please try again, and{" "}
              <a
                href="mailto:support@kultrip.com"
                className="text-kultrip-orange underline"
              >
                get in touch
              </a>{" "}
              if the issue persists.
            </DialogDescription>
            <Button
              onClick={() => {
                setShowDialog(false);
                handleRetry();
              }}
              className="bg-kultrip-purple text-white hover:bg-kultrip-purple-dark mt-4"
            >
              Try Again
            </Button>
          </DialogContent>
        </Dialog>
        <NavBar />
        <Footer />
      </>
    );
  }

  if (isGeneratingPDF) {
    return (
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow flex items-center justify-center bg-white/70 z-50 fixed inset-0">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-kultrip-purple border-gray-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-lg text-gray-600 mb-2">{pdfSteps[pdfStep]}</p>
            <p className="text-gray-400 text-sm">Please wait while we prepare your custom travel guide PDF...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const getWeatherIcon = (description?: string, icon?: string) => {
    // If icon is provided, use it to determine the icon
    if (icon) {
      const iconLower = icon.toLowerCase();
      if (iconLower.includes('cloud')) return <Cloud className="h-5 w-5" />;
      if (iconLower.includes('rain') || iconLower.includes('shower')) return <CloudRain className="h-5 w-5" />;
      if (iconLower.includes('sun') || iconLower.includes('clear')) return <Sun className="h-5 w-5" />;
    }
    
    if (!description || description.trim() === "") {
      return <Sun className="h-5 w-5" />;
    }
    const desc = description.toLowerCase();
    if (desc.includes("cloud")) return <Cloud className="h-5 w-5" />;
    if (desc.includes("rain") || desc.includes("shower")) return <CloudRain className="h-5 w-5" />;
    return <Sun className="h-5 w-5" />;
  };

  const getStoryIcon = (inspiration: string) => {
    const lower = inspiration.toLowerCase();
    if (lower.includes("harry potter") || lower.includes("book")) return <BookOpen className="h-4 w-4" />;
    if (lower.includes("emily") || lower.includes("game of thrones") || lower.includes("movie") || lower.includes("series")) return <Film className="h-4 w-4" />;
    return <Sparkles className="h-4 w-4" />;
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />

      <main className="flex-grow pt-20">
        {/* Hero Section with Immersive Header */}
        <div className="relative">
          <div className="h-[60vh] w-full overflow-hidden relative">
            {destinationImage ? (
              <img
                src={destinationImage}
                alt={itinerary.destination}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-kultrip-purple/30 via-kultrip-purple/20 to-kultrip-orange/30"></div>
            )}
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/40 to-black/70"></div>
            
            {/* Floating Story Badge */}
            <div className="absolute top-8 left-8">
              <Badge className="bg-white/90 text-kultrip-purple border-0 backdrop-blur-sm">
                <div className="flex items-center space-x-2">
                  {getStoryIcon(itinerary.inspiration)}
                  <span className="font-medium">Story-Inspired Journey</span>
                </div>
              </Badge>
            </div>

            {/* Action Buttons */}
            <div className="absolute top-8 right-8 flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleEdit}
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleShare}
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/90 backdrop-blur-sm hover:bg-white"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            </div>

            {/* Hero Content */}
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <div className="container mx-auto">
                <div className="max-w-4xl">
                  <h1 className="font-display text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
                    {itinerary.destination}
                  </h1>
                  <div className="flex items-center space-x-2 mb-6">
                    <div className="flex items-center bg-kultrip-orange/20 backdrop-blur-sm rounded-full px-4 py-2">
                      {getStoryIcon(itinerary.inspiration)}
                      <span className="text-white font-medium ml-2">Inspired by {itinerary.inspiration}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-6 text-white/90">
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      <span>{itinerary.durationOfTrip} day{parseInt(itinerary.durationOfTrip) > 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-5 w-5 mr-2" />
                      <span className="capitalize">{itinerary.travelerType} trip</span>
                    </div>
                    <div className="flex items-center">
                      <Star className="h-5 w-5 mr-2 text-yellow-400" />
                      <span>Personalized Experience</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sidebar */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <div className="sticky top-24 space-y-6">
                
                {/* Trip Overview */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-4 flex items-center">
                      <Compass className="h-5 w-5 text-kultrip-purple mr-2" />
                      Your Journey
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <MapPin className="h-5 w-5 text-kultrip-purple mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Destination</span>
                          <p className="text-gray-800 font-medium">{itinerary.destination}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Sparkles className="h-5 w-5 text-kultrip-orange mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Story Inspiration</span>
                          <p className="text-gray-800 font-medium">{itinerary.inspiration}</p>
                        </div>
                      </div>
                      <div className="flex items-start">
                        <Clock className="h-5 w-5 text-kultrip-purple mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="text-sm font-medium text-gray-500">Duration</span>
                          <p className="text-gray-800 font-medium">
                            {itinerary.durationOfTrip} day{parseInt(itinerary.durationOfTrip) > 1 ? "s" : ""}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Weather Overview */}
                <Card className="border-0 shadow-lg">
                  <CardContent className="p-6">
                    <h3 className="font-display text-xl font-semibold mb-4 flex items-center">
                      <Sun className="h-5 w-5 text-kultrip-orange mr-2" />
                      Weather Forecast
                    </h3>
                    <div className="space-y-3">
                      {itinerary?.result?.dailyItineraries?.slice(0, 3).map((day, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-kultrip-purple/10 flex items-center justify-center mr-3 text-kultrip-purple font-semibold text-sm">
                              {day.day}
                            </div>
                            <span className="text-sm font-medium">
                              {new Date(day.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center">
                            {getWeatherIcon(day.weather?.description, day.weather?.icon)}
                            <span className="ml-2 text-sm">
                              {day.weather?.temperature != null
                                ? `${day.weather.temperature}°C`
                                : ""}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="border-0 shadow-lg bg-gradient-to-br from-kultrip-purple/5 to-kultrip-orange/5">
                  <CardContent className="p-6">
                    <h3 className="font-display text-lg font-semibold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={() => window.print()}
                      >
                        <Camera className="h-4 w-4 mr-2" />
                        Print Guide
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start"
                        onClick={handleShare}
                      >
                        <Heart className="h-4 w-4 mr-2" />
                        Save to Favorites
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              
              {/* Story Introduction */}
              {itinerary.tripSummary_en && (
                <Card className="border-0 shadow-lg mb-8 bg-gradient-to-r from-kultrip-purple/5 to-kultrip-orange/5">
                  <CardContent className="p-8">
                    <div className="flex items-center mb-4">
                      <BookOpen className="h-6 w-6 text-kultrip-purple mr-3" />
                      <h2 className="font-display text-2xl font-semibold">Your Story Begins</h2>
                    </div>
                    <div className="prose prose-lg max-w-none text-gray-700">
                      <p className="text-lg leading-relaxed">{itinerary.tripSummary_en}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Day-by-Day Itinerary */}
              <div className="space-y-6">
                {itinerary?.result?.dailyItineraries?.map((day, dayIndex) => (
                  <Card key={dayIndex} className="border-0 shadow-lg overflow-hidden">
                    
                    {/* Day Header */}
                    <div className="bg-gradient-to-r from-kultrip-purple to-kultrip-orange p-6 text-white">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-display text-2xl font-bold mb-2">
                            Day {day.day}
                          </h3>
                          <p className="text-white/90 text-lg">
                            {new Date(day.date).toLocaleDateString("en-US", {
                              weekday: "long",
                              month: "long",
                              day: "numeric",
                            })}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4">
                          {day.weather && (
                            <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                              {getWeatherIcon(day.weather.description, day.weather.icon)}
                              <span className="ml-2 text-sm">
                                {day.weather.description || ""}
                                {day.weather.temperature != null
                                  ? `, ${day.weather.temperature}°C`
                                  : ""}
                              </span>
                            </div>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => toggleDay(day.day)}
                          >
                            {expandedDays[day.day] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Day Content */}
                    <div className={`transition-all duration-300 ${expandedDays[day.day] === false ? 'max-h-0 overflow-hidden' : 'max-h-none'}`}>
                      
                      {/* Places/Activities */}
                      <div className="p-6 space-y-6">
                        {day.places && day.places.length > 0 ? (
                          day.places.map((place, placeIndex) => (
                            <PlaceCard 
                              key={placeIndex} 
                              place={place}
                              googleMapsApiKey={itinerary.googleMapsApiKey}
                            />
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No places scheduled for this day
                          </div>
                        )}
                      </div>
                    </div>

                  </Card>
                ))}
              </div>

              {/* Call to Action */}
              <Card className="border-0 shadow-lg mt-12 bg-gradient-to-r from-kultrip-purple to-kultrip-orange text-white">
                <CardContent className="p-8 text-center">
                  <h3 className="font-display text-2xl font-bold mb-4">Ready for Your Adventure?</h3>
                  <p className="text-white/90 mb-6 text-lg">
                    Your story-driven journey awaits. Download your guide and start exploring!
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                      size="lg" 
                      className="bg-white text-kultrip-purple hover:bg-gray-100"
                      onClick={handleDownload}
                    >
                      <Download className="h-5 w-5 mr-2" />
                      Download PDF Guide
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      className="border-white text-white hover:bg-white/10"
                      onClick={handleShare}
                    >
                      <Share2 className="h-5 w-5 mr-2" />
                      Share Your Journey
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media print {
          nav, footer, button, .no-print {
            display: none !important;
          }
          body, html {
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .container {
            width: 100% !important;
            max-width: 100% !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .print-break-after {
            page-break-after: always;
          }
        }
      `,
        }}
      />
    </div>
  );
};

export default Results;
