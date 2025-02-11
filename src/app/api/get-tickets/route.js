import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import WasteTicket from '@/models/WasteTicket';

export async function GET(req) {
  try {
    await connectDB(); // Ensure DB is connected

    // Get userId from query parameters
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Fetch tickets from the database based on userId
    const tickets = await WasteTicket.find({ userId });

    // If no tickets found
    if (!tickets.length) {
      return NextResponse.json({ message: 'No tickets found for this user' }, { status: 404 });
    }

    return NextResponse.json({ tickets }, { status: 200 });

  } catch (error) {
    console.error('❌ Error fetching tickets:', error);
    return NextResponse.json({ error: 'Server Error' }, { status: 500 });
  }
}
