"use client";

import { supabase } from "../../lib/supabase";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data.user) {
        router.push("/dashboard");
      }
    };
    checkUser();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo:
          "https://smart-bookmark-app-gold-gamma.vercel.app/dashboard",
      },
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 w-full max-w-md border border-gray-100">
        <h1 className="text-2xl font-bold text-gray-800 text-center mb-2">
          Smart Bookmark
        </h1>

        <p className="text-gray-500 text-center mb-8">
          Save and access your bookmarks anywhere
        </p>

        <button
          onClick={loginWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-3 rounded-xl font-medium transition cursor-pointer"
        >
          {/* Google SVG Icon (black & white style) */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 48 48"
            className="w-5 h-5 fill-white"
          >
            <path
              d="M44.5 20H24v8.5h11.8C34.6 33.4 30 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 
    12-12c3 0 5.8 1.1 8 3.1l6.3-6.3C34.4 5.3 29.5 3 24 3 12.4 3 3 12.4 3 24s9.4 
    21 21 21 21-9.4 21-21c0-1.3-.2-2.7-.5-4z"
            />
          </svg>

          <span>Continue with Google</span>
        </button>

        <p className="text-xs text-gray-400 text-center mt-6">
          Secure login powered by Google OAuth
        </p>
      </div>
    </div>
  );
}
