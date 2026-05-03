import { NextResponse } from "next/server";
import { ApiResponse, Pagination } from "@/types";

export function ok<T>(data: T, pagination?: Pagination) {
  const body: ApiResponse<T> = { success: true, data };
  if (pagination) body.pagination = pagination;
  return NextResponse.json(body, { status: 200 });
}

export function created<T>(data: T) {
  return NextResponse.json({ success: true, data } as ApiResponse<T>, {
    status: 201,
  });
}

export function badRequest(error: string) {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 400,
  });
}

export function unauthorized(error = "Unauthorized") {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 401,
  });
}

export function notFound(error = "Not found") {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 404,
  });
}

export function conflict(error: string) {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 409,
  });
}

export function serverError(error = "Internal server error") {
  return NextResponse.json({ success: false, error } as ApiResponse, {
    status: 500,
  });
}
