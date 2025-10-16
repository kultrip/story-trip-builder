import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@radix-ui/react-dialog";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Map from "@/components/ui/Map";
import ItineraryCard from "@/components/ItineraryCard";
import { generateItineraryPDF } from "@/utils/generateItineraryPDF.js"
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
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
  Navigation,
  Camera,
  Coffee,
  Utensils,
  ShoppingBag,
  Compass,
  Globe,
  ArrowRight,
  PlayCircle,
  Eye,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Itinerary, Activity, DayPlan, Location } from "@/utils/types";
import { searchImages } from "@/services/imageService";
import { useNavigate } from "react-router-dom";

const Results = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [activeDay, setActiveDay] = useState(1);
  const [mapLocations, setMapLocations] = useState<Location[]>([]);
  const [destinationImage, setDestinationImage] = useState("");
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({});
  const [currentImageIndex, setCurrentImageIndex] = useState<{[key: string]: number}>({});
  const [retryCount, setRetryCount] = useState(0);
  const [viewMode, setViewMode] = useState<'standard' | 'markdown'>('standard');

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

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const nextImage = (activityId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [activityId]: ((prev[activityId] || 0) + 1) % totalImages
    }));
  };

  const prevImage = (activityId: string, totalImages: number) => {
    setCurrentImageIndex(prev => ({
      ...prev,
      [activityId]: ((prev[activityId] || 0) - 1 + totalImages) % totalImages
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

  useEffect(() => {
    if (itinerary) {
      const day = itinerary?.days?.find((d) => d.day === activeDay);
      if (day) {
        const locations: Location[] = [
          ...day.morningActivities.map((a) => a.location),
          ...day.afternoonActivities.map((a) => a.location),
          ...day.eveningActivities.map((a) => a.location),
        ];
        setMapLocations(locations);
      }
    }
  }, [activeDay, itinerary]);

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

  const getWeatherIcon = (description) => {
    if (Array.isArray(description)) {
      description = description.find((item) => typeof item === "string") || "";
    }
    if (typeof description !== "string" || description.trim() === "") {
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

  const generateMarkdownView = () => {
    if (!itinerary) return "";

    let markdown = `<div class="prose prose-lg max-w-none p-8">`;
    
    // Header
    markdown += `<h1 class="text-4xl font-bold text-kultrip-purple mb-2">Inspired Trip Itinerary: ${itinerary.destination}</h1>`;
    markdown += `<p class="text-lg text-gray-700 mb-6"><strong>Theme:</strong> ${itinerary.inspiration} | <strong>Duration:</strong> ${itinerary.durationOfTrip} Days</p>`;
    markdown += `<hr class="my-8 border-gray-300" />`;

    // Trip Summary if available
    if (itinerary.tripSummary_en) {
      markdown += `<div class="bg-gradient-to-r from-kultrip-purple/5 to-kultrip-orange/5 p-6 rounded-lg mb-8">`;
      markdown += `<p class="text-gray-700 leading-relaxed italic">${itinerary.tripSummary_en}</p>`;
      markdown += `</div>`;
    }

    // Days
    itinerary.days?.forEach((day, dayIndex) => {
      const dateFormatted = new Date(day.date).toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      });

      markdown += `<h2 class="text-3xl font-bold text-kultrip-purple mt-12 mb-4">Day ${day.day}: ${dateFormatted}</h2>`;
      
      // Weather info
      if (day.weatherInfo) {
        markdown += `<p class="text-gray-600 mb-6"><strong>Weather:</strong> ${day.weatherInfo.description || "N/A"}${day.weatherInfo.temperature ? `, ${day.weatherInfo.temperature}°C` : ""}</p>`;
      }

      // Process all activities
      const allActivities = [
        ...day.morningActivities.map(a => ({ ...a, period: 'Morning' })),
        ...day.afternoonActivities.map(a => ({ ...a, period: 'Afternoon' })),
        ...day.eveningActivities.map(a => ({ ...a, period: 'Evening' }))
      ];

      allActivities.forEach((activity) => {
        markdown += `<div class="my-8 p-6 bg-gray-50 rounded-lg">`;
        markdown += `<h3 class="text-2xl font-semibold text-gray-800 mb-2">📍 ${activity.title}</h3>`;
        markdown += `<p class="text-sm text-kultrip-purple mb-3"><em>${activity.period} - ${activity.time}</em></p>`;
        
        // Description
        if (activity.description) {
          markdown += `<p class="text-gray-700 mb-4 leading-relaxed">${activity.description}</p>`;
        }

        // Practical Information
        if (activity.location) {
          markdown += `<h4 class="text-lg font-semibold text-gray-800 mt-4 mb-3">ℹ️ Practical Information</h4>`;
          markdown += `<ul class="list-disc list-inside space-y-2 text-gray-700">`;
          
          if (activity.location.name) {
            markdown += `<li><strong>Location:</strong> ${activity.location.name}</li>`;
          }
          if (activity.location.address) {
            markdown += `<li><strong>Address:</strong> ${activity.location.address}</li>`;
          }
          if (activity.location.openingHours) {
            const hours = Array.isArray(activity.location.openingHours) 
              ? activity.location.openingHours.join(", ") 
              : activity.location.openingHours;
            markdown += `<li><strong>Hours:</strong> ${hours}</li>`;
          }
          if (activity.location.website) {
            markdown += `<li><strong>Website:</strong> <a href="${activity.location.website}" target="_blank" rel="noopener noreferrer" class="text-kultrip-purple hover:underline">${activity.location.website}</a></li>`;
          }
          if (activity.location.pricing) {
            markdown += `<li><strong>Price:</strong> ${activity.location.pricing}</li>`;
          }
          
          markdown += `</ul>`;

          // Story reference if available
          if (activity.location.inspirationReference) {
            markdown += `<div class="mt-4 p-3 bg-kultrip-purple/10 rounded border-l-4 border-kultrip-purple">`;
            markdown += `<p class="text-sm text-kultrip-purple italic">${activity.location.inspirationReference}</p>`;
            markdown += `</div>`;
          }
        }
        
        markdown += `</div>`;
      });

      markdown += `<hr class="my-8 border-gray-300" />`;
    });

    markdown += `</div>`;
    return markdown;
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
                className={`backdrop-blur-sm ${viewMode === 'markdown' ? 'bg-kultrip-purple text-white hover:bg-kultrip-purple-dark' : 'bg-white/90 hover:bg-white'}`}
                onClick={() => setViewMode(viewMode === 'standard' ? 'markdown' : 'standard')}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                {viewMode === 'standard' ? 'Markdown View' : 'Standard View'}
              </Button>
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
          {viewMode === 'markdown' ? (
            // Markdown View
            <div className="max-w-5xl mx-auto">
              <Card className="border-0 shadow-lg">
                <CardContent className="p-0">
                  <div 
                    dangerouslySetInnerHTML={{ __html: generateMarkdownView() }}
                  />
                </CardContent>
              </Card>
            </div>
          ) : (
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
                      {itinerary?.days?.slice(0, 3).map((day, index) => (
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
                            {getWeatherIcon(day.weatherInfo?.description)}
                            <span className="ml-2 text-sm">
                              {day.weatherInfo?.temperature != null
                                ? `${day.weatherInfo.temperature}°C`
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
                {itinerary?.days?.map((day, dayIndex) => (
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
                          <div className="flex items-center bg-white/20 rounded-full px-3 py-1">
                            {getWeatherIcon(day.weatherInfo?.description)}
                            <span className="ml-2 text-sm">
                              {day.weatherInfo?.description || ""}
                              {day.weatherInfo?.temperature != null
                                ? `, ${day.weatherInfo.temperature}°C`
                                : ""}
                            </span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-white/20"
                            onClick={() => toggleSection(`day-${day.day}`)}
                          >
                            {expandedSections[`day-${day.day}`] ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>

                    {/* Day Content */}
                    <div className={`transition-all duration-300 ${expandedSections[`day-${day.day}`] ? 'max-h-none' : 'max-h-96 overflow-hidden'}`}>
                      
                      {/* Map Section */}
                      <div className="p-6 bg-gray-50">
                        <div className="flex items-center mb-4">
                          <Navigation className="h-5 w-5 text-kultrip-purple mr-2" />
                          <h4 className="font-semibold text-gray-800">Today's Locations</h4>
                        </div>
                        <div className="rounded-lg overflow-hidden shadow-sm">
                          <Map
                            locations={[
                              ...day.morningActivities.map((a) => a.location),
                              ...day.afternoonActivities.map((a) => a.location),
                              ...day.eveningActivities.map((a) => a.location),
                            ].filter(
                              (loc) =>
                                loc &&
                                typeof loc.lat === "number" && !isNaN(loc.lat) &&
                                typeof loc.lng === "number" && !isNaN(loc.lng)
                            )}
                            zoom={13}
                            interactive={true}
                            className="h-64"
                          />
                        </div>
                      </div>

                      {/* Activities Timeline */}
                      <div className="p-6">
                        <div className="space-y-8">
                          
                          {/* Morning */}
                          <div className="relative">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 flex items-center justify-center mr-4 shadow-lg">
                                <Sun className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-display text-xl font-semibold text-gray-800">Morning</h4>
                                <p className="text-gray-500 text-sm">Start your day with wonder</p>
                              </div>
                            </div>
                            <div className="ml-16 space-y-4">
                              {day.morningActivities.map((activity, actIndex) => (
                                <ActivityCard 
                                  key={actIndex} 
                                  activity={activity} 
                                  currentImageIndex={currentImageIndex}
                                  nextImage={nextImage}
                                  prevImage={prevImage}
                                />
                              ))}
                            </div>
                          </div>

                          <Separator className="my-8" />

                          {/* Afternoon */}
                          <div className="relative">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-kultrip-purple to-kultrip-orange flex items-center justify-center mr-4 shadow-lg">
                                <Clock className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-display text-xl font-semibold text-gray-800">Afternoon</h4>
                                <p className="text-gray-500 text-sm">Dive deeper into the story</p>
                              </div>
                            </div>
                            <div className="ml-16 space-y-4">
                              {day.afternoonActivities.map((activity, actIndex) => (
                                <ActivityCard 
                                  key={actIndex} 
                                  activity={activity} 
                                  currentImageIndex={currentImageIndex}
                                  nextImage={nextImage}
                                  prevImage={prevImage}
                                />
                              ))}
                            </div>
                          </div>

                          <Separator className="my-8" />

                          {/* Evening */}
                          <div className="relative">
                            <div className="flex items-center mb-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center mr-4 shadow-lg">
                                <Moon className="h-6 w-6 text-white" />
                              </div>
                              <div>
                                <h4 className="font-display text-xl font-semibold text-gray-800">Evening</h4>
                                <p className="text-gray-500 text-sm">End with magical moments</p>
                              </div>
                            </div>
                            <div className="ml-16 space-y-4">
                              {day.eveningActivities.map((activity, actIndex) => (
                                <ActivityCard 
                                  key={actIndex} 
                                  activity={activity} 
                                  currentImageIndex={currentImageIndex}
                                  nextImage={nextImage}
                                  prevImage={prevImage}
                                />
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Expand/Collapse Footer */}
                    {!expandedSections[`day-${day.day}`] && (
                      <div className="p-4 bg-gray-50 border-t">
                        <Button
                          variant="ghost"
                          className="w-full text-kultrip-purple hover:bg-kultrip-purple/5"
                          onClick={() => toggleSection(`day-${day.day}`)}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          View Full Day Details
                          <ChevronDown className="h-4 w-4 ml-2" />
                        </Button>
                      </div>
                    )}
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
          )}
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

// Enhanced Activity Card Component with console.info for image debugging
const ActivityCard: React.FC<{
  activity: Activity;
  currentImageIndex: { [key: string]: number };
  nextImage: (activityId: string, totalImages: number) => void;
  prevImage: (activityId: string, totalImages: number) => void;
}> = ({ activity, currentImageIndex, nextImage, prevImage }) => {
  const [expanded, setExpanded] = useState(false);

  // Gather all possible images from activity and location
  const images: string[] = (
    (Array.isArray(activity.images) && activity.images.length > 0)
      ? activity.images
      : (activity.image ? [activity.image] : [])
  ).concat(
    (activity.location && Array.isArray(activity.location.images) && activity.location.images.length > 0)
      ? activity.location.images
      : (activity.location && activity.location.image ? [activity.location.image] : [])
  );

  // Remove duplicates
  const uniqueImages = Array.from(new Set(images));
  const currentIndex = currentImageIndex[activity.id] || 0;

  // Logging images to console for debugging
  useEffect(() => {
    if (!uniqueImages.length) {
      // No images found for activity
      console.info(`[Itinerary][ActivityCard] No images for activity "${activity.title}" (ID: ${activity.id})`);
    } else {
      uniqueImages.forEach((imgUrl, idx) => {
        // Try to check image loadability using JS Image object (status: found or not)
        const img = new window.Image();
        img.onload = () =>
          console.info(`[Itinerary][ActivityCard] Image found for activity "${activity.title}" (ID: ${activity.id}): ${imgUrl} [status: FOUND]`);
        img.onerror = () =>
          console.info(`[Itinerary][ActivityCard] Image NOT found for activity "${activity.title}" (ID: ${activity.id}): ${imgUrl} [status: NOT FOUND]`);
        img.src = imgUrl;
      });
    }
  }, [activity.id, activity.title, uniqueImages]);

  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
        {/* Image Section */}
        <div className="md:col-span-1 relative h-48 md:h-auto">
          {uniqueImages.length > 0 ? (
            <div className="relative h-full">
              <img
                src={uniqueImages[currentIndex]}
                alt={activity.title}
                className="w-full h-full object-cover"
                style={{ minHeight: 192, maxHeight: 320, objectFit: "cover" }}
              />
              {uniqueImages.length > 1 && (
                <>
                  <button
                    onClick={() => prevImage(activity.id, uniqueImages.length)}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => nextImage(activity.id, uniqueImages.length)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 text-white rounded-full p-1 hover:bg-black/70 transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                    {uniqueImages.map((_, idx) => (
                      <div
                        key={idx}
                        className={`w-2 h-2 rounded-full ${
                          idx === currentIndex ? "bg-white" : "bg-white/50"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
              <div className="absolute top-3 left-3 bg-kultrip-purple/90 text-white text-xs font-medium px-2 py-1 rounded-full">
                {activity.time}
              </div>
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-kultrip-purple/20 to-kultrip-orange/20 flex items-center justify-center">
              <Camera className="h-12 w-12 text-kultrip-purple/50" />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="md:col-span-2 p-6">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-display text-xl font-semibold text-gray-800 leading-tight">
              {activity.title}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-kultrip-purple hover:bg-kultrip-purple/5 flex-shrink-0 ml-4"
            >
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>

          <div className={`text-gray-600 leading-relaxed ${expanded ? "" : "line-clamp-3"}`}>
            <p>{activity.description}</p>
          </div>

          {activity.location && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-kultrip-purple mr-2 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">{activity.location.name}</h4>
                  <p className="text-xs text-gray-500 mb-2">{activity.location.address}</p>

                  {activity.location.inspirationReference && (
                    <p className="text-xs italic text-kultrip-purple mb-2 bg-kultrip-purple/5 px-2 py-1 rounded">
                      {activity.location.inspirationReference}
                    </p>
                  )}

                  {expanded && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
                      {activity.location.openingHours && (
                        <div className="flex items-start">
                          <Clock className="h-3 w-3 mr-1 mt-0.5 text-kultrip-purple flex-shrink-0" />
                          <div>
                            <span className="font-medium">Hours:</span>
                            <div className="text-gray-600">
                              {Array.isArray(activity.location.openingHours)
                                ? activity.location.openingHours.join(", ")
                                : activity.location.openingHours}
                            </div>
                          </div>
                        </div>
                      )}

                      {activity.location.pricing && (
                        <div className="flex items-center">
                          <Coffee className="h-3 w-3 mr-1 text-green-500" />
                          <span className="font-medium mr-1">Price:</span>
                          <span className="text-gray-600">{activity.location.pricing}</span>
                        </div>
                      )}

                      {activity.location.website && (
                        <div className="flex items-center">
                          <Globe className="h-3 w-3 mr-1 text-kultrip-purple" />
                          <a
                            href={activity.location.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-kultrip-purple hover:underline"
                          >
                            Visit Website
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activity.bookingUrl && (
            <div className="mt-4">
              <Button
                size="sm"
                className="bg-kultrip-orange hover:bg-kultrip-orange/90 text-white"
                onClick={() => window.open(activity.bookingUrl, "_blank")}
              >
                <PlayCircle className="h-4 w-4 mr-2" />
                Book Experience
              </Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

const Moon = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" />
  </svg>
);

export default Results;
