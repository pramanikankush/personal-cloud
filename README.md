# Personal Cloud Storage

A modern, AI-powered personal cloud storage solution built with Next.js, featuring intelligent file organization, secure authentication, and seamless payment integration.

## 🎥 Demo
https://drive.google.com/file/d/10-kntCcTGv-ANaIOZX7NYriMtptTcKri/view?usp=sharing
## ✨ Features

- **🔐 Secure Authentication** - User authentication powered by Clerk
- **☁️ Cloud Storage** - File storage and management with Supabase
- **🤖 AI-Powered Organization** - Intelligent file tagging and search using Google Generative AI
- **💳 Payment Integration** - Subscription management with Stripe and Razorpay
- **📱 Responsive Design** - Modern UI built with Tailwind CSS
- **🔍 Smart Search** - AI-enhanced file discovery and filtering
- **📊 File Management** - Support for documents, photos, videos, and audio files
- **⚡ Real-time Upload** - Drag-and-drop file uploads with progress tracking

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Clerk
- **Database**: Supabase
- **AI**: Google Generative AI
- **Payments**: Stripe, Razorpay
- **Deployment**: Vercel-ready

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd personal-cloud
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your `.env.local` file with:
```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Google AI
GOOGLE_AI_API_KEY=your_google_ai_api_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
personal-cloud/
├── src/
│   ├── app/          # Next.js app directory
│   └── lib/          # Utility functions and configurations
├── public/           # Static assets
├── demo ui/          # UI mockups and prototypes
├── middleware.ts     # Next.js middleware
└── package.json      # Dependencies and scripts
```

## 🎯 Key Features

### File Management
- Upload files via drag-and-drop or file browser
- Organize files by type (Documents, Photos, Videos, Audio)
- Real-time upload progress tracking
- File preview and metadata display

### AI-Powered Search
- Intelligent file tagging using Google Generative AI
- Smart search across file content and metadata
- Filter by file type, date, and AI-generated tags
- Visual file exploration with thumbnails

### User Experience
- Clean, modern dark theme interface
- Responsive design for all devices
- Quick access to recent uploads
- Storage usage tracking and upgrade prompts

### Security & Payments
- Secure user authentication with Clerk
- Encrypted file storage with Supabase
- Flexible payment options (Stripe/Razorpay)
- Subscription-based storage tiers

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🚀 Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on every push

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Clerk](https://clerk.dev/) for authentication
- [Supabase](https://supabase.com/) for backend services
- [Google AI](https://ai.google.dev/) for intelligent features
- [Tailwind CSS](https://tailwindcss.com/) for styling

---

Built with ❤️ for secure, intelligent file storage.