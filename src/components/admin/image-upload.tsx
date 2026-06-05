import { useState, useRef } from 'react';
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  bucket: string;
  folder?: string;
  onUpload: (urls: string[]) => void;
  multiple?: boolean;
}

export default function ImageUpload({ bucket, folder = 'misc', onUpload, multiple = false }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setIsUploading(true);
    const supabase = createClient();
    const uploadedUrls: string[] = [];

    try {
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from(bucket)
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from(bucket)
          .getPublicUrl(filePath);

        uploadedUrls.push(publicUrl);
      }
      onUpload(uploadedUrls);
      toast.success('Images uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Error uploading images');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        multiple={multiple}
        accept="image/*"
        className="hidden"
      />
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full h-32 border-2 border-dashed border-gold-400/30 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-gold-400/5 transition-colors disabled:opacity-50"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-6 h-6 text-gold-500 animate-spin" />
            <span className="font-inter text-sm text-espresso-200">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-6 h-6 text-espresso-200" />
            <span className="font-inter text-sm text-espresso-200">Click to upload image{multiple ? 's' : ''}</span>
          </>
        )}
      </button>
    </div>
  );
}
