import { ChangeDetectorRef, Component, ElementRef, EventEmitter, forwardRef, Input, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ExcelService } from '../../services/excel.service';
import { ImageService } from '../../services/image.service';

@Component({
  selector: 'sh-input',
  templateUrl: './sh-input.component.html',
  styleUrls: ['./sh-input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ShInputComponent),
      multi: true
    }
  ]
})
export class ShInputComponent implements ControlValueAccessor, OnInit {
  @ViewChild('dropZone') dropZone!: ElementRef;
  @ViewChild('mainInput') mainInput!: ElementRef;

  @Input() shType: 'text' | 'radio' | 'switch' | 'checkbox' | 'email' | 'file' | 'hidden' | 'password' | 'range' = 'text';
  @Input() shSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'md';
  @Input() shIcon: string | null = '';
  @Input() shName?: string;
  @Input() shClass: string = '';
  @Input() shId?: string;
  @Input() shValue?: string;
  @Input() shAllowClear: boolean = false;
  @Input() shResize?: string; // [shResize]="'606x212'" - resize ảnh kèm theo các options
  @Input() shResizeOptions?: string;
  @Input() shReadonly: boolean = false;
  @Input() shDisabled: boolean = false;
  @Input() shLabel?: string; // sử dụng cho radio, checkbox
  @Input() shPlaceHolder?: string;
  @Input() shChecked: boolean = false;
  @Input() shAutocomplete?: string;
  @Input() shLoading: boolean = false;
  @Input() shDataVali?: string;
  @Input() shReview: boolean = true; // sử dụng cho file hình

  @Output() shChange = new EventEmitter<any>();
  @Output() shClick = new EventEmitter<any>();

  iconLeft: string = '';
  iconRight: string = '';
  classLoading = '';
  value: string = '';

  onChange: any = () => { };
  onTouched: any = () => { };

  constructor(
    private renderer: Renderer2,
    private cdr: ChangeDetectorRef,
    private sanitizer: DomSanitizer,
    private excelService: ExcelService,
    private imageService: ImageService,
  ) {
    if (this.shType === 'file') {
      this.dropFile();
    }
  }

  ngOnInit(): void {
    this.updateInputClass();
  }

