import { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

const BACKEND_URL = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();
    
    // Forward the request to the FastAPI backend
    const backendResponse = await fetch(`${BACKEND_URL}/api/chatbot/ai-response`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!backendResponse.ok) {
      throw new Error(`Backend error: ${backendResponse.status}`);
    }

    const data = await backendResponse.json();
    
    return NextResponse.json({ response: data.response });
  } catch (error) {
    console.error('Error calling chatbot backend:', error);
    return NextResponse.json(
      { 
        response: "I'm sorry, I encountered an error processing your request. Please try again later." 
      },
      { status: 500 }
    );
  }
}
