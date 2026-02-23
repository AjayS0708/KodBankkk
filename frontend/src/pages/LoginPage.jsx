import { Link } from 'react-router-dom';

function LoginPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Welcome Back</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm text-slate-600">Login form goes here.</p>
      </div>
      <p className="mt-4 text-sm">
        New user?{' '}
        <Link className="font-semibold text-blue-700" to="/register">
          Go to Register
        </Link>
      </p>
      <p className="mt-2 text-sm">
        Continue to{' '}
        <Link className="font-semibold text-blue-700" to="/dashboard">
          Dashboard
        </Link>
      </p>
    </main>
  );
}

export default LoginPage;
