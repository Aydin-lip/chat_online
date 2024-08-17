import path, { dirname } from 'path'
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const RootDir = (paths = []) => {
  return path.join(__dirname, '..', ...paths)
}