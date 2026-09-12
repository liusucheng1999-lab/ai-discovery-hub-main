import { describe, expect, it } from 'vitest';
import JSZip from 'jszip';
import { extractArchiveBuffer } from '../../api/_lib/aimaker-upload';

describe('AI Maker archive validation', () => {
  it('accepts a ZIP buffer whose root contains index.html', async () => {
    const zip = new JSZip();
    zip.file('index.html', '<!doctype html><title>ok</title>');
    zip.file('assets/app.js', 'console.log("ok")');

    const files = await extractArchiveBuffer(await zip.generateAsync({ type: 'nodebuffer' }));

    expect(files.map((file) => file.path)).toEqual(['index.html', 'assets/app.js']);
  });

  it('rejects a compressed package larger than 18 MB', async () => {
    await expect(extractArchiveBuffer(Buffer.alloc(18 * 1024 * 1024 + 1))).rejects.toThrow(
      '发布包为空或超过 18 MB 限制',
    );
  });

  it('rejects a ZIP without a root index.html', async () => {
    const zip = new JSZip();
    zip.file('dist/index.html', '<!doctype html>');

    await expect(
      extractArchiveBuffer(await zip.generateAsync({ type: 'nodebuffer' })),
    ).rejects.toThrow('发布包根目录缺少 index.html');
  });
});
