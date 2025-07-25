// frontend/app/login/page.tsx
'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useToast } from '@/components/ui/Toast';
import axios from 'axios';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { jwtDecode } from 'jwt-decode';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export default function LoginPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/auth/login', data, { withCredentials: true });
      const accessToken = res.data.access_token;
      localStorage.setItem('access_token', accessToken);
      let role = 'user';
      try {
        const decoded: any = jwtDecode(accessToken);
        role = decoded.role || 'user';
      } catch {}
      showToast('Login successful!', 'success');
      // Redirect based on role
      if (role === 'admin') {
        window.location.href = '/admin';
      } else {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      showToast(err?.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#1a1f1b]">
      <Link href="/" className="absolute top-10 left-10 text-black dark:text-white underline-offset-4 hover:underline decoration-[#8854e0]">&#x2190; Back to Home</Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#1a1f1b] p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 dark:text-white"
      >
        <div className="flex items-center justify-center font-bold text-4xl text-[#8854e0] mb-10">
          <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
          Alora
        </div>
        <h1 className="text-2xl mb-2">Login to your account ☺</h1>
        <Input label="Email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        <Input label="Password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? <LoadingSpinner size={20} /> : 'Login'}
        </Button>
        <div className="flex justify-between">
            <p className="text-sm text-center mt-2">
                <a href="/reset-password" className="text-black dark:text-white underline">Reset password?</a>
            </p>
            <p className="text-sm text-center mt-2">
                <a href="/signup" className="text-black dark:text-white"><span className='text-[#8854e0] underline'>Signup</span> for free?</a>
            </p>
        </div>
      </form>
    </div>
  );
}
