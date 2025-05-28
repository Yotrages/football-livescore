import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface NewsCardProps {
  id: string;
  title: string;
  summary: string;
  image: string;
  publishedAt: string;
  source: string;
  url: string;
}

const NewsCard: React.FC<NewsCardProps> = ({
  id,
  title,
  summary,
  image,
  publishedAt,
  source,
}) => {
  // Format the date to be more readable
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  // Limit summary to a reasonable length
  const truncateSummary = (text: string, maxLength = 120) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength).trim() + '...';
  };

  return (
    <Link href={`/news/${id}`} passHref>
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden cursor-pointer h-full flex flex-col">
        <div className="relative h-48 w-full">
          <Image
            src={image || '/placeholder-news.jpg'}
            alt={title}
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 bg-blue-600 text-white px-3 py-1 text-xs font-semibold">
            {source}
          </div>
        </div>
        
        <div className="p-4 flex-grow flex flex-col">
          <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">{title}</h3>
          <p className="text-gray-600 text-sm mb-4 flex-grow">{truncateSummary(summary)}</p>
          <div className="text-xs text-gray-500 mt-auto">
            {formatDate(publishedAt)}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NewsCard;