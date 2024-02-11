import { getFrameMetadata } from "@coinbase/onchainkit";
import { Metadata } from "next";

import { env } from "@/env.mjs";
import { frame_home } from "@/lib/frames";

const frameMetadata = getFrameMetadata(frame_home());

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_URL),
  title: "frames-starter",
  description: "Frames starter",
  openGraph: {
    title: "frames-starter",
    description: "Frames starter",
    images: [`${env.NEXT_PUBLIC_URL}/image?body=Frames starter`],
  },
  other: {
    ...frameMetadata,
  },
};

export default function Home() {
  return <h1>frames-starter</h1>;
}
