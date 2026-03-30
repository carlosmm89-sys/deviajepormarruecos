import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { dbService } from '../services/dbService';
import { GalleryImage } from '../types';
import { Upload, Trash2, Image as ImageIcon, CheckCircle, Tag } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AdminGallery() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadCategory, setUploadCategory] = useState('');
  const [uploadTitle, setUploadTitle] = useState('');

  useEffect(() => {
    loadImages();
  }, []);

  const loadImages = async () => {
    try {
      const data = await dbService.getGalleryImages();
      setImages(data);
    } catch (error) {
      console.error(error);
      toast.error('Error al cargar la galería');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []) as File[];
    if (files.length === 0) return;

    // Validate files
    const validFiles = files.filter(f => f.type.startsWith('image/') && f.size <= 5 * 1024 * 1024);
    if (validFiles.length < files.length) {
      toast.error(`Se saltaron ${files.length - validFiles.length} archivos por no ser imagen o exceder 5MB.`);
    }

    if (validFiles.length === 0) return;

    try {
      setIsUploading(true);
      const loadingToast = toast.loading(`Subiendo ${validFiles.length} imágenes...`);
      
      let successCount = 0;
      for (const file of validFiles) {
        try {
          const imageUrl = await dbService.uploadImage(file);
          const newImage: Partial<GalleryImage> = {
            image_url: imageUrl,
            title: uploadTitle || undefined,
            category: uploadCategory || undefined
          };
          await dbService.saveGalleryImage(newImage);
          successCount++;
        } catch (fileErr) {
          console.error('Error subiendo un archivo:', fileErr);
        }
      }
      
      if (successCount > 0) {
        toast.success(`Se guardaron ${successCount} imágenes exitosamente`, { id: loadingToast });
      } else {
        toast.error('Ninguna imagen se pudo guardar', { id: loadingToast });
      }
      
      // Reset form & Reload
      setUploadTitle('');
      setUploadCategory('');
      loadImages();
    } catch (error: any) {
      console.error('Error en upload batch:', error);
      toast.error('Ha fallado el proceso: ' + error.message);
    } finally {
      setIsUploading(false);
      // Reset the input value so the same files can be selected again if needed
      event.target.value = '';
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Eliminar esta imagen de la base de datos?')) return;
    
    try {
      const tId = toast.loading('Eliminando...');
      await dbService.deleteGalleryImage(id);
      toast.success('Eliminada correctamente', { id: tId });
      setImages(prev => prev.filter(img => img.id !== id));
    } catch (error) {
       console.error(error);
       toast.error('No se pudo eliminar');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-serif text-gray-900">Galería Visual</h1>
          <p className="text-gray-500 mt-2">Sube y gestiona las imágenes del portfolio.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload Zone */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Upload className="w-5 h-5 text-brand-accent" />
              Nueva Imagen
            </h3>
            
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Título (Opcional)</label>
                <input 
                  type="text" 
                  value={uploadTitle}
                  onChange={e => setUploadTitle(e.target.value)}
                  placeholder="Ej. Dunas de Erg Chebbi"
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-accent"
                />
              </div>
              
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Categoría / Etiqueta</label>
                <input 
                  type="text" 
                  value={uploadCategory}
                  onChange={e => setUploadCategory(e.target.value)}
                  placeholder="Ej. Desierto, Cultura, Naturaleza..."
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-brand-accent"
                />
              </div>

              <div className="pt-4">
                <label className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 border-dashed rounded-xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" />
                    ) : (
                      <>
                        <ImageIcon className="w-8 h-8 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500 font-bold">Haz clic para subir</p>
                        <p className="text-xs text-gray-400">SVG, PNG, JPG, WEBP (Max. 5MB)</p>
                      </>
                    )}
                  </div>
                  <input type="file" multiple className="hidden" accept="image/*" onChange={handleFileUpload} disabled={isUploading} />
                </label>
              </div>
            </div>
            
          </div>
        </div>

        {/* Existing Images */}
        <div className="lg:col-span-2">
           <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                 <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                   <ImageIcon className="w-5 h-5 text-gray-400" />
                   Archivos Multimedia ({images.length})
                 </h3>
              </div>
              
              {loading ? (
                <div className="py-12 flex justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-accent" /></div>
              ) : images.length === 0 ? (
                <div className="py-12 text-center text-gray-400 border-2 border-dashed border-gray-100 rounded-xl">No hay fotos en la galería</div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {images.map(img => (
                    <div key={img.id} className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm">
                      <img src={img.image_url} alt={img.title || ''} className="w-full h-full object-cover transition-transform group-hover:scale-105" loading="lazy" />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-between">
                        <div className="flex justify-end">
                           <button onClick={(e) => { e.preventDefault(); handleDelete(img.id); }} className="p-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors" title="Eliminar">
                             <Trash2 className="w-4 h-4" />
                           </button>
                        </div>
                        <div>
                          {img.category && <span className="inline-block px-2 py-0.5 bg-brand-primary/20 text-brand-primary rounded text-[10px] font-bold uppercase mb-1">{img.category}</span>}
                          {img.title && <p className="text-white text-xs font-bold truncate">{img.title}</p>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
           </div>
        </div>
      </div>
    </div>
  );
}
