import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center">
      <div className="w-full max-w-md">
        <SignIn 
          appearance={{
            elements: {
              rootBox: "mx-auto",
              card: "bg-gray-800 border border-gray-700",
              headerTitle: "text-white",
              headerSubtitle: "text-gray-400",
              socialButtonsBlockButton: "bg-gray-700 border-gray-600 text-white hover:bg-gray-600",
              formButtonPrimary: "bg-primary-600 hover:bg-primary-700",
              formFieldInput: "bg-gray-700 border-gray-600 text-white",
              formFieldLabel: "text-gray-300",
              identityPreviewText: "text-gray-300",
              formHeaderTitle: "text-white",
              formHeaderSubtitle: "text-gray-400",
              footerActionText: "text-gray-400",
              footerActionLink: "text-primary-400 hover:text-primary-300"
            }
          }}
        />
      </div>
    </div>
  );
}