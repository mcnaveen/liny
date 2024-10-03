import { parse } from "node-html-parser";

import { fetchWithTimeout } from "@/utils/fetch-with-timeout";
import { GOOGLE_FAVICON_URL } from "@/lib/constants";

export const getHtml = async (url: string): Promise<string | null> => {
  return await fetchWithTimeout(url, {
    headers: {
      "User-Agent": "Liny Bot",
    },
  })
    .then((r) => r.text())
    .catch(() => null);
};

export const getHeadChildNodes = (html: string) => {
  const ast = parse(html);
  const title = ast.querySelector("title")?.innerText || "";
  const linkTags = ast.querySelectorAll("link").map(({ attributes }) => {
    const { rel, href } = attributes;

    return {
      rel,
      href,
    };
  });

  return { title, linkTags };
};

export const getMetaTags = async (url: string) => {
  const html = await getHtml(url);

  if (!html) {
    return {
      title: url,
      favicon: null,
    };
  }
  const { title: titleTag } = getHeadChildNodes(html);

  const faviconUrl = `${GOOGLE_FAVICON_URL}${new URL(url).hostname}`;

  return {
    title: titleTag || url,
    favicon: faviconUrl,
  };
};
