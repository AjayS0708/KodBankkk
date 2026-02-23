import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await api.post('/auth/login', formData);
      navigate('/dashboard');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Welcome Back</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            required
          />
          <input
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            name="password"
            type="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <button
            className="w-full rounded bg-blue-700 px-3 py-2 text-sm font-semibold text-white disabled:opacity-60"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>
        </form>
      </div>
      <p className="mt-4 text-sm">
        New user?{' '}
        <Link className="font-semibold text-blue-700" to="/register">
          Go to Register
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;
