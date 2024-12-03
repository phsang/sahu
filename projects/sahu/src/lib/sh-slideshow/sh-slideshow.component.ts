import { Component, ElementRef, Input, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-slideshow',
  templateUrl: './sh-slideshow.component.html',
  styleUrls: ['./sh-slideshow.component.scss']
})
export class ShSlideshowComponent {
  @ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;

  @Input() shData: any[] = [];
  slideLoaded: boolean[] = [];
  currentIndex = 0;
  isPopupOpen = false;

  // Mảng chứa giá trị style cho riêng mỗi slide
  slideStyles: any[] = [];

  constructor(private renderer: Renderer2) { }

  openPopup(index: number) {
    this.currentIndex = index;
    this.isPopupOpen = true;

    this.slideLoaded = new Array(this.shData.length).fill(false);

    // Nếu popup được hiển thị, di chuyển vào body
    setTimeout(() => {
      if (this.isPopupOpen && this.popupContainer) {
        this.renderer.appendChild(document.body, this.popupContainer.nativeElement);

        setTimeout(() => {
          this.popupContainer.nativeElement.classList.add('show');
        }, 10);
      }
    }, 10);
  }

  closePopup() {
    this.popupContainer.nativeElement.classList.remove('loaded');
    this.popupContainer.nativeElement.classList.remove('show');

    setTimeout(() => {
      this.isPopupOpen = false;
    }, 400);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.shData.length;
    this.popupContainer.nativeElement.classList.add('slide-next');

    if (this.slideStyles[this.currentIndex]) {
      this.applyStyle(this.currentIndex);
    } else {
      setTimeout(() => {
        this.slideAnimation(this.currentIndex);
      }, 200);
    }
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.shData.length) % this.shData.length;
    this.popupContainer.nativeElement.classList.remove('slide-next');

    if (this.slideStyles[this.currentIndex]) {
      this.applyStyle(this.currentIndex);
    } else {
      setTimeout(() => {
        this.slideAnimation(this.currentIndex);
      }, 200);
    }
  }

  onSlideLoad(event: Event, index: number) {
    this.slideLoaded[index] = true;

    const imgElement = event.target as HTMLImageElement;
    this.slideStyles[index] = {
      'width': imgElement.naturalWidth,
      'height': imgElement.naturalHeight
    }

    if (this.slideLoaded.every(x => x)) {
      this.popupContainer.nativeElement.classList.add('loaded');

      this.slideAnimation(this.currentIndex);
    }
  }

  slideAnimation(index: number) {
    let currentSlide = this.popupContainer.nativeElement.querySelector('#slide-' + index);

    let percentZoom = 100;
    let imgW = currentSlide.querySelector('img').offsetWidth;
    let imgH = currentSlide.querySelector('img').offsetHeight;
    let parW = currentSlide.offsetWidth;
    let parH = currentSlide.offsetHeight;
    if ((imgW > imgH) && (imgW >= parW)) {
      percentZoom = (parW / imgW) * 100;
    } else if ((imgH > imgW) && (imgH >= parH)) {
      percentZoom = (parH / imgH) * 100;
    } else if (imgH === imgW) {
      percentZoom = 100;
      if (imgW > parW) {
        percentZoom = (parW / imgW) * 100;
      }
      if (imgH > parH) {
        percentZoom = (parH / imgH) * 100;
      }
    }

    console.log(percentZoom, imgW, imgH, parW, parH);

    this.slideStyles[index] = {
      zoom: percentZoom / 100,
      rotate: 0,
      left: (parW - imgW) / 2,
      top: (parH - imgH) / 2,
    }

    console.log(this.slideStyles);

    this.applyStyle(index);
  }

  applyStyle(index: number) {
    let currentImg = this.popupContainer.nativeElement.querySelector('#slide-' + index + ' img');

    currentImg.style.left = this.slideStyles[index].left + 'px';
    currentImg.style.top = this.slideStyles[index].top + 'px';
    currentImg.style.transform = `rotate(${this.slideStyles[index].rotate}deg) scale(${this.slideStyles[index].zoom})`;
  }

  zoomIn() {
    if (this.slideStyles[this.currentIndex].zoom >= 3) {
      return;
    }

    this.slideStyles[this.currentIndex].zoom += 0.1;
    this.applyStyle(this.currentIndex);
  }

  zoomOut() {
    if (this.slideStyles[this.currentIndex].zoom <= 0.1) {
      return;
    }

    this.slideStyles[this.currentIndex].zoom -= 0.1;
    this.applyStyle(this.currentIndex);
  }

  zoomReset() {
    this.slideStyles[this.currentIndex].zoom = 1;
    this.applyStyle(this.currentIndex);
  }

  rotateLeft() {
    this.slideStyles[this.currentIndex].rotate -= 90;
    this.applyStyle(this.currentIndex);
  }

  rotateRight() {
    this.slideStyles[this.currentIndex].rotate += 90;
    this.applyStyle(this.currentIndex);
  }
}
