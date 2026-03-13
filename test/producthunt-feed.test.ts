import assert from "node:assert/strict";
import test from "node:test";
import { parseProductHuntFeed } from "../src/routes/producthunt.js";

const sampleFeed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>Product Hunt — The best new products, every day</title>
  <entry>
    <id>tag:www.producthunt.com,2005:Post/1096941</id>
    <published>2026-03-12T14:59:39-07:00</published>
    <updated>2026-03-13T01:41:27-07:00</updated>
    <link rel="alternate" type="text/html" href="https://www.producthunt.com/products/scindo"/>
    <title>Scindo</title>
    <content type="html">&lt;p&gt;AI captures decisions, drafts plans, and opens matching PRs.&lt;/p&gt;</content>
    <author>
      <name>Jinhwan Kim</name>
    </author>
  </entry>
</feed>`;

test("parseProductHuntFeed converts Atom feed entries into route items", async () => {
  const items = await parseProductHuntFeed(sampleFeed);

  assert.equal(items.length, 1);
  assert.equal(items[0].id, "tag:www.producthunt.com,2005:Post/1096941");
  assert.equal(items[0].title, "Scindo");
  assert.equal(items[0].author, "Jinhwan Kim");
  assert.equal(items[0].desc, "AI captures decisions, drafts plans, and opens matching PRs.");
  assert.equal(items[0].url, "https://www.producthunt.com/products/scindo");
  assert.equal(items[0].mobileUrl, "https://www.producthunt.com/products/scindo");
});
