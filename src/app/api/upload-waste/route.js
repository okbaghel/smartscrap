import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import WasteTicket from "@/models/WasteTicket";
import cloudinary from "@/lib/cloudinary";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    await connectDB();

    const formData = await req.formData();
    const userId = formData.get("userId");
    const weight = parseFloat(formData.get("weight"));
    const lat = parseFloat(formData.get("lat"));
    const lng = parseFloat(formData.get("lng"));
    const image = formData.get("image");

    if (!userId || !weight || !lat || !lng || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Convert file to buffer for Cloudinary
    const arrayBuffer = await image.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(`data:image/jpeg;base64,${buffer.toString("base64")}`);
    const ticketId = uuidv4().replace(/-/g, "").substring(0, 10).toUpperCase(); 
    // console.log(ticketId);

    // Save ticket in MongoDB
    const newTicket = new WasteTicket({
      userId,
      imageUrl: uploadResponse.secure_url,
      weight,
      location: { lat, lng },
      ticketId,
      status: "Pending",
    });

    await newTicket.save();

    return NextResponse.json({ message: "Waste uploaded successfully", ticket: newTicket }, { status: 201 });
  } catch (error) {
    console.error("Upload Waste Error:", error);
    return NextResponse.json({ error: "Server Error" }, { status: 500 });
  }
}
