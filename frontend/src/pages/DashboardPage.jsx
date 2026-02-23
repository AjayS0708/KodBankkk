import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Confetti from 'react-confetti';
import api from '../lib/api';

function DashboardPage() {
  const [balance, setBalance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showConfetti, setShowConfetti] = useState(false);
  const [viewport, setViewport] = useState({ width: 0, height: 0 });

  useEffect(() => {
    function updateViewport() {
      setViewport({ width: window.innerWidth, height: window.innerHeight });
    }

    updateViewport();
    window.addEventListener('resize', updateViewport);

    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  async function handleCheckBalance() {
    setError('');
    setIsLoading(true);

    try {
      const response = await api.get('/balance/check-balance');
      setBalance(response.data.balance);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4200);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || 'Unable to fetch balance. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="kodbank-gradient-bg relative min-h-screen overflow-hidden px-6 py-12">
      {showConfetti ? (
        <Confetti width={viewport.width} height={viewport.height} numberOfPieces={260} recycle={false} />
      ) : null}
      <section className="relative mx-auto flex min-h-[80vh] w-full max-w-4xl flex-col justify-center">
        <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur-md">
          <p className="text-sm font-medium uppercase tracking-[0.2em] text-slate-500">Kodbank</p>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">Dashboard</h1>
          <p className="mt-3 max-w-xl text-sm text-slate-600">
            Quickly check your current account balance in a secure session.
          </p>

          <div className="mt-8">
            <button
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
              type="button"
              onClick={handleCheckBalance}
              disabled={isLoading}
            >
              {isLoading ? 'Checking...' : 'Check Balance'}
            </button>
          </div>

          {error ? <p className="mt-4 text-sm font-medium text-red-600">{error}</p> : null}

          {balance !== null ? (
            <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4">
              <p className="text-lg font-semibold text-emerald-800">🎉 Your balance is ₹{balance}</p>
            </div>
          ) : null}
        </div>
      </section>

      <div className="relative mx-auto mt-4 flex w-full max-w-4xl gap-4 text-sm">
        <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to="/login">
          Login
        </Link>
        <Link className="font-semibold text-slate-900 underline-offset-4 hover:underline" to="/register">
          Register
        </Link>
      </div>
    </main>
  );
}

export default DashboardPage;
