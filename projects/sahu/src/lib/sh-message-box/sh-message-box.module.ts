import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShMessageBoxComponent } from './sh-message-box.component';

@NgModule({
  declarations: [ShMessageBoxComponent],
  imports: [CommonModule],
  exports: [ShMessageBoxComponent]
})
export class ShMessageBoxModule {}