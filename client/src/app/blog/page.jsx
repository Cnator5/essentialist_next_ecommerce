import Link from 'next/link';

export const metadata = {
  title: 'Beauty Tips & Store Updates | EssentialistMakeupStore Blog',
  description: 'Discover the latest beauty trends, tutorials, and store updates from EssentialistMakeupStore. Stay inspired with makeup tips tailored for Cameroon.',
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || 'http://localhost:1010';

async function fetchBlogs(page = 1) {
  try {
    const url = new URL('/api/blog/list', API_BASE_URL);
    url.searchParams.set('status', 'published');
    url.searchParams.set('limit', '12'); // Posts per page
    url.searchParams.set('page', page.toString());
    url.searchParams.set('sort', 'newest');

    const response = await fetch(url.toString(), {
      next: { revalidate: 120 },
    });

    if (!response.ok) {
      console.error('Failed to load blogs:', response.status, response.statusText);
      return { data: [], totalPages: 1, currentPage: 1 };
    }

    return response.json();
  } catch (error) {
    console.error('Blog list error:', error);
    return { data: [], totalPages: 1, currentPage: 1 };
  }
}

const BlogPage = async ({ searchParams }) => {
  // Get the current page from URL or default to 1
  const params = await searchParams;
  const currentPage = parseInt(params.page) || 1;
  
  const payload = await fetchBlogs(currentPage);
  const posts = payload?.data || [];
  const totalPages = payload?.totalPages || 1;

  return (
    <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
          EssentialistMakeupStore Blog
        </h1>
        <p className="mt-4 text-lg text-slate-600">
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

      {/* Professional Pagination UI */}
      {totalPages > 1 && (
        <nav className="mt-16 flex items-center justify-center space-x-2 border-t border-slate-200 pt-8">
          <Link
            href={`/blog?page=${Math.max(1, currentPage - 1)}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentPage === 1 
                ? 'pointer-events-none text-slate-300' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-primary-200'
            }`}
          >
            ← Previous
          </Link>

          <div className="flex space-x-1">
            {[...Array(totalPages)].map((_, i) => {
              const pageNum = i + 1;
              // Show pages near current page, plus first and last
              if (
                pageNum === 1 || 
                pageNum === totalPages || 
                (pageNum >= currentPage - 1 && pageNum <= currentPage + 1)
              ) {
                return (
                  <Link
                    key={pageNum}
                    href={`/blog?page=${pageNum}`}
                    className={`h-10 w-10 flex items-center justify-center rounded-lg text-sm font-medium transition ${
                      currentPage === pageNum
                        ? 'bg-primary-200 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pageNum}
                  </Link>
                );
              } else if (pageNum === currentPage - 2 || pageNum === currentPage + 2) {
                return <span key={pageNum} className="px-2 text-slate-400">...</span>;
              }
              return null;
            })}
          </div>

          <Link
            href={`/blog?page=${Math.min(totalPages, currentPage + 1)}`}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition ${
              currentPage === totalPages 
                ? 'pointer-events-none text-slate-300' 
                : 'text-slate-700 hover:bg-slate-100 hover:text-primary-200'
            }`}
          >
            Next →
          </Link>
        </nav>
      )}
    </section>
  );
};

export default BlogPage;