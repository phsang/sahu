import { Injectable } from '@angular/core';
// @ts-ignore
import Pica from 'pica';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private pica: Pica;

  constructor() {
    this.pica = new Pica();
  }

  /**
   * Resize and compress an image
   * @param file - The original image file
   * @param quality - The desired image quality (0.1 to 1)
   * @param width - The target width
   * @param height - The target height
   * @returns A Promise that resolves to a File
   */
  async resizeAndCompressImage(param: any): Promise<File> {
    const _default: any = {
      file: null,
      quality: 100,
      width: 300,
      height: 300,
    };
    let options = { ..._default, ...param };

    const img = new Image();
    const blobURL = URL.createObjectURL(options.file);

    return new Promise<File>((resolve, reject) => {
      img.onload = async () => {
        try {
          // Create a canvas element for resizing
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          // Calculate aspect ratio
          const aspectRatio = img.width / img.height;

          // Adjust width and height to maintain aspect ratio
          let targetWidth = options.width;
          let targetHeight = options.height;

          if (img.width > img.height) {
            targetHeight = Math.round(targetWidth / aspectRatio);
          } else {
            targetWidth = Math.round(targetHeight * aspectRatio);
          }

          canvas.width = targetWidth;
          canvas.height = targetHeight;

          // Fill canvas with white background (optional for JPEG images)
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, targetWidth, targetHeight);

          // Draw the image on the canvas
          ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

          // Compress the resized image
          const blob = await this.pica.toBlob(canvas, 'image/jpeg', options.quality);

          // Create a new File object from the Blob
          const resizedFile = new File([blob], options.file.name, { type: 'image/jpeg' });

          // Clean up resources
          URL.revokeObjectURL(blobURL);

          resolve(resizedFile);
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = (error) => reject(error);
      img.src = blobURL;
    });
  }

}
