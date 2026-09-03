import { cpSync, existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const htmlEntries = Object.fromEntries(
  readdirSync(__dirname)
    .filter((file) => file.endsWith('.html'))
    .map((file) => [file.replace('.html', ''), resolve(__dirname, file)])
);

function copyStaticDir(dirName) {
  const source = resolve(__dirname, dirName);
  const target = resolve(__dirname, 'dist', dirName);

  if (existsSync(source)) {
    cpSync(source, target, { recursive: true, force: true });
  }
}

export default defineConfig({
  build: {
    rollupOptions: {
      input: htmlEntries
    }
  },
  plugins: [
    {
      name: 'copy-static-assets',
      closeBundle() {
        copyStaticDir('js');
        copyStaticDir('assets');
        copyStaticDir('css');
      }
    }
  ]
});
