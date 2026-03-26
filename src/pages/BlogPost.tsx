import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogPost } from '../types';
import { dbService } from '../services/dbService';
import { ArrowLeft, Calendar, User, Share2 } from 'lucide-react';
import { usePageViews } from '../hooks/usePageViews';

export default function BlogPostDetail() {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      if (slug) {
        try {
          const data = await dbService.getBlogPost(slug);
          setPost(data);
          if (data && data.id) {
            dbService.incrementBlogViews(data.id);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50/50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-accent"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4 bg-gray-50/50">
        <h2 className="text-2xl font-bold">Artículo no encontrado</h2>
        <Link to="/blog" className="btn-primary">Volver al blog</Link>
      </div>
    );
  }

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
        url: window.location.href,
      }).catch(console.error);
    }
  };

  return (
    <div className="bg-gray-50/30 min-h-screen pb-24">
      {/* Hero Header */}
      <section className="relative pt-24 pb-32 px-4 overflow-hidden bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          <Link to="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-accent transition-colors text-sm font-bold uppercase tracking-wider mb-4 group justify-center">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" /> Volver al Blog
          </Link>
          <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-center gap-6 text-sm font-medium text-gray-500 pt-4">
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <User className="w-4 h-4" /> {post.author}
            </div>
            <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-full">
              <Calendar className="w-4 h-4" /> {new Date(post.published_at).toLocaleDateString('es-ES', { month: 'long', day: 'numeric', year: 'numeric' })}
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        <div className="w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl mb-16 bg-white shrink-0">
          <img 
            src={post.cover_image || 'https://loremflickr.com/1200/600/morocco'} 
            alt={post.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>

        <div className="bg-white p-8 md:p-16 rounded-[3rem] shadow-sm border border-gray-100">
          <div 
            className="prose prose-lg md:prose-xl max-w-none text-gray-700 leading-relaxed
                       prose-headings:font-serif prose-headings:font-bold prose-headings:text-gray-900 
                       prose-h2:mt-12 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-gray-100
                       prose-p:mb-6 prose-p:text-lg
                       prose-a:text-brand-primary prose-a:no-underline hover:prose-a:underline
                       prose-strong:text-gray-900 prose-strong:font-bold
                       prose-ul:list-disc prose-ul:pl-6 prose-li:mb-2
                       [&_p]:break-words [&_p]:overflow-wrap-anywhere"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          <div className="mt-16 pt-8 border-t border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                <User className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Escrito por</p>
                <p className="font-bold text-gray-900">{post.author}</p>
              </div>
            </div>

            <button 
              onClick={shareArticle}
              className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-900 font-bold rounded-xl transition-colors flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" /> 
              <span className="hidden sm:inline">Compartir Artículo</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
