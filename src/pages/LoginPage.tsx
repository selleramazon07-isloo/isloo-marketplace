import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogIn, Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Email is required.');
    if (!password) return setError('Password is required.');

    setLoading(true);
    const { error: authError } = await signIn(email.trim(), password);
    setLoading(false);

    if (authError) {
      if (authError.includes('Invalid login credentials')) setError('Invalid email or password.');
      else setError(authError);
      return;
    }

    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-surface-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-lg">i</span>
            </div>
            <span className="text-2xl font-black tracking-tight">
              <span className="text-brand-500">isloo</span><span className="text-brand-300">.com</span>
            </span>
          </Link>
          <h1 className="text-2xl font-bold text-surface-900">Welcome back</h1>
          <p className="text-surface-400 text-sm mt-1">Log in to your Isloo account</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Email Address <span className="text-danger-500">*</span></label>
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="you@example.com"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="label">Password <span className="text-danger-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(''); }}
                  placeholder="Enter your password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Link to="/forgot-password" className="text-xs text-brand-500 font-medium hover:underline">
                Forgot password?
              </Link>
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-100 text-danger-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader size={16} className="animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  Log In
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-surface-400">
              Don't have an account?{' '}
              <Link to="/signup" className="text-brand-500 font-semibold hover:underline">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-brand-500 mt-6 transition-colors">
          <ArrowLeft size={14} />
          Back to marketplace
        </Link>
      </div>
    </div>
  );
}
