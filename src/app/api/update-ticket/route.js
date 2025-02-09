import { connectDB } from "@/lib/mongodb";
import WasteTicket from "@/models/WasteTicket";
import { NextResponse } from "next/server";

export async function PATCH(req) {
  try {
    await connectDB();
    const { ticketId, status } = await req.json();

    if (status === "Rejected") {
      // Delete the ticket if it's rejected
      await WasteTicket.findOneAndDelete({ ticketId });
      return NextResponse.json({ message: "Ticket rejected and deleted" }, { status: 200 });
    } else {
      // Update ticket status to Approved or Pending
      await WasteTicket.findOneAndUpdate({ ticketId }, { status });
      return NextResponse.json({ message: `Ticket status updated to ${status}` }, { status: 200 });
    }
  } catch (error) {
    console.error("Error updating ticket status:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
