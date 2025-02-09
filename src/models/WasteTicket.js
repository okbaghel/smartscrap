import mongoose from "mongoose";

const WasteTicketSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  imageUrl: { type: String, required: true },
  weight: { type: Number, required: true },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  ticketId: { type: String, unique: true, required: true }, // Unique Ticket ID
  status: { type: String, default: "Pending" },
}, { timestamps: true });

export default mongoose.models.WasteTicket || mongoose.model("WasteTicket", WasteTicketSchema);
