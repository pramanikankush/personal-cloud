'use client';

import { useState } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import AITaggingSearch from './AITaggingSearch';
import FileDetails from './FileDetails';
import Upload from './Upload';
import Upgrade from './Upgrade';

export default function PersonalCloudApp() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { isSignedIn, isLoaded } = useUser();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard onNavigate={setCurrentView} />;
      case 'search':
        return <AITaggingSearch />;
      case 'filedetails':
        return <FileDetails />;
      case 'upload':
        return <Upload />;
      case 'upgrade':
        return <Upgrade />;
      default:
        return <Dashboard onNavigate={setCurrentView} />;
    }
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Personal Cloud</h1>
          <p className="text-gray-400 mb-8">Your secure cloud storage solution</p>
          <SignInButton mode="modal">
            <button className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-md font-semibold transition-colors">
              Get Started
            </button>
          </SignInButton>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white font-sans">
      <div className="flex min-h-screen">
        <Sidebar currentView={currentView} setCurrentView={setCurrentView} />
        <div className="flex-1">
          {renderView()}
        </div>
      </div>
    </div>
  );
}