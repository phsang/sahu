import { Injectable } from '@angular/core';
import * as XLSX from 'xlsx';

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  constructor() { }

  public onFileChange(evt: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const target: DataTransfer = <DataTransfer>(evt.target);
      if (target.files.length !== 1) {
        reject('Cannot use multiple files');
      }

      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const binaryString: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(binaryString, { type: 'binary' });

        // Giả sử bạn muốn lấy dữ liệu từ sheet đầu tiên
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        // Chuyển dữ liệu từ sheet thành JSON
        const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

        // Loại bỏ các mảng rỗng
        const filteredData = data.filter((row: any) => row.length > 0);

        resolve(filteredData);
      };

      reader.onerror = (error) => reject(error);
      reader.readAsBinaryString(target.files[0]);
    });
  }
}
