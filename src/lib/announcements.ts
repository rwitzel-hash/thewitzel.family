export type SchoolAnnouncement = {
  id: number;
  date: string;
  title: string;
  excerpt: string;
  link: string;
};

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#8217;/g, "'")
    .replace(/&#8211;/g, "–")
    .replace(/\s+/g, " ")
    .trim();
}

export async function getSchoolAnnouncements(options: {
  apiBase: string;
  categoryIds?: number[];
  limit?: number;
}): Promise<SchoolAnnouncement[]> {
  const limit = options.limit ?? 5;
  const params = new URLSearchParams({
    per_page: String(limit),
    _fields: "id,date,title,excerpt,link",
    orderby: "date",
    order: "desc",
  });

  if (options.categoryIds?.length) {
    params.set("categories", options.categoryIds.join(","));
  }

  const url = `${options.apiBase.replace(/\/$/, "")}/wp-json/wp/v2/posts?${params}`;

  try {
    const response = await fetch(url, { next: { revalidate: 1800 } });
    if (!response.ok) return [];

    const posts = (await response.json()) as Array<{
      id: number;
      date: string;
      title?: { rendered?: string };
      excerpt?: { rendered?: string };
      link: string;
    }>;

    return posts.map((post) => ({
      id: post.id,
      date: post.date.slice(0, 10),
      title: stripHtml(post.title?.rendered ?? "Announcement"),
      excerpt: stripHtml(post.excerpt?.rendered ?? ""),
      link: post.link,
    }));
  } catch {
    return [];
  }
}
