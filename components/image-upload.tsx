"use client";
import { UploadButton } from "@uploadthing/react";
import { useState } from "react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [mode, setMode] = useState<"url" | "upload">("url");

  return (
    <div className="col-span-2 flex flex-col gap-2">
      <div className="flex gap-2 text-sm">
        <button type="button" onClick={() => setMode("url")} className={`px-3 py-1 rounded ${mode === "url" ? "bg-amber-600 text-white" : "bg-gray-200"}`}>
          Paste URL
        </button>
        <button type="button" onClick={() => setMode("upload")} className={`px-3 py-1 rounded ${mode === "upload" ? "bg-amber-600 text-white" : "bg-gray-200"}`}>
          Upload
        </button>
      </div>
      {mode === "url" ? (
        <input className="border rounded px-3 py-2" placeholder="Image URL (optional)" value={value} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <UploadButton<OurFileRouter, "beerImage">
          endpoint="beerImage"
          onClientUploadComplete={(res) => {
            if (res?.[0]) onChange(res[0].ufsUrl);
          }}
          onUploadError={(error) => console.error(error)}
        />
      )}
      {value && <p className="text-xs text-gray-400 truncate">Current: {value}</p>}
    </div>
  );
}
