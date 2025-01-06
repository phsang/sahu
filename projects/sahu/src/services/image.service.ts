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
  async applySharpenFilter(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    // Sharpen kernel
    const sharpenKernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0,
    ];

    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;
    const newImageData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const index = (y * width + x) * 4;

        // Apply the kernel to each color channel
        for (let channel = 0; channel < 3; channel++) {
          let newValue = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const neighborIndex =
                ((y + ky) * width + (x + kx)) * 4 + channel;
              const kernelValue = sharpenKernel[(ky + 1) * 3 + (kx + 1)];
              newValue += data[neighborIndex] * kernelValue;
            }
          }
          newImageData[index + channel] = Math.min(
            255,
            Math.max(0, newValue)
          );
        }
        // Preserve alpha channel
        newImageData[index + 3] = data[index + 3];
      }
    }

    // Update canvas with sharpened image data
    ctx.putImageData(new ImageData(newImageData, width, height), 0, 0);
  }

  async applyMedianFilter(canvas: HTMLCanvasElement): Promise<void> {
    const ctx = canvas.getContext('2d')!;
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    const width = imageData.width;
    const height = imageData.height;

    const newData = new Uint8ClampedArray(data);

    const getPixel = (x: number, y: number, channel: number) => {
      const index = (y * width + x) * 4 + channel;
      return data[index];
    };

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let channel = 0; channel < 3; channel++) {
          const neighbors = [];

          // Lấy giá trị pixel của vùng lân cận (3x3)
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              neighbors.push(getPixel(x + kx, y + ky, channel));
            }
          }

          // Lấy giá trị trung vị và gán lại pixel
          neighbors.sort((a, b) => a - b);
          const medianValue = neighbors[Math.floor(neighbors.length / 2)];
          const index = (y * width + x) * 4 + channel;
          newData[index] = medianValue;
        }
      }
    }

    ctx.putImageData(new ImageData(newData, width, height), 0, 0);
  }

  async resizeAndCompressImage(param: any): Promise<File> {
    const _default: any = {
      file: null,
      quality: 100,
      width: 300,
      height: 300,
      objectFit: 'cover', // Options: 'cover' | 'contain'
      backgroundColor: 'transparent', // Use 'transparent' or any color
      format: 'png', // Change to 'jpeg' or 'webp' if needed
      sharpen: false,
      median: false,
    };
    let options = { ..._default, ...param };

    // sử dụng định dạng jpeg để hỗ trợ nén ảnh (vì png không hỗ trợ nén ảnh)
    // nếu tồn tại quality và không tồn tại format
    if (param.quality && !param.format) {
      options.format = 'jpeg';
    }
    options.format = 'image/' + options.format;

    const img = new Image();
    const blobURL = URL.createObjectURL(options.file);

    return new Promise<File>((resolve, reject) => {
      img.onload = async () => {
        try {
          // Create a canvas element
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d')!;

          let targetWidth = options.width;
          let targetHeight = options.height;

          const imgAspectRatio = img.width / img.height;
          const targetAspectRatio = options.width / options.height;

          if (options.objectFit === 'cover') {
            if (imgAspectRatio > targetAspectRatio) {
              canvas.height = options.height;
              canvas.width = canvas.height * img.width / img.height;
            } else {
              canvas.width = options.width;
              canvas.height = canvas.width * img.height / img.width;
            }
          }
          if (options.objectFit === 'contain') {
            canvas.width = options.width;
            canvas.height = options.height;

            if (imgAspectRatio > targetAspectRatio) {
              targetHeight = options.width * img.height / img.width;
            } else {
              targetWidth = options.height * img.width / img.height;
            }

            if (options.backgroundColor !== 'transparent') {
              ctx.fillStyle = options.backgroundColor;
              ctx.fillRect(0, 0, canvas.width, canvas.height);
            }
          }

          // Draw the image centered on the canvas
          const offsetX = (canvas.width - targetWidth) / 2;
          const offsetY = (canvas.height - targetHeight) / 2;

          if (options.objectFit === 'contain') {
            ctx.drawImage(img, 0, 0, img.width, img.height, offsetX, offsetY, targetWidth, targetHeight);
          }
          if (options.objectFit === 'cover') {
            ctx.drawImage(img, 0, 0, img.width, img.height, 0, 0, canvas.width, canvas.height);
          }
          if (options.median) {
            await this.applyMedianFilter(canvas);
          }
          if (options.sharpen) {
            await this.applySharpenFilter(canvas);
          }

          // Compress the resized image
          const blob = await this.pica.toBlob(
            canvas,
            options.format,
            options.quality / 100
          );

          // Create a new File object from the Blob
          const fileName = options.file.name.replace(/\.\w+$/, `.${options.format.split('/')[1]}`);
          const resizedFile = new File([blob], fileName, {
            type: options.format,
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
