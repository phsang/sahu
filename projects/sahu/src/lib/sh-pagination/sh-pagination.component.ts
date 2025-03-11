import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'sh-pagination',
  templateUrl: './sh-pagination.component.html',
  styles: [`
    .pagination-container {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    button:disabled {
      opacity: 0.5;
    }
  `]
})
export class ShPaginationComponent {
  @Input() shTotal = 100;
  @Input() itemsPerPage = 10;
  @Input() shPage = 1;
  @Input() shShowSizeChanger = false;
  @Input() pageSizeOptions = [10, 20, 30, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  get totalPages() {
    return Math.ceil(this.shTotal / this.itemsPerPage);
  }

  prevPage() {
    if (this.shPage > 1) {
      this.shPage--;
      this.pageChange.emit(this.shPage);
    }
  }

  nextPage() {
    if (this.shPage < this.totalPages) {
      this.shPage++;
      this.pageChange.emit(this.shPage);
    }
  }

  onSizeChange() {
    this.shPage = 1;
    this.pageSizeChange.emit(this.itemsPerPage);
    this.pageChange.emit(this.shPage);
  }
}
