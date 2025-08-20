import { NextRequest, NextResponse } from "next/server";

export function validateApiKey(request: NextRequest): boolean {
  const apiKey = request.headers.get("x-api-key");
  const expectedApiKey = process.env.API_KEY;

  if (!expectedApiKey) {
    console.error("API_KEY environment variable is not set");
    return false;
  }

  if (!apiKey || apiKey !== expectedApiKey) {
    return false;
  }

  return true;
}

export function createUnauthorizedResponse(): NextResponse {
  return NextResponse.json(
    { error: "Unauthorized - Invalid or missing API key" },
    { status: 401 }
  );
}
