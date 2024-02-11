import { getFrameHtmlResponse } from "@coinbase/onchainkit";
import { NextResponse } from "next/server";

import { frame_home } from "@/lib/frames";

async function getResponse(): Promise<NextResponse> {
  return new NextResponse(getFrameHtmlResponse(frame_home()));
}

export async function POST(): Promise<Response> {
  return getResponse();
}

export const dynamic = "force-dynamic";
