'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser } from '@clerk/nextjs';

interface FileData {
  id: string;
  name: string;
  size: string;
  type: string;
  modified_date: string;
  storage_path: string;
  summary?: string;
}

export default function FileDetails() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [selectedFile, setSelectedFile] = useState<FileData | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchRecentFiles();
    }
  }, [user]);

  const fetchRecentFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user?.id)
        .order('modified_date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      setFiles(data || []);
      if (data && data.length > 0) {
        setSelectedFile(data[0]);
        generateSummary(data[0]);
      }
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const generateSummary = async (file: FileData) => {
    if (file.summary || !file.name) return;
    
    setLoadingSummary(true);
    try {
      const response = await fetch('/api/generate-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          fileName: file.name, 
          fileType: file.type || 'unknown',
          storagePath: file.storage_path 
        })
      });
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      
      const { summary } = await response.json();
      const updatedFile = { ...file, summary };
      setSelectedFile(updatedFile);
      setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
    } catch (error) {
      const updatedFile = { ...file, summary: 'AI summary not available for this file.' };
      setSelectedFile(updatedFile);
      setFiles(prev => prev.map(f => f.id === file.id ? updatedFile : f));
    } finally {
      setLoadingSummary(false);
    }
  };

  const handleFileSelect = (file: FileData) => {
    setSelectedFile(file);
    generateSummary(file);
    generatePreviewUrl(file);
  };

  const generatePreviewUrl = async (file: FileData) => {
    try {
      const { data } = await supabase.storage
        .from('files')
        .createSignedUrl(file.storage_path, 3600);
      
      setPreviewUrl(data?.signedUrl || null);
    } catch (error) {
      console.error('Error generating preview URL:', error);
      setPreviewUrl(null);
    }
  };

  const getFileIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'pdf': return 'picture_as_pdf';
      case 'image': return 'image';
      case 'video': return 'movie';
      case 'audio': return 'audio_file';
      case 'document': return 'description';
      default: return 'insert_drive_file';
    }
  };

  const scrollFiles = (direction: 'left' | 'right') => {
    const container = document.getElementById('files-container');
    if (container) {
      const scrollAmount = 200;
      const newPosition = direction === 'left' 
        ? Math.max(0, scrollPosition - scrollAmount)
        : scrollPosition + scrollAmount;
      
      container.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };

  if (files.length === 0) {
    return (
      <main className="flex-1 bg-slate-900 text-white overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <p className="text-gray-400">No files found. Upload a file to see details here!</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 bg-slate-900 text-white overflow-y-auto">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-2 text-sm text-slate-400 mb-6 overflow-hidden">
          <a className="hover:text-white flex-shrink-0" href="#">Files</a>
          <span className="flex-shrink-0">/</span>
          <span className="text-white font-medium truncate min-w-0" title={selectedFile?.name}>{selectedFile?.name}</span>
        </div>

        {/* Recent Files Selector */}
        <div className="bg-slate-800/50 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">Recent Files</h3>
            <div className="flex gap-2">
              <button 
                onClick={() => scrollFiles('left')}
                className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-white">chevron_left</span>
              </button>
              <button 
                onClick={() => scrollFiles('right')}
                className="p-2 rounded-md bg-slate-700 hover:bg-slate-600 transition-colors"
              >
                <span className="material-symbols-outlined text-white">chevron_right</span>
              </button>
            </div>
          </div>
          <div 
            id="files-container"
            className="flex gap-3 overflow-x-auto scrollbar-hide"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {files.map((file) => (
              <button
                key={file.id}
                onClick={() => handleFileSelect(file)}
                className={`p-3 rounded-lg text-left transition-colors flex-shrink-0 w-48 ${
                  selectedFile?.id === file.id 
                    ? 'bg-primary-500/20 border border-primary-500' 
                    : 'bg-slate-700 hover:bg-slate-600'
                }`}
              >
                <div className="text-sm font-medium text-white truncate" title={file.name}>
                  {file.name}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {file.type} · {file.size}
                </div>
              </button>
            ))}
          </div>
        </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Left Column */}
              <div className="md:col-span-2 space-y-8">
                {/* File Header */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-white mb-2 break-words" title={selectedFile?.name}>{selectedFile?.name}</h2>
                      <p className="text-sm text-slate-400 break-words">{selectedFile?.type} · {selectedFile?.size} · Uploaded on {new Date(selectedFile?.modified_date || '').toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button className="p-2 rounded-md hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined">edit</span>
                      </button>
                      <button className="p-2 rounded-md hover:bg-slate-700 transition-colors text-red-400">
                        <span className="material-symbols-outlined">delete</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* AI Summary */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI Summary</h3>
                  {loadingSummary ? (
                    <div className="flex items-center gap-2 text-slate-400">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>
                      <span>Generating summary...</span>
                    </div>
                  ) : selectedFile?.summary ? (
                    <p className="text-slate-300 text-sm leading-relaxed">{selectedFile.summary}</p>
                  ) : (
                    <p className="text-slate-400 text-sm">No summary available for this file type.</p>
                  )}
                </div>

                {/* AI Tags */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">AI-Generated Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Project', 'Proposal', 'Business', 'Marketing', 'Strategy'].map((tag) => (
                      <span key={tag} className="bg-slate-700 text-slate-200 text-xs font-medium px-2.5 py-1 rounded-full">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Sharing */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-white">Sharing</h3>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-400">Public link</p>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input defaultChecked className="sr-only peer" type="checkbox" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-500/50 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center bg-slate-900 rounded-md p-3">
                      <input
                        className="bg-transparent text-sm text-slate-300 w-full focus:outline-none"
                        readOnly
                        type="text"
                        value="https://cloudvault.com/share/aB3xZ9pL"
                      />
                      <button className="ml-2 p-2 rounded-md hover:bg-slate-700 transition-colors">
                        <span className="material-symbols-outlined text-base">content_copy</span>
                      </button>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-slate-300" htmlFor="permissions">Permissions</label>
                      <div className="mt-2 relative">
                        <select
                          className="w-full appearance-none bg-slate-900 border border-slate-700 text-white text-sm rounded-md focus:ring-primary-500 focus:border-primary-500 block p-2.5"
                          id="permissions"
                        >
                          <option>Can view</option>
                          <option>Can edit</option>
                        </select>
                        <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">expand_more</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                {/* File Preview */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">File Preview</h3>
                  <div className="aspect-square bg-slate-900 rounded-md flex items-center justify-center overflow-hidden">
                    {previewUrl && selectedFile?.type === 'image' ? (
                      <img 
                        src={previewUrl} 
                        alt={selectedFile.name}
                        className="w-full h-full object-cover rounded-md"
                      />
                    ) : previewUrl && selectedFile?.type === 'pdf' ? (
                      <iframe 
                        src={previewUrl}
                        className="w-full h-full rounded-md"
                        title={selectedFile.name}
                      />
                    ) : (
                      <div className="text-center">
                        <span className="material-symbols-outlined text-6xl text-slate-600 mb-2 block">
                          {getFileIcon(selectedFile?.type || '')}
                        </span>
                        <p className="text-sm text-slate-400">Preview not available</p>
                      </div>
                    )}
                  </div>
                  {previewUrl && (
                    <a 
                      href={previewUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-2 text-sm text-primary-400 hover:text-primary-300"
                    >
                      <span className="material-symbols-outlined text-base">open_in_new</span>
                      Open in new tab
                    </a>
                  )}
                </div>

                {/* File Details */}
                <div className="bg-slate-800/50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">File Details</h3>
                  <ul className="text-sm space-y-3 text-slate-300">
                    <li className="flex justify-between">
                      <span>Type</span>
                      <span className="font-medium text-white">{selectedFile?.type}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Size</span>
                      <span className="font-medium text-white">{selectedFile?.size}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Owner</span>
                      <span className="font-medium text-white">You</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Upload Date</span>
                      <span className="font-medium text-white">{new Date(selectedFile?.modified_date || '').toLocaleDateString()}</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Modified Date</span>
                      <span className="font-medium text-white">{new Date(selectedFile?.modified_date || '').toLocaleDateString()}</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
    </main>
  );
}