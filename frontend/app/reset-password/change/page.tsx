'use client';
import { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';

export default function ChangePasswordPage() {
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/auth/reset-password', { token, newPassword: password });
      setMsg('Password reset! You can now log in.');
    } catch {
      setMsg('Error resetting password.');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto mt-20 p-6 bg-white rounded shadow">
      <h1 className="text-xl font-bold mb-4">Set New Password</h1>
      <input
        type="password"
        placeholder="New password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full mb-2 p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded" disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Password'}
      </button>
      {msg && <div className="mt-2 text-center">{msg}</div>}
    </form>
  );
}
