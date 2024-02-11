import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const body = searchParams.get("body");

  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 40,
          color: "black",
          background: "white",
          width: "100%",
          height: "100%",
          padding: "50px 50px",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {body}
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
