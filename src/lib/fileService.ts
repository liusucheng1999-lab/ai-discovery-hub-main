import JSZip from 'jszip';

export interface FileInfo {
  name: string;
  content: Blob;
  path: string;
}

/**
 * 处理文件上传 - 如果是 ZIP 则解压，如果是 HTML 则直接返回
 */
export async function processUploadedFile(file: File): Promise<{
  files: FileInfo[];
  entryFile: FileInfo;
  isZip: boolean;
}> {
  const isZip = file.type === 'application/zip' || file.name.endsWith('.zip');

  if (isZip) {
    return processZipFile(file);
  } else {
    return processHtmlFile(file);
  }
}

/**
 * 处理 ZIP 文件 - 解压并返回所有文件
 */
async function processZipFile(file: File): Promise<{
  files: FileInfo[];
  entryFile: FileInfo;
  isZip: boolean;
}> {
  const zip = new JSZip();
  const contents = await zip.loadAsync(file);

  const files: FileInfo[] = [];
  let entryFile: FileInfo | null = null;

  // 遍历 ZIP 中的所有文件
  for (const [path, zipObject] of Object.entries(contents.files)) {
    // 跳过目录
    if (zipObject.dir) continue;

    const fileBlob = await zipObject.async('blob');
    const fileName = path.split('/').pop() || path;

    const fileInfo: FileInfo = {
      name: fileName,
      content: fileBlob,
      path: path,
    };

    files.push(fileInfo);

    // 查找入口文件（index.html 或第一个 HTML）
    if (!entryFile) {
      if (path.endsWith('index.html') || path.endsWith('.html')) {
        entryFile = fileInfo;
      }
    }
  }

  if (!entryFile) {
    throw new Error('ZIP 文件中未找到 HTML 入口文件');
  }

  return {
    files,
    entryFile,
    isZip: true,
  };
}

/**
 * 处理 HTML 文件 - 直接返回
 */
async function processHtmlFile(file: File): Promise<{
  files: FileInfo[];
  entryFile: FileInfo;
  isZip: boolean;
}> {
  const fileInfo: FileInfo = {
    name: file.name,
    content: file,
    path: file.name,
  };

  return {
    files: [fileInfo],
    entryFile: fileInfo,
    isZip: false,
  };
}

/**
 * 将 Blob 转换为 File
 */
export function blobToFile(blob: Blob, fileName: string): File {
  return new File([blob], fileName, { type: blob.type });
}

/**
 * 根据文件名推断 Content-Type（带 UTF-8 编码声明）
 */
export function getContentType(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase();
  const map: Record<string, string> = {
    html: 'text/html; charset=utf-8',
    htm: 'text/html; charset=utf-8',
    css: 'text/css; charset=utf-8',
    js: 'application/javascript; charset=utf-8',
    mjs: 'application/javascript; charset=utf-8',
    json: 'application/json; charset=utf-8',
    svg: 'image/svg+xml',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    gif: 'image/gif',
    webp: 'image/webp',
    ico: 'image/x-icon',
    woff: 'font/woff',
    woff2: 'font/woff2',
    ttf: 'font/ttf',
    txt: 'text/plain; charset=utf-8',
  };
  return map[ext || ''] || 'application/octet-stream';
}
