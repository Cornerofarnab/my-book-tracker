import { NextResponse } from "next/server";
import { Prisma } from "@/generated/prisma";

export class HttpError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function readJsonBody(request: Request) {
  try {
    const body = await request.json();
    if (body === null || typeof body !== "object" || Array.isArray(body)) {
      throw new HttpError(400, "Request body must be a JSON object.");
    }
    return body as Record<string, unknown>;
  } catch (error) {
    if (error instanceof HttpError) throw error;
    throw new HttpError(400, "Invalid JSON body.");
  }
}

export function handleApiError(error: unknown) {
  if (error instanceof HttpError) {
    return jsonError(error.message, error.status);
  }

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2025") {
      return jsonError("Record not found.", 404);
    }
    if (error.code === "P2003") {
      return jsonError("Related user was not found.", 400);
    }
  }

  console.error(error);
  return jsonError("Something went wrong. Check your database connection.", 500);
}

export function optionalString(value: unknown) {
  if (value === undefined || value === null || value === "") return null;
  if (typeof value !== "string") {
    throw new HttpError(400, "Expected a string value.");
  }
  const trimmed = value.trim();
  return trimmed.length ? trimmed : null;
}

export function requiredString(value: unknown, field: string) {
  const parsed = optionalString(value);
  if (!parsed) {
    throw new HttpError(400, `${field} is required.`);
  }
  return parsed;
}

export function optionalInt(value: unknown, field: string, min?: number, max?: number) {
  if (value === undefined || value === null || value === "") return null;
  const parsed = typeof value === "number" ? value : Number(value);
  if (!Number.isInteger(parsed)) {
    throw new HttpError(400, `${field} must be an integer.`);
  }
  if (min !== undefined && parsed < min) {
    throw new HttpError(400, `${field} must be at least ${min}.`);
  }
  if (max !== undefined && parsed > max) {
    throw new HttpError(400, `${field} must be at most ${max}.`);
  }
  return parsed;
}
