import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about LeafSense — the CNN and NLP pipeline for crop disease detection, the PlantVillage dataset, team, and methodology.",
};

const CNN_CLASSES = [
  "Pepper bell — Bacterial Spot",
  "Pepper bell — Healthy",
  "Potato — Early Blight",
  "Potato — Late Blight",
  "Potato — Healthy",
  "Tomato — Bacterial Spot",
  "Tomato — Early Blight",
  "Tomato — Late Blight",
  "Tomato — Leaf Mold",
  "Tomato — Septoria Leaf Spot",
  "Tomato — Spider Mites (Two-spotted spider mite)",
  "Tomato — Target Spot",
  "Tomato — Yellow Leaf Curl Virus",
  "Tomato — Mosaic Virus",
  "Tomato — Healthy",
];

const cnnLayers = [
  { id: "layer-conv1", name: "Conv2D (32 filters, 3×3) + ReLU" },
  { id: "layer-pool1", name: "MaxPooling2D (2×2)" },
  { id: "layer-bn1",   name: "BatchNormalization" },
  { id: "layer-conv2", name: "Conv2D (64 filters, 3×3) + ReLU" },
  { id: "layer-pool2", name: "MaxPooling2D (2×2)" },
  { id: "layer-bn2",   name: "BatchNormalization" },
  { id: "layer-conv3", name: "Conv2D (128 filters, 3×3) + ReLU" },
  { id: "layer-pool3", name: "MaxPooling2D (2×2)" },
  { id: "layer-drop",  name: "Dropout (0.4)" },
  { id: "layer-flat",  name: "Flatten" },
  { id: "layer-dense", name: "Dense (256 units) + ReLU" },
  { id: "layer-out",   name: "Dense (15 units) + Softmax" },
];

