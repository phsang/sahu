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
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.shData.length) % this.shData.length;
    this.popupContainer.nativeElement.classList.remove('slide-next');
  }

  onSlideLoad(index: number) {
    this.slideLoaded[index] = true;

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

    // giá trị width, height sau khi zoom
    let newWidth = imgW * (percentZoom / 100);
    let newHeight = imgH * (percentZoom / 100);
    this.slideStyles[index] = {
      zoom: percentZoom / 100,
      rotate: 0,
      left: (parW - newWidth) / 2,
      top: (parH - newHeight) / 2,
    }

    console.log(index);
    console.log(imgW, imgH, parW, parH, newWidth, newHeight);
    console.log(this.slideStyles);

    this.popupContainer.nativeElement.querySelector('#slide-' + index + ' img').style.left = this.slideStyles[index].left + 'px';
    this.popupContainer.nativeElement.querySelector('#slide-' + index + ' img').style.top = this.slideStyles[index].top + 'px';
    this.popupContainer.nativeElement.querySelector('#slide-' + index + ' img').style.transform = `rotate(${this.slideStyles[index].rotate}deg) scale(${this.slideStyles[index].zoom})`;
  }
}
