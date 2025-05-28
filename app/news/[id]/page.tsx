"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaCalendar, FaGlobe, FaShare, FaTag, FaUser } from 'react-icons/fa';

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
  author?: string;
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

interface RelatedArticle {
  id: string;
  title: string;
  image: string;
  date: string;
}

const NewsDetail: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;
  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<RelatedArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    fetchArticle();
  }, [id]);

  const fetchArticle = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`/api/news/${id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch article');
      }
      
      const data = await response.json();
      setArticle(data.article);
      setRelatedArticles(data.relatedArticles || []);
      setError(null);
    } catch (err) {
      setError('Error fetching article. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  
  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: article?.title || 'Football News',
        text: article?.subtitle || '',
        url: window.location.href
      }).catch(err => console.error('Error sharing:', err));
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert('Link copied to clipboard!'))
        .catch(err => console.error('Error copying to clipboard:', err));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center p-4">
          <p className="text-xl text-red-500">{error || 'Article not found'}</p>
          <button 
            onClick={() => router.push('/news')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Back to News
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>{article.title} | Football News</title>
        <meta name="description" content={article.subtitle} />
        <meta property="og:title" content={article.title} />
        <meta property="og:description" content={article.subtitle} />
        <meta property="og:image" content={article.image} />
      </Head>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/news">
            <div className="flex items-center text-blue-600 hover:text-blue-800">
              <FaArrowLeft className="w-4 h-4 mr-1" />
              <span>Back to News</span>
            </div>
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Article Header */}
          <div className="relative h-64 md:h-96">
            <Image
              src={article.image}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
          
          <div className="p-6 md:p-8">
            <div className="flex flex-wrap items-center text-sm text-gray-500 mb-4 gap-4">
              <div className="flex items-center">
                <FaCalendar className="w-4 h-4 mr-1" />
                <span>{formatDate(article.date)}</span>
              </div>
              
              {article.author && (
                <div className="flex items-center">
                  <FaUser className="w-4 h-4 mr-1" />
                  <span>{article.author}</span>
                </div>
              )}
              
              <div className="flex items-center">
                <FaGlobe className="w-4 h-4 mr-1" />
                <a 
                  href={article.sourceUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  {article.source}
                </a>
              </div>
              
              <button 
                onClick={shareArticle}
                className="flex items-center hover:text-blue-600"
              >
                <FaShare className="w-4 h-4 mr-1" />
                <span>Share</span>
              </button>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
            <p className="text-xl text-gray-700 mb-6">{article.subtitle}</p>
            
            {article.categories.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {article.categories.map((category, index) => (
                  <Link key={index} href={`/news?category=${category}`}>
                    <div className="inline-flex items-center bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full">
                      <FaTag className="w-3 h-3 mr-1" />
                      <span className="text-sm">{category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Article Content */}
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: article.content }} />
            
            {/* Related Teams and Competitions */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              {article.relatedTeams && article.relatedTeams.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-lg font-semibold mb-2">Related Teams</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedTeams.map((team) => (
                      <Link key={team.id} href={`/teams/${team.id}`}>
                        <div className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                          {team.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
              
              {article.relatedCompetitions && article.relatedCompetitions.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-2">Related Competitions</h3>
                  <div className="flex flex-wrap gap-2">
                    {article.relatedCompetitions.map((competition) => (
                      <Link key={competition.id} href={`/leagues/${competition.id}`}>
                        <div className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm">
                          {competition.name}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Related Articles</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedArticles.map((relatedArticle) => (
                <Link key={relatedArticle.id} href={`/news/${relatedArticle.id}`}>
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
                    <div className="relative h-40">
                      <Image
                        src={relatedArticle.image}
                        alt={relatedArticle.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <FaCalendar className="w-3 h-3 mr-1" />
                        <span>{formatDate(relatedArticle.date)}</span>
                      </div>
                      <h3 className="font-semibold line-clamp-2">{relatedArticle.title}</h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default NewsDetail;