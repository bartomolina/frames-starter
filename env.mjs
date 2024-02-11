import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  client: {
    NEXT_PUBLIC_URL: z.string(1),
  },
  server: {
    PRIVATE_KEY: z.string(1),
    ALCHEMY_KEY: z.string(1),
    SUPABASE_URL: z.string(1),
    SUPABASE_ANON_KEY: z.string(1),
    FARCASTER_DEVELOPER_MNEMONIC: z.string(),
    FARCASTER_DEVELOPER_FID: z.string(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    ALCHEMY_KEY: process.env.ALCHEMY_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_ANON_KEY: process.env.SUPABASE_ANON_KEY,
    FARCASTER_DEVELOPER_MNEMONIC: process.env.FARCASTER_DEVELOPER_MNEMONIC,
    FARCASTER_DEVELOPER_FID: process.env.FARCASTER_DEVELOPER_FID,
  },
});
