const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

export default function rateLimitMiddleware(
  handler: (req: any) => Promise<any> | any,
) {
  return async (req: any) => {
    const ip =
      req.headers["x-forwarded-for"] ||
      (req.connection && req.connection.remoteAddress) ||
      "unknown";
    const limit = 100;
    const windowMs = 60 * 1000;

    if (!rateLimitMap.has(ip)) {
      rateLimitMap.set(ip, {
        count: 0,
        lastReset: Date.now(),
      });
    }

    const ipData = rateLimitMap.get(ip)!;

    if (Date.now() - ipData.lastReset > windowMs) {
      ipData.count = 0;
      ipData.lastReset = Date.now();
    }

    if (ipData.count >= limit) {
      return new Response("Too Many Requests", { status: 429 });
    }

    ipData.count += 1;

    return handler(req);
  };
}
