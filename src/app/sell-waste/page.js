"use client";
import { useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, MapPin, Image as ImageIcon } from "lucide-react";
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

  // Get user’s location
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
    <div className="p-6 space-y-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold">Sell Your Waste</h1>

      <div className="space-y-4">
        <Input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Selected Waste"
            width={200}
            height={200}
            className="rounded-lg"
          />
        )}

        <Input
          type="number"
          placeholder="Weight (kg)"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
        />

        <Button onClick={handleGetLocation} className="flex items-center">
          <MapPin className="mr-2" /> Get My Location
        </Button>
        {location.lat && location.lng && (
          <p className="text-sm">📍 {location.lat}, {location.lng}</p>
        )}

        <Button onClick={handleSubmit} disabled={loading} className="flex items-center w-full">
          <Upload className="mr-2" /> {loading ? "Uploading..." : "Upload Waste"}
        </Button>
      </div>

      {ticket && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold">Waste Ticket</h2>
            <p><strong>Ticket ID:</strong> {ticket.ticketId}</p>
            <p><strong>Weight:</strong> {ticket.weight} kg</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
