"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNewsBySlug } from '@/hooks/useLiveData';
import NewsCard from '@/components/news/NewsCard';
import {
  FaArrowLeft, FaClock, FaEye, FaTag,
  FaFacebook, FaTwitter, FaLink,
} from 'react-icons/fa';
import Link from 'next/link';

// ── Category colour map (shared with NewsCard) ───────────────────────────────
const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Transfer Updates':       { bg: 'rgba(255,171,0,0.15)',    color: '#ffab00' },
  'Match Reports':          { bg: 'rgba(0,230,118,0.12)',    color: '#00e676' },
  'Player Interviews':      { bg: 'rgba(167,139,250,0.15)',  color: '#a78bfa' },
  'League Updates':         { bg: 'rgba(41,121,255,0.15)',   color: '#6ab0ff' },
  'International Football': { bg: 'rgba(20,184,166,0.15)',   color: '#2dd4bf' },
  'Club News':              { bg: 'rgba(251,146,60,0.15)',   color: '#fb923c' },
  'Opinion & Analysis':     { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
  'Football News':          { bg: 'rgba(96,165,250,0.15)',   color: '#60a5fa' },
};
const cat = (c: string) =>
  CATEGORY_COLORS[c] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' };

// ── Helpers ──────────────────────────────────────────────────────────────────
const fullDate = (d: string) =>
  new Date(d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

const timeAgo = (d: string) => {
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// ── Skeleton ─────────────────────────────────────────────────────────────────
const Skeleton = () => (
  <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-5">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton rounded-2xl" style={{ height: 400 }} />
      <div className="skeleton h-4 w-28 rounded" />
      <div className="skeleton h-9 w-full rounded" />
      <div className="skeleton h-9 w-4/5 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-2/3 rounded" />
      <div className="skeleton h-px w-full rounded" style={{ opacity: 0.3 }} />
      {[...Array(8)].map((_, i) => (
        <div key={i} className="skeleton rounded" style={{ height: 16, width: `${65 + Math.random() * 35}%` }} />
      ))}
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────────────────
export default function ArticlePage() {
  const params   = useParams();
  const router   = useRouter();
  const slug     = (params.id || params.slug) as string;
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useNewsBySlug(slug);

  const share = (platform?: 'twitter' | 'facebook') => {
    const url   = window.location.href;
    const title = data?.article.title ?? 'Football News';
    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
    } else if (navigator.share) {
      navigator.share({ title, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      });
    }
  };

  if (isLoading) return <Skeleton />;

  if (error || !data) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}
        className="flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Article Not Found</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            This article may have been removed or the link is incorrect.
          </p>
          <button onClick={() => router.push('/news')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}>
            <FaArrowLeft size={12} /> Back to News
          </button>
        </div>
      </div>
    );
  }

  const { article, related } = data;
  const cs      = cat(article.category);
  const pubDate = article.publishedAt || article.createdAt;

  return (
    <>
      {/* ── Article body styles ─────────────────────────────────────────── */}
      <style>{`
        /* Reading column */
        .article-body {
          font-family: 'Inter', -apple-system, sans-serif;
          font-size: 16px;
          line-height: 1.85;
          color: var(--text-secondary);
          word-break: break-word;
        }

        /* Paragraphs */
        .article-body p {
          margin: 0 0 1.25em;
        }

        /* Headings */
        .article-body h1,
        .article-body h2,
        .article-body h3,
        .article-body h4 {
          font-family: 'Rajdhani', sans-serif;
          color: var(--text-primary);
          letter-spacing: 0.4px;
          margin: 1.6em 0 0.5em;
          line-height: 1.25;
        }
        .article-body h1 { font-size: 2em;   font-weight: 800; }
        .article-body h2 { font-size: 1.55em; font-weight: 700; padding-bottom: 0.3em; border-bottom: 1px solid var(--border-subtle); }
        .article-body h3 { font-size: 1.25em; font-weight: 700; }
        .article-body h4 { font-size: 1.05em; font-weight: 700; }

        /* Inline */
        .article-body strong { color: var(--text-primary); font-weight: 700; }
        .article-body em     { color: #b4c4df; font-style: italic; }
        .article-body u      { text-decoration: underline; text-decoration-color: var(--accent-blue); text-underline-offset: 3px; }
        .article-body s      { color: var(--text-muted); text-decoration: line-through; }

        /* Highlight — TipTap outputs style="background-color: X; color: Y" */
        .article-body mark {
          padding: 1px 4px;
          border-radius: 4px;
          /* default amber if no inline style */
          background-color: rgba(255,171,0,0.25);
          color: inherit;
        }

        /* Text color — TipTap outputs style="color: X" via TextStyle */
        /* No extra rule needed — inline style handles it */

        /* Text alignment — TipTap outputs style="text-align: X" */
        /* No extra rule needed — inline style handles it */

        /* Code */
        .article-body code {
          background: rgba(41,121,255,0.1);
          color: #6ab0ff;
          padding: 2px 7px;
          border-radius: 5px;
          font-size: 0.88em;
          font-family: 'Fira Code', 'Cascadia Code', monospace;
        }
        .article-body pre {
          background: var(--bg-secondary);
          border: 1px solid var(--border-subtle);
          border-radius: 12px;
          padding: 18px 20px;
          overflow-x: auto;
          margin: 1.4em 0;
        }
        .article-body pre code {
          background: none;
          color: #a5b4d4;
          padding: 0;
          font-size: 0.9em;
        }

        /* Blockquote */
        .article-body blockquote {
          margin: 1.6em 0;
          padding: 14px 20px;
          border-left: 4px solid var(--accent-blue);
          background: rgba(41,121,255,0.06);
          border-radius: 0 12px 12px 0;
          color: var(--text-secondary);
          font-style: italic;
          font-size: 1.05em;
        }
        .article-body blockquote p { margin: 0; }

        /* Lists */
        .article-body ul,
        .article-body ol {
          padding-left: 1.6em;
          margin: 0.6em 0 1.2em;
        }
        .article-body ul { list-style: disc; }
        .article-body ol { list-style: decimal; }
        .article-body li {
          margin: 0.35em 0;
          padding-left: 0.2em;
        }
        .article-body li::marker { color: var(--accent-blue); }

        /* Links */
        .article-body a {
          color: var(--accent-blue);
          text-decoration: underline;
          text-decoration-color: rgba(41,121,255,0.4);
          text-underline-offset: 3px;
          transition: color 0.15s, text-decoration-color 0.15s;
        }
        .article-body a:hover {
          color: #90c4ff;
          text-decoration-color: rgba(144,196,255,0.6);
        }

        /* Divider */
        .article-body hr {
          border: none;
          border-top: 1px solid var(--border-subtle);
          margin: 2em 0;
        }

        /* Images — inline images placed anywhere by the editor */
        .article-body img {
          max-width: 100%;
          height: auto;
          display: block;
          margin: 1.6em auto;
          border-radius: 12px;
          border: 1px solid var(--border-subtle);
          box-shadow: 0 4px 24px rgba(0,0,0,0.3);
        }

        /* Full-width image variant */
        .article-body img[data-full-width="true"] {
          max-width: calc(100% + 64px);
          margin-left: -32px;
          border-radius: 0;
        }

        /* Caption below images (if a paragraph immediately follows an img) */
        .article-body img + p em,
        .article-body figure figcaption {
          display: block;
          text-align: center;
          font-size: 0.82em;
          color: var(--text-muted);
          margin-top: -0.8em;
          margin-bottom: 1.4em;
          font-style: italic;
        }

        /* Tables (future-proof) */
        .article-body table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.4em 0;
          font-size: 0.9em;
        }
        .article-body th, .article-body td {
          padding: 9px 14px;
          border: 1px solid var(--border-subtle);
          text-align: left;
        }
        .article-body th {
          background: var(--bg-surface);
          color: var(--text-primary);
          font-weight: 700;
        }
        .article-body tr:nth-child(even) td { background: rgba(255,255,255,0.02); }

        /* First paragraph lead — slightly larger */
        .article-body > p:first-of-type {
          font-size: 1.08em;
          color: var(--text-primary);
          font-weight: 450;
        }
      `}</style>

      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8">

          {/* ── Back ── */}
          <button onClick={() => router.push('/news')}
            className="flex items-center gap-2 mb-7 text-sm font-medium group"
            style={{ color: 'var(--text-muted)' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>
            <FaArrowLeft size={11} className="transition-transform group-hover:-translate-x-0.5" />
            Back to News
          </button>

          {/* ── Hero cover image ── */}
          {article.imageUrl && (
            <div className="rounded-2xl overflow-hidden mb-8"
              style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.4)', maxHeight: 480 }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full object-cover"
                style={{ maxHeight: 480, width: '100%' }}
              />
            </div>
          )}

          {/* ── Category + featured badge ── */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <Link href={`/news?category=${encodeURIComponent(article.category)}`}>
              <span className="text-xs font-bold px-3 py-1 rounded-full cursor-pointer" style={cs}>
                {article.category}
              </span>
            </Link>
            {article.featured && (
              <span className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: 'rgba(255,171,0,0.15)', color: '#ffab00' }}>
                ⭐ Featured
              </span>
            )}
          </div>

          {/* ── Title ── */}
          <h1 className="font-black leading-tight mb-4"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--text-primary)',
              fontSize: 'clamp(1.6rem, 4vw, 2.4rem)',
              letterSpacing: '0.5px',
            }}>
            {article.title}
          </h1>

          {/* ── Summary ── */}
          <p className="mb-5 text-base leading-relaxed"
            style={{ color: 'var(--text-secondary)', borderLeft: '3px solid var(--accent-blue)', paddingLeft: '14px', fontStyle: 'italic' }}>
            {article.summary}
          </p>

          {/* ── Meta bar ── */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}>
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1.5">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--bg-surface)', color: 'var(--text-secondary)' }}>
                  {article.author.charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {article.author}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock size={10} />
                <span title={fullDate(pubDate)}>{timeAgo(pubDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span style={{ opacity: 0.5 }}>·</span>
                <span>{article.readTime} min read</span>
              </div>
              {article.views > 0 && (
                <div className="flex items-center gap-1">
                  <FaEye size={10} />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <button onClick={() => share('twitter')}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                title="Share on Twitter"
                style={{ background: 'rgba(29,161,242,0.12)', color: '#1da1f2', border: '1px solid rgba(29,161,242,0.2)' }}>
                <FaTwitter size={12} />
              </button>
              <button onClick={() => share('facebook')}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all"
                title="Share on Facebook"
                style={{ background: 'rgba(24,119,242,0.12)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.2)' }}>
                <FaFacebook size={12} />
              </button>
              <button onClick={() => share()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                title="Copy link"
                style={{ background: copied ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.06)', color: copied ? 'var(--accent-green)' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                <FaLink size={10} />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* ── Article content (rich HTML from TipTap) ── */}
          <div
            className="article-body mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* ── Footer: date + tags ── */}
          <div className="py-6 space-y-4"
            style={{ borderTop: '1px solid var(--border-subtle)' }}>
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Published {fullDate(pubDate)}
            </p>

            {article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <FaTag size={9} /> Tags:
                </span>
                {article.tags.map(tag => (
                  <Link key={tag} href={`/news?tag=${encodeURIComponent(tag)}`}>
                    <span className="text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer"
                      style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(41,121,255,0.12)';
                        (e.currentTarget as HTMLElement).style.color = '#6ab0ff';
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      }}>
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* ── Share again (bottom) ── */}
          <div className="rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Enjoyed this article?</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Share it with fellow football fans.</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => share('twitter')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(29,161,242,0.12)', color: '#1da1f2', border: '1px solid rgba(29,161,242,0.25)' }}>
                <FaTwitter size={11} /> Twitter
              </button>
              <button onClick={() => share('facebook')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(24,119,242,0.12)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.25)' }}>
                <FaFacebook size={11} /> Facebook
              </button>
              <button onClick={() => share()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: copied ? 'rgba(0,230,118,0.15)' : 'var(--bg-surface)', color: copied ? 'var(--accent-green)' : 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                <FaLink size={10} /> {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* ── Related articles ── */}
          {related.length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <span className="section-label">More Articles</span>
                <Link href={`/news?category=${encodeURIComponent(article.category)}`}
                  className="text-xs font-medium"
                  style={{ color: 'var(--accent-blue)' }}>
                  More in {article.category} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map(rel => (
                  <NewsCard key={rel._id} article={rel} />
                ))}
              </div>
            </section>
          )}

        </div>
      </div>
    </>
  );
}
