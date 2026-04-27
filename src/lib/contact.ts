export interface ContactPayload {
  name: string;
  email: string;
  message: string;
  budget?: string;
  projectType?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: Partial<Record<keyof ContactPayload, string>>;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateContact(body: unknown): ValidationResult {
  if (typeof body !== "object" || body === null) {
    return { valid: false, errors: { name: "Invalid request body" } };
  }

  const data = body as Record<string, unknown>;
  const errors: Partial<Record<keyof ContactPayload, string>> = {};

  if (!data.name || typeof data.name !== "string" || data.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!data.email || typeof data.email !== "string" || !EMAIL_RE.test(data.email)) {
    errors.email = "A valid email address is required";
  }

  if (
    !data.message ||
    typeof data.message !== "string" ||
    data.message.trim().length < 20
  ) {
    errors.message = "Message must be at least 20 characters";
  }

  if (typeof data.name === "string" && data.name.trim().length > 100) {
    errors.name = "Name must be under 100 characters";
  }

  if (typeof data.message === "string" && data.message.trim().length > 5000) {
    errors.message = "Message must be under 5000 characters";
  }

  return { valid: Object.keys(errors).length === 0, errors };
}
