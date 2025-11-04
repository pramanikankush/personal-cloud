'use client';

import { useUser, SignInButton, UserButton } from '@clerk/nextjs';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  handler: (response: { razorpay_payment_id: string }) => void;
  prefill: {
    name: string;
    email: string;
  };
  theme: {
    color: string;
  };
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () => void;
    };
  }
}

export default function Sidebar({ currentView, setCurrentView }: SidebarProps) {
  const { isSignedIn, user } = useUser();

  const handlePayment = () => {
    const options: RazorpayOptions = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      amount: 99900, // ₹999 in paise
      currency: 'INR',
      name: 'Personal Cloud',
      description: 'Upgrade Storage Plan',
      handler: function (response: { razorpay_payment_id: string }) {
        alert('Payment successful! Payment ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: user?.fullName || user?.firstName || 'User',
        email: user?.primaryEmailAddress?.emailAddress || '',
      },
      theme: {
        color: '#2563eb'
      }
    };
    
    if (window.Razorpay) {
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        const rzp = new window.Razorpay(options);
        rzp.open();
      };
      document.body.appendChild(script);
    }
  };

  return (
    <aside className="w-64 bg-gray-900/50 p-6 flex flex-col justify-between">
      <div className="flex flex-col gap-8">
        {/* User Profile */}
        <div className="flex items-center gap-3">
          {isSignedIn ? (
            <>
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-10 h-10",
                    userButtonPopoverCard: "bg-gray-800 border border-gray-700",
                    userButtonPopoverActionButton: "text-gray-300 hover:text-white hover:bg-gray-700",
                    userButtonPopoverActionButtonText: "text-gray-300",
                    userButtonPopoverFooter: "hidden"
                  }
                }}
              />
              <div>
                <h1 className="text-white font-semibold">{user?.fullName || user?.firstName || 'User'}</h1>
                <p className="text-gray-400 text-sm">Personal Cloud</p>
              </div>
            </>
          ) : (
            <>
              <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center">
                <span className="material-symbols-outlined text-gray-400">person</span>
              </div>
              <div>
                <SignInButton mode="modal">
                  <button className="text-primary-400 hover:text-primary-300 font-semibold text-sm">
                    Sign In
                  </button>
                </SignInButton>
                <p className="text-gray-400 text-sm">Personal Cloud</p>
              </div>
            </>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          <button
            onClick={() => setCurrentView('dashboard')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              currentView === 'dashboard' 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">home</span>
            <span>Home</span>
          </button>
          <button
            onClick={() => setCurrentView('search')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              currentView === 'search' 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">search</span>
            <span>AI Search</span>
          </button>
          <button
            onClick={() => setCurrentView('filedetails')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              currentView === 'filedetails' 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">description</span>
            <span>File Details</span>
          </button>
          <button
            onClick={() => setCurrentView('upload')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              currentView === 'upload' 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">upload</span>
            <span>Upload</span>
          </button>
          <button
            onClick={() => setCurrentView('upgrade')}
            className={`flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors ${
              currentView === 'upgrade' 
                ? 'bg-gray-700/50 text-white' 
                : 'text-gray-300 hover:bg-gray-800 hover:text-white'
            }`}
          >
            <span className="material-symbols-outlined">upgrade</span>
            <span>Upgrade</span>
          </button>
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-col gap-4">
{isSignedIn && (
          <div className="bg-gray-800 rounded-lg p-4 text-center">
            <h3 className="font-semibold mb-2">Upgrade Storage</h3>
            <p className="text-sm text-gray-400 mb-4">Get more space for your files.</p>
            <button 
              onClick={() => setCurrentView('upgrade')}
              className="w-full bg-primary-600 text-white py-2 rounded-md hover:bg-primary-700 transition-colors"
            >
              View Plans
            </button>
          </div>
        )}
        <div className="text-center">
          <p className="text-sm text-gray-500">© 2024 YourCloud Inc.</p>
        </div>
      </div>
    </aside>
  );
}