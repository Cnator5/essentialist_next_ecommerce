// app/blog/[slug]/page.jsx
import Link from 'next/link';
import { notFound } from 'next/navigation';
import sanitizeHtml from 'sanitize-html';

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  'http://localhost:1010';

async function fetchBlog(slug) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog/${slug}`, {
      next: { revalidate: 120 },
    });

    if (response.status === 404) {
      return null;
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch blog: ${response.statusText}`);
    }

    return response.json();
  } catch (error) {
    console.error(`Blog details error for slug "${slug}":`, error);
    return null;
  }
}

export async function generateMetadata({ params }) {
  const { slug } = await params;

  const payload = await fetchBlog(slug);
  if (!payload?.data) {
    return {
      title: 'Article not found | EssentialistMakeupStore',
    };
  }

  const blog = payload.data;
  return {
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt || undefined,
    openGraph: {
      title: blog.metaTitle || blog.title,
      description: blog.metaDescription || blog.excerpt || '',
      images: blog.coverImage ? [blog.coverImage] : [],
      type: 'article',
      publishedTime: blog.publishedAt,
      tags: blog.tags,
    },
  };
}

const BlogDetailsPage = async ({ params }) => {
  const { slug } = await params;

  const payload = await fetchBlog(slug);

  if (!payload?.data) {
    notFound();
  }

  const blog = payload.data;

  const publishedDate = blog.publishedAt || blog.createdAt;
  const formattedDate = publishedDate
    ? new Date(publishedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const sanitizedContent = sanitizeHtml(blog.content || '', {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat([
      'img',
      'video',
      'source',
      'iframe',
      'figure',
      'figcaption',
    ]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      iframe: ['src', 'allow', 'allowfullscreen', 'frameborder'],
      img: ['src', 'alt', 'title', 'width', 'height', 'loading'],
      video: ['controls', 'poster', 'width', 'height', 'src'],
      source: ['src', 'type'],
    },
    allowedSchemes: ['data', 'http', 'https'],
  });

  return (
    <article className="mx-auto max-w-4xl px-4 py-12">
      <Link
        href="/blog"
        className="text-sm font-semibold uppercase tracking-wide text-primary-200 hover:text-primary-300"
      >
        ← Back to Blog
      </Link>

      <header className="mt-6 space-y-4 text-center">
        <h1 className="text-3xl font-semibold text-slate-900 md:text-4xl">{blog.title}</h1>
        {blog.excerpt && <p className="mx-auto max-w-2xl text-sm text-slate-600 md:text-base">{blog.excerpt}</p>}

        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-500 md:text-sm">
          {formattedDate && <span>Published {formattedDate}</span>}
          {blog.readingTime ? <span>{blog.readingTime} min read</span> : null}
          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <span className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">
                  #{tag}
                </span>
              ))}
            </span>
          )}
        </div>
      </header>

      {blog.coverImage && (
        <div className="mt-8 overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <img
            src={blog.coverImage}
            alt={blog.title}
            className="h-auto w-full object-cover"
            loading="lazy"
          />
        </div>
      )}

      <section
        className="prose prose-slate mx-auto mt-10 max-w-none prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-headings:text-slate-900 prose-p:text-slate-700 prose-a:text-primary-200 hover:prose-a:text-primary-300"
        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      />

      <footer className="mt-12 rounded-3xl bg-slate-50 px-6 py-8 text-center shadow-inner">
        <h2 className="text-lg font-semibold text-slate-900">Need personalised beauty advice?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Chat with our team on{' '}
          <a href="tel:+237655225569" className="font-semibold text-primary-200">
            +237 655 22 55 69
          </a>{' '}
          or reach us via email at{' '}
          <a href="mailto:esssmakeup@gmail.com" className="font-semibold text-primary-200">
            esssmakeup@gmail.com
          </a>
        </p>
      </footer>
    </article>
  );
};

export default BlogDetailsPage;