const GEOAPIFY_POSTCODE_ENDPOINT = "https://api.geoapify.com/v1/postcode/search";
const GEOAPIFY_GEOCODE_ENDPOINT = "https://api.geoapify.com/v1/geocode/search";

type GeoapifyResult = {
  properties?: {
    formatted?: string;
    address_line1?: string;
    address_line2?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    country_code?: string;
  };
};

export type PostcodeAddressCandidate = {
  formatted: string;
  addressLine1: string | null;
  addressLine2: string | null;
  city: string | null;
  state: string | null;
  postcode: string | null;
  country: string | null;
  countryCode: string | null;
};

export type PostcodeAddressLookup = {
  bestMatch: PostcodeAddressCandidate;
  candidates: PostcodeAddressCandidate[];
};

type GeoapifyFeatureCollection = {
  features?: GeoapifyResult[];
};

async function fetchGeoapifyFeatures(endpoint: string, params: URLSearchParams) {
  const response = await fetch(`${endpoint}?${params.toString()}`, {
    headers: {
      "User-Agent": "nextAuth_complete_template/1.0 (local dev)",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return [] as GeoapifyResult[];
  }

  const data = (await response.json()) as GeoapifyFeatureCollection;
  return data?.features || [];
}

function toCandidate(feature: GeoapifyResult): PostcodeAddressCandidate | null {
  const properties = feature.properties;
  const formatted = properties?.formatted?.trim();
  if (!formatted) return null;

  return {
    formatted,
    addressLine1: properties?.address_line1?.trim() || null,
    addressLine2: properties?.address_line2?.trim() || null,
    city: properties?.city?.trim() || null,
    state: properties?.state?.trim() || null,
    postcode: properties?.postcode?.trim() || null,
    country: properties?.country?.trim() || null,
    countryCode: properties?.country_code?.trim().toLowerCase() || null,
  };
}

async function fetchPostcodeCandidates(normalizedPostCode: string, apiKey: string, configuredCountryCode?: string) {
  const postcodeParams = new URLSearchParams({
    postcode: normalizedPostCode,
    geometry: "original",
    apiKey,
  });

  if (configuredCountryCode) {
    postcodeParams.set("countrycode", configuredCountryCode);
  }

  // Geoapify postcode endpoint can return no features for valid values, so we fallback to geocode search.
  let features = await fetchGeoapifyFeatures(GEOAPIFY_POSTCODE_ENDPOINT, postcodeParams);

  if (features.length === 0) {
    const geocodeParams = new URLSearchParams({
      text: normalizedPostCode,
      apiKey,
    });

    if (configuredCountryCode) {
      geocodeParams.set("filter", `countrycode:${configuredCountryCode}`);
    }

    features = await fetchGeoapifyFeatures(GEOAPIFY_GEOCODE_ENDPOINT, geocodeParams);
  }

  return features.map(toCandidate).filter((candidate): candidate is PostcodeAddressCandidate => !!candidate);
}

export async function resolveAddressDetailsFromPostcode(postCode: string, countryCode?: string): Promise<PostcodeAddressLookup | null> {
  const normalizedPostCode = postCode.trim();
  if (!normalizedPostCode) return null;

  const apiKey = process.env.GEOAPIFY_API_KEY?.trim();
  if (!apiKey) {
    console.error("GEOAPIFY_API_KEY is not set in environment variables");
    return null;
  }

  const configuredCountryCode =
    countryCode?.trim().toLowerCase() || process.env.GEOAPIFY_COUNTRY_CODE?.trim().toLowerCase();

  try {
    const candidates = await fetchPostcodeCandidates(normalizedPostCode, apiKey, configuredCountryCode);

    if (candidates.length === 0) return null;

    const preferredCandidate = configuredCountryCode
      ? candidates.find((candidate) => candidate.countryCode === configuredCountryCode)
      : null;

    const bestMatch = preferredCandidate || candidates[0];
    return { bestMatch, candidates };
  } catch (error) {
    console.error("Error resolving address from postcode:", error);
    return null;
  }
}

export async function resolveAddressFromPostcode(postCode: string, countryCode?: string) {
  const details = await resolveAddressDetailsFromPostcode(postCode, countryCode);
  return details?.bestMatch.formatted || null;
}
