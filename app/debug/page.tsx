"use client";

import { FrameActionPayload, getFrame } from "frames.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import useSWR from "swr";

import { LoginWindow } from "./components/create-signer";
import { FrameDebugger } from "./components/frame-debugger";
import { FrameRender } from "./components/frame-render";
import { useFarcasterIdentity } from "./hooks/use-farcaster-identity";
import { createFrameActionMessageWithSignerKey } from "./lib/farcaster";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string>;
}): JSX.Element {
  const {
    farcasterUser,
    loading,
    startFarcasterSignerProcess,
    logout,
    impersonateUser,
  } = useFarcasterIdentity();
  const router = useRouter();
  const url = searchParams.url;
  const [urlInput, setUrlInput] = useState(
    process.env.NEXT_PUBLIC_HOST || "http://localhost:3000"
  );

  const [currentFrame, setCurrentFrame] = useState<
    ReturnType<typeof getFrame> | undefined
  >(undefined);
  const [framePerformanceInSeconds, setFramePerformanceInSeconds] = useState<
    number | null
  >(null);

  // Load initial frame
  const { data, error, isLoading } = useSWR<ReturnType<typeof getFrame>>(
    url ? `/debug/og?url=${url}` : null,
    fetcher
  );

  // todo this is kinda nasty
  useEffect(() => {
    setCurrentFrame(data);
  }, [data]);

  const submitOption = async ({
    buttonIndex,
    inputText,
  }: {
    buttonIndex: number;
    inputText?: string;
  }) => {
    if (
      !farcasterUser ||
      !farcasterUser.fid ||
      !currentFrame ||
      !currentFrame?.frame ||
      !url
    ) {
      return;
    }

    const button = currentFrame?.frame.buttons![buttonIndex - 1];

    const castId = {
      fid: 1,
      hash: new Uint8Array(
        Buffer.from("0000000000000000000000000000000000000000", "hex")
      ),
    };

    const { message, trustedBytes } =
      await createFrameActionMessageWithSignerKey(farcasterUser.privateKey, {
        fid: farcasterUser.fid,
        buttonIndex,
        castId,
        url: Buffer.from(url),
        // seems the message in hubs actually requires a value here.
        inputText: inputText === undefined ? undefined : Buffer.from(inputText),
      });

    if (!message) {
      throw new Error("hub error");
    }

    const searchParams = new URLSearchParams({
      postType: button?.action || "post",
      postUrl: currentFrame.frame.postUrl,
    });

    const tstart = new Date();

    const response = await fetch(
      `/debug/frame-action?${searchParams.toString()}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          untrustedData: {
            fid: farcasterUser.fid,
            url: url,
            messageHash: `0x${Buffer.from(message.hash).toString("hex")}`,
            timestamp: message.data.timestamp,
            network: 1,
            buttonIndex: Number(message.data.frameActionBody.buttonIndex),
            castId: {
              fid: castId.fid,
              hash: `0x${Buffer.from(castId.hash).toString("hex")}`,
            },
            inputText,
          },
          trustedData: {
            messageBytes: trustedBytes,
          },
        } as FrameActionPayload),
      }
    );

    const tend = new Date();
    const diff = +((tend.getTime() - tstart.getTime()) / 1000).toFixed(2);
    setFramePerformanceInSeconds(diff);

    const dataRes = await response.json();

    if (response.status === 302) {
      const location = dataRes.location;
      if (window.confirm("You are about to be redirected to " + location!)) {
        window.location.href = location!;
      }
      return;
    }

    setCurrentFrame(dataRes);
  };

  if (error) return <div>Failed to load</div>;
  if (isLoading) return <div>Loading...</div>;
  if (url && !currentFrame?.frame)
    return (
      <div>
        Something is wrong, couldn&apos;t fetch frame from {url}...{" "}
        {url.startsWith("http://") || url.startsWith("https://")
          ? ""
          : "URL must start with http:// or https://"}{" "}
        <Link href="/debug" className="block underline">
          Go back
        </Link>
      </div>
    );

  const baseUrl = process.env.NEXT_PUBLIC_HOST || "http://localhost:3000";

  return (
    <div className="">
      <div className="">
        <div className="mb-4 bg-slate-100 p-4">
          <div className="flex flex-row items-center gap-4">
            <h2 className="font-bold">Frames.js debugger</h2>
            <form
              className="flex flex-row"
              onSubmit={(e) => {
                e.preventDefault();
                console.log("urlInput", urlInput);
                if (
                  !(
                    urlInput.startsWith("http://") ||
                    urlInput.startsWith("https://")
                  )
                ) {
                  alert("URL must start with http:// or https://");
                  return;
                }
                router.push(`?url=${encodeURIComponent(urlInput)}`);
              }}
            >
              <input
                type="text"
                name="url"
                className="w-[300px] rounded-l border border-gray-400 px-2 py-1"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                }}
                placeholder="Enter URL"
              />
              <button className="rounded-r bg-blue-500 p-2 py-1 text-white">
                Debug
              </button>
            </form>
            <span className="ml-4">Examples:</span>
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                router.push(`?url=${baseUrl}`);
              }}
            >
              Home
            </button>
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                router.push(`?url=${baseUrl}/examples/user-data`);
              }}
            >
              User data
            </button>
            <button
              className="underline"
              onClick={(e) => {
                e.preventDefault();
                router.push(`?url=${baseUrl}/examples/custom-redirects`);
              }}
            >
              Custom Redirects
            </button>
          </div>
          <LoginWindow
            farcasterUser={farcasterUser}
            loading={loading}
            startFarcasterSignerProcess={startFarcasterSignerProcess}
            impersonateUser={impersonateUser}
            logout={logout}
          ></LoginWindow>
        </div>
        {url ? (
          <>
            <FrameDebugger
              frameData={currentFrame}
              url={url}
              framePerformanceInSeconds={framePerformanceInSeconds}
            >
              <FrameRender
                frame={currentFrame?.frame!}
                submitOption={submitOption}
                isLoggedIn={!!farcasterUser?.fid}
              />
            </FrameDebugger>
          </>
        ) : null}
      </div>
    </div>
  );
}
