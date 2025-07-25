'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function ResetPasswordPage() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get('token');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Request reset link
  const handleRequest = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/auth/request-password-reset', { email });
      setMsg('Check your email for a reset link.');
    } catch {
      setMsg('Error sending reset email.');
    }
    setLoading(false);
  };

  // Set new password
  const handleReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { token, newPassword: password });
      setMsg('Password reset! You can now log in.');
      setTimeout(() => {
        router.push('/login');
      }, 1500);
    } catch {
      setMsg('Error resetting password.');
    }
    setLoading(false);
  };

  if (token) {
    // Show set new password form
    return (
      <div className="flex flex-col items-center justify-center bg-[#1a1f1b] h-screen">
        <form onSubmit={handleReset} className="bg-white dark:bg-[#1a1f1b] p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 dark:text-white">
          <div className='flex items-center justify-center mb-10'>
            <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
            <h1 className="text-2xl font-bold text-[#8854e0]">Alora</h1>
          </div>
          <Input
            label="New Password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? <LoadingSpinner size={20} /> : 'Reset Password'}
          </Button>
          {msg && <div className="mt-2 text-center">{msg}</div>}
        </form>
      </div>
    );
  }

  // Show request reset link form
  return (
    <div className="flex flex-col items-center justify-center bg-[#1a1f1b] h-screen">
      <form onSubmit={handleRequest} className="bg-white dark:bg-[#1a1f1b] p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 dark:text-white">
        <div className='flex items-center justify-center mb-10'>
            <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
            <h1 className="text-2xl font-bold text-[#8854e0]">Alora</h1>
        </div>
        <h1 className="text-xl text-black dark:text-white font-bold mb-4 mt-10">Reset your Password</h1>
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoadingSpinner size={20} /> : 'Reset Password'}
        </Button>
        {msg && <div className="mt-2 text-center">{msg}</div>}
      </form>
    </div>
  );
}