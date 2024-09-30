import { readVaultStructure } from "../../utils/fileSystemReader";
import { VAULT_PATH } from "../../config";
import { MDXRemote } from "next-mdx-remote/rsc";
import fs from "fs/promises";
import { useMDXComponents } from "../../mdx-components";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import matter from "gray-matter";

export async function generateStaticParams() {
  const pages = readVaultStructure(VAULT_PATH);
  return pages.map((page) => ({
    slug: page.route.split("/").filter(Boolean),
  }));
}

export default async function Page({ params }: { params: { slug: string[] } }) {
  const route = `/${params.slug.join("/")}`;
  const pages = readVaultStructure(VAULT_PATH);
  const pageInfo = pages.find((page) => page.route === route);

  if (!pageInfo) {
    notFound();
  }

  const source = await fs.readFile(pageInfo!.filePath, "utf8");
  const { data: frontmatter, content } = matter(source);
  console.log(frontmatter);
  const components = useMDXComponents({});

  return (
    <div className="parsedown preview flex min-h-[350px] w-full justify-center p-10 items-center">
      <div>
        {frontmatter.title && <h1>{frontmatter.title}</h1>}
        <MDXRemote
          source={content}
          components={components as any}
          options={{
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
