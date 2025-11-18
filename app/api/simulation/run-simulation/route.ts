import { NextRequest, NextResponse } from "next/server"

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000"
const PPO_VERSION = "500k_steps" // Options: "v1.5", "v2.0_lite", "500k_steps", "v2.0"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.grid || !Array.isArray(body.grid)) {
      return NextResponse.json(
        { error: "Invalid grid data" },
        { status: 400 }
      )
    }

    // Validate constraints based on PPO version
    if (PPO_VERSION === "v1.5") {
      if (body.exits && body.exits.length > 40) {
        return NextResponse.json(
          { error: "Maximum 40 exits allowed (PPO v1.5 constraint)" },
          { status: 400 }
        )
      }

      if (body.agent_positions && body.agent_positions.length > 5) {
        return NextResponse.json(
          { error: "Maximum 5 agents allowed (PPO v1.5 constraint)" },
          { status: 400 }
        )
      }
    } else {
      // v2.0 supports up to 248 exits and 10 agents
      if (body.exits && body.exits.length > 248) {
        return NextResponse.json(
          { error: "Maximum 248 exits allowed (PPO v2.0 constraint)" },
          { status: 400 }
        )
      }

      if (body.agent_positions && body.agent_positions.length > 10) {
        return NextResponse.json(
          { error: "Maximum 10 agents allowed (PPO v2.0 constraint)" },
          { status: 400 }
        )
      }
    }

    // Forward to Python backend
    const response = await fetch(`${BACKEND_URL}/api/run-simulation`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Backend error:", errorText)
      return NextResponse.json(
        { error: "Failed to start simulation" },
        { status: response.status }
      )
    }

    const result = await response.json()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Run simulation error:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}
