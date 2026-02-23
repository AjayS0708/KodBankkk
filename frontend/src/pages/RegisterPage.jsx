import { Link } from 'react-router-dom';

function RegisterPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6">
      <h1 className="mb-6 text-3xl font-bold">Create Account</h1>
      <div className="rounded-lg bg-white p-6 shadow">
        <p className="text-sm text-slate-600">Register form goes here.</p>
      </div>
      <p className="mt-4 text-sm">
        Already registered?{' '}
        <Link className="font-semibold text-blue-700" to="/login">
          Go to Login
        </Link>
      </p>
    </main>
  );
}

export default RegisterPage;
