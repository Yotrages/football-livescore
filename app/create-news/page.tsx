"use client"
import React, { useState } from 'react';
import { FaEye, FaFile, FaImage, FaSave, FaTag, FaUser } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';

// Type definitions based on typical news response structure
interface NewsPost {
  id?: string;
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  tags: string[];
  imageUrl?: string;
  publishedAt?: string;
  status: 'draft' | 'published';
  featured: boolean;
  slug?: string;
}

interface FormData {
  title: string;
  content: string;
  summary: string;
  author: string;
  category: string;
  tags: string;
  imageUrl: string;
  featured: boolean;
  status: 'draft' | 'published';
}

const Page: React.FC = () => {
  const [imagePreview, setImagePreview] = useState('');
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    summary: '',
    author: '',
    category: '',
    tags: '',
    imageUrl: "",
    featured: false,
    status: 'draft'
  });

  console.log(formData.imageUrl)

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const categories = [
    'Football News',
    'Transfer Updates',
    'Match Reports',
    'Player Interviews',
    'League Updates',
    'International Football',
    'Club News',
    'Opinion & Analysis'
  ];

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (!formData.summary.trim()) {
      newErrors.summary = 'Summary is required';
    }

    if (!formData.author.trim()) {
      newErrors.author = 'Author is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      console.log(_)
      return false;
    }
  };

  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }

    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent, submitStatus: 'draft' | 'published') => {
    e.preventDefault();
    
    const updatedFormData = { ...formData, status: submitStatus };
    setFormData(updatedFormData);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const newsPost: NewsPost = {
        title: updatedFormData.title,
        content: updatedFormData.content,
        summary: updatedFormData.summary,
        author: updatedFormData.author,
        category: updatedFormData.category,
        tags: updatedFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
        imageUrl: updatedFormData.imageUrl || undefined,
        featured: updatedFormData.featured,
        status: updatedFormData.status,
        slug: generateSlug(updatedFormData.title),
        publishedAt: submitStatus === 'published' ? new Date().toISOString() : undefined
      };

      // Simulate API call
      console.log('Submitting news post:', newsPost);
      
      // Here you would make your actual API call
      // const response = await fetch('/api/news', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify(newsPost),
      // });

      // Simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert(`News post ${submitStatus === 'published' ? 'published' : 'saved as draft'} successfully!`);
      
      // Reset form after successful submission
      setFormData({
        title: '',
        content: '',
        summary: '',
        author: '',
        category: '',
        tags: '',
        imageUrl: '',
        featured: false,
        status: 'draft'
      });

    } catch (error) {
      console.error('Error submitting news post:', error);
      alert('Error submitting news post. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const PreviewCard = () => {
  
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
      <div className="relative">
        {formData.imageUrl && (
          <Image 
            src={formData.imageUrl} 
            alt={formData.title}
            className="w-full h-48 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'flex';
            }}
          />
        )}
        {formData.featured && (
          <div className="absolute top-4 left-4">
            <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
              Featured
            </span>
          </div>
        )}
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
            {formData.category || 'Category'}
          </span>
          <span className="text-gray-500 text-sm">
            {formData.author || 'Author'}
          </span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {formData.title || 'Article Title'}
        </h3>
        <p className="text-gray-600 mb-4">
          {formData.summary || 'Article summary will appear here...'}
        </p>
        <p className="text-black mb-4">
          {formData.content || 'Article content will appear here...'}
        </p>
        {formData.tags && (
          <div className="flex flex-wrap gap-2">
            {formData.tags.split(',').map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                #{tag.trim()}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <FaFile className="w-8 h-8 text-blue-600" />
              Create News Post
            </h1>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <FaEye className="w-4 h-4" />
              {previewMode ? 'Edit' : 'Preview'}
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Form Section */}
            <div className={previewMode ? 'hidden lg:block' : ''}>
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.title ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Enter article title"
                  />
                  {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>

                {/* Summary */}
                <div>
                  <label htmlFor="summary" className="block text-sm font-medium text-gray-700 mb-2">
                    Summary *
                  </label>
                  <textarea
                    id="summary"
                    name="summary"
                    rows={3}
                    value={formData.summary}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.summary ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Brief summary of the article"
                  />
                  {errors.summary && <p className="text-red-500 text-sm mt-1">{errors.summary}</p>}
                </div>

                {/* Content */}
                <div>
                  <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    rows={10}
                    value={formData.content}
                    onChange={handleInputChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                      errors.content ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Write your article content here..."
                  />
                  {errors.content && <p className="text-red-500 text-sm mt-1">{errors.content}</p>}
                </div>

                {/* Author and Category Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaUser className="w-4 h-4 inline mr-1" />
                      Author *
                    </label>
                    <input
                      type="text"
                      id="author"
                      name="author"
                      value={formData.author}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.author ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Author name"
                    />
                    {errors.author && <p className="text-red-500 text-sm mt-1">{errors.author}</p>}
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                      <FaTag className="w-4 h-4 inline mr-1" />
                      Category *
                    </label>
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                        errors.category ? 'border-red-500' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Select category</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <input
                    type="text"
                    id="tags"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="football, premier league, transfer (separated by commas)"
                  />
                </div>

                {/* Image URL */}
                <div>
                  <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-2">
                    <FaImage className="w-4 h-4 inline mr-1" />
                    Featured Image URL
                  </label>
                  <input
                    type="file"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl}
onChange={(e) => {
                  handleImageChange(e);
                  // Ensure the file is registered in the form
    setFormData(prev => ({...prev, imageUrl: imagePreview}))
                }}                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                      errors.imageUrl ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image.jpg"
                  />
                  {errors.imageUrl && <p className="text-red-500 text-sm mt-1">{errors.imageUrl}</p>}
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="featured"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="featured" className="text-sm font-medium text-gray-700">
                    Mark as featured article
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6">
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'draft')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <FaSave className="w-4 h-4" />
                    {isSubmitting && formData.status === 'draft' ? 'Saving...' : 'Save as Draft'}
                  </button>
                  
                  <button
                    type="button"
                    onClick={(e) => handleSubmit(e, 'published')}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <MdSend className="w-4 h-4" />
                    {isSubmitting && formData.status === 'published' ? 'Publishing...' : 'Publish Now'}
                  </button>
                </div>
              </div>
            </div>

            {/* Preview Section */}
            <div className={previewMode ? 'lg:col-span-2' : ''}>
              <div className="sticky top-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Preview</h2>
                <PreviewCard />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;