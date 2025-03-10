import { slideDown, slideUp } from './mf.animation';
import { formatNumber } from './mf.app';
import { fromEvent, merge } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

export class mfValidation {

  generateError(element: HTMLElement, status: boolean = true, msg: string = 'Vui lòng điền vào trường này!'): void {
    const parent = element.closest('.field-validation');
    const msgError = parent?.querySelector('.msg_error') as HTMLElement;
    msg = '<i class="fal fa-exclamation-triangle"></i>' + msg;

    if (status) {
      parent?.classList.remove('field_error');
      if (msgError) {
        slideUp(msgError, 250);
      }
    } else {
      if (msgError) {
        msgError.innerHTML = msg;
        slideDown(msgError, 250);
      } else {
        const errorSpan = document.createElement('span');
        errorSpan.className = 'msg_error';
        errorSpan.innerHTML = msg;
        parent?.appendChild(errorSpan);
        slideDown(errorSpan, 250);
      }
      parent?.classList.add('field_error');
    }
  }

  lengthValidation(input: HTMLInputElement | HTMLTextAreaElement, dataLength: string): boolean {
    let value = input.value.trim();
    let [dataMin, dataMax] = dataLength.replace(/length\(|\)/g, '').split(',');

    if (dataMin != '*' && dataMax != '*') {
      if (
        parseInt(dataMin) > value.length ||
        parseInt(dataMax) < value.length
      ) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(dataMin)} và lớn hơn ${formatNumber(dataMax)}`);
        return false;
      }
    }
    if (dataMin != '*') {
      if (parseInt(dataMin) > value.length) {
        this.generateError(input, false, `Giá trị có độ dài không được nhỏ hơn ${formatNumber(dataMin)}`);
        return false;
      }
    }
    if (dataMax != '*') {
      if (parseInt(dataMax) < value.length) {
        this.generateError(input, false, `Giá trị có độ dài không được lớn hơn ${formatNumber(dataMax)}`);
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  rangeValidation(input: HTMLInputElement | HTMLTextAreaElement, dataRange: string): boolean {
    let value: any = input.value.trim() || null;
    let [dataMin, dataMax] = dataRange.replace(/range\(|\)/g, '').split(',');

    if (value) {
      value = parseFloat(value);
      if (dataMin != '*' && dataMax != '*') {
        if (
          parseFloat(dataMin) > value ||
          parseFloat(dataMax) < value
        ) {
          this.generateError(input, false, `Giá trị không được nhỏ hơn ${formatNumber(dataMin)} và lớn hơn ${formatNumber(dataMax)}`);
          return false;
        }
      }
      if (dataMin != '*') {
        if (parseFloat(dataMin) > value) {
          this.generateError(input, false, `Giá trị không được nhỏ hơn ${formatNumber(dataMin)}`);
          return false;
        }
      }
      if (dataMax != '*') {
        if (parseFloat(dataMax) < value) {
          this.generateError(input, false, `Giá trị không được lớn hơn ${formatNumber(dataMax)}`);
          return false;
        }
      }
    }

    this.generateError(input, true);
    return true;
  }

  nullValidation(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    let type = input.getAttribute('type');

    if (type === 'file') {
      if (!input.value || input.value === '') {
        this.generateError(input, false, 'Vui lòng chọn file');
        return false;
      }
      this.generateError(input, true);
      return true;
    }

    if (
      (input.tagName.toUpperCase() === 'INPUT' && type?.toUpperCase() === 'TEXT') ||
      input.tagName.toUpperCase() === 'TEXTAREA'
    ) {
      let value: string | null = input.value || null;

      if (value) {
        value = value.trimStart();
        input.value = value;

        this.generateError(input, true);
        return true;
      } else {
        this.generateError(input, false);
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  otpValidation(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    let _val: string | null = input.value.trim() || null;

    if (_val) {
      _val = _val.replace(/\D/g, '');
      input.value = _val;

      if (_val.length !== 4) {
        this.generateError(input, false, 'Mã OTP bao gồm 4 chữ số');
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  urlValidation(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    let value: string | null = input.value || null;

    if (value?.trim()) {
      input.value = value.trimStart();

      const isValidUrl = (urlString: string) => {
        try {
          new URL(urlString);
          return true;
        } catch (_) {
          return false;
        }
      }

      if (isValidUrl(value)) {
        this.generateError(input, true);
        return true;
      } else {
        this.generateError(input, false, 'Đường dẫn không phải là một URL hợp lệ!');
        return false;
      }
    }

    this.generateError(input, true);
    return true;
  }

  intValidation(input: HTMLInputElement | HTMLTextAreaElement): boolean {
    let value: string | null = input.value.replace(/\D/g, '').trim() || null;

    if (value) {
      input.value = formatNumber(value);

      this.generateError(input, true);
      return true;
    }

    this.generateError(input, false);
    return false;
  }

  phoneValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const vnf_regex = /((09|03|07|08|05)+([0-9]{8})\b)/g;
    let _val: string | null = input.value.trim() || null;

    if (_val) {
      _val = _val.replace(/\D|\.|\s+/g, '');
      if (_val.length > 10) {
        _val = _val.substring(0, 10);
      }

      // format số điện thoại
      if (_val.length > 4 && _val.length < 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4);
      } else if (_val.length >= 8) {
        _val = _val.substring(0, 4) + '.' + _val.substring(4, 7) + '.' + _val.substring(7);
      }
      input.value = _val;

      _val = _val.replace(/\./g, '');
      if (_val.length !== 10) {
        this.generateError(input, false, 'Số điện thoại phải 10 số');
        return false;
      }

      let vnf = vnf_regex.test(_val);
      this.generateError(input, vnf, vnf ? '' : 'Số điện thoại không đúng định dạng!');

      return vnf;
    }

    this.generateError(input, true);
    return true;
  }

  emailValidation(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement): boolean {
    const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const value = input.value?.trim() || null;

    if (value) {
      // Kiểm tra email hợp lệ
      const isEmailValid = emailRegex.test(value);
      if (!isEmailValid) {
        this.generateError(input, false, 'Email không hợp lệ');
        return false;
      }
    }

    // Mặc định không có lỗi
    this.generateError(input, true);
    return true;
  }

  detectAll(form: HTMLFormElement): boolean {
    const inputs = form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach((input) => {
      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {
        let dataVali = input.getAttribute('data-vali')?.replace(/\'/g, '"').replace(/\s+/g, '').trim() || null;
        if (dataVali) {
          let arrVali = JSON.parse(dataVali);
          let valiItem: any = '';

          for (let i = 0; i < arrVali.length; i++) {
            valiItem = arrVali[i].trim();

            switch (true) {
              case valiItem.includes('null'): {
                isValid = this.nullValidation(input);
                break;
              }
              case valiItem.includes('otp'): {
                isValid = this.otpValidation(input);
                break;
              }
              case valiItem.includes('url'): {
                isValid = this.urlValidation(input);
                break;
              }
              case valiItem.includes('int'): {
                isValid = this.intValidation(input);
                break;
              }
              case valiItem.includes('phone'): {
                isValid = this.phoneValidation(input);
                break;
              }
              case valiItem.includes('email'): {
                isValid = this.emailValidation(input);
                break;
              }
              case valiItem.includes('range'): {
                isValid = this.rangeValidation(input, valiItem);
                break;
              }
              case valiItem.includes('length'): {
                isValid = this.lengthValidation(input, valiItem);
                break;
              }
            }

            if (!isValid) {
              break;
            }
          }
        }
      }
    });

    if (!isValid) {
      form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
    } else {
      form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
    }

    return isValid;
  }

  init(form: HTMLFormElement): void {
    const inputs = form.querySelectorAll('input, textarea');

    inputs.forEach((input) => {
      // kiểm tra nếu input đang có sự kiện sẽ return
      if (input.getAttribute('listener') == 'true') { }

      if (input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement) {

        merge(
          fromEvent(input, 'input'),
          fromEvent(input, 'change')
        ).pipe(
          debounceTime(200)
        ).subscribe(() => {
          // Xử lý logic của bạn ở đây
          let _dataVali = input.getAttribute('data-vali')?.replace(/\'/g, '"').replace(/\s+/g, '').trim() || null;
          let isValid = true;
          if (_dataVali && _dataVali.length > 0) {
            let arrVali = JSON.parse(_dataVali);
            let valiItem: any = '';

            for (let i = 0; i < arrVali.length; i++) {
              valiItem = arrVali[i].trim();

              switch (true) {
                case valiItem.includes('null'): {
                  isValid = this.nullValidation(input);
                  break;
                }
                case valiItem.includes('otp'): {
                  isValid = this.otpValidation(input);
                  break;
                }
                case valiItem.includes('url'): {
                  isValid = this.urlValidation(input);
                  break;
                }
                case valiItem.includes('int'): {
                  isValid = this.intValidation(input);
                  break;
                }
                case valiItem.includes('phone'): {
                  isValid = this.phoneValidation(input);
                  break;
                }
                case valiItem.includes('email'): {
                  isValid = this.emailValidation(input);
                  break;
                }
                case valiItem.includes('range'): {
                  isValid = this.rangeValidation(input, valiItem);
                  break;
                }
                case valiItem.includes('length'): {
                  isValid = this.lengthValidation(input, valiItem);
                  break;
                }
              }

              if (!isValid) {
                break;
              }
            }
          }

          if (!isValid) {
            form.querySelector('*[type="submit"]')?.classList.add('btn-disabled');
          } else {
            form.querySelector('*[type="submit"]')?.classList.remove('btn-disabled');
          }
        });
      }
    });
  }

}