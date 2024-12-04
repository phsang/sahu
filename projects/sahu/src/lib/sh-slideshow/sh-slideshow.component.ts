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
  slideMove = false;
  positionX = 0;
  positionY = 0;

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

    this.applyStyle(this.currentIndex);
  }

  previousSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.shData.length) % this.shData.length;
    this.popupContainer.nativeElement.classList.remove('slide-next');

    this.applyStyle(this.currentIndex);
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

      setTimeout(() => {
        let currentSlide = this.popupContainer.nativeElement.querySelector('#slide-' + this.currentIndex);
        for (let i = 0; i < this.slideStyles.length; i++) {
          let percentZoom = 100;
          let imgW = this.slideStyles[i].width;
          let imgH = this.slideStyles[i].height;
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

          this.slideStyles[i] = {
            zoom: percentZoom / 100,
            rotate: 0,
            left: (parW - imgW) / 2,
            top: (parH - imgH) / 2,
          }
        }

        this.applyStyle(this.currentIndex);
      }, 10);
    }
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

  onSlideMouseDown(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.popupContainer.nativeElement.classList.add('dragging');
    this.slideMove = true;

    this.positionX = event.clientX;
    this.positionY = event.clientY;
  }

  onSlideMouseMove(event: MouseEvent, index: number) {
    if (!this.slideMove) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    let _newX = event.clientX - this.positionX;
    let _newY = event.clientY - this.positionY;

    console.log(event.clientX, event.clientY, this.positionX, this.positionY, _newX, _newY);
    console.log(this.slideStyles[index].left, this.slideStyles[index].top);

    this.slideStyles[index].left += _newX;
    this.slideStyles[index].top += _newY;

    this.applyStyle(index);
  }

  onSlideMouseUp(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.popupContainer.nativeElement.classList.remove('dragging');
    this.slideMove = false;
  }
}
