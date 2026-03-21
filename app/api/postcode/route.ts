import { NextRequest, NextResponse } from "next/server";
import { resolveAddressDetailsFromPostcode } from "@/lib/geocoding";

export async function GET(request: NextRequest) {
  const postCode = request.nextUrl.searchParams.get("postCode")?.trim() || "";
  const countryCode = request.nextUrl.searchParams.get("countryCode")?.trim() || undefined;

  if (!postCode) {
    return NextResponse.json({ message: "postCode is required" }, { status: 400 });
  }

  const result = await resolveAddressDetailsFromPostcode(postCode, countryCode);

  if (!result) {
    return NextResponse.json({ message: "No address found for this postcode" }, { status: 404 });
  }

  return NextResponse.json(
    {
      address: result.bestMatch.formatted,
      bestMatch: result.bestMatch,
      candidates: result.candidates,
    },
    { status: 200 },
  );
}
