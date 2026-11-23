export async function GET() {
  const { UMAMI_API_KEY, UMAMI_WEBSITE_ID } = process.env;
  if (!UMAMI_API_KEY || !UMAMI_WEBSITE_ID) {
    return Response.json({ visitors: null });
  }

  const url = `https://api.umami.is/v1/websites/${UMAMI_WEBSITE_ID}/stats?startAt=0&endAt=${Date.now()}`;
  const response = await fetch(url, { headers: { "x-umami-api-key": UMAMI_API_KEY } });
  if (!response.ok) return Response.json({ visitors: null });

  const stats = await response.json();
  return Response.json(
    { visitors: stats.visitors?.value ?? stats.visitors ?? null },
    { headers: { "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400" } },
  );
}