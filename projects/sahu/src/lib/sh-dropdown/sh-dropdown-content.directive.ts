import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[shDropdownContent]'
})
export class ShDropdownContentDirective {
  constructor(public templateRef: TemplateRef<any>) { }
}