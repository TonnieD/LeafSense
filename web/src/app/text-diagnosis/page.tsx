"use client";

import { useState } from "react";
import DiagnosisResult from "@/components/DiagnosisResult";

interface TextPredictionResult {
  predicted_class: string;
  recommendation: string;
}

const EXAMPLE_SYMPTOMS = [
  "Yellow spots spreading across the lower leaves with brown necrotic centres",
  "Dark water-soaked lesions on potato leaves that spread rapidly in wet conditions",
  "White powdery mold on the underside of tomato leaves with yellowing on top",
  "Circular brown spots with yellow halos appearing on pepper bell leaves",
];

export default function TextDiagnosisPage() {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TextPredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const API_URL =
    process.env.NEXT_PUBLIC_INFERENCE_API_URL ?? "http://localhost:8000";

  const analyse = async () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    setLoading(true);
    setResult(null);
    setError(null);

    try {
      const res = await fetch(`${API_URL}/predict/text`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: trimmed }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as { detail?: string }).detail ?? `Server error ${res.status}`);
      }

      const data: TextPredictionResult = await res.json();
      setResult(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Ctrl/Cmd + Enter submits
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      if (text.trim() && !loading) analyse();
    }
  };

  const reset = () => {
    setText("");
    setResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page header */}
      <div className="mb-8">
        <p className="section-label mb-1">NLP Model</p>
        <h1 className="font-serif text-3xl md:text-4xl font-bold text-soil">
          Text Diagnosis
        </h1>
        <p className="mt-2 text-soil/65 text-sm max-w-xl">
          Describe the symptoms you observe on the crop in plain language. The
          Multinomial Naive Bayes classifier interprets your description and
          predicts the disease class with a treatment recommendation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ---- LEFT: Input Panel ---- */}
        <div className="space-y-5">
          <div className="card space-y-4">
            <label
              htmlFor="symptom-textarea"
              className="section-label"
            >
              Symptom Description
            </label>
            <textarea
              id="symptom-textarea"
              className="textarea-field"
              placeholder="Describe what you observe on the crop leaves, stems, or fruit. For example: yellow spots with brown edges on tomato leaves..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={handleKeyDown}
              rows={7}
              maxLength={2000}
              aria-label="Symptom description for crop disease classification"
              aria-describedby="textarea-hint"
            />
            <div className="flex items-center justify-between">
              <p
                id="textarea-hint"
                className="text-xs text-soil/40"
              >
                Press Ctrl + Enter to submit
              </p>
              <span className="text-xs text-soil/40">
                {text.length} / 2000
              </span>
            </div>

            <div className="flex gap-3 pt-1">
              <button
                id="btn-analyse-text"
                onClick={analyse}
                disabled={loading || !text.trim()}
                className="btn-primary flex-1 text-base py-3"
                aria-busy={loading}
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin"
                      aria-hidden="true"
                    />
                    Classifying...
                  </>
                ) : (
                  "Analyse Description"
                )}
              </button>
              {(text || result) && (
                <button
                  id="btn-reset-text"
                  onClick={reset}
                  className="btn-secondary text-sm px-4"
                  aria-label="Clear and reset"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Example prompts */}
          <div id="example-prompts-section">
            <p className="section-label mb-3">Example Descriptions</p>
            <div className="space-y-2">
              {EXAMPLE_SYMPTOMS.map((symptom, i) => (
                <button
                  key={i}
                  id={`example-prompt-${i}`}
                  onClick={() => {
                    setText(symptom);
                    setResult(null);
                    setError(null);
                  }}
                  className="w-full text-left px-4 py-3 rounded-xl border border-cream-dark bg-[#181f15] text-sm text-soil/70
                    hover:border-sage/40 hover:text-soil hover:bg-sage/5 transition-all duration-150 group"
                  aria-label={`Use example: ${symptom}`}
                >
                  <span className="text-sage font-semibold mr-2 group-hover:text-sage-light transition-colors">
                    {String(i + 1).padStart(2, "0")}.
                  </span>
                  {symptom}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ---- RIGHT: Results Panel ---- */}
        <div className="space-y-5">
          {/* Loading skeleton */}
          {loading && (
            <div
              id="text-loading-panel"
              className="card space-y-4 animate-pulse"
              role="status"
              aria-label="Classifying description"
            >
              <div className="flex items-center gap-3 mb-2">
                <span
                  className="inline-block w-5 h-5 border-2 border-sage/40 border-t-sage rounded-full animate-spin flex-shrink-0"
                  aria-hidden="true"
                />
                <p className="font-serif font-semibold text-soil">
                  Classifying symptoms...
                </p>
              </div>
              <p className="text-xs text-soil/50">
                If the inference service is waking from standby, this may take up to
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
              id="text-error-panel"
              className="card border border-terracotta/20 bg-terracotta/5"
              role="alert"
            >
              <p className="font-semibold text-terracotta text-sm mb-1">
                Classification failed
              </p>
              <p className="text-soil/70 text-sm">{error}</p>
            </div>
          )}

          {/* Results */}
          {result && !loading && (
            <DiagnosisResult
              predictedClass={result.predicted_class}
              isHealthy={result.predicted_class.toLowerCase().includes("healthy")}
              recommendation={result.recommendation}
              mode="text"
            />
          )}

          {/* Empty state */}
          {!result && !loading && !error && (
            <div
              id="text-empty-state"
              className="card-cream flex flex-col items-center justify-center min-h-[280px] text-center gap-4"
            >
              <div className="p-4 bg-cream-dark rounded-full">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true">
                  <rect x="5" y="4" width="22" height="26" rx="3" stroke="#6b7c3f" strokeWidth="2" />
                  <line x1="10" y1="11" x2="22" y2="11" stroke="#6b7c3f" strokeWidth="1.75" strokeLinecap="round" />
                  <line x1="10" y1="16" x2="22" y2="16" stroke="#6b7c3f" strokeWidth="1.75" strokeLinecap="round" />
                  <line x1="10" y1="21" x2="17" y2="21" stroke="#6b7c3f" strokeWidth="1.75" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <p className="font-serif font-semibold text-soil">No diagnosis yet</p>
                <p className="text-soil/50 text-sm mt-1 max-w-xs">
                  Describe the symptoms you observe on the crop, then press
                  &ldquo;Analyse Description&rdquo;.
                </p>
              </div>
            </div>
          )}

          {/* Info card */}
          <div className="card-cream text-xs text-soil/60 leading-relaxed space-y-2">
            <p className="font-semibold text-soil text-sm">How the model works</p>
            <p>
              The Multinomial Naive Bayes classifier uses TF-IDF vectorization to
              identify keyword patterns in your symptom description and maps them to
              one of 15 disease classes.
            </p>
            <p className="text-soil/40">
              The model was trained on synthetic symptom descriptions derived from
              the PlantVillage dataset categories. Accuracy improves with specific,
              detailed descriptions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
