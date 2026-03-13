import { fileURLToPath } from "url";
import path from "path";

export const isMainModule = (moduleUrl: string, argv1: string | undefined = process.argv[1]): boolean => {
  if (!argv1) {
    return false;
  }

  const currentFile = path.resolve(fileURLToPath(moduleUrl));
  const entryFile = path.resolve(argv1);
  return currentFile === entryFile;
};
