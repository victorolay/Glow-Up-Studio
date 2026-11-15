import type { PhotoFraming, RenderLayer } from '@/game/types';

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
  framing?: PhotoFraming;
  magazineCover?: { title: string; subtitle: string } | null;
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
  const framing = composition.framing ?? 'full';
  const zoom = framing === 'portrait' ? 2.45 : framing === 'half' ? 1.52 : 1;
  const originY = framing === 'portrait' ? 0.03 : framing === 'half' ? 0.16 : 0.5;

  const draw = async (src: string, blend?: string, opacity?: number, applyFraming = true) => {
    const img = await loadImage(src);
    ctx.save();
    if (filter) ctx.filter = filter;
    if (blend && blend !== 'normal') {
      ctx.globalCompositeOperation = blend as GlobalCompositeOperation;
    }
    ctx.globalAlpha = opacity ?? 1;
    if (applyFraming && zoom > 1) {
      const cx = width * 0.5;
      const cy = height * originY;
      ctx.translate(cx, cy);
      ctx.scale(zoom, zoom);
      ctx.translate(-cx, -cy);
    }
    ctx.drawImage(img, 0, 0, width, height);
    ctx.restore();
  };

  await draw(composition.backgroundSrc, undefined, 1, false);
  for (const layer of composition.layers) {
    await draw(layer.src, layer.blend, layer.opacity, true);
  }

  if (composition.magazineCover) {
    // Editorial cover typography overlay
    ctx.save();
    const topGrad = ctx.createLinearGradient(0, 0, 0, height * 0.12);
    topGrad.addColorStop(0, 'rgba(20, 14, 24, 0.56)');
    topGrad.addColorStop(1, 'rgba(20, 14, 24, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(0, 0, width, height * 0.12);

    const botGrad = ctx.createLinearGradient(0, height * 0.74, 0, height);
    botGrad.addColorStop(0, 'rgba(20, 14, 24, 0)');
    botGrad.addColorStop(1, 'rgba(20, 14, 24, 0.74)');
    ctx.fillStyle = botGrad;
    ctx.fillRect(0, height * 0.74, width, height * 0.26);

    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 250, 246, 0.96)';
    ctx.font = '700 42px Georgia, serif';
    ctx.fillText('GLOW UP', width / 2, 54);

    ctx.font = '600 11px system-ui, sans-serif';
    ctx.fillStyle = '#e6c36a';
    ctx.fillText('ATELIER EDITORIAL · COLLECTOR ISSUE', width / 2, 73);

    ctx.textAlign = 'left';
    ctx.fillStyle = '#ffffff';
    ctx.font = '700 40px Georgia, serif';
    ctx.fillText(composition.magazineCover.title, 42, height - 110);

    ctx.fillStyle = 'rgba(255, 245, 240, 0.88)';
    ctx.font = '500 22px system-ui, sans-serif';
    ctx.fillText(composition.magazineCover.subtitle, 42, height - 72);

    ctx.strokeStyle = 'rgba(255,255,255,0.45)';
    ctx.lineWidth = 3;
    ctx.strokeRect(18, 18, width - 36, height - 36);
    ctx.restore();
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
