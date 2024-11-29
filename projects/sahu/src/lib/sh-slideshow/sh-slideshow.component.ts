import { AfterViewInit, Component, ElementRef, Input, OnInit, Renderer2, ViewChild } from '@angular/core';

@Component({
  selector: 'sh-slideshow',
  templateUrl: './sh-slideshow.component.html',
  styleUrls: ['./sh-slideshow.component.scss'],
})
export class ShSlideshowComponent {
  @ViewChild('popupContainer', { static: false }) popupContainer!: ElementRef;

  @Input() shData: any[] = [];
  slideLoaded: boolean[] = [];
  currentIndex = 0;
  isPopupOpen = false;

  constructor(private renderer: Renderer2) { }

  openPopup(index: number) {
    this.currentIndex = index;
    this.isPopupOpen = true;

    this.slideLoaded = new Array(this.shData.length).fill(false);

    // Nếu popup được hiển thị, di chuyển vào body
    setTimeout(() => {
      if (this.isPopupOpen && this.popupContainer) {
        this.renderer.appendChild(document.body, this.popupContainer.nativeElement);
      }
    }, 10);
  }

  closePopup() {
    this.popupContainer.nativeElement.classList.remove('show');

    setTimeout(() => {
      this.isPopupOpen = false;
    }, 400);
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.shData.length;
  }

  previousSlide() {
    this.currentIndex =
      (this.currentIndex - 1 + this.shData.length) % this.shData.length;
  }

  onSlideLoad(index: number) {
    this.slideLoaded[index] = true;

    if (this.slideLoaded.every(x => x)) {
      this.popupContainer.nativeElement.classList.add('show');
    }
  }
}
