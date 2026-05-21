// app/api/events/route.ts

import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

/* GET EVENTS */
export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabase
      .from("events")
      .select("*")
      .order(
        "timestamp",
        {
          ascending: false,
        }
      );

    if (error) {
      return NextResponse.json(
        {
          success: false,

          error:
            error.message,
        },

        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      total:
        data.length,

      events: data,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to fetch events",
      },

      {
        status: 500,
      }
    );
  }
}

/* ADD EVENT */
export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const {
      title,
      region,
      category,
      severity,
      lat,
      lng,
      source,
    } = body;

    const {
      data,
      error,
    } = await supabase
      .from("events")
      .insert([
        {
          title,

          region,

          category,

          severity,

          lat:
            Number(lat),

          lng:
            Number(lng),

          source,
        },
      ])
      .select();

    if (error) {
      return NextResponse.json(
        {
          success: false,

          error:
            error.message,
        },

        {
          status: 500,
        }
      );
    }

    return NextResponse.json({
      success: true,

      message:
        "Event added successfully",

      event: data[0],
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        error:
          "Failed to add event",
      },

      {
        status: 500,
      }
    );
  }
}