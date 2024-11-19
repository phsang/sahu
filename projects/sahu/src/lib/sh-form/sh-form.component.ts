import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, Output, PLATFORM_ID, SimpleChanges, ViewChild } from '@angular/core';
import { mfValidation } from '../utils/mf.validation';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'sh-form',
  templateUrl: './sh-form.component.html',
  styleUrls: ['./sh-form.component.scss'],
  providers: [mfValidation]
})
export class ShFormComponent implements AfterViewInit, OnChanges {
  @ViewChild('shForm') shForm!: ElementRef;
  @Input() shClass?: string;
  @Output() shSubmit = new EventEmitter<Event>();

  constructor(
    private cdr: ChangeDetectorRef,
    private validation: mfValidation,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    if (isPlatformBrowser(this.platformId)) {
      this.validation.init(this.shForm.nativeElement);
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    if (this.validation.detectAll(this.shForm.nativeElement, true)) {
      this.shSubmit.emit(event);
    }
  }
}
