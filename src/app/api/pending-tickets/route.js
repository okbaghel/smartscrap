import { NextResponse } from 'next/server';
import {connectDB} from '@/lib/mongodb'

import WasteTicket from '@/models/WasteTicket';

export async function GET(req) {
    try {
      // Connect to the database
      await connectDB();



  
      // Get userId from query parameters
    //   const { searchParams } = new URL(req.url);
    //   const userId = searchParams.get('userId'); // This gets the query parameter
  
    //   if (!userId) {
    //     return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    //   }
  
      // Fetch tickets from the database based on the userId
      const tickets = await WasteTicket.find({ status: "Pending" });
  
      // If no tickets found
      if (!tickets) {
        return NextResponse.json({ message: 'No tickets found for this user' }, { status: 404 });
      }
  
      // Return the tickets in the response
      return NextResponse.json({ tickets }, { status: 200 });
  
    } catch (error) {
      console.error('Error fetching tickets:', error);
      return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
  }