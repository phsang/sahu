import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sh-select',
  templateUrl: './sh-select.component.html',
  styleUrls: ['./sh-select.component.scss']
})

export class ShSelectComponent implements OnInit {
  @Input() shPlaceHolder?: string;
  @Input() shShowSearch: boolean = false;
  @Input() shApiCall!: (searchTerm: string) => Observable<any[]>;
  @Input() ngModel: any;
  @Input() shMultiple: boolean = false;

  @Output() ngModelChange = new EventEmitter<any>();

  searchControl = new FormControl();
  dropdownOpen = false;
  loading = false;
  selectedTags: string[] = [];
  options: any[] = [];
  groupedOptions: any[] = [];

  ngOnInit() {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap(searchTerm => {
        this.loading = true;
        return this.shApiCall(searchTerm).pipe(
          switchMap((data) => {
            this.loading = false;
            return of(data);
          })
        );
      })
    ).subscribe(options => {
      this.groupedOptions = this.groupOptions(options);
    });
  }

  toggleDropdown(open: boolean) {
    this.dropdownOpen = open;
  }

  selectOption(option: any) {
    if (this.shMultiple) {
      // Kiểm tra xem giá trị đã được chọn hay chưa
      if (!this.selectedTags.includes(option.label)) {
        this.selectedTags.push(option.label);

        // Nếu có `ngModel`, cập nhật giá trị và phát ra sự kiện
        if (this.ngModel !== undefined) {
          this.ngModel = this.selectedTags;
          this.ngModelChange.emit(this.ngModel);
        } else {
          this.ngModelChange.emit(this.selectedTags);
        }
      }
    } else {
      // Với chế độ chọn đơn lẻ
      if (this.ngModel !== undefined) {
        this.ngModel = option.value;
        this.ngModelChange.emit(this.ngModel);
      } else {
        this.ngModelChange.emit(option.value);
      }

      // Đóng dropdown sau khi chọn
      this.toggleDropdown(false);
    }
  }

  removeTag(tag: string) {
    this.selectedTags = this.selectedTags.filter(t => t !== tag);
    this.ngModelChange.emit(this.selectedTags);
  }

  groupOptions(options: any[]): any[] {
    const grouped: { [key: string]: { label: string, options: any[] } } = {};
    options.forEach(option => {
      const groupLabel = option.group || 'default';
      if (!grouped[groupLabel]) {
        grouped[groupLabel] = { label: groupLabel, options: [] };
      }
      grouped[groupLabel].options.push(option);
    });
    return Object.values(grouped);
  }
}
