"use client";
import React, { useState } from 'react';
import { useNewsList, useFeaturedNews, useNewsCategories } from '@/hooks/useLiveData';
import NewsCard from '@/components/news/NewsCard';
import { FaArrowLeft, FaSearch, FaTimes, FaChevronLeft, FaChevronRight, FaPlus, FaNewspaper } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const NewsCardSkeleton = () => (
  <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}>
    <div className="skeleton" style={{ paddingBottom: '56.25%', position: 'relative', borderRadius: 0 }}></div>
    <div className="p-4 space-y-2">
      <div className="skeleton h-4 w-20 rounded"></div>
      <div className="skeleton h-4 w-full rounded"></div>
      <div className="skeleton h-4 w-3/4 rounded"></div>
      <div className="skeleton h-3 w-full rounded"></div>
      <div className="skeleton h-3 w-2/3 rounded"></div>
    </div>
  </div>
);

const FeaturedSkeleton = () => (
  <div className="skeleton rounded-2xl" style={{ height: '340px' }}></div>
);

const Page = () => {
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('');

  const { data: newsData, isLoading: listLoading } = useNewsList({
    page,
    limit: 9,
    category: activeCategory || undefined,
    search: search || undefined,
  });

  const { data: featured = [], isLoading: featuredLoading } = useFeaturedNews(3);
  const { data: categories = [] } = useNewsCategories();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat === activeCategory ? '' : cat);
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const clearFilters = () => {
    setActiveCategory('');
    setSearch('');
    setSearchInput('');
    setPage(1);
  };

  const articles = newsData?.articles || [];
  const pagination = newsData?.pagination;
  const hasFilters = activeCategory || search;

  return (
    <div style={{ background: 'var(--bg-primary)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => router.back()}
              className="flex items-center justify-center w-8 h-8 rounded-lg transition-colors"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <FaArrowLeft size={12} />
            </button>
            <div>
              <h1 className="font-bold text-xl" style={{ fontFamily: 'Rajdhani, sans-serif', color: 'var(--text-primary)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                Football News & Analysis
              </h1>
              <p className="text-xs" style={{ color: 'var(--text-muted)' }}>
                Real-time breaking news, tactical breakdowns & transfer reports
              </p>
            </div>
          </div>
          <Link
            href="/create-news"
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-all hover:opacity-90"
            style={{ background: 'var(--accent-blue)', color: '#fff' }}
          >
            <FaPlus size={10} /> Write Article
          </Link>
        </div>

        {/* Featured Banner (only on page 1 without filters) */}
        {!hasFilters && page === 1 && (
          <section className="mb-8">
            <div className="mb-3">
              <span className="section-label">Top Stories</span>
            </div>
            {featuredLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2">
                  <FeaturedSkeleton />
                </div>
                <div className="grid gap-4">
                  <FeaturedSkeleton />
                  <FeaturedSkeleton />
                </div>
              </div>
            ) : featured.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className={featured.length > 1 ? 'lg:col-span-2' : 'lg:col-span-3'}>
                  <NewsCard article={featured[0]} variant="featured" />
                </div>
                {featured.length > 1 && (
                  <div className="grid gap-4" style={{ gridTemplateRows: featured.length > 2 ? '1fr 1fr' : '1fr' }}>
                    {featured.slice(1, 3).map(a => (
                      <NewsCard key={a._id} article={a} variant="featured" />
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </section>
        )}

        {/* Search + categories */}
        <div
          className="rounded-xl p-4 mb-6 space-y-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
        >
          {/* Search bar */}
          <form onSubmit={handleSearch} className="relative">
            <FaSearch size={12} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search articles, authors, clubs, players, tags..."
              className="search-input pr-24"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => { setSearchInput(''); setSearch(''); setPage(1); }}
                className="absolute right-16 top-1/2 -translate-y-1/2"
                style={{ color: 'var(--text-muted)' }}
              >
                <FaTimes size={11} />
              </button>
            )}
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{ background: 'var(--accent-blue)', color: '#fff' }}
            >
              Search
            </button>
          </form>

          {/* Category pills */}
          {categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {categories.map(({ category, count }) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
                  style={{
                    background: activeCategory === category ? 'rgba(41,121,255,0.25)' : 'rgba(255,255,255,0.05)',
                    color: activeCategory === category ? '#6ab0ff' : 'var(--text-secondary)',
                    border: activeCategory === category ? '1px solid rgba(41,121,255,0.45)' : '1px solid var(--border-subtle)',
                  }}
                >
                  {category} <span style={{ opacity: 0.65 }}>({count})</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Active filters */}
        {hasFilters && (
          <div className="flex items-center gap-3 mb-4">
            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
              {pagination ? `${pagination.total} result` : 'Searching...'}
              {activeCategory && ` in "${activeCategory}"`}
              {search && ` for "${search}"`}
            </span>
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-xs font-medium"
              style={{ color: 'var(--accent-blue)' }}
            >
              <FaTimes size={9} /> Clear
            </button>
          </div>
        )}

        {/* Section header for article grid */}
        {!hasFilters && (
          <div className="flex items-center justify-between mb-4">
            <span className="section-label">All Stories</span>
            {pagination && <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{pagination.total} articles</span>}
          </div>
        )}

        {/* Articles grid */}
        {listLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(9)].map((_, i) => <NewsCardSkeleton key={i} />)}
          </div>
        ) : articles.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {articles.map((article, i) => (
              <div key={article._id} className="animate-fade-in-up" style={{ animationDelay: `${Math.min(i * 40, 300)}ms` }}>
                <NewsCard article={article} />
              </div>
            ))}
          </div>
        ) : (
          <div
            className="rounded-xl py-20 text-center"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)' }}
          >
            <div className="text-4xl mb-4">📰</div>
            <h3 className="font-bold text-base mb-2" style={{ color: 'var(--text-primary)' }}>
              {hasFilters ? 'No articles found' : 'No articles yet'}
            </h3>
            <p className="text-sm mb-5" style={{ color: 'var(--text-secondary)' }}>
              {hasFilters
                ? 'Try adjusting your search or category filter.'
                : 'Articles will appear here once seeded or published.'}
            </p>
            {hasFilters ? (
              <button onClick={clearFilters} className="px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent-blue)', color: '#fff' }}>
                Clear Filters
              </button>
            ) : (
              <Link href="/create-news" className="inline-block px-5 py-2.5 rounded-lg text-sm font-semibold" style={{ background: 'var(--accent-green)', color: '#000' }}>
                Write Article
              </Link>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={!pagination.hasPrev}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              <FaChevronLeft size={10} /> Prev
            </button>

            <div className="flex items-center gap-1">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1)
                .filter(p => p === 1 || p === pagination.pages || Math.abs(p - page) <= 1)
                .reduce((acc: (number | string)[], p, idx, arr) => {
                  if (idx > 0 && (arr[idx - 1] as number) < p - 1) acc.push('...');
                  acc.push(p);
                  return acc;
                }, [])
                .map((p, i) =>
                  p === '...' ? (
                    <span key={`ellipsis-${i}`} className="px-2 text-sm" style={{ color: 'var(--text-muted)' }}>...</span>
                  ) : (
                    <button
                      key={p}
                      onClick={() => setPage(p as number)}
                      className="w-8 h-8 rounded-lg text-sm font-semibold transition-all"
                      style={{
                        background: page === p ? 'var(--accent-blue)' : 'var(--bg-card)',
                        color: page === p ? '#fff' : 'var(--text-secondary)',
                        border: page === p ? 'none' : '1px solid var(--border-subtle)',
                      }}
                    >
                      {p}
                    </button>
                  )
                )}
            </div>

            <button
              onClick={() => setPage(p => Math.min(pagination.pages, p + 1))}
              disabled={!pagination.hasNext}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold disabled:opacity-40 transition-all"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}
            >
              Next <FaChevronRight size={10} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;
