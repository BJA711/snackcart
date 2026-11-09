import { describe, it, expect } from "vitest";
import {
  phoneRegex,
  postalCodeRegex,
  checkoutSchema,
} from "../src/lib/validations";

describe("Input Validation RegExes", () => {
  it("validates standard 10-digit Indian mobile numbers", () => {
    expect(phoneRegex.test("9876543210")).toBe(true);
    expect(phoneRegex.test("8765432109")).toBe(true);
    expect(phoneRegex.test("7654321098")).toBe(true);
    expect(phoneRegex.test("6543210987")).toBe(true);

    // Invalid numbers
    expect(phoneRegex.test("5543210987")).toBe(false); // starts with 5
    expect(phoneRegex.test("987654321")).toBe(false);  // 9 digits
    expect(phoneRegex.test("98765432100")).toBe(false); // 11 digits
    expect(phoneRegex.test("98765abcd0")).toBe(false); // characters
  });

  it("validates standard 6-digit Indian PIN codes", () => {
    expect(postalCodeRegex.test("560038")).toBe(true);
    expect(postalCodeRegex.test("110001")).toBe(true);
    expect(postalCodeRegex.test("400001")).toBe(true);

    // Invalid codes
    expect(postalCodeRegex.test("010001")).toBe(false); // starts with 0
    expect(postalCodeRegex.test("56003")).toBe(false);  // 5 digits
    expect(postalCodeRegex.test("5600388")).toBe(false); // 7 digits
  });
});

describe("Checkout Schema Validation", () => {
  const validData = {
    delivery_name: "Ramesh Kumar",
    delivery_phone: "9876543210",
    delivery_street: "Flat 204, Green Palms",
    delivery_landmark: "Near Metro",
    delivery_city: "Bengaluru",
    delivery_state: "Karnataka",
    delivery_postal_code: "560038",
    customer_notes: "Leave at door",
    items: [
      {
        product_id: "c1111111-1111-1111-1111-111111111111",
        quantity: 2,
      },
    ],
  };

  it("accepts valid checkout input", () => {
    const res = checkoutSchema.safeParse(validData);
    expect(res.success).toBe(true);
  });

  it("rejects when cart items array is empty", () => {
    const res = checkoutSchema.safeParse({
      ...validData,
      items: [],
    });
    expect(res.success).toBe(false);
  });

  it("rejects when phone number is invalid", () => {
    const res = checkoutSchema.safeParse({
      ...validData,
      delivery_phone: "12345",
    });
    expect(res.success).toBe(false);
  });

  it("rejects when recipient name is too short", () => {
    const res = checkoutSchema.safeParse({
      ...validData,
      delivery_name: "A",
    });
    expect(res.success).toBe(false);
  });

  it("rejects when item quantity is 0 or negative", () => {
    const res = checkoutSchema.safeParse({
      ...validData,
      items: [
        {
          product_id: "c1111111-1111-1111-1111-111111111111",
          quantity: 0,
        },
      ],
    });
    expect(res.success).toBe(false);
  });
});
