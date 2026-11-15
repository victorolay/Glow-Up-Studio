interface PreviewThumbProps {
  src: string;
  /** Vertical focus point in SVG canvas coordinates (0-1600). */
  focusY?: number;
  /** Horizontal focus point in SVG canvas coordinates (0-1000). */
  focusX?: number;
  zoom?: number;
  height?: number;
}

/** Cropped preview of a full-canvas layer asset (placeholder pipeline, 600×1280). */
export function PreviewThumb({ src, focusY = 500, focusX = 300, zoom = 0.75, height = 96 }: PreviewThumbProps) {
  const w = 600 * zoom;
  const h = 1280 * zoom;
  return (
    <div className="relative w-full overflow-hidden rounded-xl bg-surface-2" style={{ height }} aria-hidden="true">
      <img
        src={src}
        alt=""
        draggable={false}
        className="absolute max-w-none"
        style={{
          width: w,
          height: h,
          left: `calc(50% - ${focusX * zoom}px)`,
          top: `${height / 2 - focusY * zoom}px`,
        }}
      />
    </div>
  );
}
