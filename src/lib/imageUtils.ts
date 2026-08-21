export interface ProcessedImageResult {
  file: File;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
}

export const PRODUCT_IMAGE_DIMENSIONS = {
  width: 1600,
  height: 1600,
  label: "Max 1600px (High Res)",
  aspectRatio: "Natural / Crisp",
};

export const CATEGORY_IMAGE_DIMENSIONS = {
  width: 1600,
  height: 1600,
  label: "Max 1600px (High Res)",
  aspectRatio: "Natural / Crisp",
};

/**
 * Optimizes an uploaded image without adding artificial padding or letterboxing.
 * Preserves the natural aspect ratio while ensuring ultra-crisp high resolution (up to maxDimension).
 */
export async function processAndResizeImage(
  file: File,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      // If image is within bounds, keep exact original aspect ratio and resolution
      let targetW = origW;
      let targetH = origH;

      if (origW > maxWidth || origH > maxHeight) {
        const ratio = Math.min(maxWidth / origW, maxHeight / origH);
        targetW = Math.round(origW * ratio);
        targetH = Math.round(origH * ratio);
      }

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // Ultra high-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Transparent for PNG/WEBP, clean white only for JPG
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetW, targetH);
      } else {
        ctx.clearRect(0, 0, targetW, targetH);
      }

      ctx.drawImage(img, 0, 0, targetW, targetH);

      const outputMime = file.type === 'image/png' ? 'image/png' : 'image/jpeg';
      
      canvas.toBlob(
        (blob) => {
          URL.revokeObjectURL(objectUrl);
          if (!blob) {
            reject(new Error('Canvas image blob generation failed'));
            return;
          }

          const resizedFile = new File([blob], file.name, {
            type: outputMime,
            lastModified: Date.now(),
          });

          const previewUrl = URL.createObjectURL(resizedFile);

          resolve({
            file: resizedFile,
            width: targetW,
            height: targetH,
            originalWidth: origW,
            originalHeight: origH,
            previewUrl,
          });
        },
        outputMime,
        0.98 // Near-lossless high fidelity
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
