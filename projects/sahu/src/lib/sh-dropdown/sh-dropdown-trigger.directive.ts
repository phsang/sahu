import { Directive, ElementRef } from '@angular/core';

@Directive({
  selector: '[shDropdownTrigger]'
})
export class ShDropdownTriggerDirective {
  constructor(public elementRef: ElementRef) { }
}