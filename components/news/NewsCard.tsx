"use client";
import Link from 'next/link';
import { NewsItem } from '@/types';
import { FaClock, FaUser, FaEye } from 'react-icons/fa';

interface NewsCardProps {
  article: NewsItem;
  variant?: 'default' | 'featured' | 'compact';
}

const categoryColors: Record<string, { bg: string; color: string }> = {
  'Transfer Updates':    { bg: 'rgba(255,171,0,0.15)',    color: '#ffab00' },
  'Match Reports':       { bg: 'rgba(0,230,118,0.12)',    color: '#00e676' },
  'Player Interviews':   { bg: 'rgba(167,139,250,0.15)',  color: '#a78bfa' },
  'League Updates':      { bg: 'rgba(41,121,255,0.15)',   color: '#6ab0ff' },
  'International Football': { bg: 'rgba(20,184,166,0.15)', color: '#2dd4bf' },
  'Club News':           { bg: 'rgba(251,146,60,0.15)',   color: '#fb923c' },
  'Opinion & Analysis':  { bg: 'rgba(248,113,113,0.15)', color: '#f87171' },
  'Football News':       { bg: 'rgba(96,165,250,0.15)',   color: '#60a5fa' },
};

const getCategoryStyle = (category: string) =>
  categoryColors[category] || { bg: 'rgba(255,255,255,0.08)', color: 'var(--text-secondary)' };

const timeAgo = (dateString: string): string => {
  const now = Date.now();
  const then = new Date(dateString).getTime();
  const diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const NewsCard: React.FC<NewsCardProps> = ({ article, variant = 'default' }) => {
  const catStyle = getCategoryStyle(article.category);
  const date = article.publishedAt || article.createdAt;

  if (variant === 'compact') {
    return (
      <Link href={`/news/${article.slug}`} className="block group">
        <div
          className="flex gap-3 p-3 rounded-xl transition-all"
          style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-subtle)' }}
          onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.background = 'var(--bg-card-hover)'}
          onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)'}
        >
          {article.imageUrl && (
            <div className="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <span
              className="text-xs font-semibold px-1.5 py-0.5 rounded mb-1 inline-block"
              style={catStyle}
            >
              {article.category}
            </span>
            <h4
              className="text-sm font-semibold line-clamp-2 group-hover:underline"
              style={{ color: 'var(--text-primary)' }}
            >
              {article.title}
            </h4>
            <div className="flex items-center gap-2 mt-1 text-xs" style={{ color: 'var(--text-muted)' }}>
              <FaClock size={9} />
              <span>{timeAgo(date)}</span>
              <span>·</span>
              <span>{article.readTime} min read</span>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  if (variant === 'featured') {
    return (
      <Link href={`/news/${article.slug}`} className="block group h-full">
        <div
          className="relative h-full rounded-2xl overflow-hidden cursor-pointer"
          style={{ border: '1px solid var(--border-subtle)', minHeight: '340px' }}
        >
          {/* Image */}
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0"
              style={{ background: 'linear-gradient(135deg, #1e2d45 0%, #141c2e 100%)' }}
            />
          )}

          {/* Gradient overlay */}
          <div
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,14,26,0.97) 0%, rgba(10,14,26,0.5) 50%, rgba(10,14,26,0.1) 100%)' }}
          />

          {/* Content */}
          <div className="absolute inset-0 flex flex-col justify-end p-5">
            <div className="flex items-center gap-2 mb-2">
              <span
                className="text-xs font-bold px-2.5 py-1 rounded-full"
                style={catStyle}
              >
                {article.category}
              </span>
              {article.featured && (
                <span
                  className="text-xs font-bold px-2.5 py-1 rounded-full"
                  style={{ background: 'rgba(255,171,0,0.2)', color: '#ffab00' }}
                >
                  ⭐ Featured
                </span>
              )}
            </div>

            <h2
              className="font-bold text-xl leading-snug mb-2 group-hover:underline line-clamp-3"
              style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '0.3px' }}
            >
              {article.title}
            </h2>
            <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
              {article.summary}
            </p>
            <div className="flex items-center gap-3 text-xs" style={{ color: 'var(--text-muted)' }}>
              <div className="flex items-center gap-1">
                <FaUser size={9} />
                <span>{article.author}</span>
              </div>
              <span>·</span>
              <div className="flex items-center gap-1">
                <FaClock size={9} />
                <span>{timeAgo(date)}</span>
              </div>
              <span>·</span>
              <span>{article.readTime} min read</span>
              {article.views > 0 && (
                <>
                  <span>·</span>
                  <div className="flex items-center gap-1">
                    <FaEye size={9} />
                    <span>{article.views.toLocaleString()}</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </Link>
    );
  }

  // Default card
  return (
    <Link href={`/news/${article.slug}`} className="block group h-full">
      <div
        className="h-full rounded-xl overflow-hidden transition-all duration-200 flex flex-col cursor-pointer"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-primary)';
          (e.currentTarget as HTMLElement).style.boxShadow = 'var(--card-shadow)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLElement).style.transform = '';
          (e.currentTarget as HTMLElement).style.borderColor = 'var(--border-subtle)';
          (e.currentTarget as HTMLElement).style.boxShadow = '';
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden" style={{ paddingBottom: '56.25%' }}>
          {article.imageUrl ? (
            <img
              src={article.imageUrl}
              alt={article.title}
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-400 group-hover:scale-105"
            />
          ) : (
            <div
              className="absolute inset-0 flex items-center justify-center text-4xl"
              style={{ background: 'linear-gradient(135deg, var(--bg-surface) 0%, var(--bg-secondary) 100%)' }}
            >
              ⚽
            </div>
          )}
          {article.featured && (
            <div
              className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded"
              style={{ background: 'rgba(255,171,0,0.9)', color: '#000' }}
            >
              Featured
            </div>
          )}
        </div>

        {/* Body */}
        <div className="p-4 flex flex-col flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span
              className="text-xs font-semibold px-2 py-0.5 rounded"
              style={catStyle}
            >
              {article.category}
            </span>
          </div>

          <h3
            className="font-bold text-sm leading-snug mb-2 line-clamp-2 group-hover:underline flex-1"
            style={{ color: 'var(--text-primary)' }}
          >
            {article.title}
          </h3>
          <p className="text-xs line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
            {article.summary}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between text-xs mt-auto pt-2" style={{ borderTop: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
            <div className="flex items-center gap-1.5">
              <FaUser size={9} />
              <span className="truncate max-w-[80px]">{article.author}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{article.readTime} min</span>
              <span>·</span>
              <span>{timeAgo(date)}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;
