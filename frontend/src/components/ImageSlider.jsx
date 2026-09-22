import { useState } from "react";

// Renders a single frame: a real photo URL/base64 string, or an
// { emoji, color } placeholder object.
function Frame({ frame, emojiSize = "text-[130px]" }) {
  if (typeof frame === "string") {
    return <img src={frame} alt="" className="h-full w-full object-cover" draggable={false} />;
  }
  return (
    <div className={`flex h-full w-full items-center justify-center ${frame.color}`}>
      <span className={emojiSize}>{frame.emoji}</span>
    </div>
  );
}

export default function ImageSlider({
  images,
  className = "",
  emojiSize = "text-[130px]",
  showArrows = true,
  showDots = true,
  showCount = false,
}) {
  const [index, setIndex] = useState(0);
  const frames = images && images.length > 0 ? images : [{ emoji: "🛍️", color: "bg-[#222]" }];
  const hasMultiple = frames.length > 1;

  const stop = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const next = (e) => {
    stop(e);
    setIndex((i) => (i + 1) % frames.length);
  };

  const prev = (e) => {
    stop(e);
    setIndex((i) => (i - 1 + frames.length) % frames.length);
  };

  const goTo = (e, i) => {
    stop(e);
    setIndex(i);
  };

  return (
    <div className={`group/slider relative h-full w-full overflow-hidden ${className}`}>
      <Frame frame={frames[index]} emojiSize={emojiSize} />

      {hasMultiple && showArrows && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous photo"
            className="absolute left-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 group-hover/slider:opacity-100"
          >
            ‹
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next photo"
            className="absolute right-2 top-1/2 z-30 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-black/50 text-lg text-white opacity-0 transition-opacity duration-200 hover:bg-black/70 group-hover/slider:opacity-100"
          >
            ›
          </button>
        </>
      )}

      {hasMultiple && showDots && (
        <div className="absolute bottom-3 left-1/2 z-30 flex -translate-x-1/2 gap-1.5">
          {frames.map((_, i) => (
            <button
              type="button"
              key={i}
              onClick={(e) => goTo(e, i)}
              aria-label={`Go to photo ${i + 1}`}
              className={`h-1.5 rounded-full transition-all duration-200 ${
                i === index ? "w-5 bg-[var(--gold)]" : "w-1.5 bg-white/60 hover:bg-white"
              }`}
            />
          ))}
        </div>
      )}

      {hasMultiple && showCount && (
        <span className="absolute right-2 top-2 z-30 rounded bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white">
          {index + 1}/{frames.length}
        </span>
      )}
    </div>
  );
}
