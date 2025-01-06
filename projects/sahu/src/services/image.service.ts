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
      objectFit: 'cover', // Options: 'cover' | 'contain'
      backgroundColor: 'transparent', // Use 'transparent' or any color
      outputFormat: 'png', // Change to 'jpeg' or 'webp' if needed
    };
    let options = { ..._default, ...param };
    options.outputFormat = 'image/' + options.outputFormat;

    const img = new Image();
    const blobURL = URL.createObjectURL(options.file);

    return new Promise<File>((resolve, reject) => {
      img.onload = async () => {
        try {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          canvas.width = options.width;
          canvas.height = options.height;

          // Calculate aspect ratios
          const imgAspectRatio = img.width / img.height;
          const targetAspectRatio = options.width / options.height;

          let drawWidth = options.width;
          let drawHeight = options.height;
          let offsetX = 0;
          let offsetY = 0;

          if (options.objectFit === 'cover') {
            // Resize to cover the target dimensions
            if (imgAspectRatio > targetAspectRatio) {
              drawWidth = options.height * imgAspectRatio;
              offsetX = -(drawWidth - options.width) / 2; // Center horizontally
            } else {
              drawHeight = options.width / imgAspectRatio;
              offsetY = -(drawHeight - options.height) / 2; // Center vertically
            }
          } else if (options.objectFit === 'contain') {
            // Resize to fit within the target dimensions
            if (imgAspectRatio > targetAspectRatio) {
              drawHeight = options.width / imgAspectRatio;
              offsetY = (options.height - drawHeight) / 2; // Center vertically
            } else {
              drawWidth = options.height * imgAspectRatio;
              offsetX = (options.width - drawWidth) / 2; // Center horizontally
            }

            // Fill canvas background color if not transparent
            if (options.backgroundColor !== 'transparent') {
              ctx.fillStyle = options.backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }

          // Draw the image
          ctx.drawImage(img, offsetX, offsetY, drawWidth, drawHeight);

          // Compress the resized image
          const blob = await this.pica.toBlob(
            canvas,
            options.outputFormat,
            options.quality
          );

          // Create a new File object from the Blob
          const resizedFile = new File([blob], options.file.name, {
            type: options.outputFormat,
          });

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
