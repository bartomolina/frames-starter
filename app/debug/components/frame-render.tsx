import { Frame } from "frames.js";
import { useState } from "react";

export type FrameRenderProps = {
  isLoggedIn: boolean;
  frame: Frame;
  submitOption: (args: {
    buttonIndex: number;
    inputText?: string;
  }) => Promise<void>;
};

export function FrameRender({
  frame,
  submitOption,
  isLoggedIn,
}: FrameRenderProps) {
  const [inputText, setInputText] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  return (
    <div style={{ width: "382px" }}>
      <img
        src={frame.image}
        alt="Description of the image"
        style={{ borderRadius: "4px", border: "1px solid #ccc" }}
        {...((frame.imageAspectRatio ?? "1.91:1") === "1:1"
          ? { width: 382, height: 382 }
          : { height: 200, width: 382 })}
      />
      {frame.inputText && (
        <input
          className="mt-1 w-full rounded border border-gray-400 p-2"
          type="text"
          placeholder={frame.inputText}
          onChange={(e) => setInputText(e.target.value)}
        />
      )}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          marginTop: "4px",
          gap: "4px",
        }}
      >
        {frame.buttons?.map(({ label, action, target }, index: number) => (
          <button
            type="button"
            disabled={isWaiting}
            className={`bg-gray-200 p-2 hover:bg-gray-300 ${
              isWaiting ? "bg-gray-100 hover:bg-gray-100" : ""
            } rounded border border-gray-400 text-sm text-gray-800`}
            style={{
              flex: "1 1 0px",
              cursor: isWaiting ? undefined : "pointer",
            }}
            onClick={async () => {
              if (!isLoggedIn) {
                alert(
                  "Choose an fid to impersonate or Sign in (costs warps) to use the frame buttons"
                );
                return;
              }
              if (action === "link") {
                if (
                  window.confirm("You are about to be redirected to " + target!)
                ) {
                  window.location.href = target!;
                }
              } else if (action === "mint") {
                alert(`Requested to mint NFT: ${target}`);
              } else {
                setIsWaiting(true);
                try {
                  await submitOption({
                    buttonIndex: index + 1,
                    inputText:
                      frame.inputText === undefined ? undefined : inputText,
                  });
                } catch (error) {
                  alert("error: check the console");
                  console.error(error);
                }
                setIsWaiting(false);
              }
            }}
            key={index}
          >
            {action === "mint" ? `♦ ` : ""}
            {label}
            {action === "post_redirect" || action === "link" ? ` ↗` : ""}
          </button>
        ))}
      </div>
    </div>
  );
}
