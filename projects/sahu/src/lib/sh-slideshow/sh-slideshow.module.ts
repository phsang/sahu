import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ShButtonModule } from '../sh-button';
import { ShSlideshowComponent } from './sh-slideshow.component';

@NgModule({
  declarations: [ShSlideshowComponent],
  imports: [
    FormsModule,
    CommonModule,
    ShButtonModule,
  ],
  exports: [ShSlideshowComponent],
})
export class ShSlideshowModule { }
