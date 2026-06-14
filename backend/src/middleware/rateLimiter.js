class MemoryStore {
  constructor() {
    this.store = new Map();
  }

  get(key) {
    return this.store.get(key);
  }

  set(key, value, ttl) {
    this.store.set(key, {
      value,
      expiry: Date.now() + ttl * 1000
    });
    this.cleanup();
  }

  cleanup() {
    const now = Date.now();
    for (const [key, data] of this.store.entries()) {
      if (data.expiry < now) {
        this.store.delete(key);
      }
    }
  }

  exists(key) {
    const data = this.store.get(key);
    if (!data) return false;
    if (data.expiry < Date.now()) {
      this.store.delete(key);
      return false;
    }
    return true;
  }
}

const store = new MemoryStore();

export const rateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = "Too many requests from this IP, please try again later",
    statusCode = 429,
    keyGenerator = (c) => {
      return c.req.header("cf-connecting-ip") || c.req.header("x-forwarded-for") || c.req.header("x-real-ip") || "unknown";
    }
  } = options;

  return async (c, next) => {
    try {
      const key = keyGenerator(c);
      const now = Date.now();
      const windowStart = now - windowMs;
      let rateLimitData = store.get(key);

      if (!rateLimitData || rateLimitData.expiry < now) {
        rateLimitData = {
          requests: [],
          expiry: now + windowMs
        };
      }

      rateLimitData.requests = rateLimitData.requests.filter(
        (timestamp) => timestamp > windowStart
      );

      if (rateLimitData.requests.length >= max) {
        const resetTime = Math.ceil((rateLimitData.requests[0] + windowMs) / 1000);
        return c.json({
          success: false,
          message,
          rateLimitInfo: {
            limit: max,
            remaining: 0,
            resetTime,
            retryAfter: Math.ceil((rateLimitData.requests[0] + windowMs - now) / 1000)
          }
        }, statusCode);
      }

      rateLimitData.requests.push(now);
      store.set(key, rateLimitData, Math.ceil(windowMs / 1000));
      const remaining = Math.max(0, max - rateLimitData.requests.length);
      const resetTime = Math.ceil((rateLimitData.requests[0] + windowMs) / 1000);
      c.res.headers.set("X-RateLimit-Limit", max.toString());
      c.res.headers.set("X-RateLimit-Remaining", remaining.toString());
      c.res.headers.set("X-RateLimit-Reset", resetTime.toString());
      await next();
    } catch (error) {
      console.error("Rate limiter error:", error);
      await next();
    }
  };
};

export const authRateLimiter = () => rateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many authentication attempts, please try again later"
});

export const emailRateLimiter = (options = {}) => {
  const { max = 5, windowMs = 15 * 60 * 1000 } = options;
  return async (c, next) => {
    try {
      const body = await c.req.json();
      const email = (body.email || 'unknown').toLowerCase().trim();
      const key = `email:${email}`;
      const now = Date.now();
      const windowStart = now - windowMs;
      let data = store.get(key);
      if (!data || data.expiry < now) {
        data = { requests: [], expiry: now + windowMs };
      }
      data.requests = data.requests.filter(t => t > windowStart);
      if (data.requests.length >= max) {
        return c.json({
          success: false,
          message: "Too many requests for this email, please try again later",
          rateLimitInfo: {
            limit: max,
            remaining: 0,
            retryAfter: Math.ceil((data.requests[0] + windowMs - now) / 1000)
          }
        }, 429);
      }
      data.requests.push(now);
      store.set(key, data, Math.ceil(windowMs / 1000));
    } catch {
      // If body parsing fails, still allow the request
    }
    await next();
  };
};
