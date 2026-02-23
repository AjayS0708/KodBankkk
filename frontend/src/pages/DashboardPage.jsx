import { Link } from 'react-router-dom';
import { useState } from 'react';
import api from '../lib/api';

function DashboardPage() {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleCheckBalance() {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.get('/balance/check-balance');
      setBalance(response.data.balance);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to fetch balance. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <button
          className="rounded bg-blue-700 px-4 py-2 text-sm font-semibold text-white disabled:opacity-60"
          type="button"
          onClick={handleCheckBalance}
          disabled={isLoading}
        >
          {isLoading ? 'Checking...' : 'Check Balance'}
        </button>
        {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}
        {balance !== null ? (
          <p className="mt-4 text-sm text-slate-700">
            Balance: <span className="font-semibold">{balance}</span>
          </p>
        ) : null}
      </div>
      <div className="mt-6 flex gap-4 text-sm">
        <Link className="font-semibold text-blue-700" to="/login">
          Login
        </Link>
        <Link className="font-semibold text-blue-700" to="/register">
          Register
        </Link>
      </div>
    </main>
  );
}

export default DashboardPage;
