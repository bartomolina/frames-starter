import {
  FrameRequest,
  getFrameHtmlResponse,
  getFrameMessage,
} from "@coinbase/onchainkit";
import { NextRequest, NextResponse } from "next/server";

// import { createWalletClient, http } from "viem";
// import { privateKeyToAccount } from "viem/accounts";
// import { sepolia } from "viem/chains";
// import { env } from "@/env.mjs";
import { frame_error, frame_next } from "@/lib/frames";
// import { supabase } from "@/lib/supabase-client";

async function getResponse(req: NextRequest): Promise<NextResponse> {
  let fid: number | undefined = 0;
  let text: string | undefined = "";
  let address: string | undefined = "";

  const body: FrameRequest = await req.json();

  try {
    const { isValid, message } = await getFrameMessage(body, {
      neynarApiKey: "NEYNAR_ONCHAIN_KIT",
    });

    if (!isValid || !message) {
      return new NextResponse(getFrameHtmlResponse(frame_error()));
    }

    if (message) {
      fid = message.interactor.fid;
      address = message.interactor.verified_accounts[0];
    }

    if (message?.input) {
      text = message.input;
    }

    // const account = privateKeyToAccount(`0x${env.PRIVATE_KEY}`);

    // const client = createWalletClient({
    //   account,
    //   chain: sepolia,
    //   transport: http(`https://eth-sepolia.g.alchemy.com/v2/${env.ALCHEMY_KEY}`),
    // });

    // send a transaction
    // await client.sendTransaction({
    //   account,
    //   to: `0x...`,
    //   value: 1n,
    // });

    // update DB
    // await supabase.from("Users").upsert({
    //   id: fid,
    //   updated_at: new Date().toISOString(),
    // });

    return new NextResponse(
      getFrameHtmlResponse(frame_next(fid.toString(), address, text))
    );
  } catch {
    return new NextResponse(getFrameHtmlResponse(frame_error()));
  }
}

export async function POST(req: NextRequest): Promise<Response> {
  return getResponse(req);
}

export const dynamic = "force-dynamic";
