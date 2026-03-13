import type { ListItem, RouterData } from "../types.js";
import { get } from "../utils/getData.js";
import { getTime } from "../utils/getTime.js";
import RSSParser from "rss-parser";

export const handleRoute = async (_: undefined, noCache: boolean) => {
  const listData = await getList(noCache);
  const routeData: RouterData = {
    name: "producthunt",
    title: "Product Hunt",
    type: "Today",
    description: "The best new products, every day",
    link: "https://www.producthunt.com/",
    total: listData.data?.length || 0,
    ...listData,
  };
  return routeData;
};

const getList = async (noCache: boolean) => {
  const url = "https://www.producthunt.com/feed";
  const result = await get<string>({ url, noCache });
  return {
    ...result,
    data: await parseProductHuntFeed(result.data),
  };
};

export const parseProductHuntFeed = async (feedContent: string): Promise<ListItem[]> => {
  const parser = new RSSParser();
  const feed = await parser.parseString(feedContent);

  return feed.items.map((item, index) => {
    const atomItem = item as typeof item & { id?: string };
    return {
      id: item.guid || atomItem.id || item.link || `producthunt-${index}`,
      title: item.title || "",
      desc: item.contentSnippet?.trim() || "",
      author: item.creator ?? item.author,
      hot: undefined,
      timestamp: getTime(item.pubDate || 0),
      url: item.link || "",
      mobileUrl: item.link || "",
    };
  });
};
