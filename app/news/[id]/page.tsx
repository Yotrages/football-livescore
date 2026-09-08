"use client";
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useNewsBySlug } from '@/hooks/useLiveData';
import NewsCard from '@/components/news/NewsCard';
import {
  FaArrowLeft, FaClock, FaEye, FaTag,
  FaFacebook, FaTwitter, FaLink, FaBolt, FaShareAlt
} from 'react-icons/fa';
import Link from 'next/link';

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  'Transfer Updates':       { bg: 'rgba(255,171,0,0.15)',    color: '#ffab00' },
  'Match Reports':          { bg: 'rgba(0,230,118,0.12)',    color: '#00e676' },
  'Player Interviews':      { bg: 'rgba(167,139,250,0.15)',  color: '#a78bfa' },
  'League Updates':         { bg: 'rgba(41,121,255,0.15)',   color: '#6ab0ff' },
  'International Football': { bg: 'rgba(20,184,166,0.15)',   color: '#2dd4bf' },
  'Club News':              { bg: 'rgba(251,146,60,0.15)',   color: '#fb923c' },
  'Opinion & Analysis':     { bg: 'rgba(248,113,113,0.15)',  color: '#f87171' },
  'Football News':          { bg: 'rgba(96,165,250,0.15)',   color: '#60a5fa' },
};

const getCategoryStyle = (c: string) =>
  CATEGORY_COLORS[c] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' };

const sanitizeSummary = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/<a\b[^>]*>.*?<\/a>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/https?:\/\/\S+/gi, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const fullDate = (d?: string | Date) => {
  if (!d) return 'Recent';
  return new Date(d).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });
};