const metrics = [
  { label: "Validation Accuracy", value: "95%+" },
  { label: "Test Accuracy", value: "~94%" },
  { label: "Optimizer", value: "Adam" },
  { label: "Loss Function", value: "Categorical Crossentropy" },
  { label: "Input Shape", value: "128 × 128 × 3" },
  { label: "Disease Classes", value: "15" },
];

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* Header */}
      <section aria-labelledby="about-heading">
        <p className="section-label mb-2">About the Project</p>
        <h1
          id="about-heading"
          className="font-serif text-3xl md:text-4xl font-bold text-soil mb-4"
        >
          LeafSense
        </h1>
        <p className="text-soil/70 leading-relaxed max-w-3xl">
          LeafSense is a deep learning and natural language processing system that
          classifies crop leaf diseases from images and text descriptions. It was
          developed as a data science capstone project by Group Seven using the
          PlantVillage dataset and subsequently migrated to a production web
          application. The system provides targeted pesticide recommendations
          alongside each diagnosis, making it a practical tool for farmers,
          agronomists, and agricultural researchers.
        </p>
      </section>

      {/* Problem statement */}
      <section aria-labelledby="problem-heading" className="card">
        <h2
          id="problem-heading"
          className="font-serif text-2xl font-semibold text-soil mb-3"
        >
          Problem Statement
        </h2>
        <p className="text-soil/70 leading-relaxed mb-3">
          Crop diseases are among the leading causes of agricultural yield loss
          globally. Misdiagnosis — or delayed diagnosis — results in the wrong
          treatments being applied, compounding economic and environmental damage.
          In sub-Saharan Africa and other smallholder farming regions, access to
          trained agronomists is limited, and farmers often rely on visual
          inspection alone.
        </p>
        <p className="text-soil/70 leading-relaxed">
          LeafSense addresses this gap by providing an accessible, AI-powered
          field tool that requires only a smartphone camera or a plain-language
          description of observed symptoms. The system operates on three high-value
          crops — pepper, potato, and tomato — which together represent a
          significant share of smallholder agricultural production across the
          continent.
        </p>
      </section>

      {/* Dataset */}
      <section aria-labelledby="dataset-heading">
        <h2
          id="dataset-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          Dataset
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card space-y-3">
            <p className="section-label">PlantVillage</p>
            <p className="text-soil/70 text-sm leading-relaxed">
              The model was trained on a subset of the publicly available
              PlantVillage dataset, sourced from Kaggle. The dataset contains
              high-resolution images of healthy and diseased crop leaves across
              15 classes spanning three crop species: pepper bell, potato, and
              tomato.
            </p>
            <dl className="space-y-1 text-sm">
              <div className="flex justify-between">
                <dt className="text-soil/50">Source</dt>
                <dd className="font-medium text-soil">PlantVillage / Kaggle</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soil/50">Total images</dt>
                <dd className="font-medium text-soil">~20,000+</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soil/50">Image size (after resize)</dt>
                <dd className="font-medium text-soil">128 × 128 px</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soil/50">Label format</dt>
                <dd className="font-medium text-soil">Categorical (one-hot)</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-soil/50">Structure</dt>
                <dd className="font-medium text-soil">Folder per class</dd>
              </div>
            </dl>
          </div>

          <div className="card space-y-3">
            <p className="section-label">15 Disease Classes</p>
            <ol className="space-y-1">
              {CNN_CLASSES.map((cls, i) => (
                <li
                  key={i}
                  id={`class-${i + 1}`}
                  className="flex gap-3 text-sm"
                >
                  <span className="text-wheat font-bold flex-shrink-0 w-5 text-right">
                    {i + 1}.
                  </span>
                  <span className="text-soil/75">{cls}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* Methodology */}
      <section aria-labelledby="methodology-heading">
        <h2
          id="methodology-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          Methodology
        </h2>
        <p className="text-soil/70 text-sm leading-relaxed mb-6 max-w-3xl">
          The project follows the CRISP-DM framework across five phases: business
          understanding, data understanding, data preparation, modelling, and
          evaluation. Two separate models were developed — a convolutional neural
          network for image classification and a Naive Bayes pipeline for text
          classification.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
          {[
            "Data Loading",
            "Augmentation",
            "Model Training",
            "Evaluation",
            "Deployment",
          ].map((step, i) => (
            <div
              key={step}
              id={`methodology-step-${i + 1}`}
              className="card-cream text-center py-4"
            >
              <div className="w-8 h-8 rounded-full bg-soil flex items-center justify-center mx-auto mb-2">
                <span className="text-wheat font-bold text-xs">{i + 1}</span>
              </div>
              <p className="text-xs font-semibold text-soil">{step}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CNN model */}
      <section aria-labelledby="cnn-heading">
        <h2
          id="cnn-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          CNN Model Architecture
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card space-y-4">
            <p className="section-label">Layer Stack</p>
            <ol className="space-y-2">
              {cnnLayers.map((layer, i) => (
                <li
                  key={layer.id}
                  id={layer.id}
                  className="flex gap-3 items-center text-sm"
                >
                  <span className="w-5 h-5 rounded-full bg-wheat/20 text-wheat font-bold text-xs flex items-center justify-center flex-shrink-0">
                    {i + 1}
                  </span>
                  <span className="text-soil/75 font-mono text-xs">{layer.name}</span>
                </li>
              ))}
            </ol>
            <p className="text-xs text-soil/50 pt-2 border-t border-cream-dark">
              Data augmentation applied: random horizontal/vertical flips, zoom
              (0.2), and width/height shifts (0.2).
            </p>
          </div>

          <div className="space-y-4">
            <div className="card">
              <p className="section-label mb-3">Performance Metrics</p>
              <dl className="space-y-2">
                {metrics.map((m) => (
                  <div key={m.label} className="flex justify-between text-sm">
                    <dt className="text-soil/55">{m.label}</dt>
                    <dd className="font-semibold text-soil">{m.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="card">
              <p className="section-label mb-2">Key Findings</p>
              <ul className="space-y-2 text-sm text-soil/70 list-none">
                <li className="flex gap-2">
                  <span className="text-sage mt-0.5 flex-shrink-0" aria-hidden="true">&#8250;</span>
                  Strong generalisation due to dropout and augmentation — minimal overfitting observed in training curves.
                </li>
                <li className="flex gap-2">
                  <span className="text-sage mt-0.5 flex-shrink-0" aria-hidden="true">&#8250;</span>
                  Highest confusion between visually similar blight classes (early vs. late blight on tomato).
                </li>
                <li className="flex gap-2">
                  <span className="text-sage mt-0.5 flex-shrink-0" aria-hidden="true">&#8250;</span>
                  Healthy classes achieve near-perfect precision and recall across all three crops.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* NLP model */}
      <section aria-labelledby="nlp-heading">
        <h2
          id="nlp-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          NLP Pipeline
        </h2>
        <div className="card max-w-3xl space-y-4">
          <p className="text-soil/70 text-sm leading-relaxed">
            The text classification pipeline uses a Multinomial Naive Bayes
            classifier with TF-IDF vectorization. Training data was sourced from a
            synthetic symptom description dataset derived from PlantVillage class
            labels, covering all 15 disease categories.
          </p>
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="card-cream">
              <dt className="section-label mb-1">Vectorizer</dt>
              <dd className="text-soil font-medium">TF-IDF (scikit-learn)</dd>
            </div>
            <div className="card-cream">
              <dt className="section-label mb-1">Classifier</dt>
              <dd className="text-soil font-medium">Multinomial Naive Bayes</dd>
            </div>
            <div className="card-cream">
              <dt className="section-label mb-1">Training data</dt>
              <dd className="text-soil font-medium">Synthetic symptom descriptions</dd>
            </div>
            <div className="card-cream">
              <dt className="section-label mb-1">Output</dt>
              <dd className="text-soil font-medium">Disease class label + recommendation</dd>
            </div>
          </dl>
          <p className="text-xs text-soil/50 border-t border-cream-dark pt-3">
            Pesticide recommendations are retrieved from a curated lookup dictionary
            keyed by class label. Healthy classes return &ldquo;No treatment required&rdquo;.
          </p>
        </div>
      </section>

      {/* Web Application */}
      <section aria-labelledby="webapp-heading" className="card">
        <h2
          id="webapp-heading"
          className="font-serif text-2xl font-semibold text-soil mb-4"
        >
          Web Application
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="section-label mb-2">Frontend</p>
            <ul className="space-y-1 text-soil/70">
              <li>Next.js 14 (App Router) on Vercel</li>
              <li>TypeScript, Tailwind CSS</li>
              <li>Image upload and live camera capture</li>
              <li>Text symptom input with example prompts</li>
            </ul>
          </div>
          <div>
            <p className="section-label mb-2">Inference Backend</p>
            <ul className="space-y-1 text-soil/70">
              <li>FastAPI service on Render</li>
              <li>TensorFlow 2.16 for CNN inference</li>
              <li>scikit-learn 1.2 for NLP pipeline</li>
              <li>Cron keep-alive to minimise cold starts</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Limitations & future */}
      <section aria-labelledby="limitations-heading">
        <h2
          id="limitations-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          Known Limitations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              id: "limitation-nlp-data",
              title: "Synthetic NLP Training Data",
              body:
                "The NLP model was trained on synthetically generated descriptions rather than real farmer reports, which may reduce its robustness on informal or regional language.",
            },
            {
              id: "limitation-dataset",
              title: "PlantVillage Distribution",
              body:
                "The PlantVillage dataset contains controlled laboratory images. The CNN may under-perform on low-quality field photographs taken in varying lighting or with soil background.",
            },
            {
              id: "limitation-coverage",
              title: "Limited Crop Coverage",
              body:
                "The system covers only three crop types (pepper, potato, tomato) and 15 disease classes. Many commercially important crops — maize, beans, cassava — are not yet supported.",
            },
          ].map((item) => (
            <div key={item.id} id={item.id} className="card-cream">
              <p className="font-serif font-semibold text-soil mb-2">{item.title}</p>
              <p className="text-sm text-soil/65 leading-relaxed">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Future work */}
      <section aria-labelledby="future-heading" className="card">
        <h2
          id="future-heading"
          className="font-serif text-2xl font-semibold text-soil mb-4"
        >
          Future Work
        </h2>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2 text-sm text-soil/70">
          {[
            "Transfer learning with EfficientNet or MobileNetV3",
            "Grad-CAM visual explainability overlays",
            "Mobile-optimised TensorFlow Lite deployment",
            "Expanded crop coverage (maize, cassava, beans)",
            "Swahili and other regional language NLP support",
            "Real-time advisory integration with agri-extension services",
            "Field image fine-tuning to reduce domain shift",
            "Early stopping and learning rate scheduling experiments",
          ].map((item, i) => (
            <li key={i} id={`future-item-${i + 1}`} className="flex gap-2">
              <span className="text-wheat font-bold flex-shrink-0" aria-hidden="true">&#8250;</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Contributors */}
      <section aria-labelledby="contributors-heading" className="border-t border-cream-dark pt-12">
        <h2
          id="contributors-heading"
          className="font-serif text-2xl font-semibold text-soil mb-6"
        >
          Contributors
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { id: "contributor-diana", name: "Diana Mayalo", role: "Data Science — Group Seven" },
            { id: "contributor-anthony", name: "Anthony Nganga Chege", role: "Data Science + Production Migration" },
            { id: "contributor-group", name: "Group Seven", role: "Data Science Collaborators" },
          ].map((person) => (
            <div key={person.id} id={person.id} className="card text-center">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sage to-soil flex items-center justify-center mx-auto mb-3">
                <span className="text-cream font-serif font-bold text-lg">
                  {person.name[0]}
                </span>
              </div>
              <p className="font-serif font-semibold text-soil">{person.name}</p>
              <p className="text-xs text-soil/55 mt-1">{person.role}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
