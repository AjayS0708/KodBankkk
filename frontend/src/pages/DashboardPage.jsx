import { Link } from 'react-router-dom';

function DashboardPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-12">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-6 rounded-lg bg-white p-6 shadow">
        <p className="text-sm text-slate-600">Dashboard content placeholder.</p>
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