  async createFakeFile() {
    // Lấy extension từ this.value
    const url = this.value;
    const ext = url.split('.').pop();

    try {
      // Fetch file từ URL
      this.classLoading = 'loading';
      this.shLoading = true;
      const response = await fetch(url, {
        method: 'GET',
        mode: 'cors'
      });
      this.shLoading = false;

      if (!response.ok) {
        throw new Error("Không thể tải file từ URL");
      }

      // Chuyển đổi dữ liệu thành Blob
      const blob = await response.blob();

      // Tạo đối tượng File từ Blob
      const type = blob.type || (ext === "xlsx" ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" : "image/" + ext);

      const fakeFile = new File([blob], `fake.${ext}`, {
        type: type,
      });

      // Sử dụng DataTransfer để gắn file
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(fakeFile);

      // Gán file giả vào input
      this.dropZone.nativeElement.querySelector('input').files = dataTransfer.files;

      // Gọi onChange hoặc xử lý tiếp
      this.onChange(this.value);
    } catch (error) {
      console.error("Lỗi khi tạo file giả:", error);
    }
  }

  writeValue(value: string): void {
    this.value = value;
    if (this.value && this.shType === 'file') {
      this.createFakeFile();
    }
    this.updateInputClass();
  }

  iconArr(iconRule: string): any {
    if (iconRule.includes(',')) {
      return iconRule.split(',');
    } else {
      return [iconRule];
    }
  }

  private updateInputClass(): void {
    let classType = `sh-input-${this.shType || 'text'}`;
    if (!this.shClass.includes(classType)) {
      this.shClass += ' ' + classType;
    }

    const sanitizedIcon = this.shIcon?.trim().replace(/\s+/g, '') || null;
    if (sanitizedIcon) {
      const [leftIcon, rightIcon] = this.iconArr(sanitizedIcon);
      if (leftIcon !== '*') this.iconLeft = leftIcon;
      if (rightIcon && rightIcon !== '*') this.iconRight = rightIcon;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    let newValue = input.value;

    if (
      this.shType === 'checkbox' ||
      this.shType === 'switch'
    ) {
      // Lấy giá trị từ thuộc tính checked
      this.value = input.checked.toString(); // Đảm bảo value là chuỗi để phù hợp với FormControl
      this.onChange(input.checked); // Phát sự kiện thay đổi với giá trị boolean
    } else {
      // Mặc định lấy giá trị từ value
      this.value = input.value;

      // ràng buộc giá trị nhập (lưu ý: không ràng buộc trong shForm)
      if (this.shDataVali?.includes('phone')) {
        newValue = this.formatPhone(this.value);
      }
      if (this.shDataVali?.includes('identity')) {
        newValue = this.value.trim().replace(/\D/g, '');
        if (this.value.length > 12) {
          newValue = this.value.substring(0, 10);
        }
      }

      this.onChange(newValue);
      setTimeout(() => {
        this.value = newValue;
      }, 10);
    }
  }

  handleClick(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.shClick.emit(input.value);
  }

  dropFile() {
    let dropZone = this.dropZone.nativeElement;

    // Ngăn trình duyệt xử lý hành vi mặc định khi kéo thả
    dropZone.addEventListener('dragover', (event: any) => {
      event.preventDefault();
      dropZone.classList.add('dragover');
    });

    // Hoàn tác kiểu dáng khi rời khỏi khu vực
    dropZone.addEventListener('dragleave', () => {
      dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', (event: any) => {
      event.preventDefault(); // Ngăn hành vi mặc định
      dropZone.classList.remove('dragover'); // Hoàn tác kiểu dáng khi thả
      const files = event.dataTransfer?.files; // Lấy danh sách các file

      // Xử lý file tại đây
      if (files && files.length > 0) {
        this.shChange.emit({
          file: files[0],
          data: null
        });
      }
    });
  }

  parseDataVali(dataVali: string): any {
    // Loại bỏ ký tự bao quanh nếu có (dấu ngoặc vuông [])
    const trimmedData = dataVali?.trim().replace(/^\[|\]$/g, '');
    if (!trimmedData) return [];

    // Regex để nhận diện các phần tử như 'file(...)' hoặc từ khóa thông thường
    const regex = /(\w+\([^)]*\)|\w+)/g;
    const matches = trimmedData.match(regex);

    if (!matches) return [];

    return matches.map(item => {
      // Xử lý phần tử dạng file(...)
      if (item.startsWith('file')) {
        const fileRegex = /file\(([^,]+),\s*([^,]+)(?:,\s*([^,]+)(?:,\s*(.+))?)?\)/;
        const match = fileRegex.exec(item);

        if (match) {
          return {
            key: 'file',
            type: match[1],
            size: parseInt(match[2], 10),
            additional: match[3] ? match[3] : null,
            entries: match[4] ? parseInt(match[4]) : null
          };
        }
      }

      // Trả về phần tử thông thường
      return { key: item };
    });
  }

  async excelValid(rule: any, file: File): Promise<any> {
    // đọc file excel và kiểm tra tính hợp lệ
    let jsonData = await this.excelService.readFileExcelToJson(file);
    let additional = jsonData[0].join(':');

    if (
      additional !== rule.additional ||
      jsonData.length <= 1 ||
      jsonData.length > (rule.entries + 1)
    ) {
      return {
        data: null,
        status: false
      };
    }

    jsonData.shift();
    return {
      data: jsonData,
      status: true
    };
  }

  parseResizeOptions(options: string): Record<string, any> {
    const result: Record<string, any> = {};
    const pairs = options.split(',').map(pair => pair.trim()); // Tách các cặp key-value

    pairs.forEach(pair => {
      const [key, value] = pair.split(':').map(item => item.trim());
      if (!key) return;

      // Kiểm tra giá trị và parse đúng kiểu
      if (value === 'true' || value === 'false') {
        result[key] = value === 'true';
      } else if (!isNaN(Number(value))) {
        result[key] = Number(value);
      } else if (value.startsWith('#') || value.startsWith('"') || value.startsWith("'")) {
        result[key] = value.replace(/^["']|["']$/g, ''); // Loại bỏ dấu nháy nếu có
      } else {
        result[key] = value;
      }
    });

    return result;
  }

  async handleFileInput(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    let valid = this.shDataVali ? this.parseDataVali(this.shDataVali) : null;
    let rule = null;

    if (valid?.length > 0) {
      rule = valid[0].key === 'file' ? valid[0] : (valid[1]?.key === 'file' ? valid[1] : null);
    }

    if (input.files && input.files.length > 0) {
      let file = input.files[0];
      if (rule) {
        const { type: allowedTypes, maxSize } = { type: rule.type, maxSize: rule.size };

        let isValid = true;
        let excelData: any = null;

        // Kiểm tra loại file
        if (allowedTypes) {
          const allowedTypesArray = allowedTypes.split(':').map((type: string) => type.trim().toLowerCase());
          const fileType = file.name.split('.').pop()?.toLowerCase() || '';
          if (!allowedTypesArray.includes(fileType)) {
            isValid = false;
          } else {
            // kiểm tra tính hợp lệ của file excel nếu chỉ chấp nhận file excel
            if (fileType === 'xlsx' && allowedTypesArray.includes('xlsx')) {
              excelData = await this.excelValid(rule, file);
              isValid = excelData.status;
            }
          }
        }

        // Kiểm tra kích thước file
        if (maxSize) {
          const maxSizeInBytes = parseInt(maxSize) * 1024; // Giả định maxSize là KB
          if (file.size > maxSizeInBytes) {
            isValid = false;
          }
        }

        // Nếu toàn bộ hợp lệ, resize và nén ảnh nếu có thuộc tính resize
        if (this.shResize) {
          const [width, height] = this.shResize.replace(/\s+/g, '').split('x');
          let param: any = null;
          param = {
            file,
            width,
            height,
          };
          if (this.shResizeOptions) {
            const options = this.parseResizeOptions(this.shResizeOptions);
            param = { ...param, ...options };
          }

          file = await this.imageService.resizeAndCompressImage(param);
        }

        if (isValid) {
          this.classLoading = 'loading';
          this.shChange.emit({
            file: file,
            data: excelData?.data || null
          });
        } else {
          this.classLoading = '';
        }

      }
    } else {
      this.classLoading = '';
      this.shValue = '';
      input.files = null;
    }
  }

  fileActive() {
    this.classLoading = 'active';
  }

  fileReset(event: Event) {
    this.classLoading = '';
    this.shValue = '';

    if (this.shReview) {
      setTimeout(() => {
        let btn = event.target as HTMLElement;

        if (btn) {
          let input = btn.closest('.sh-file')?.querySelector('input');
          if (input) {
            input.value = '';
            input.files = null;

            input.dispatchEvent(new Event('change'));
          }
        }
      }, 300);
    } else {
      let btn = event.target as HTMLElement;

      if (btn) {
        let input = btn.closest('.sh-file_unview')?.querySelector('input');
        if (input) {
          input.value = '';
          input.files = null;

          input.dispatchEvent(new Event('change'));
        }
      }
    }
  }

  handleFocus(): void {
    this.shClass = this.shClass.replace('control-value', '').trim();
    if (!this.shClass.includes('control-focus')) {
      this.shClass += ' control-focus';
    }
  }

  handleBlur(): void {
    // nếu có giá trị thì thêm class để style
    if (this.value && this.value.trim() != '' && !this.shClass.includes('control-value')) {
      this.shClass += ' control-value';
    }

    if (this.shClass.includes('control-focus')) {
      this.shClass = this.shClass.replace('control-focus', '').trim();
    }
    this.onTouched();
  }

  formatPhone(phone: string): string {
    // Loại bỏ tất cả ký tự không phải số trước khi định dạng
    phone = phone.replace(/\D/g, '');

    if (phone.length > 10) {
      phone = phone.substring(0, 10);
    }

    // Format số điện thoại
    if (phone.length > 4 && phone.length < 8) {
      phone = phone.substring(0, 4) + '.' + phone.substring(4);
    } else if (phone.length >= 8) {
      phone = phone.substring(0, 4) + '.' + phone.substring(4, 7) + '.' + phone.substring(7);
    }

    return phone;
  }

  resetDisplayValue() {
    this.value = '';
    this.shValue = '';
    this.onChange('');
    this.shChange.emit(null);

    this.mainInput.nativeElement.dispatchEvent(new Event('change'));
  }

}
