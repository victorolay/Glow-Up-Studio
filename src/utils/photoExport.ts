import type { RenderLayer } from '@/game/types';

/** Draw a photo composition (background + ordered layers) to a canvas. */

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export interface PhotoComposition {
  backgroundSrc: string;
  layers: RenderLayer[];
  filterCss?: string;
  width?: number;
  height?: number;
}

export async function renderPhotoToBlob(composition: PhotoComposition): Promise<Blob> {
  const width = composition.width ?? 600;
  const height = composition.height ?? 1280;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  const filter = composition.filterCss && composition.filterCss !== 'none' ? composition.filterCss : undefined;

  const draw = async (src: string, blend?: string, opacity?: number) => {
    const img = await loadImage(src);
    ctx.save();
    if (filter) ctx.filter = filter;
    if (blend && blend !== 'normal') {
      ctx.globalCompositeOperation = blend as GlobalCompositeOperation;
    }
    ctx.globalAlpha = opacity ?? 1;
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
  };

  await draw(composition.backgroundSrc);
  for (const layer of composition.layers) {
    await draw(layer.src, layer.blend, layer.opacity);
  }

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error('toBlob failed'))),
      'image/png',
    );
  });
}

export async function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

/** Downscale a data-url image for lookbook thumbnails. */
export async function makeThumbnail(dataUrl: string, targetH = 384): Promise<string> {
  const img = await loadImage(dataUrl);
  const scale = targetH / img.height;
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(img.width * scale);
  canvas.height = targetH;
  const ctx = canvas.getContext('2d');
  if (!ctx) return dataUrl;
  ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas.toDataURL('image/jpeg', 0.72);
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
