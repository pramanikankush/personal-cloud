'use client';

import { useState, useRef } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '@clerk/nextjs';

interface UploadProgress {
  name: string;
  progress: number;
}

export default function Upload() {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { user } = useUser();

  const handleFileUpload = async (files: FileList) => {
    if (!user) return;
    
    setUploading(true);
    const progressArray: UploadProgress[] = Array.from(files).map(file => ({
      name: file.name,
      progress: 0
    }));
    setUploadProgress(progressArray);

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
      const fileName = `${user.id}/${Date.now()}-${sanitizedName}`;
      
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('files')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { error: dbError } = await supabase
          .from('files')
          .insert({
            name: sanitizedName,
            size: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
            type: file.type.startsWith('image/') ? 'image' : 'file',
            user_id: user.id,
            storage_path: fileName,
            modified_date: new Date().toISOString()
          });

        if (dbError) throw dbError;

        setUploadProgress(prev => 
          prev.map((item, index) => 
            index === i ? { ...item, progress: 100 } : item
          )
        );
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
    
    setTimeout(() => {
      setUploading(false);
      setUploadProgress([]);
    }, 2000);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files);
    }
  };

  const handleFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <main className="flex-1 bg-slate-900 text-white flex justify-center px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-3xl space-y-8">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Upload Files</h1>
          <p className="mt-4 text-lg text-slate-400">Add files to your personal cloud storage.</p>
        </div>
        <div className="flex flex-col gap-8">
          <div 
            className="flex flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed border-slate-700 bg-slate-800/50 p-16 text-center hover:border-slate-600 transition-colors"
            onDrop={handleDrop}
            onDragOver={(e) => e.preventDefault()}
          >
            <div className="rounded-full bg-slate-800 p-4">
              <span className="material-symbols-outlined text-4xl text-slate-400">cloud_upload</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-lg font-semibold text-white">Drag and drop files here</p>
              <p className="text-slate-400">or</p>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.removeAttribute('webkitdirectory');
                    fileInputRef.current.click();
                  }
                }}
                disabled={uploading}
                className="inline-flex items-center justify-center rounded-md bg-primary-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined mr-2">file_upload</span>
                <span>Browse Files</span>
              </button>
              <button 
                onClick={() => {
                  if (fileInputRef.current) {
                    fileInputRef.current.setAttribute('webkitdirectory', '');
                    fileInputRef.current.click();
                  }
                }}
                disabled={uploading}
                className="inline-flex items-center justify-center rounded-md bg-gray-600 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-gray-500 transition-colors disabled:opacity-50"
              >
                <span className="material-symbols-outlined mr-2">folder</span>
                <span>Browse Folders</span>
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFileUpload(e.target.files)}
            />
          </div>

          {uploadProgress.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-medium text-white">Uploading...</h2>
              {uploadProgress.map((file, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-300">{file.name}</p>
                    <p className="text-sm text-slate-400">{file.progress}%</p>
                  </div>
                  <div className="h-2 w-full rounded-full bg-slate-700">
                    <div 
                      className="h-full rounded-full bg-primary-500 transition-all duration-300" 
                      style={{ width: `${file.progress}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          )}
              </div>
            </div>
    </main>
  );
}