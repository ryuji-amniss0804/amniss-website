import { MetadataRoute } from 'next'
import { getAllPosts } from '@/lib/posts'

const SITE_URL = 'https://amniss-japan.jp'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = (
    [
      { path: '', changeFrequency: 'weekly' as const, priority: 1 },
      { path: '/moving', changeFrequency: 'weekly' as const, priority: 0.9 },
      { path: '/kaitori', changeFrequency: 'weekly' as const, priority: 0.9 },
      { path: '/transport', changeFrequency: 'weekly' as const, priority: 0.8 },
      { path: '/shucho-kaitori', changeFrequency: 'monthly' as const, priority: 0.7 },
      { path: '/pc-sales', changeFrequency: 'monthly' as const, priority: 0.6 },
      { path: '/blog', changeFrequency: 'weekly' as const, priority: 0.6 },
      { path: '/company', changeFrequency: 'monthly' as const, priority: 0.5 },
      { path: '/tokushoho', changeFrequency: 'yearly' as const, priority: 0.3 },
      { path: '/privacy', changeFrequency: 'yearly' as const, priority: 0.3 },
    ]
  ).map(({ path, changeFrequency, priority }) => ({
    url: `${SITE_URL}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  // ブログ記事（取得に失敗しても sitemap 全体は壊さない）
  let posts: MetadataRoute.Sitemap = []
  try {
    posts = getAllPosts().map((post) => {
      const parsed = post.date ? new Date(post.date) : null
      return {
        url: `${SITE_URL}/blog/${post.slug}`,
        lastModified: parsed && !Number.isNaN(parsed.getTime()) ? parsed : now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }
    })
  } catch {
    posts = []
  }

  return [...staticPages, ...posts]
}
