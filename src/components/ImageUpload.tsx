import React, { useState, useRef } from 'react';
import imageCompression from 'browser-image-compression';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { dbService } from '../services/dbService';

interface Props {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  className?: string;
}

export default function ImageUpload({ value, onChange, label, className = '' }: Props) {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      // Compress image before upload
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true
      };
      const compressedFile = await imageCompression(file, options);
      
      // Upload to Supabase Storage
      const url = await dbService.uploadImage(compressedFile);
      onChange(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Verifica que el bucket de almacenamiento exista y tenga permisos públicos.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={`space-y-4 ${className} bg-white border border-gray-100 p-6 rounded-2xl shadow-sm`}>
      {label && <label className="text-sm font-bold text-gray-900 flex items-center gap-2"><ImageIcon className="w-4 h-4 text-brand-accent"/> {label}</label>}
      
      <div className="flex flex-col sm:flex-row items-start gap-6">
        {value ? (
          <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-gray-200 shadow-inner bg-gray-50 flex-shrink-0 group">
            <img src={value} alt="Preview" className="w-full h-full object-contain p-2" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button
                type="button"
                onClick={() => onChange('')}
                className="p-2 bg-white rounded-full text-red-500 hover:bg-red-50 hover:scale-110 transition-transform shadow-lg"
                title="Quitar imagen"
                >
                <X className="w-5 h-5" />
                </button>
            </div>
          </div>
        ) : (
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="w-32 h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col justify-center items-center text-gray-400 bg-gray-50 hover:bg-brand-primary/5 hover:border-brand-primary hover:text-brand-primary transition-colors cursor-pointer flex-shrink-0"
          >
            {uploading ? <Loader2 className="w-6 h-6 animate-spin text-brand-primary" /> : <Upload className="w-8 h-8 mb-2 opacity-50" />}
            <span className="text-xs font-bold text-center px-2">{uploading ? 'Subiendo...' : 'Añadir Imagen'}</span>
          </div>
        )}

        <div className="flex-1 space-y-3 w-full">
           <div className="flex flex-col gap-2">
             <button 
                type="button" 
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="self-start px-5 py-2.5 bg-white border-2 border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center gap-2 cursor-pointer shadow-sm disabled:opacity-50"
             >
                <Upload className="w-4 h-4" /> {value ? 'Reemplazar' : 'Seleccionar Archivo'}
             </button>
             <p className="text-xs text-gray-500 font-medium ml-1">JPG, PNG o WEBP. Reducción y compresión automática.</p>
           </div>
           
           <input
             type="file"
             ref={fileInputRef}
             className="hidden"
             accept="image/*"
             onChange={handleFileChange}
           />
           {value && (
             <div className="mt-4">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">URL Pública</label>
                <input 
                type="text" 
                value={value} 
                readOnly 
                className="w-full mt-1 text-xs px-3 py-2 bg-gray-100 border border-transparent rounded-lg text-gray-500 outline-none focus:border-brand-accent transition-colors" 
                onClick={(e) => (e.target as HTMLInputElement).select()}
                />
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
