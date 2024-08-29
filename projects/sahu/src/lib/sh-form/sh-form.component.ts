import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { mfValidation } from '../utils/mf.validation';

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
    private validation: mfValidation
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
    this.validation.init(document.getElementById('sh-form') as HTMLFormElement);
  }

  ngOnChanges(changes: SimpleChanges): void {
  }

  handleSubmit(event: Event): void {
    event.preventDefault();
    let form = document.getElementById('sh-form') as HTMLFormElement;
    if (this.validation.detectAll(form)) {
      this.shSubmit.emit(event);
    }
  }
}
