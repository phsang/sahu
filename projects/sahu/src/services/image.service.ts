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
      height: 300
    };
    let options = { ..._default, ...param };
    const img = new Image();
    const blobURL = URL.createObjectURL(options.file);

    return new Promise<File>((resolve, reject) => {
      img.onload = async () => {
        try {
          // Create a canvas element for resizing
          const canvas = document.createElement('canvas');
          canvas.width = options.width;
          canvas.height = options.height;

          // Resize the image using Pica
          const resizedCanvas = await this.pica.resize(img, canvas);

          // Compress the resized image
          const blob = await this.pica.toBlob(resizedCanvas, 'image/jpeg', options.quality);

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
