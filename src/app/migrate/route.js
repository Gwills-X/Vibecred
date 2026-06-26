import { importMigrationFile } from "@/lib/importSql";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await importMigrationFile();
    return NextResponse.json({
      success: true,
      message: "Migration executed! Check terminal logs.",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
