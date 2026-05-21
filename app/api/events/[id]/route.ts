import { NextResponse } from "next/server";

import { supabase } from "@/lib/supabase";

export async function DELETE(
  request: Request,

  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    const { id } =
      await params;

    const { error } =
      await supabase
        .from("events")
        .delete()
        .eq(
          "id",
          Number(id)
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
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,

        error:
          "Delete failed",
      },

      {
        status: 500,
      }
    );
  }
}