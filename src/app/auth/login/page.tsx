// ============================================
// LUXUDIES - Login Page
// ============================================

'use client';

import { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, Smartphone, ArrowRight } from 'lucide-react';
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

type AuthMode = 'email' | 'otp';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const [mode, setMode] = useState<AuthMode>('email');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Please fill in all fields'); return; }
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Welcome back!');
      router.push(redirect);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Login failed';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOTP = async () => {
    if (!phone || phone.length < 10) { toast.error('Enter a valid phone number'); return; }
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({ phone: `+91${phone}` });
      if (error) throw error;
      setOtpSent(true);
      toast.success('OTP sent to your phone');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to send OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp || otp.length < 6) { toast.error('Enter a valid 6-digit OTP'); return; }
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.verifyOtp({
        phone: `+91${phone}`,
        token: otp,
        type: 'sms',
      });
      if (error) throw error;
      toast.success('Login successful!');
      router.push(redirect);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Invalid OTP';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${redirect}`,
        },
      });
      if (error) throw error;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Google login failed';
      toast.error(message);
    }
  };

  const inputClasses = "w-full h-12 px-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[12px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all";

  return (
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
          <h1 className="font-playfair text-2xl font-bold text-espresso">Welcome Back</h1>
          <p className="font-inter text-sm text-espresso-200 mt-1">Sign in to your LUXUDIES account</p>
        </div>

        <GlassCard variant="strong" padding="lg">
          {/* Google Login */}
          <button
            onClick={handleGoogleLogin}
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

          {/* Mode Toggle */}
          <div className="flex bg-pearl-200 rounded-full p-1 mb-6">
            <button
              onClick={() => { setMode('email'); setOtpSent(false); }}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-inter font-medium transition-all ${mode === 'email' ? 'bg-white text-espresso shadow-sm' : 'text-espresso-200'}`}
            >
              <Mail className="w-3.5 h-3.5" />
              Email
            </button>
            <button
              onClick={() => setMode('otp')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full text-xs font-inter font-medium transition-all ${mode === 'otp' ? 'bg-white text-espresso shadow-sm' : 'text-espresso-200'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              OTP
            </button>
          </div>

          {mode === 'email' ? (
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div>
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`${inputClasses} pr-12`}
                  required
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
                SIGN IN
              </Button>
            </form>
          ) : (
            <div className="space-y-4">
              {!otpSent ? (
                <>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-inter text-espresso-200">+91</span>
                    <input
                      type="tel"
                      placeholder="Phone number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className={`${inputClasses} pl-14`}
                      maxLength={10}
                    />
                  </div>
                  <Button fullWidth size="lg" onClick={handleSendOTP} isLoading={isLoading}>
                    SEND OTP
                  </Button>
                </>
              ) : (
                <>
                  <p className="text-xs font-inter text-espresso-200 text-center">
                    OTP sent to +91 {phone}
                  </p>
                  <input
                    type="text"
                    placeholder="Enter 6-digit OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`${inputClasses} text-center text-lg tracking-[0.5em]`}
                    maxLength={6}
                  />
                  <Button fullWidth size="lg" onClick={handleVerifyOTP} isLoading={isLoading}>
                    VERIFY OTP
                  </Button>
                  <button
                    onClick={() => setOtpSent(false)}
                    className="w-full text-center text-xs font-inter text-espresso-200 hover:text-gold-500 transition-colors"
                  >
                    Change phone number
                  </button>
                </>
              )}
            </div>
          )}

          {/* Sign Up Link */}
          <p className="text-center text-sm font-inter text-espresso-200 mt-6">
            Don&apos;t have an account?{' '}
            <Link href="/auth/signup" className="text-gold-500 font-semibold hover:text-gold-600 transition-colors">
              Create Account
            </Link>
          </p>
        </GlassCard>
      </motion.div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <>
      <Header />
      <Suspense fallback={<div className="min-h-screen" />}>
        <LoginContent />
      </Suspense>
      <MobileNav />
    </>
  );
}
