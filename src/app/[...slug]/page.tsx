import { readVaultStructure, PageInfo } from "../../utils/fileSystemReader";
import { VAULT_PATH } from "../../config";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs";
import { useMDXComponents } from "../../mdx-components";
import remarkGfm from "remark-gfm";

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
    <div className="parsedown preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <div>
        <MDXRemote
          source={content}
          components={components as any}
          options={{
            parseFrontmatter: true,
            mdxOptions: {
              remarkPlugins: [remarkGfm],
              rehypePlugins: [],
            },
          }}
        />
      </div>
    </div>
  );
}
