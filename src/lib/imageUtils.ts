export interface ProcessedImageResult {
  file: File;
  width: number;
  height: number;
  originalWidth: number;
  originalHeight: number;
  previewUrl: string;
}

export const PRODUCT_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 1600,
  label: "1200 × 1600 px",
  aspectRatio: "3:4 (Portrait)",
};

export const CATEGORY_IMAGE_DIMENSIONS = {
  width: 1200,
  height: 1600,
  label: "1200 × 1600 px",
  aspectRatio: "3:4 (Portrait)",
};

/**
 * Resizes an uploaded image file to the proper specified dimensions (targetWidth x targetHeight)
 * using HTML5 Canvas. Returns the optimized File, exact dimensions, and preview URL.
 */
export async function processAndResizeImage(
  file: File,
  targetWidth: number,
  targetHeight: number,
  fitMode: 'contain' | 'cover' | 'stretch' = 'contain'
): Promise<ProcessedImageResult> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      const origW = img.naturalWidth || img.width;
      const origH = img.naturalHeight || img.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetWidth;
      canvas.height = targetHeight;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Failed to create canvas context'));
        return;
      }

      // High-quality image smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';

      // Background canvas fill for transparency preservation or white background
      if (file.type === 'image/jpeg' || file.type === 'image/jpg') {
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, targetWidth, targetHeight);
      } else {
        ctx.clearRect(0, 0, targetWidth, targetHeight);
      }

      let drawW = targetWidth;
      let drawH = targetHeight;
      let drawX = 0;
      let drawY = 0;

      if (fitMode === 'contain') {
        const scale = Math.min(targetWidth / origW, targetHeight / origH);
        drawW = Math.round(origW * scale);
        drawH = Math.round(origH * scale);
        drawX = Math.round((targetWidth - drawW) / 2);
        drawY = Math.round((targetHeight - drawH) / 2);
      } else if (fitMode === 'cover') {
        const scale = Math.max(targetWidth / origW, targetHeight / origH);
        drawW = Math.round(origW * scale);
        drawH = Math.round(origH * scale);
        drawX = Math.round((targetWidth - drawW) / 2);
        drawY = Math.round((targetHeight - drawH) / 2);
      }

      ctx.drawImage(img, drawX, drawY, drawW, drawH);

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
            width: targetWidth,
            height: targetHeight,
            originalWidth: origW,
            originalHeight: origH,
            previewUrl,
          });
        },
        outputMime,
        0.92
      );
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(err);
    };

    img.src = objectUrl;
  });
}
