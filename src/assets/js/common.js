console.log('123')
const parquet = require('parquetjs');
console.log('456')
// 读取 Parquet 文件
async function readParquetFile(filePath) {
  try {
    const reader = await parquet.ParquetReader.openFile(filePath);
    const schema = reader.schema;
    const rows = [];

    // 逐行读取
    while (true) {
      const row = await reader.read();
      if (!row) break;
      rows.push(row);
    }

    console.log('Parsed Rows:', rows);
    reader.close();
  } catch (err) {
    console.error('Error reading Parquet file:', err);
  }
}
