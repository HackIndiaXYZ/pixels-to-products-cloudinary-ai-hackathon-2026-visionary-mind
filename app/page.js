"use client";

import { useState, useRef } from "react";

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

// Scene presets for Cloudinary's generative background replace effect.
// Each "prompt" describes the new environment the product should sit in.
const SCENES = [ { label: "Marble counter", prompt: "on a white marble kitchen counter with soft daylight" }, { label: "Outdoor lifestyle", prompt: "outdoors on a wooden table with warm afternoon light" }, { label: "Studio backdrop", prompt: "on a plain light grey professional studio backdrop" }, { label: "Minimal shelf", prompt: "on a floating wooden shelf against a beige wall" }, ];

// Multi-format crops for social/marketplace placements.
// g_auto lets Cloudinary's AI pick the crop focus automatically.
const FORMATS = [
  { label: "Square (Instagram post)", transform: "ar_1:1,c_fill,g_auto" },
  { label: "Story (9:16)", transform: "ar_9:16,c_fill,g_auto" },
  { label: "Wide banner (16:9)", transform: "ar_16:9,c_fill,g_auto" },
];

function buildUrl(publicId, transformation) {
  return `https://res.cloudinary.com/${CLOUD_NAME}/image/upload/${transformation}/${publicId}`;
}

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [publicId, setPublicId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const configMissing = !CLOUD_NAME || !UPLOAD_PRESET;

  function handleFile(selected) {
    if (!selected) return;
    setFile(selected);
    setPreviewUrl(URL.createObjectURL(selected));
    setPublicId(null);
    setError(null);
  }

  async function handleUpload() {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      form.append("upload_preset", UPLOAD_PRESET);

      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        { method: "POST", body: form }
      );

      if (!res.ok) {
        const detail = await res.json().catch(() => null);
        throw new Error(detail?.error?.message || "Upload failed");
      }

      const data = await res.json();
      setPublicId(data.public_id);
    } catch (err) {
      setError(err.message || "Something went wrong during upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="wrap">
      <div className="mast">
        <span className="mast-mark">Pixels → Products</span>
        <span className="mast-sub">AI photoshoot studio, built on Cloudinary</span>
      </div>

      <h1>Turn one product photo into a full shoot</h1>
      <p className="lede">
        Upload a plain photo and get back studio-ready scenes and
        platform-ready crops, generated on the fly by Cloudinary&apos;s AI.
      </p>

      {configMissing && (
        <p className="status-line error">
          Missing Cloudinary config. Copy .env.local.example to .env.local
          and fill in your cloud name and unsigned upload preset.
        </p>
      )}

      <div
        className={`dropzone ${dragActive ? "active" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFile(e.dataTransfer.files?.[0]);
        }}
        onClick={() => inputRef.current?.click()}
      >
        <label className="dropzone-label">
          Choose a product photo, or drag one here
        </label>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={(e) => handleFile(e.target.files?.[0])}
        />
        <div className="dropzone-hint">JPG or PNG, plain background works best</div>
      </div>

      {previewUrl && (
        <div className="source-preview">
          <img src={previewUrl} alt="Selected product" />
          <div className="source-meta">
            <strong>{file?.name}</strong>
            {publicId ? "Uploaded — generating below" : "Ready to upload"}
          </div>
          <button
            className="primary"
            onClick={handleUpload}
            disabled={uploading || configMissing || !file}
          >
            {uploading ? "Uploading…" : "Generate shoot"}
          </button>
        </div>
      )}

      {error && <p className="status-line error">{error}</p>}

      {publicId && (
        <>
          <section className="results">
            <h2>Scenes</h2>
            <div className="grid">
              {SCENES.map((scene) => {
                const url = buildUrl(
                  publicId,
                  `e_gen_background_replace:prompt_${encodeURIComponent(scene.prompt)}`
                );
                return (
                  <div className="card" key={scene.label}>
                    <div className="card-image">
                      <img
                        src={url}
                        alt={scene.label}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                    <div className="card-body">
                      <span className="card-label">{scene.label}</span>
                      <a className="download" href={url} download target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          <section className="results format-row">
            <h2>Ready-to-post crops</h2>
            <div className="grid">
              {FORMATS.map((format) => {
                const url = buildUrl(publicId, format.transform);
                return (
                  <div className="card" key={format.label}>
                    <div className="card-image">
                      <img src={url} alt={format.label} loading="lazy" />
                    </div>
                    <div className="card-body">
                      <span className="card-label">{format.label}</span>
                      <a className="download" href={url} download target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        </>
      )}

      <footer className="note">
        Scenes use Cloudinary&apos;s generative background replace effect —
        confirm it&apos;s enabled for your account in the Cloudinary console
        before your demo. If a scene tile stays blank, the effect likely
        needs enabling or your plan/trial doesn&apos;t include it yet.
      </footer>
    </div>
  );
}
