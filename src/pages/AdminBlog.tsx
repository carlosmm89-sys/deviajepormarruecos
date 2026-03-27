import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus, Image as ImageIcon, Eye, ExternalLink, BookOpen, MapPin } from 'lucide-react';
import { dbService } from '../services/dbService';
import { BlogPost } from '../types';

export default function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<'blog' | 'collections'>('blog');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const data = await dbService.getBlogPosts(true); // adminView = true to get all posts regardless of published state
      setPosts(data);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este artículo del blog? Esta acción no se puede deshacer.')) {
      try {
        await dbService.deleteBlogPost(id);
        setPosts(posts.filter(p => p.id !== id));
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Error al eliminar el artículo');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-accent border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 border-l-4 border-brand-accent pl-4">Blog</h1>
          <p className="mt-2 text-gray-500">Gestiona los artículos y SEO de tu apartado Blog</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link to="/blog" target="_blank" className="btn-secondary flex items-center justify-center gap-2">
            <ExternalLink className="w-4 h-4" /> Ver Blog Público
          </Link>
          <Link
            to="/admin/blog/new"
            className="btn-primary flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Nuevo Artículo
          </Link>
        </div>
      </div>

      <div className="flex bg-gray-100 p-1.5 rounded-xl w-max shadow-inner">
        <button
          onClick={() => setFilterType('blog')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
            filterType === 'blog' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <BookOpen className="w-4 h-4" /> Noticias Blog
        </button>
        <button
          onClick={() => setFilterType('collections')}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all ${
            filterType === 'collections' ? 'bg-white text-brand-primary shadow-sm ring-1 ring-gray-900/5' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <MapPin className="w-4 h-4" /> Actividades y Colecciones
        </button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {posts.filter(p => filterType === 'blog' ? p.category === 'Blog' : p.category !== 'Blog').length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">No hay ningún contenido en esta sección.</p>
            <Link to="/admin/blog/new" className="text-brand-primary font-bold hover:underline mt-2 inline-block">
              Crear nuevo contenido
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Contenido</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Categoría</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-sm uppercase tracking-wider">Estado</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-center text-sm uppercase tracking-wider">Visitas</th>
                  <th className="py-4 px-6 font-semibold text-gray-600 border-b border-gray-100 text-right text-sm uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {posts.filter(p => filterType === 'blog' ? p.category === 'Blog' : p.category !== 'Blog').map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-12 rounded-lg bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
                          ) : (
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 line-clamp-1">{post.title}</div>
                          <div className="text-sm text-gray-500 font-mono">/{post.slug}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center text-sm font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full uppercase tracking-widest text-[10px]">
                        {post.category}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex px-2 py-1 rounded-md text-xs font-bold uppercase tracking-wider ${
                        post.is_published 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {post.is_published ? 'Público' : 'Borrador'}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center gap-1.5 text-sm font-bold text-gray-700 bg-gray-100 px-3 py-1 rounded-full">
                        <Eye className="w-4 h-4" />
                        {post.views || 0}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          to={`/blog/${post.slug}`}
                          target="_blank"
                          className="p-2 text-gray-400 hover:text-brand-primary hover:bg-orange-50 rounded-lg transition-colors"
                          title="Ver en la web"
                        >
                          <ExternalLink className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/blog/${post.id}`}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar"
                        >
                          <Edit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => handleDelete(post.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Eliminar"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
