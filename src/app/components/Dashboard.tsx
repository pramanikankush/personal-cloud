'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { useUser, SignInButton, SignOutButton } from '@clerk/nextjs';

interface FileData {
  id: string;
  name: string;
  size: string;
  modified_date: string;
  type: string;
  user_id: string;
}

export default function Dashboard() {
  const [files, setFiles] = useState<FileData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAllFiles, setShowAllFiles] = useState(false);
  const { user } = useUser();

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
        .eq('user_id', user?.id)
        .order('modified_date', { ascending: false });
      
      if (error) throw error;
      setFiles(data || []);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const displayedFiles = showAllFiles ? filteredFiles : filteredFiles.slice(0, 3);

  const handleQuickAction = (action: string) => {
    switch (action) {
      case 'upload':
        document.getElementById('file-upload')?.click();
        break;
      case 'new-folder':
        const folderName = prompt('Enter folder name:');
        if (folderName) console.log('Create folder:', folderName);
        break;
      case 'recent':
        setSearchTerm('');
        setShowAllFiles(false);
        break;
      case 'clear-search':
        setSearchTerm('');
        break;
      case 'grid':
        console.log('Switch to grid view');
        break;
      case 'list':
        console.log('Switch to list view');
        break;
    }
  };

  return (
    <main className="flex-1 bg-gray-950 p-4 h-screen overflow-hidden">
      {/* Header */}
      <header className="flex justify-between items-center mb-4">
        <div className="relative w-full max-w-lg">
          <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            search
          </span>
          <input
            className="w-full bg-gray-900/70 border border-gray-700 rounded-md py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            placeholder="Search files and folders"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {user ? (
          <SignOutButton>
            <button className="flex items-center gap-2 bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
              <span className="material-symbols-outlined">logout</span>
              <span>Sign Out</span>
            </button>
          </SignOutButton>
        ) : (
          <SignInButton>
            <button className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors">
              <span className="material-symbols-outlined">login</span>
              <span>Sign In</span>
            </button>
          </SignInButton>
        )}
      </header>

          {/* Quick Actions */}
          <section className="mb-6">
            <div className="bg-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
                  <span className="material-symbols-outlined text-white text-lg">bolt</span>
                </div>
                <h2 className="text-xl font-bold text-white">Quick Actions</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button 
                  onClick={() => handleQuickAction('upload')}
                  className="group bg-gradient-to-br from-gray-800/80 to-gray-700/80 hover:from-primary-600/90 hover:to-primary-500/90 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700/50 hover:border-primary-500/50 flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gray-700/50 group-hover:bg-primary-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl group-hover:text-primary-300">upload</span>
                  </div>
                  <span className="text-sm font-medium">Upload File</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('new-folder')}
                  className="group bg-gradient-to-br from-gray-800/80 to-gray-700/80 hover:from-slate-600/90 hover:to-slate-500/90 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700/50 hover:border-slate-500/50 flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gray-700/50 group-hover:bg-slate-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl group-hover:text-slate-300">create_new_folder</span>
                  </div>
                  <span className="text-sm font-medium">New Folder</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('recent')}
                  className="group bg-gradient-to-br from-gray-800/80 to-gray-700/80 hover:from-slate-600/90 hover:to-slate-500/90 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700/50 hover:border-slate-500/50 flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gray-700/50 group-hover:bg-slate-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl group-hover:text-slate-300">schedule</span>
                  </div>
                  <span className="text-sm font-medium">Recent Files</span>
                </button>
                <button 
                  onClick={() => handleQuickAction('clear-search')}
                  className="group bg-gradient-to-br from-gray-800/80 to-gray-700/80 hover:from-gray-600/90 hover:to-gray-500/90 text-white p-4 rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-xl border border-gray-700/50 hover:border-gray-500/50 flex flex-col items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-12 h-12 bg-gray-700/50 group-hover:bg-gray-500/20 rounded-lg flex items-center justify-center transition-all duration-300">
                    <span className="material-symbols-outlined text-2xl group-hover:text-gray-300">clear_all</span>
                  </div>
                  <span className="text-sm font-medium">Clear Search</span>
                </button>
              </div>
            </div>
            <input type="file" id="file-upload" className="hidden" multiple />
          </section>

          {/* My Files */}
          <section>
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-xl font-bold">My Files</h2>
              <div className="flex items-center gap-2 text-gray-400">
                <button className="p-2 rounded-md hover:bg-gray-800 hover:text-white transition-colors" onClick={() => handleQuickAction('grid')}>
                  <span className="material-symbols-outlined">grid_view</span>
                </button>
                <button className="p-2 rounded-md bg-gray-800 text-white" onClick={() => handleQuickAction('list')}>
                  <span className="material-symbols-outlined">view_list</span>
                </button>
              </div>
            </div>
            <div className="overflow-x-auto bg-gray-900 rounded-lg border border-gray-800">
              <table className="min-w-full text-left">
                <thead className="border-b border-gray-800">
                  <tr>
                    <th className="px-4 py-2 text-sm font-semibold">Name</th>
                    <th className="px-4 py-2 text-sm font-semibold">Size</th>
                    <th className="px-4 py-2 text-sm font-semibold">Last Modified</th>
                    <th className="px-4 py-2 text-sm font-semibold"></th>
                  </tr>
                </thead>
                <tbody>
                  {displayedFiles.length > 0 ? displayedFiles.map((file) => (
                    <tr key={file.id} className="border-b border-gray-800 hover:bg-gray-800/60 transition-colors">
                      <td className="px-4 py-3 whitespace-nowrap flex items-center gap-3">
                        <span className="material-symbols-outlined text-primary-400">
                          {file.type === 'folder' ? 'folder' : 'description'}
                        </span>
                        <span className="font-medium truncate max-w-xs" title={file.name}>{file.name}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400">{file.size}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-gray-400">{new Date(file.modified_date).toLocaleDateString()}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <button className="text-gray-400 hover:text-white">
                          <span className="material-symbols-outlined">more_horiz</span>
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={4} className="px-4 py-6 text-center text-gray-400">
                        No files found. Upload your first file to get started!
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {filteredFiles.length > 3 && !showAllFiles && (
              <div className="mt-3 text-center">
                <button 
                  onClick={() => setShowAllFiles(true)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                  Load More ({filteredFiles.length - 3} more files)
                </button>
              </div>
            )}
          </section>
    </main>
  );
}