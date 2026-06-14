"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DiagnosisResult from "@/components/DiagnosisResult";

type InputMode = "upload" | "camera";

interface PredictionResult {
  predicted_class: string;
  confidence: number;
  is_healthy: boolean;
  recommendation: string;
}

// ---- SVG icons (no emoji) ----
const UploadIcon = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" aria-hidden="true">
    <rect x="4" y="4" width="32" height="32" rx="8" stroke="#6b7c3f" strokeWidth="2" />
    <path d="M20 26V14M14 20l6-6 6 6" stroke="#6b7c3f" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CameraIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="2" y="6" width="20" height="15" rx="3" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="12" cy="13.5" r="3.5" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 6V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v1" stroke="currentColor" strokeWidth="1.75" />
    <circle cx="18" cy="10" r="1" fill="currentColor" />
  </svg>
);

const SwitchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
    <path d="M2 9a7 7 0 1 0 7-7" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
    <path d="M5 5.5L2 2.5 5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function ImageDiagnosisPage() {
  const [inputMode, setInputMode] = useState<InputMode>("upload");
  const [dragActive, setDragActive] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<"environment" | "user">("environment");
  const [capturedFromCamera, setCapturedFromCamera] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const videoCallbackRef = useCallback((node: HTMLVideoElement | null) => {
    videoRef.current = node;
    if (node && streamRef.current) {
      node.srcObject = streamRef.current;
      node.play().catch((err) => console.error("Error playing video:", err));
    }
  }, []);

  const API_URL =
    process.env.NEXT_PUBLIC_INFERENCE_API_URL ?? "http://localhost:8000";

  // ---- Camera helpers ----
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async (mode: "environment" | "user" = facingMode) => {
    setCameraError(null);

    // Camera access is blocked by browsers on insecure contexts (HTTP)
    if (typeof window !== "undefined" && !window.isSecureContext) {
      setCameraError(
        "Camera access requires a secure connection (HTTPS). When testing locally on a phone, please use a secure tunnel (e.g. ngrok), or deploy to Vercel (which serves HTTPS by default)."
      );
      return;
    }

    try {
      let stream: MediaStream;
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode, width: { ideal: 1280 }, height: { ideal: 720 } },
        });
      } catch {
        // Fallback constraint if mobile hardware rejects high resolution spec
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: mode },
        });
      }

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setCameraActive(true);
    } catch {
      setCameraError(
        "Camera access denied or unavailable. Please allow camera access in your browser and system settings."
      );
    }
  }, [facingMode]);

  // Stop camera when switching away
  useEffect(() => {
    if (inputMode !== "camera") stopCamera();
  }, [inputMode, stopCamera]);

  // Cleanup on unmount
  useEffect(() => () => stopCamera(), [stopCamera]);

  // ---- File handling ----
  const processFile = (file: File) => {
    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setError("Please upload a JPG or PNG image.");
      return;
    }
    setImageFile(file);
    setResult(null);
    setError(null);
    setCapturedFromCamera(false);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  // ---- Camera capture ----
  const capturePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    ctx.drawImage(video, 0, 0);
    canvas.toBlob(
      (blob) => {
        if (!blob) return;
        const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
        setImageFile(file);
        setImagePreview(canvas.toDataURL("image/jpeg"));
        setCapturedFromCamera(true);
        setResult(null);
        setError(null);
        stopCamera();
      },
      "image/jpeg",
      0.92
    );
  };

  const switchCamera = async () => {
    const next: "environment" | "user" = facingMode === "environment" ? "user" : "environment";
    setFacingMode(next);
    stopCamera();
    await startCamera(next);
  };

  const retakePhoto = () => {
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setCapturedFromCamera(false);
    startCamera();
  };

  // ---- Inference ----
  const analyse = async () => {
    if (!imageFile) return;
    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const form = new FormData();
      form.append("file", imageFile);

      const res = await fetch(`${API_URL}/predict/image`, {
        method: "POST",
        body: form,
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? `Server error ${res.status}`);
      }

      const data: PredictionResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const resetAll = () => {
    setImagePreview(null);
    setImageFile(null);
    setResult(null);
    setError(null);
    setCapturedFromCamera(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="section-label mb-1">CNN Model</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-soil">
          Image Diagnosis
        </h1>
        <p className="mt-2 text-soil/65 text-sm max-w-xl">
          Upload a leaf photograph or use your device camera to capture one. The CNN
          model analyses the image and identifies the disease with a confidence score
          and treatment recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ---- LEFT: Input Panel ---- */}
        <div className="space-y-5">
          {/* Mode toggle */}
          <div
            className="flex rounded-xl border border-cream-dark bg-[#181f15] p-1 gap-1"
            role="tablist"
            aria-label="Image input method"
          >
            <button
              id="tab-upload"
              role="tab"
              aria-selected={inputMode === "upload"}
              onClick={() => setInputMode("upload")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                inputMode === "upload"
                  ? "bg-sage text-cream shadow-sm"
                  : "text-soil/60 hover:text-soil hover:bg-cream-dark"
              }`}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <path d="M2 11v2a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M8 10V2M5 5l3-3 3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Upload Photo
            </button>
            <button
              id="tab-camera"
              role="tab"
              aria-selected={inputMode === "camera"}
              onClick={() => setInputMode("camera")}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                inputMode === "camera"
                  ? "bg-sage text-cream shadow-sm"
                  : "text-soil/60 hover:text-soil hover:bg-cream-dark"
              }`}
            >
              <CameraIcon size={16} />
              Take Photo
            </button>
          </div>

          {/* ---- Upload mode ---- */}
          {inputMode === "upload" && (
            <div>
              {!imagePreview ? (
                <div
                  id="upload-drop-zone"
                  role="button"
                  tabIndex={0}
                  aria-label="Drop leaf image here or click to browse"
                  className={`upload-zone min-h-[260px] ${dragActive ? "drag-active" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                >
                  <UploadIcon />
                  <div className="text-center px-4">
                    <p className="font-semibold text-soil text-sm">
                      Drop your leaf image here
                    </p>
                    <p className="text-soil/50 text-xs mt-1">
                      or click to browse &mdash; JPG, PNG, JPEG
                    </p>
                  </div>
                  <p className="text-xs text-sage font-medium">
                    Max 10 MB
                  </p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-cream-dark shadow-warm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    id="image-preview"
                    src={imagePreview}
                    alt="Uploaded leaf for diagnosis"
                    className="w-full object-cover h-56 sm:h-72 md:h-96"
                  />
                  <button
                    id="btn-remove-image"
                    onClick={resetAll}
                    className="absolute top-3 right-3 p-1.5 bg-soil/80 text-cream rounded-full hover:bg-soil transition-colors"
                    aria-label="Remove image"
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                      <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>
              )}
              <input
                ref={fileInputRef}
                id="file-input"
                type="file"
                accept=".jpg,.jpeg,.png,image/jpeg,image/png"
                className="sr-only"
                onChange={handleFileChange}
                aria-label="Upload leaf image"
              />
            </div>
          )}

          {/* ---- Camera mode ---- */}
          {inputMode === "camera" && (
            <div className="space-y-3">
              {cameraError && (
                <div
                  id="camera-error-msg"
                  className="rounded-xl border border-terracotta/20 bg-terracotta/8 px-4 py-3 text-sm text-terracotta"
                  role="alert"
                >
                  {cameraError}
                </div>
              )}

              {/* Captured preview */}
              {capturedFromCamera && imagePreview ? (
                <div className="space-y-3">
                  <div className="relative rounded-2xl overflow-hidden border border-cream-dark shadow-warm">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      id="camera-capture-preview"
                      src={imagePreview}
                      alt="Captured photo for diagnosis"
                      className="w-full object-cover h-56 sm:h-72 md:h-96"
                    />
                    <div className="absolute top-3 left-3 bg-sage text-cream text-xs font-semibold px-2.5 py-1 rounded-full">
                      Photo captured
                    </div>
                  </div>
                  <button
                    id="btn-retake-photo"
                    onClick={retakePhoto}
                    className="btn-secondary w-full text-sm"
                  >
                    <SwitchIcon />
                    Retake Photo
                  </button>
                </div>
              ) : (
                <>
                  {/* Live viewfinder */}
                  {!cameraActive ? (
                    <div className="upload-zone min-h-[260px]">
                      <CameraIcon size={40} />
                      <div className="text-center px-4">
                        <p className="font-semibold text-soil text-sm">Camera not active</p>
                        <p className="text-soil/50 text-xs mt-1">
                          Grant camera permission and press the button below
                        </p>
                      </div>
                      <button
                        id="btn-start-camera"
                        onClick={() => startCamera()}
                        className="btn-primary text-sm"
                      >
                        <CameraIcon size={16} />
                        Start Camera
                      </button>
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden border border-cream-dark shadow-warm bg-black">
                      <video
                        ref={videoCallbackRef}
                        id="camera-viewfinder"
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-56 sm:h-72 md:h-96 object-cover"
                        aria-label="Camera viewfinder"
                      />
                      {/* Crosshair overlay */}
                      <div
                        className="absolute inset-0 pointer-events-none flex items-center justify-center"
                        aria-hidden="true"
                      >
                        <div className="w-48 h-48 border-2 border-wheat/60 rounded-xl" />
                      </div>
                      {/* Switch camera button */}
                      <button
                        id="btn-switch-camera"
                        onClick={switchCamera}
                        className="absolute top-3 right-3 p-2 bg-soil/70 text-cream rounded-full hover:bg-soil transition-colors"
                        aria-label="Switch camera (front/back)"
                      >
                        <SwitchIcon />
                      </button>
                    </div>
                  )}

                  {cameraActive && (
                    <div className="flex gap-3">
                      <button
                        id="btn-capture-photo"
                        onClick={capturePhoto}
                        className="btn-wheat flex-1 text-sm"
                        aria-label="Capture photo"
                      >
                        <CameraIcon size={16} />
                        Capture Photo
                      </button>
                      <button
                        id="btn-stop-camera"
                        onClick={stopCamera}
                        className="btn-secondary text-sm px-4"
                        aria-label="Stop camera"
                      >
                        Stop
                      </button>
                    </div>
                  )}
                </>
              )}

              {/* Hidden canvas for capture */}
              <canvas ref={canvasRef} className="hidden" aria-hidden="true" />
            </div>
          )}

          {/* ---- Analyse button ---- */}
          <button
            id="btn-analyse-image"
            onClick={analyse}
            disabled={loading || !imageFile}
            className="btn-primary w-full text-base py-3.5"
            aria-busy={loading}
          >
            {loading ? (
              <>
                <span
                  className="inline-block w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"
                  aria-hidden="true"
                />
                Analysing...
              </>
            ) : (
              "Analyse Image"
            )}
          </button>
        </div>

        {/* ---- RIGHT: Results Panel ---- */}
        <div className="space-y-5">
          {/* Loading skeleton */}
          {loading && (
            <div
              id="loading-panel"
              className="card space-y-4 animate-pulse"
              role="status"
              aria-label="Analysing image"
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-5 h-5 border-2 border-sage/40 border-t-sage rounded-full animate-spin flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="font-serif font-semibold text-soil">
                  Analysing your image...
                </p>
              </div>
              <p className="text-xs text-soil/50">
                If the inference service is waking up from standby, this may take up to
                30 seconds on the first request.
              </p>
              <div className="space-y-2 pt-2">
                <div className="skeleton h-4 w-3/4" />
                <div className="skeleton h-4 w-1/2" />
                <div className="skeleton h-4 w-5/6" />
              </div>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div
              id="error-panel"
              className="card border border-terracotta/20 bg-terracotta/5"
              role="alert"
            >
              <p className="font-semibold text-terracotta text-sm mb-1">
                Diagnosis failed
              </p>
              <p className="text-soil/70 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <DiagnosisResult
              predictedClass={result.predicted_class}
              isHealthy={result.is_healthy}
              confidence={result.confidence}
              recommendation={result.recommendation}
              mode="image"
            />
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div
              id="empty-state-panel"
              className="card-cream flex flex-col items-center justify-center min-h-[280px] text-center gap-4"
            >
              <div className="p-4 bg-cream-dark rounded-full">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <circle cx="16" cy="16" r="12" stroke="#6b7c3f" strokeWidth="2" />
                  <path d="M16 10v6M16 20v2" stroke="#6b7c3f" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="font-serif font-semibold text-soil">No diagnosis yet</p>
                <p className="text-soil/50 text-sm mt-1 max-w-xs">
                  Upload a leaf photo or use the camera to capture one, then press
                  &ldquo;Analyse Image&rdquo;.
                </p>
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="card-cream text-xs text-soil/60 leading-relaxed space-y-1">
            <p className="font-semibold text-soil text-sm">Supported crops</p>
            <p>Pepper bell, Potato, Tomato &mdash; across 15 disease classes from the PlantVillage dataset.</p>
            <p className="mt-1 text-soil/40">
              For best results use a clear, well-lit photo of a single leaf with the affected area visible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
