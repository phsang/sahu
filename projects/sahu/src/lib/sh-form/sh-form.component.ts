import { isPlatformBrowser } from '@angular/common';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, Output, PLATFORM_ID, ViewChild } from '@angular/core';
import { mfValidation } from '../utils/mf.validation';

@Component({
  selector: 'sh-form',
  templateUrl: './sh-form.component.html',
  styleUrls: ['./sh-form.component.scss'],
  providers: [mfValidation]
})
export class ShFormComponent implements AfterViewInit, OnDestroy {
  @ViewChild('shForm', { static: true }) shForm!: ElementRef;
  @Input() shClass?: string;
  @Output() shSubmit = new EventEmitter<Event>();
  private observer!: MutationObserver;

  constructor(
    private cdr: ChangeDetectorRef,
    private validation: mfValidation,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      this.validation.init(this.shForm.nativeElement);

      // Khởi tạo MutationObserver
      this.observer = new MutationObserver(() => {
        this.validation.init(this.shForm.nativeElement);
      });

      // Theo dõi các thay đổi trong form
      this.observer.observe(this.shForm.nativeElement, {
        childList: true, // Theo dõi thêm/xóa phần tử con
        subtree: true    // Bao gồm cả các phần tử con cấp sâu hơn
      });
    }
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.validation.detectAll(this.shForm.nativeElement, true)) {
      this.shSubmit.emit(event);
    }
  }

  ngOnDestroy(): void {
    // Hủy MutationObserver khi component bị destroy
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
