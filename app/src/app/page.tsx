"use client";
import React from "react";
import Link from "next/link";
import { FeatureCard } from "@/components/ui/feature-card";
import { StatCard } from "@/components/ui/stat-card";

export default function HomePage() {
  const features = [
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: "Lightning Fast",
      description: "Real-time messaging with sub-millisecond latency powered by edge computing.",
      color: "emerald" as const,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "AI Enhanced",
      description: "Smart replies, sentiment analysis, and language translation built-in.",
      color: "purple" as const,
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Enterprise Secure",
      description: "End-to-end encryption with SOC2 compliance and advanced access controls.",
      color: "blue" as const,
    },
  ];

  const stats = [
    { value: "10M+", label: "Active Users", gradient: "from-emerald-400 to-emerald-600" },
    { value: "99.9%", label: "Uptime", gradient: "from-purple-400 to-purple-600" },
    { value: "50ms", label: "Avg Latency", gradient: "from-blue-400 to-blue-600" },
    { value: "150+", label: "Countries", gradient: "from-pink-400 to-pink-600" },
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-500/10 via-black to-purple-600/10" />
      
      {/* Grid Pattern Overlay */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]" />
      
      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 md:px-12 md:py-6">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg animate-float" />
          <span className="text-xl font-semibold">Chat App</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/docs" className="text-gray-400 hover:text-white transition-colors">
            Docs
          </Link>
          <Link href="/pricing" className="text-gray-400 hover:text-white transition-colors">
            Pricing
          </Link>
          <Link href="/login" className="px-4 py-2 bg-white text-black rounded-lg hover:bg-gray-200 transition-all hover:scale-105">
            Sign in
          </Link>
        </div>

        {/* Mobile menu button */}
        <button className="md:hidden text-gray-400 hover:text-white">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>
      
      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center px-6 py-20 md:px-12 md:py-32">
        {/* Badge */}
        <div className="mb-8 inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 animate-float">
          <span className="text-emerald-400 text-sm">✨ Powered by AI</span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-7xl font-bold text-center max-w-4xl">
          <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Build intelligent
          </span>
          <br />
          <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent animate-gradient">
            conversations
          </span>
        </h1>
        
        {/* Subtitle */}
        <p className="mt-6 text-xl text-gray-400 text-center max-w-2xl">
          Experience the future of communication with our AI-powered chat platform. 
          Real-time, secure, and infinitely scalable.
        </p>
        
        {/* CTA Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row gap-4">
          <button className="px-8 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-emerald-500/25">
            Start chatting →
          </button>
          <button className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white rounded-lg border border-white/20 hover:bg-white/20 transition-all transform hover:scale-105">
            View demo
          </button>
        </div>
        
        {/* Features Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>
        
        {/* Stats Section */}
        <div className="mt-32 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl w-full">
          {stats.map((stat, index) => (
            <StatCard key={index} {...stat} />
          ))}
        </div>

        {/* Trust Section */}
        <div className="mt-32 text-center max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Trusted by teams everywhere
          </h2>
          <p className="text-gray-400 mb-12">
            From startups to Fortune 500, the world's best teams use our platform
          </p>
          
          {/* Logo Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center opacity-50">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 bg-gray-800 rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="relative z-10 mt-32 border-t border-white/10 px-6 py-12 md:px-12">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-semibold mb-4">Product</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Features</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Security</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">About</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Careers</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Resources</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Reference</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Legal</h3>
            <ul className="space-y-2 text-gray-400">
              <li><Link href="#" className="hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Cookies</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
          <p>&copy; 2024 Chat App. All rights reserved.</p>
        </div>
      </footer>
      
      {/* Animated Gradient Orbs */}
      <div className="fixed top-1/4 left-1/4 w-96 h-96 bg-emerald-500 rounded-full filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
      <div className="fixed bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full filter blur-[128px] opacity-20 animate-pulse pointer-events-none" />
    </div>
  );
}
