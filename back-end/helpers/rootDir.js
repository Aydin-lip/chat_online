import path from 'path'

export const RootDir = (paths) => {
  return path.join(__dirname, '..', ...paths)
}