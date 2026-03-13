import { fileURLToPath } from "url";
import fs from "fs";
import path from "path";
import type { ListContext, RouterData } from "../types.js";

export type SourceHandler = (c: ListContext, noCache: boolean) => Promise<RouterData>;

const routesDirectory = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../routes");

let cachedSourceIds: string[] | null = null;

const findRouteFiles = (dirPath: string, allFiles: string[] = [], basePath = ""): string[] => {
  const items = fs.readdirSync(dirPath);

  for (const item of items) {
    const fullPath = path.join(dirPath, item);
    const relativePath = basePath ? path.posix.join(basePath, item) : item;
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      findRouteFiles(fullPath, allFiles, relativePath);
      continue;
    }

    if (stat.isFile() && (item.endsWith(".ts") || item.endsWith(".js")) && !item.endsWith(".d.ts")) {
      allFiles.push(relativePath.replace(/\.(ts|js)$/, ""));
    }
  }

  return allFiles;
};

export const getSourceIds = (): string[] => {
  if (cachedSourceIds) {
    return cachedSourceIds;
  }

  if (!fs.existsSync(routesDirectory) || !fs.statSync(routesDirectory).isDirectory()) {
    throw new Error(`Routes directory does not exist: ${routesDirectory}`);
  }

  cachedSourceIds = findRouteFiles(routesDirectory).sort((left, right) => left.localeCompare(right));
  return cachedSourceIds;
};

export const hasSource = (sourceId: string): boolean => getSourceIds().includes(sourceId);

export const loadSourceHandler = async (sourceId: string): Promise<SourceHandler> => {
  if (!hasSource(sourceId)) {
    throw new Error(`Unknown source: ${sourceId}`);
  }

  const module = await import(new URL(`../routes/${sourceId}.js`, import.meta.url).href);

  if (typeof module.handleRoute !== "function") {
    throw new Error(`Route "${sourceId}" does not export handleRoute`);
  }

  return module.handleRoute as SourceHandler;
};
