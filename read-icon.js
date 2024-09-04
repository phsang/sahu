const fs = require('fs');
const path = require('path');

const modeIndex = 0;
const modeList = ['duotone', 'light', 'regular', 'solid'];

function getAllSvgFiles(modeIndex, fileList = {}) {
  let dir = './public/fontawesome5/svgs/' + modeList[modeIndex];
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      // Nếu là thư mục, tiếp tục duyệt
      getAllSvgFiles(modeIndex, fileList);
    } else if (path.extname(file) === '.svg') {
      // Nếu là file SVG, đọc nội dung
      let content = fs.readFileSync(filePath, 'utf8');
      let attributes = `fill="currentColor" height="1em" width="1em"`;
      content = content.replace('<svg', `<svg ${attributes}`);

      let _fileName = file.replace('.svg', '');
      if (fileList[_fileName] === undefined) {
        fileList[_fileName] = {
          [modeList[modeIndex]]: content
        };
      } else {
        fileList[_fileName][modeList[modeIndex]] = content;
      }
    }
  });

  if (modeIndex < modeList.length - 1) {
    return getAllSvgFiles(modeIndex + 1, fileList);
  } else {
    return fileList;
  }
}

const svgFiles = getAllSvgFiles(0);

const outputFilePath = './public/icons.json'; // Đường dẫn đến file JSON sẽ ghi

// Ghi nội dung vào file JSON
fs.writeFileSync(outputFilePath, JSON.stringify(svgFiles, null, 2), 'utf8');

console.log(`Đã ghi thành công dữ liệu vào file ${outputFilePath}`);
