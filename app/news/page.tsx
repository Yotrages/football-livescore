"use client"
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaCalendar, FaChevronRight, FaTag } from 'react-icons/fa';

// Types
interface NewsArticle {
  id: string;
  title: string;
  subtitle: string;
  content: string;
  image: string;
  date: string;
  source: string;
  sourceUrl: string;
  categories: string[];
  relatedTeams?: {
    id: number;
    name: string;
  }[];
  relatedCompetitions?: {
    id: number;
    name: string;
  }[];
}

interface NewsCategory {
  id: string;
  name: string;
  count: number;
}

const NewsPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [featuredArticle, setFeaturedArticle] = useState<NewsArticle | null>(null);
  const [categories, setCategories] = useState<NewsCategory[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  
  useEffect(() => {
    fetchNews();
    fetchCategories();
  }, [selectedCategory, page]);
  
  const fetchNews = async () => {
    try {
      setLoading(true);
      
      const url = selectedCategory 
        ? `/api/news?category=${selectedCategory}&page=${page}`
        : `/api/news?page=${page}`;
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Failed to fetch news articles');
      }
      
      const data = await response.json();
      
      if (page === 1) {
        setArticles(data.articles);
        if (data.articles.length > 0) {
          setFeaturedArticle(data.articles[0]);
          setArticles(data.articles.slice(1));
        }
      } else {
        setArticles(prev => [...prev, ...data.articles]);
      }
      
      setHasMore(data.hasMore);
      setError(null);
    } catch (err) {
      setError('Error fetching news. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/news/categories');
      
      if (!response.ok) {
        throw new Error('Failed to fetch categories');
      }
      
      const data = await response.json();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };
  
  const handleCategoryClick = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setPage(1);
    window.scrollTo(0, 0);
  };
  
  const loadMore = () => {
    setPage(prev => prev + 1);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) {
      return text;
    }
    return text.substring(0, maxLength) + '...';
  };

  return (
    <>
      <Head>
        <title>Football News | Football Live</title>
        <meta name="description" content="Latest football news, transfers, and updates" />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Football News</h1>
          
          <div className="flex space-x-2 overflow-x-auto whitespace-nowrap pb-2">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3 py-1 rounded-full text-sm font-medium ${
                selectedCategory === null
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 hover:bg-gray-300'
              }`}
            >
              All
            </button>
            
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedCategory === category.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Featured Article */}
        {featuredArticle && page === 1 && !selectedCategory && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
            <div className="md:flex">
              <div className="md:w-2/3 relative h-64 md:h-auto">
                <Image
                  src={featuredArticle.image}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="md:w-1/3 p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                  <FaCalendar className="w-4 h-4 mr-1" />
                  <span>{formatDate(featuredArticle.date)}</span>
                </div>
                <h2 className="text-2xl font-bold mb-2">{featuredArticle.title}</h2>
                <p className="text-gray-600 mb-4">
                  {truncateText(featuredArticle.subtitle, 120)}
                </p>
                <Link href={`/news/${featuredArticle.id}`}>
                  <div className="inline-flex items-center font-medium text-blue-600 hover:text-blue-800">
                    Read More <FaChevronRight className="w-4 h-4 ml-1" />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article) => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>

        {/* Loading and Load More */}
        <div className="mt-8 text-center">
          {loading && (
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          )}
          
          {!loading && hasMore && (
            <button
              onClick={loadMore}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Load More
            </button>
          )}
          
          {!loading && !hasMore && articles.length > 0 && (
            <p className="text-gray-500">No more articles to load</p>
          )}
          
          {!loading && articles.length === 0 && !error && (
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <p className="text-lg font-medium mb-2">No Articles Found</p>
              <p className="text-gray-600">
                {selectedCategory ? 'Try selecting a different category' : 'Check back later for updates'}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Link href={`/news/${article.id}`}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
        <div className="relative h-48">
          <Image
            src={article.image}
            alt={article.title}
            fill
            className="object-cover"
          />
        </div>
        <div className="p-4">
          <div className="flex items-center text-sm text-gray-500 mb-2">
            <FaCalendar className="w-4 h-4 mr-1" />
            <span>{formatDate(article.date)}</span>
          </div>
          <h3 className="text-lg font-bold mb-2">{article.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2 mb-3">
            {article.subtitle}
          </p>
          
          {article.categories.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.categories.slice(0, 3).map((category, index) => (
                <span
                  key={index}
                  className="inline-flex items-center text-xs bg-gray-100 px-2 py-1 rounded"
                >
                  <FaTag className="w-3 h-3 mr-1" />
                  {category}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default NewsPage;