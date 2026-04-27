import type { APIRoute } from "astro";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { Resend } from "resend";
import { validateContact } from "@lib/contact";

export const prerender = false;

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: false,
});

const resend = new Resend(import.meta.env.RESEND_API_KEY);

const JSON_HEADERS = { "Content-Type": "application/json" };

function json(body: object, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const { success, limit, remaining, reset } = await ratelimit.limit(
    clientAddress ?? "anonymous",
  );

  if (!success) {
    return new Response(
      JSON.stringify({ error: "Too many requests. Try again later." }),
      {
        status: 429,
        headers: {
          ...JSON_HEADERS,
          "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)),
          "X-RateLimit-Limit": String(limit),
          "X-RateLimit-Remaining": String(remaining),
        },
      },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON body" }, 400);
  }

  const { valid, errors } = validateContact(body);
  if (!valid) {
    return json({ error: "Validation failed", fields: errors }, 422);
  }

  const { name, email, message, budget, projectType } = body as {
    name: string;
    email: string;
    message: string;
    budget?: string;
    projectType?: string;
  };

  const { error } = await resend.emails.send({
    from: import.meta.env.RESEND_FROM_EMAIL,
    to: import.meta.env.RESEND_TO_EMAIL,
    replyTo: email,
    subject: `Portfolio contact from ${name}`,
    text: [
      `From: ${name} <${email}>`,
      projectType ? `Project type: ${projectType}` : "",
      budget ? `Budget: ${budget}` : "",
      "",
      message,
    ]
      .filter(Boolean)
      .join("\n"),
  });

  if (error) {
    console.error("Resend error:", error);
    return json({ error: "Failed to send message. Please try again." }, 500);
  }

  return json({ success: true });
};
