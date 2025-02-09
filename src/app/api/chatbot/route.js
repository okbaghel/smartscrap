import { NextResponse } from "next/server";
import axios from "axios";

const GEMINI_API_KEY = process.env.local.GEMINI_API_KEY;

export async function POST(req) {
  try {
    const { message } = await req.json();

    console.log("User Message:", message);

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ role: "user", parts: [{ text: message }] }],
      }
    );

    console.log("Full API Response:", response.data);

    // Ensure response exists
    if (
      response.data &&
      response.data.candidates &&
      response.data.candidates[0] &&
      response.data.candidates[0].content &&
      response.data.candidates[0].content.parts
    ) {
      const reply = response.data.candidates[0].content.parts
        .map((part) => part.text)
        .join(" ");

      return NextResponse.json({ reply });
    } else {
      return NextResponse.json({ reply: "I couldn't process that. Try again." });
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json({ reply: "Error fetching response.", error: error.message }, { status: 500 });
  }
}