const timeAgo = (d?: string | Date) => {
  if (!d) return 'just now';
  const s = Math.floor((Date.now() - new Date(d).getTime()) / 1000);
  if (s < 60)   return 'just now';
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  if (s < 604800) return `${Math.floor(s / 86400)}d ago`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

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

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = (params.id || params.slug) as string;
  const [copied, setCopied] = useState(false);

  const { data, isLoading, error } = useNewsBySlug(slug);

  const share = (platform?: 'twitter' | 'facebook') => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = data?.article?.title ?? 'Football News';
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

  if (error || !data || !data.article) {
    return (
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}
        className="flex items-center justify-center px-4 py-20">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Article Not Found</h1>
          <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
            This article may have been moved or the link is expired.
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

  const { article, related = [] } = data;
  const pubDate = article.publishedAt || article.createdAt;
  const cleanSummary = sanitizeSummary(article.summary);

  return (
    <>
      <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">

          {/* Top navigation */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/news')}
              className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all"
              style={{
                background: 'rgba(255,255,255,0.05)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-subtle)',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
              onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >
              <FaArrowLeft size={10} /> Back to News
            </button>

            <span className="text-xs font-semibold px-2.5 py-1 rounded-full" style={getCategoryStyle(article.category)}>
              {article.category}
            </span>
          </div>

          {/* Hero image banner */}
          {article.imageUrl ? (
            <div className="relative rounded-2xl overflow-hidden mb-6" style={{ border: '1px solid var(--border-subtle)', maxHeight: '460px' }}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover"
                style={{ maxHeight: '460px' }}
              />
            </div>
          ) : null}

          {/* Category & Featured badge */}
          <div className="flex items-center gap-2 mb-3">
            <span
              className="text-xs font-bold px-2.5 py-1 rounded-full"
              style={getCategoryStyle(article.category)}
            >
              {article.category}
            </span>
            {article.featured && (
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1"
                style={{ background: 'rgba(255,171,0,0.2)', color: '#ffab00' }}
              >
                <FaBolt size={9} /> Featured Story
              </span>
            )}
          </div>

          {/* Title */}
          <h1
            className="font-black leading-tight mb-4"
            style={{
              fontFamily: 'Rajdhani, sans-serif',
              color: 'var(--text-primary)',
              fontSize: 'clamp(1.75rem, 4vw, 2.6rem)',
              letterSpacing: '0.4px',
            }}
          >
            {article.title}
          </h1>

          {/* Summary */}
          {cleanSummary && (
            <p
              className="mb-6 text-base leading-relaxed"
              style={{
                color: 'var(--text-secondary)',
                borderLeft: '4px solid var(--accent-blue)',
                paddingLeft: '16px',
                fontStyle: 'italic',
                background: 'rgba(41, 121, 255, 0.04)',
                paddingTop: '8px',
                paddingBottom: '8px',
                borderRadius: '0 8px 8px 0',
              }}
            >
              {cleanSummary}
            </p>
          )}

          {/* Meta bar */}
          <div
            className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-6"
            style={{ borderBottom: '1px solid var(--border-subtle)' }}
          >
            <div className="flex flex-wrap items-center gap-4 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-2">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                  style={{ background: 'var(--bg-surface)', color: '#6ab0ff' }}
                >
                  {(article.author || 'F').charAt(0).toUpperCase()}
                </div>
                <span className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>
                  {article.author || 'Sports Desk'}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <FaClock size={10} />
                <span title={fullDate(pubDate)}>{timeAgo(pubDate)}</span>
              </div>
              <div className="flex items-center gap-1">
                <span>•</span>
                <span>{article.readTime || 1} min read</span>
              </div>
              {article.views !== undefined && article.views > 0 && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <FaEye size={10} />
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              )}
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => share('twitter')}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
                title="Share on Twitter"
                style={{ background: 'rgba(29,161,242,0.12)', color: '#1da1f2', border: '1px solid rgba(29,161,242,0.25)' }}
              >
                <FaTwitter size={12} />
              </button>
              <button
                onClick={() => share('facebook')}
                className="flex items-center justify-center w-8 h-8 rounded-lg transition-all hover:opacity-80"
                title="Share on Facebook"
                style={{ background: 'rgba(24,119,242,0.12)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.25)' }}
              >
                <FaFacebook size={12} />
              </button>
              <button
                onClick={() => share()}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all hover:opacity-80"
                title="Copy link"
                style={{
                  background: copied ? 'rgba(0,230,118,0.15)' : 'rgba(255,255,255,0.06)',
                  color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <FaLink size={10} />
                {copied ? 'Copied!' : 'Copy link'}
              </button>
            </div>
          </div>

          {/* Article content (rich HTML) */}
          <div
            className="article-body mb-10"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />

          {/* Footer: date + tags */}
          <div
            className="py-6 space-y-4"
            style={{ borderTop: '1px solid var(--border-subtle)' }}
          >
            <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
              Published on {fullDate(pubDate)}
            </p>

            {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="flex items-center gap-1 text-xs" style={{ color: 'var(--text-muted)' }}>
                  <FaTag size={9} /> Tags:
                </span>
                {article.tags.map((tag: string) => (
                  <Link key={tag} href={`/news?tag=${encodeURIComponent(tag)}`}>
                    <span
                      className="text-xs px-2.5 py-1 rounded-full transition-all cursor-pointer"
                      style={{
                        background: 'rgba(255,255,255,0.05)',
                        color: 'var(--text-secondary)',
                        border: '1px solid var(--border-subtle)',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(41,121,255,0.12)';
                        (e.currentTarget as HTMLElement).style.color = '#6ab0ff';
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.05)';
                        (e.currentTarget as HTMLElement).style.color = 'var(--text-secondary)';
                      }}
                    >
                      #{tag}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Share Box (bottom) */}
          <div
            className="rounded-2xl p-5 mb-10 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Enjoyed this article?</p>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>Share it with fellow football fans.</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => share('twitter')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(29,161,242,0.12)', color: '#1da1f2', border: '1px solid rgba(29,161,242,0.25)' }}
              >
                <FaTwitter size={11} /> Twitter
              </button>
              <button
                onClick={() => share('facebook')}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{ background: 'rgba(24,119,242,0.12)', color: '#1877f2', border: '1px solid rgba(24,119,242,0.25)' }}
              >
                <FaFacebook size={11} /> Facebook
              </button>
              <button
                onClick={() => share()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all"
                style={{
                  background: copied ? 'rgba(0,230,118,0.15)' : 'var(--bg-surface)',
                  color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                }}
              >
                <FaLink size={10} /> {copied ? 'Copied!' : 'Copy Link'}
              </button>
            </div>
          </div>

          {/* Related articles */}
          {related && related.length > 0 && (
            <section className="mt-12">
              <div className="flex items-center justify-between mb-4">
                <span className="section-label">Related Stories</span>
                <Link
                  href={`/news?category=${encodeURIComponent(article.category)}`}
                  className="text-xs font-medium"
                  style={{ color: 'var(--accent-blue)' }}
                >
                  More in {article.category} →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {related.map((rel: any) => (
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
