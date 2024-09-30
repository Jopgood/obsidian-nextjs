import { readVaultStructure, PageInfo } from "../../utils/fileSystemReader";
import { VAULT_PATH } from "../../config";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import { useMDXComponents } from "../../mdx-components";

export default async function Page({ params }: { params: { slug: string[] } }) {
  const route = `/${params.slug.join("/")}`;
  const pages = readVaultStructure(VAULT_PATH);
  const pageInfo = pages.find((page) => page.route === route);

  if (!pageInfo) {
    return <div>Page not found</div>;
  }

  const content = await fs.promises.readFile(pageInfo.filePath, "utf8");
  const components = useMDXComponents({});

  return (
    <div className="parsedown">
      <MDXRemote
        source={content}
        components={components as any}
        options={{
          parseFrontmatter: true,
          mdxOptions: {
            remarkPlugins: [],
            rehypePlugins: [],
          },
        }}
      />
    </div>
  );
}
