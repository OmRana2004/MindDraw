"use client"

import { useState, useEffect, FormEvent } from "react";
import { Mail, Lock, User, Eye, EyeOff, Sun, Moon, Circle, Square, Triangle } from "lucide-react";
import Link from "next/link";

interface AuthPageProps {
  isSignin: boolean;
}

export function AuthPage({ isSignin }: AuthPageProps) {
  const [isDark, setIsDark] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("theme");
      setIsDark(saved === "dark");
    }
  }, []);

  const toggleTheme = () => {
    setIsDark(prev => {
      const newTheme = !prev;
      localStorage.setItem("theme", newTheme ? "dark" : "light");
      return newTheme;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    alert(isSignin ? "Sign In submitted" : "Sign Up submitted");
  };

  return (
    <div className={`relative min-h-screen flex items-center justify-center transition-colors duration-300 ${
      isDark ? "bg-gray-900" : "bg-white"
    }`}>
      
      {/* Background shapes */}
      <div className="absolute inset-0 pointer-events-none">
        <Circle className={`absolute top-20 left-10 w-16 h-16 opacity-60 animate-pulse ${isDark ? 'text-blue-500' : 'text-blue-200'}`} style={{ animationDuration: '3s' }} />
        <Square className={`absolute top-32 right-20 w-12 h-12 opacity-50 rotate-12 ${isDark ? 'text-pink-500' : 'text-pink-200'}`} />
        <Triangle className={`absolute bottom-40 left-1/4 w-20 h-20 opacity-40 -rotate-12 ${isDark ? 'text-green-500' : 'text-green-200'}`} />
        <Circle className={`absolute top-1/2 right-10 w-10 h-10 opacity-50 ${isDark ? 'text-yellow-500' : 'text-yellow-200'}`} />
        <Square className={`absolute bottom-20 right-1/3 w-14 h-14 opacity-40 rotate-45 ${isDark ? 'text-purple-500' : 'text-purple-200'}`} />
        <Circle className={`absolute top-1/3 left-1/3 w-8 h-8 opacity-60 ${isDark ? 'text-orange-500' : 'text-orange-200'}`} />
        <Triangle className={`absolute bottom-1/3 right-1/4 w-16 h-16 opacity-30 rotate-45 ${isDark ? 'text-teal-500' : 'text-teal-200'}`} />
        <Square className={`absolute top-1/4 right-1/2 w-10 h-10 opacity-40 -rotate-12 ${isDark ? 'text-red-500' : 'text-red-200'}`} />
      </div>

      {/* Theme toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button onClick={toggleTheme} className="p-2 rounded-lg">
          {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
        </button>
      </div>

      {/* Auth Card */}
      <div className={`relative z-10 w-full max-w-md p-8 rounded-lg shadow-lg transition-colors duration-300 ${
        isDark ? "bg-gray-800 text-white" : "bg-white text-gray-900"
      }`}>
        <h1 className="text-3xl font-bold mb-6 text-center">
          {isSignin ? "Sign In" : "Sign Up"}
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {!isSignin && (
            <div className="relative">
              <User className={`absolute top-3 left-3 w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
              <input
                type="text"
                placeholder="Full Name"
                className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                  isDark
                    ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                    : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600"
                }`}
                required
              />
            </div>
          )}

          <div className="relative">
            <Mail className={`absolute top-3 left-3 w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
            <input
              type="email"
              placeholder="Email"
              className={`w-full pl-10 pr-4 py-2 rounded-lg border transition-colors duration-300 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600"
              }`}
              required
            />
          </div>

          <div className="relative">
            <Lock className={`absolute top-3 left-3 w-5 h-5 ${isDark ? "text-gray-300" : "text-gray-500"}`} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className={`w-full pl-10 pr-10 py-2 rounded-lg border transition-colors duration-300 ${
                isDark
                  ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
                  : "bg-gray-100 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-600"
              }`}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-2.5 right-3"
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>

          <button
            type="submit"
            className={`w-full py-2 rounded-lg font-semibold transition-colors duration-300 ${
              isDark ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
            }`}
          >
            {isSignin ? "Sign In" : "Sign Up"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          {isSignin ? "Don't have an account?" : "Already have an account?"}{" "}
          <Link href={isSignin ? "/signup" : "/signin"} className={`font-semibold ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {isSignin ? "Sign Up" : "Sign In"}
          </Link>
        </p>
      </div>
    </div>
  );
}
