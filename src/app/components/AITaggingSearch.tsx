'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '../../lib/supabase';
import { useUser } from '@clerk/nextjs';

interface FileData {
  id: string;
  name: string;
  type: string;
  storage_path: string;
  user_id: string;
  created_at: string;
  tags?: string[];
}

export default function AITaggingSearch() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFileType, setSelectedFileType] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTag, setSelectedTag] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFileTypeDropdown, setShowFileTypeDropdown] = useState(false);
  const [showDateDropdown, setShowDateDropdown] = useState(false);
  const [showTagDropdown, setShowTagDropdown] = useState(false);
  const { user } = useUser();
  
  const itemsPerPage = 12;

  const getFileIcon = (fileName: string, fileType: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return { icon: 'picture_as_pdf', color: 'text-red-400', bg: 'bg-red-900/30' };
      case 'doc':
      case 'docx':
        return { icon: 'description', color: 'text-blue-400', bg: 'bg-blue-900/30' };
      case 'xls':
      case 'xlsx':
        return { icon: 'table_chart', color: 'text-green-400', bg: 'bg-green-900/30' };
      case 'ppt':
      case 'pptx':
        return { icon: 'slideshow', color: 'text-orange-400', bg: 'bg-orange-900/30' };
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
      case 'webp':
        return { icon: 'image', color: 'text-purple-400', bg: 'bg-purple-900/30' };
      case 'mp4':
      case 'avi':
      case 'mov':
        return { icon: 'movie', color: 'text-pink-400', bg: 'bg-pink-900/30' };
      case 'mp3':
      case 'wav':
      case 'flac':
        return { icon: 'audio_file', color: 'text-yellow-400', bg: 'bg-yellow-900/30' };
      case 'zip':
      case 'rar':
      case '7z':
        return { icon: 'folder_zip', color: 'text-indigo-400', bg: 'bg-indigo-900/30' };
      case 'txt':
        return { icon: 'text_snippet', color: 'text-gray-400', bg: 'bg-gray-900/30' };
      default:
        return { icon: 'description', color: 'text-gray-400', bg: 'bg-gray-900/30' };
    }
  };

  useEffect(() => {
    if (user) {
      fetchFiles();
    }
  }, [user]);

  const fetchFiles = async () => {
    try {
      const { data, error } = await supabase
        .from('files')
        .select('*')
        .eq('user_id', user?.id);
      
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !selectedFileType || file.type === selectedFileType;
    
    let matchesDate = true;
    if (selectedDate) {
      const fileDate = new Date(file.created_at);
      const today = new Date();
      const daysDiff = Math.floor((today.getTime() - fileDate.getTime()) / (1000 * 60 * 60 * 24));
      
      switch (selectedDate) {
        case 'today':
          matchesDate = daysDiff === 0;
          break;
        case 'week':
          matchesDate = daysDiff <= 7;
          break;
        case 'month':
          matchesDate = daysDiff <= 30;
          break;
        case 'year':
          matchesDate = daysDiff <= 365;
          break;
      }
    }
    
    const matchesTag = !selectedTag || (file.tags && file.tags.includes(selectedTag));
    
    return matchesSearch && matchesType && matchesDate && matchesTag;
  });

  const totalPages = Math.ceil(filteredFiles.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedFiles = filteredFiles.slice(startIndex, startIndex + itemsPerPage);
  
  const fileTypes = [...new Set(files.map(file => file.type))];
  const allTags = [...new Set(files.flatMap(file => file.tags || []))];
  const dateOptions = [
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  return (
    <main className="flex-1">
      {/* Header */}
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-gray-800 bg-gray-900/50 backdrop-blur-lg px-8">
            <div className="flex items-center gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Explore Files</h2>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">search</span>
                <input
                  className="w-full bg-gray-800 border-none rounded-md pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:ring-2 focus:ring-primary-500 focus:outline-none"
                  placeholder="Search files, tags..."
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <button className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700 transition-colors">
                <span className="material-symbols-outlined">help</span>
              </button>
            </div>
          </header>

          <div className="p-8">
            {/* Filters */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-4">
                <h3 className="text-lg font-semibold">Filters</h3>
                <div className="flex-1 border-t border-gray-800"></div>
              </div>
              <div className="flex gap-4">
                <div className="relative">
                  <button 
                    onClick={() => setShowFileTypeDropdown(!showFileTypeDropdown)}
                    className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <span>{selectedFileType || 'File Type'}</span>
                    <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                  {showFileTypeDropdown && (
                    <div className="absolute top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                      <button 
                        onClick={() => { setSelectedFileType(''); setShowFileTypeDropdown(false); setCurrentPage(1); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        All Types
                      </button>
                      {fileTypes.map(type => (
                        <button 
                          key={type}
                          onClick={() => { setSelectedFileType(type); setShowFileTypeDropdown(false); setCurrentPage(1); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 capitalize"
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowDateDropdown(!showDateDropdown)}
                    className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <span>{selectedDate ? dateOptions.find(d => d.value === selectedDate)?.label : 'Date'}</span>
                    <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                  {showDateDropdown && (
                    <div className="absolute top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                      <button 
                        onClick={() => { setSelectedDate(''); setShowDateDropdown(false); setCurrentPage(1); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        All Dates
                      </button>
                      {dateOptions.map(option => (
                        <button 
                          key={option.value}
                          onClick={() => { setSelectedDate(option.value); setShowDateDropdown(false); setCurrentPage(1); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="relative">
                  <button 
                    onClick={() => setShowTagDropdown(!showTagDropdown)}
                    className="flex items-center gap-2 rounded-md bg-gray-800 px-4 py-2 text-sm font-medium text-gray-300 hover:bg-gray-700 transition-colors"
                  >
                    <span>{selectedTag || 'Tags'}</span>
                    <span className="material-symbols-outlined text-base">expand_more</span>
                  </button>
                  {showTagDropdown && (
                    <div className="absolute top-full mt-1 w-48 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-10">
                      <button 
                        onClick={() => { setSelectedTag(''); setShowTagDropdown(false); setCurrentPage(1); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                      >
                        All Tags
                      </button>
                      {allTags.map(tag => (
                        <button 
                          key={tag}
                          onClick={() => { setSelectedTag(tag); setShowTagDropdown(false); setCurrentPage(1); }}
                          className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700"
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Search Results */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Search Results</h3>
                <div className="text-sm text-gray-400">
                  Showing {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredFiles.length)} of {filteredFiles.length} results
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                {paginatedFiles.length > 0 ? paginatedFiles.map((file) => (
                  <div key={file.id} className="group relative">
                    <div className={`aspect-square w-full overflow-hidden rounded-lg ${getFileIcon(file.name, file.type).bg} border border-gray-700 flex flex-col items-center justify-center p-4 hover:border-gray-600 transition-colors`}>
                      <span className={`material-symbols-outlined text-5xl ${getFileIcon(file.name, file.type).color} mb-2`}>
                        {getFileIcon(file.name, file.type).icon}
                      </span>
                      <div className="text-xs text-gray-300 font-medium uppercase tracking-wider">
                        {file.name.split('.').pop()}
                      </div>
                    </div>
                    <div className="mt-2">
                      <h4 className="text-sm font-medium truncate" title={file.name}>{file.name}</h4>
                      <p className="text-xs text-gray-400">{file.type}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full text-center py-12">
                    <p className="text-gray-400">No files found. Upload some files to see them here!</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex justify-center">
                  <nav className="flex items-center gap-2">
                    <button 
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">chevron_left</span>
                    </button>
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + 1;
                      return (
                        <button 
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`flex h-9 w-9 items-center justify-center rounded-md font-semibold ${
                            currentPage === page 
                              ? 'bg-primary-500 text-white' 
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          } transition-colors`}
                        >
                          {page}
                        </button>
                      );
                    })}
                    {totalPages > 5 && (
                      <>
                        <span className="text-gray-500">...</span>
                        <button 
                          onClick={() => setCurrentPage(totalPages)}
                          className={`flex h-9 w-9 items-center justify-center rounded-md font-semibold ${
                            currentPage === totalPages 
                              ? 'bg-primary-500 text-white' 
                              : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                          } transition-colors`}
                        >
                          {totalPages}
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="flex h-9 w-9 items-center justify-center rounded-md bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white transition-colors disabled:opacity-50"
                    >
                      <span className="material-symbols-outlined">chevron_right</span>
                    </button>
                  </nav>
                </div>
              )}
            </div>
          </div>
    </main>
  );
}