// ============================================
// LUXUDIES - Sign Up Page (Redesigned)
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function SignUpPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) { toast.error('Please fill in all required fields'); return; }
    if (password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            phone: phone ? `+91${phone}` : '',
          },
        },
      });
      if (error) throw error;
      toast.success('Account created! Please check your email to verify.');
      router.push('/auth/login');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Sign up failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google sign up failed';
      toast.error(message);
    }
  };

  const inputClasses = "w-full h-12 bg-transparent border-b border-gold-400/30 text-sm font-inter text-espresso placeholder:text-espresso-200 focus:outline-none focus:border-gold-500 transition-colors px-1";

  return (
    <div className="min-h-screen flex bg-pearl">
      
      {/* Left Half: Editorial Image */}
      <div className="hidden lg:flex w-1/2 relative bg-espresso">
        <Image
          src="/images/products/ring.jpg" // A nice lifestyle image
          alt="LUXUDIES Lifestyle"
          fill
          className="object-cover opacity-80"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-espresso-500/90 via-espresso-500/20 to-transparent" />
        <div className="absolute bottom-16 left-16 right-16">
          <Link href="/" className="inline-block mb-6">
            <span className="font-playfair text-3xl font-bold tracking-wide text-white">
              LUXUDIES
            </span>
          </Link>
          <h2 className="font-playfair text-4xl text-white font-medium mb-4 leading-tight">
            Begin your journey of elegance.
          </h2>
          <p className="font-inter text-pearl-200 opacity-80 max-w-sm">
            Create an account to unlock exclusive offers, save your favorite pieces, and manage your orders effortlessly.
          </p>
        </div>
      </div>

      {/* Right Half: Form Container */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md my-auto"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-10">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src="/images/brand/logo.jpg" alt="LUXUDIES" width={48} height={48} className="rounded-full border border-gold-400/20" />
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-espresso">Create Account</h1>
          </div>

          <div className="hidden lg:block mb-10">
            <h1 className="font-playfair text-4xl font-bold text-espresso mb-2">Create Account</h1>
            <p className="font-inter text-espresso-200">Join the LUXUDIES family</p>
          </div>

          <div className="space-y-6">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-gold-400/20 rounded-full text-sm font-inter font-medium text-espresso hover:bg-gold-50 hover:border-gold-400/40 transition-colors shadow-sm"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4">
              <span className="flex-1 h-px bg-gold-400/20" />
              <span className="text-[10px] font-inter uppercase tracking-widest text-espresso-200">Or sign up with email</span>
              <span className="flex-1 h-px bg-gold-400/20" />
            </div>

            <form onSubmit={handleSignUp} className="space-y-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>

              <div className="relative">
                <span className="absolute left-1 top-1/2 -translate-y-1/2 text-sm font-inter text-espresso-300">+91</span>
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${inputClasses} pl-10`}
                  maxLength={10}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters) *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={inputClasses}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-espresso-200 hover:text-espresso"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-gold h-12 text-xs tracking-widest shadow-gold mt-2"
              >
                {isLoading ? 'CREATING...' : 'CREATE ACCOUNT'}
              </button>
            </form>

            <p className="text-center text-[11px] font-inter text-espresso-200 mt-4">
              By creating an account, you agree to our{' '}
              <Link href="/policies/terms" className="text-gold-500 hover:text-gold-600 underline underline-offset-4 decoration-gold-400/30 hover:decoration-gold-500 transition-all">Terms</Link> and{' '}
              <Link href="/policies/privacy" className="text-gold-500 hover:text-gold-600 underline underline-offset-4 decoration-gold-400/30 hover:decoration-gold-500 transition-all">Privacy Policy</Link>
            </p>

            <p className="text-center text-sm font-inter text-espresso-200 pt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-espresso font-semibold hover:text-gold-500 underline underline-offset-4 decoration-gold-400/30 hover:decoration-gold-500 transition-all">
                Sign In
              </Link>
            </p>
          </div>

        </motion.div>
      </div>
    </div>
  );
}
