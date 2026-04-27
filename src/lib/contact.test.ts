import { describe, it, expect } from "vitest";
import { validateContact } from "./contact";

describe("validateContact", () => {
  const valid = {
    name: "Jane Doe",
    email: "jane@example.com",
    message: "I need help building a greenfield product from scratch.",
  };

  it("accepts a valid payload", () => {
    const result = validateContact(valid);
    expect(result.valid).toBe(true);
    expect(result.errors).toEqual({});
  });

  it("rejects null body", () => {
    const result = validateContact(null);
    expect(result.valid).toBe(false);
  });

  it("rejects missing name", () => {
    const result = validateContact({ ...valid, name: "" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects name shorter than 2 chars", () => {
    const result = validateContact({ ...valid, name: "A" });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects name longer than 100 chars", () => {
    const result = validateContact({ ...valid, name: "A".repeat(101) });
    expect(result.valid).toBe(false);
    expect(result.errors.name).toBeDefined();
  });

  it("rejects invalid email", () => {
    const result = validateContact({ ...valid, email: "not-an-email" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("rejects email with no TLD", () => {
    const result = validateContact({ ...valid, email: "user@domain" });
    expect(result.valid).toBe(false);
    expect(result.errors.email).toBeDefined();
  });

  it("rejects message shorter than 20 chars", () => {
    const result = validateContact({ ...valid, message: "Too short." });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it("rejects message longer than 5000 chars", () => {
    const result = validateContact({ ...valid, message: "A".repeat(5001) });
    expect(result.valid).toBe(false);
    expect(result.errors.message).toBeDefined();
  });

  it("accepts optional budget and projectType fields", () => {
    const result = validateContact({
      ...valid,
      budget: "$5k–$10k",
      projectType: "greenfield",
    });
    expect(result.valid).toBe(true);
  });

  it("collects multiple errors at once", () => {
    const result = validateContact({ name: "", email: "bad", message: "short" });
    expect(result.valid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(1);
  });
});
