import { NextResponse } from "next/server";
import { bookingService } from "@/services/booking/BookingService";
import { BookingError } from "@/services/booking/types";

export async function GET() {
  try {
    const services = await bookingService.getServices();
    return NextResponse.json(services);
  } catch (error) {
    if (error instanceof BookingError) {
      return NextResponse.json(
        { error: error.code, message: error.message },
        { status: 400 },
      );
    }
    console.error(error);
    return NextResponse.json(
      { error: "UNKNOWN", message: "Failed to load services" },
      { status: 500 },
    );
  }
}
