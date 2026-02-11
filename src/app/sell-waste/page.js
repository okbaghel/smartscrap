"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, Image as ImageIcon, Sparkles, Weight, CheckCircle, Loader2, X, FileImage, Ticket } from "lucide-react";
import Image from "next/image";
import { toast } from "react-hot-toast"; // ✅ Import toast

export default function SellWastePage() {
  const { user, isLoaded } = useUser();
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [weight, setWeight] = useState("");
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [loading, setLoading] = useState(false);
  const [ticket, setTicket] = useState(null);

  // Handle image selection
  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // Remove selected image
  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
  };

  // Get user's location
  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          toast.success("Location fetched successfully!"); // ✅ Show success toast
        },
        (error) => {
          toast.error("Failed to fetch location."); // ❌ Show error toast
        }
      );
    } else {
      toast.error("Geolocation is not supported by your browser.");
    }
  };

  // Submit waste details
  const handleSubmit = async () => {
    if (!image || !weight || !location.lat || !location.lng) {
      toast.error("Please provide all required details."); // ❌ Show validation error
      return;
    }

    setLoading(true);
    const loadingToast = toast.loading("Uploading waste..."); // ⏳ Show loading toast

    const formData = new FormData();
    formData.append("userId", user.id);
    formData.append("weight", weight);
    formData.append("lat", location.lat);
    formData.append("lng", location.lng);
    formData.append("image", image);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/upload-waste`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Failed to upload waste");

      const data = await response.json();
      setTicket(data.ticket);
      toast.success("Waste uploaded successfully!"); // ✅ Show success toast
    } catch (error) {
      toast.error("Error uploading waste."); // ❌ Show error toast
    } finally {
      setLoading(false);
      toast.dismiss(loadingToast); // 🛑 Remove loading toast
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-emerald-950/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-6 lg:space-y-8">
        
        {/* Header Section */}
        <div className="text-center space-y-3 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-cyan-500/10 blur-3xl -z-10"></div>
          <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4" />
            <span>Sell Your Waste</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-emerald-800 to-teal-800 dark:from-slate-100 dark:via-emerald-200 dark:to-teal-200 bg-clip-text text-transparent">
            Turn Your Waste Into Cash
          </h1>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Upload waste images, add details, and generate a ticket to sell to recycling companies
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload Form Section */}
          <div className="space-y-6">
            {/* Image Upload Card */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-lg">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Upload Waste Image</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Take a clear photo of your waste</p>
                  </div>
                </div>

                {!imagePreview ? (
                  <div className="relative border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    />
                    <div className="p-8 sm:p-12 text-center space-y-3">
                      <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white shadow-xl">
                        <FileImage className="w-8 h-8" />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-900 dark:text-white mb-1">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          PNG, JPG, GIF up to 10MB
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-900 border-2 border-emerald-500">
                    <div className="relative w-full h-64 sm:h-80">
                      <Image
                        src={imagePreview}
                        alt="Selected Waste"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button
                      onClick={removeImage}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white shadow-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          Image ready
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Weight Input Card */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg">
                    <Weight className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Enter Weight</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Approximate weight of waste</p>
                  </div>
                </div>

                <div className="relative">
                  <Input
                    type="number"
                    placeholder="Enter weight in kg"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="pl-4 pr-12 h-14 text-lg border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-500 rounded-xl"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">
                    kg
                  </div>
                </div>

                {weight && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      📦 Estimated weight: <span className="font-bold">{weight} kg</span>
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Location Card */}
            <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800/50 backdrop-blur-sm">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="p-6 relative z-10 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-lg">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Location</h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Share your current location</p>
                  </div>
                </div>

                <Button
                  onClick={handleGetLocation}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white h-14 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
                >
                  <MapPin className="mr-2 w-5 h-5" />
                  Get My Location
                </Button>

                {location.lat && location.lng && (
                  <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-purple-900 dark:text-purple-100 mb-1">
                          Location captured
                        </p>
                        <p className="text-xs text-purple-700 dark:text-purple-300 font-mono break-all">
                          📍 {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Button
              onClick={handleSubmit}
              disabled={loading || !image || !weight || !location.lat}
              className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white h-16 text-lg font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
              <span className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-6 h-6" />
                    Upload Waste
                  </>
                )}
              </span>
            </Button>
          </div>

          {/* Ticket Display Section */}
          <div className="lg:sticky lg:top-8 h-fit">
            {ticket ? (
              <Card className="group relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                  }}></div>
                </div>
                <CardContent className="p-8 relative z-10 space-y-6">
                  <div className="text-center space-y-2">
                    <div className="inline-flex p-4 rounded-2xl bg-white/20 backdrop-blur-sm">
                      <Ticket className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold">Waste Ticket Generated!</h2>
                    <p className="text-emerald-100">Your waste has been successfully uploaded</p>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-emerald-100 text-sm mb-1">Ticket ID</p>
                      <p className="text-2xl font-bold font-mono">{ticket.ticketId}</p>
                    </div>

                    <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                      <p className="text-emerald-100 text-sm mb-1">Weight</p>
                      <p className="text-2xl font-bold">{ticket.weight} kg</p>
                    </div>

                    <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
                      <div className="flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        <p className="font-semibold">Next Steps</p>
                      </div>
                      <ul className="text-sm text-emerald-100 space-y-1">
                        <li>✓ Ticket saved to your account</li>
                        <li>✓ Companies will be notified</li>
                        <li>✓ Await pickup confirmation</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-0 shadow-xl bg-white dark:bg-slate-800/50 backdrop-blur-sm">
                <CardContent className="p-8 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-2xl bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-600">
                    <Ticket className="w-12 h-12 text-slate-600 dark:text-slate-300" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">No Ticket Yet</h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Complete the form and upload your waste to generate a ticket
                    </p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-4 text-sm text-slate-600 dark:text-slate-400">
                    <p className="font-semibold mb-2">📋 Required Information:</p>
                    <ul className="text-left space-y-1">
                      <li className={image ? "text-emerald-600 dark:text-emerald-400" : ""}>
                        {image ? "✓" : "○"} Upload waste image
                      </li>
                      <li className={weight ? "text-emerald-600 dark:text-emerald-400" : ""}>
                        {weight ? "✓" : "○"} Enter weight
                      </li>
                      <li className={location.lat ? "text-emerald-600 dark:text-emerald-400" : ""}>
                        {location.lat ? "✓" : "○"} Share location
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}