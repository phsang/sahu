import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sh-pagination',
  templateUrl: './sh-pagination.component.html',
})
export class ShPaginationComponent implements OnInit {
  @Input() shTotal = 0;
  @Input() shPageIndex = 1;
  @Input() shPageSize = 10;
  @Input() shShowSizeChanger = false;
  @Input() pageSizeOptions = [10, 20, 30, 50];

  @Output() pageChange = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  pages: number[] = [];
  pageSizeList: any[] = [];

  ngOnInit(): void {
    this.updatePages();

    this.pageSizeList = this.pageSizeOptions.map((item) => {
      return { label: item, value: item };
    });
  }

  updatePages() {
    this.pages = [];
    if (this.totalPages <= 5) {
      this.pages.push(...Array.from({ length: this.totalPages }, (_, i) => i + 1));
    } else {
      if (this.shPageIndex - 4 > 0 && this.shPageIndex + 4 <= this.totalPages) {
        this.pages.push(1, -1, this.shPageIndex - 2, this.shPageIndex - 1, this.shPageIndex, this.shPageIndex + 1, this.shPageIndex + 2, -1, this.totalPages);
      } else {
        if (this.shPageIndex - 4 <= 0) {
          this.pages.push(1, 2, 3, 4, 5, -1, this.totalPages);
        } else {
          this.pages.push(1, -1, this.totalPages - 4, this.totalPages - 3, this.totalPages - 2, this.totalPages - 1, this.totalPages);
        }
      }
    }
  }

  get totalPages() {
    return Math.ceil(this.shTotal / this.shPageSize);
  }

  prevPage() {
    if (this.shPageIndex > 1) {
      this.shPageIndex--;
      this.pageChange.emit(this.shPageIndex);
    }
    this.updatePages();
  }

  nextPage() {
    if (this.shPageIndex < this.totalPages) {
      this.shPageIndex++;
      this.pageChange.emit(this.shPageIndex);
    }
    this.updatePages();
  }

  onSizeChange() {
    this.shPageIndex = 1;
    this.pageSizeChange.emit(this.shPageSize);
    this.updatePages();
  }

  pageIndexChange(page: number) {
    this.shPageIndex = page;
    this.pageChange.emit(this.shPageIndex);
    this.updatePages();
  }
}
