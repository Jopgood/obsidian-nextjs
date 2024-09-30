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

    return <p>{parts}</p>;
  }

  return <p>{children}</p>;
};

const CustomTable: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="table-wrapper">
      <table>{children}</table>
    </div>
  );
};

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    p: ({ children }) => <CustomParagraph>{children}</CustomParagraph>,
    table: ({ children }) => <CustomTable>{children}</CustomTable>,
    ...components,
  };
}
