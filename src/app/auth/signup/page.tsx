// ============================================
// LUXUDIES - Sign Up Page
// ============================================

'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Eye, EyeOff, User, Mail, Phone } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
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

  const inputClasses = "w-full h-12 px-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[12px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all";

  return (
    <>
      <Header />
      <main className="min-h-screen flex items-center justify-center py-12 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Image src="/images/brand/logo.jpg" alt="LUXUDIES" width={48} height={48} className="rounded-full border border-gold-400/20" />
            </Link>
            <h1 className="font-playfair text-2xl font-bold text-espresso">Create Account</h1>
            <p className="font-inter text-sm text-espresso-200 mt-1">Join the LUXUDIES family</p>
          </div>

          <GlassCard variant="strong" padding="lg">
            {/* Google Sign Up */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full h-12 flex items-center justify-center gap-3 bg-white border border-pearl-400 rounded-[12px] text-sm font-inter font-medium text-espresso hover:bg-pearl-100 transition-colors mb-6"
            >
              <GoogleIcon className="w-5 h-5" />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 mb-6">
              <span className="flex-1 h-px bg-gold-400/10" />
              <span className="text-xs font-inter text-espresso-100">or</span>
              <span className="flex-1 h-px bg-gold-400/10" />
            </div>

            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className={`${inputClasses} pl-11`}
                  required
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
                <input
                  type="email"
                  placeholder="Email Address *"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`${inputClasses} pl-11`}
                  required
                />
              </div>

              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
                <input
                  type="tel"
                  placeholder="Phone Number (optional)"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className={`${inputClasses} pl-11`}
                  maxLength={10}
                />
              </div>

              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password (min 6 characters) *"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-12`}
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-espresso-200 hover:text-espresso"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              <Button type="submit" fullWidth size="lg" isLoading={isLoading}>
                CREATE ACCOUNT
              </Button>
            </form>

            <p className="text-center text-[11px] font-inter text-espresso-100 mt-4">
              By creating an account, you agree to our{' '}
              <Link href="/policies/terms" className="text-gold-500 hover:underline">Terms</Link> and{' '}
              <Link href="/policies/privacy" className="text-gold-500 hover:underline">Privacy Policy</Link>
            </p>

            <p className="text-center text-sm font-inter text-espresso-200 mt-6">
              Already have an account?{' '}
              <Link href="/auth/login" className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
                Sign In
              </Link>
            </p>
          </GlassCard>
        </motion.div>
      </main>
      <MobileNav />
    </>
  );
}
