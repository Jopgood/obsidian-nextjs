import fs from "fs";
import path from "path";

interface PageInfo {
  route: string;
  filePath: string;
}

function readVaultStructure(vaultPath: string): PageInfo[] {
  const pages: PageInfo[] = [];

  function traverseDirectory(currentPath: string, currentRoute: string) {
    const items = fs.readdirSync(currentPath);

    for (const item of items) {
      const itemPath = path.join(currentPath, item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        if (item.startsWith("(") && item.endsWith(")")) {
          const routeName = item.slice(1, -1);
          traverseDirectory(itemPath, `${currentRoute}/${routeName}`);
        }
      } else if (
        stats.isFile() &&
        (item === "page.mdx" || item === "page.md")
      ) {
        pages.push({
          route: currentRoute,
          filePath: itemPath,
        });
      }
    }
  }

  traverseDirectory(vaultPath, "");
  return pages;
}

export { readVaultStructure };
export type { PageInfo };
