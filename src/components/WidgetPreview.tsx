import React, { useState } from "react";

type Props = {
  onGenerate?: (story: string) => Promise<any>; // optional override to call the real generator
};

export default function WidgetPreview({ onGenerate }: Props) {
  const [story, setStory] = useState<string>("A character inspired by a novel visiting the old port of Lisbon...");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [captured, setCaptured] = useState(false);

  const generate = async () => {
    setLoading(true);
    setPreview(null);
    try {
      if (onGenerate) {
        const res = await onGenerate(story);
        // Expect res.previewHtml or similar from your API / Results flow
        setPreview(res?.previewHtml || JSON.stringify(res, null, 2));
      } else {
        // Placeholder preview: replace with call to your generation endpoint or app route
        const sample = `<h3 class="text-xl font-semibold">Sample Inspired Guide</h3><p>${story}</p><ul><li>Day 1: Explore the old port</li><li>Day 2: Visit the filming locations</li></ul>`;
        setPreview(sample);
      }
    } catch (err) {
      setPreview("Failed to generate preview. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const captureEmail = () => {
    // Progressive capture: require email to download full guide
    // Wire this to your CRM / lead-capture endpoint. Here we just simulate.
    if (!email) return alert("Please enter an email to receive the full guide");
    setCaptured(true);
    // TODO: POST to /api/leads with story + email
  };

  return (
    <section className="bg-gradient-to-r from-kultrip-purple/5 to-kultrip-orange/5 rounded-lg p-6 shadow max-w-4xl mx-auto">
      <h3 className="text-2xl font-semibold mb-2">Try the Kultrip widget — turn inspirations into a guide</h3>
      <p className="text-sm text-gray-700 mb-4">Paste a movie, book, or short story and see a sample itinerary instantly.</p>

      <div className="mb-3">
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={4}
          className="w-full border p-3 rounded"
        />
      </div>

      <div className="flex gap-2 mb-4">
        <button className="px-4 py-2 bg-kultrip-purple text-white rounded" onClick={generate} disabled={loading}>
          {loading ? "Generating..." : "Generate sample guide"}
        </button>
        <button
          className="px-4 py-2 border rounded"
          onClick={() =>
            setStory(
              "Inspired by 'Under the Tuscan Sun' — a relaxed 7-day food & countryside escape across Tuscany."
            )
          }
        >
          Try sample prompt
        </button>
      </div>

      <div className="mb-4">
        {preview ? (
          <div className="bg-white rounded p-4 border" dangerouslySetInnerHTML={{ __html: preview }} />
        ) : (
          <div className="text-sm text-gray-600">No preview yet — generate a sample guide to see how Kultrip works.</div>
        )}
      </div>

      {preview && !captured && (
        <div className="mt-4 p-4 rounded bg-white border">
          <div className="text-sm text-gray-700 mb-2">To download the full branded guide, enter your email</div>
          <div className="flex gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@agency.com"
              className="p-2 border rounded flex-1"
            />
            <button className="px-4 py-2 bg-kultrip-orange text-white rounded" onClick={captureEmail}>
              Send me the guide
            </button>
          </div>
          <div className="text-xs text-gray-500 mt-2">We’ll email the guide and optionally follow up to show a full demo.</div>
        </div>
      )}

      {captured && (
        <div className="mt-4 text-sm text-green-700">Thanks — we’ve sent the guide and a link to schedule a demo.</div>
      )}
    </section>
  );
}
