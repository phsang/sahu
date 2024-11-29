import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShSlideshowComponent } from './sh-slideshow.component';
import { FormsModule } from '@angular/forms';

@NgModule({
  declarations: [ShSlideshowComponent],
  imports: [CommonModule, FormsModule],
  exports: [ShSlideshowComponent],
})
export class ShSlideshowModule { }
