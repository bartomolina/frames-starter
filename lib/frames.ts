import { FrameButtonMetadata } from "@coinbase/onchainkit/dist/types/core/types";

import { env } from "@/env.mjs";

// Error
export const frame_error = () => {
  const body = "🙅‍♂️ There was an error validating the request";
  return {
    buttons: [
      {
        label: "Home",
      },
    ] as [FrameButtonMetadata, ...FrameButtonMetadata[]],
    image: `${env.NEXT_PUBLIC_URL}/api/image?body=${body}`,
    post_url: `${env.NEXT_PUBLIC_URL}/api/home`,
  };
};

// Home
export const frame_home = () => {
  const body = "👋 Welcome to frames";
  return {
    buttons: [
      {
        label: "Next frame",
      },
    ] as [FrameButtonMetadata, ...FrameButtonMetadata[]],
    image: `${env.NEXT_PUBLIC_URL}/api/image?body=${body}`,
    post_url: `${env.NEXT_PUBLIC_URL}/api/next`,
    input: {
      text: "Message",
    },
  };
};

// Next
export const frame_next = (fid: string, address: string, text: string) => {
  const body = `🚀 LFG%0D%0Dfid: ${fid}%0D%0Daddress: ${address.slice(
    0,
    6
  )}%0D%0Dmessage: ${text}`;
  return {
    buttons: [
      {
        label: "Home",
      },
    ] as [FrameButtonMetadata, ...FrameButtonMetadata[]],
    image: `${env.NEXT_PUBLIC_URL}/api/image?body=${body}`,
    post_url: `${env.NEXT_PUBLIC_URL}/api/home`,
  };
};
