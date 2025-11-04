// app/blog/page.jsx
import Link from 'next/link';

export const metadata = {
  title: 'Beauty Tips & Store Updates | EssentialistMakeupStore Blog',
  description:
    'Discover the latest beauty trends, tutorials, and store updates from EssentialistMakeupStore. Stay inspired with makeup tips tailored for Cameroon.',
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:1010';

async function fetchBlogs() {
  try {
    const url = new URL('/api/blog/list', API_BASE_URL);
    url.searchParams.set('status', 'published');
    url.searchParams.set('limit', '12');
    url.searchParams.set('sort', 'newest');

    const response = await fetch(url.toString(), {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      console.error('Failed to load blogs:', response.status, response.statusText);
      return { data: [] };
    }

    return response.json();
  } catch (error) {
    console.error('Blog list error:', error);
    return { data: [] };
  }
}

const BlogPage = async () => {
  const payload = await fetchBlogs();
  const posts = payload?.data || [];

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <header className="text-center">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">
          EssentialistMakeupStore Blog
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
          Tutorials, beauty advice, new arrivals, promotions, and behind-the-scenes stories from Cameroon’s favourite makeup destination.
        </p>
      </header>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.length === 0 && (
          <div className="col-span-full rounded-lg border border-slate-200 bg-white p-8 text-center text-slate-500 shadow-sm">
            No articles published yet. Check back soon for fresh beauty inspiration.
          </div>
        )}

        {posts.map((post) => {
          const publishedDate = post.publishedAt || post.createdAt;
          const formattedDate = publishedDate
            ? new Date(publishedDate).toLocaleDateString(undefined, {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })
            : '—';

          return (
            <article
              key={post._id}
              className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <Link href={`/blog/${post.slug}`} className="group block">
                <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                  {post.coverImage ? (
                    <div
                      className="h-full w-full bg-cover bg-center transition-transform group-hover:scale-105"
                      style={{ backgroundImage: `url(${post.coverImage})` }}
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-sm text-slate-400">
                      Cover image coming soon
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-3 px-5 py-6">
                  <div className="flex flex-wrap gap-2 text-xs uppercase tracking-wide text-primary-200">
                    {(post.tags || []).slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-primary-50 px-2 py-0.5 text-primary-300">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <h2 className="text-lg font-semibold text-slate-900 line-clamp-2 group-hover:text-primary-200">
                    {post.title}
                  </h2>

                  <p className="text-sm text-slate-600 line-clamp-3">{post.excerpt}</p>

                  <div className="mt-auto flex items-center justify-between text-xs text-slate-500">
                    <span>{formattedDate}</span>
                    {post.readingTime ? (
                      <span>{post.readingTime} min read</span>
                    ) : null}
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default BlogPage;