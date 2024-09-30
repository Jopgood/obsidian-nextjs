import type { MDXComponents } from "mdx/types";
import Link from "next/link";
import React from "react";

const ObsidianLink: React.FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
}) => {
  // Process the href to remove parentheses and 'page' suffix
  const processedHref = href.replace(/^\(|\)/g, "").replace(/\/page$/, "");
  return <Link href={`/${processedHref}`}>{children}</Link>;
};

const CustomParagraph: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  if (typeof children === "string") {
    const regex = /\[\[(.*?)\|(.*?)\]\]/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(children)) !== null) {
      if (match.index > lastIndex) {
        parts.push(children.slice(lastIndex, match.index));
      }
      const [, href, text] = match;
      parts.push(
        <ObsidianLink key={match.index} href={href}>
          {text}
        </ObsidianLink>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < children.length) {
      parts.push(children.slice(lastIndex));
    }

    return <p className="leading-7 [&:not(:first-child)]:mt-6">{parts}</p>;
  }

  return <p className="leading-7 [&:not(:first-child)]:mt-6">{children}</p>;
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => <h1>{children}</h1>,
    h2: ({ children }) => <h2 className="">{children}</h2>,
    p: CustomParagraph,
    ...components,
  };
}
