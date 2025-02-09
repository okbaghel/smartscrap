import { auth } from "@clerk/nextjs";  // Clerk authentication
import User from "@/models/User";
import dbConnect from "@/lib/dbConnect"; // Ensure DB connection

export async function GET(req) {
  await dbConnect();
  const { userId } = auth(); // Get logged-in Clerk user ID

  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const user = await User.findOne({ clerkId: userId });
  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  return Response.json({ creditPoints: user.creditPoints });
}

export async function POST(req) {
  await dbConnect();
  const { userId } = auth();
  if (!userId) return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { points } = await req.json();
  const user = await User.findOne({ clerkId: userId });

  if (!user) return Response.json({ error: "User not found" }, { status: 404 });

  user.creditPoints += points;
  await user.save();

  return Response.json({ creditPoints: user.creditPoints });
}
