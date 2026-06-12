"use client";

interface DiagnosisResultProps {
  predictedClass: string;
  isHealthy: boolean;
  confidence?: number;
  recommendation: string;
  mode: "image" | "text";
}

function formatClassName(cls: string): string {
  // 'Tomato___Leaf_Mold' -> 'Tomato - Leaf Mold'
  return cls
    .replace(/___/g, " - ")
    .replace(/_/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export default function DiagnosisResult({
  predictedClass,
  isHealthy,
  confidence,
  recommendation,
  mode,
}: DiagnosisResultProps) {
  const displayClass = formatClassName(predictedClass);

  return (
    <div
      id="diagnosis-result-panel"
      className="animate-slide-up card space-y-5"
      role="region"
      aria-label="Diagnosis results"
      aria-live="polite"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-serif text-xl font-semibold text-soil">
          Diagnosis Result
        </h3>
        <span
          id="health-status-badge"
          className={isHealthy ? "badge-healthy" : "badge-disease"}
          aria-label={`Health status: ${isHealthy ? "Healthy" : "Disease Detected"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full inline-block ${
              isHealthy ? "bg-sage" : "bg-terracotta"
            }`}
            aria-hidden="true"
          />
          {isHealthy ? "Healthy" : "Disease Detected"}
        </span>
      </div>

      <div className="divider my-0" />

      {/* Predicted class */}
      <div id="predicted-class-section">
        <p className="section-label mb-1">
          {mode === "image" ? "CNN Prediction" : "NLP Prediction"}
        </p>
        <p
          id="predicted-class-value"
          className="font-serif text-2xl font-semibold text-soil leading-snug"
        >
          {displayClass}
        </p>
      </div>

      {/* Confidence — only for image mode */}
      {mode === "image" && confidence !== undefined && (
        <div id="confidence-section">
          <div className="flex justify-between items-center mb-2">
            <p className="section-label">Confidence</p>
            <p
              id="confidence-value"
              className="text-sm font-semibold text-soil"
            >
              {(confidence * 100).toFixed(1)}%
            </p>
          </div>
          <div className="confidence-bar" role="progressbar" aria-valuenow={Math.round(confidence * 100)} aria-valuemin={0} aria-valuemax={100}>
            <div
              className="confidence-bar-fill"
              style={{ width: `${(confidence * 100).toFixed(1)}%` }}
            />
          </div>
        </div>
      )}

      <div className="divider my-0" />

      {/* Recommendation */}
      <div id="recommendation-section">
        <p className="section-label mb-2">Treatment Recommendation</p>
        <div
          id="recommendation-value"
          className={`rounded-xl px-4 py-3 text-sm leading-relaxed font-sans border ${
            isHealthy
              ? "bg-sage/10 border-sage/20 text-sage"
              : "bg-terracotta/8 border-terracotta/20 text-soil"
          }`}
        >
          {isHealthy ? (
            <span className="font-medium">{recommendation}</span>
          ) : (
            <>
              <span className="font-semibold text-terracotta block mb-0.5">
                Recommended Treatment
              </span>
              {recommendation}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
