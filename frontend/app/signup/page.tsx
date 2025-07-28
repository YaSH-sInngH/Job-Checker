// frontend/app/signup/page.tsx
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

const schema = z.object({
  email: z.string().email(),
  username: z.string().min(3, 'Username must be at least 3 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user']).optional(), // Only allow 'user' for public signup
});

type FormData = z.infer<typeof schema>;

export default function SignupPage() {
  const { showToast } = useToast();
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'user' },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/auth/signup', data, { withCredentials: true });
      showToast('Signup successful! Please log in.', 'success');
      window.location.href = '/login';
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      showToast(error?.response?.data?.message || 'Signup failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-[#1a1f1b]">
      <Link href="/" className="absolute top-10 left-10 text-black dark:text-white underline-offset-4 hover:underline duration-150 decoration-[#8854e0]">&#x2190; Back to Home</Link>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white dark:bg-[#1a1f1b] p-8 rounded-lg shadow-md w-full max-w-sm space-y-4 dark:text-white"
      >
        <div className="flex items-center justify-center font-bold text-4xl text-[#8854e0] mb-10">
          <Image src="/a2.png" alt="Alora Logo" width={32} height={32} className="mr-2 rounded-full" />
          Alora
        </div>
        <h1 className="text-2xl mb-2">Signup for an account 🤗</h1>
        <Input label="Email" type="email" {...register('email')} />
        {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
        <Input label="Username" type="text" {...register('username')} />
        {errors.username && <p className="text-red-500 text-xs">{errors.username.message}</p>}
        <Input label="Password" type="password" {...register('password')} />
        {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
        {/* Optionally, allow role selection for future admin use, but only 'user' for now */}
        <input type="hidden" value="user" {...register('role')} />
        <Button type="submit" className="w-full flex items-center justify-center hover:bg-[#8854e0]/80" disabled={loading}>
          {loading ? <LoadingSpinner size={20} className='text-white'/> : 'Sign Up'}
        </Button>
        <p className="text-sm text-center mt-2">
          Already have an account ? <a href="/login" className="text-[#8854e0] hover:underline">Login</a>
        </p>
      </form>
    </div>
  );
}
