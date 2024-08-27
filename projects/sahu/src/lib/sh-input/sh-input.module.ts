import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ShInputDirective } from './sh-input.directive';

@NgModule({
  declarations: [ShInputDirective],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports: [ShInputDirective]
})
export class ShInputModule { }
