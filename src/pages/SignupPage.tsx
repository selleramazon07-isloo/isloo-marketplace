import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { UserPlus, Eye, EyeOff, Loader, ArrowLeft } from 'lucide-react';

export default function SignupPage() {
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.full_name.trim()) return setError('Full name is required.');
    if (!form.email.trim()) return setError('Email is required.');
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    if (form.password !== form.confirmPassword) return setError('Passwords do not match.');

    setLoading(true);
    const { error: authError } = await signUp(form.email.trim(), form.password, {
      full_name: form.full_name.trim(),
      phone: form.phone.trim(),
    });
    setLoading(false);

    if (authError) {
      if (authError.includes('already registered')) setError('This email is already registered.');
      else setError(authError);
      return;
    }

    navigate('/dashboard');
  };

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setError('');
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
          <h1 className="text-2xl font-bold text-surface-900">Create your account</h1>
          <p className="text-surface-400 text-sm mt-1">Join Islamabad's #1 marketplace</p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name <span className="text-danger-500">*</span></label>
              <input
                type="text"
                value={form.full_name}
                onChange={(e) => handleChange('full_name', e.target.value)}
                placeholder="Muhammad Ali"
                className="input-field"
                autoFocus
              />
            </div>

            <div>
              <label className="label">Email Address <span className="text-danger-500">*</span></label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => handleChange('email', e.target.value)}
                placeholder="you@example.com"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Phone Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => handleChange('phone', e.target.value)}
                placeholder="0300-1234567"
                className="input-field"
              />
            </div>

            <div>
              <label className="label">Password <span className="text-danger-500">*</span></label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min 6 characters"
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

            <div>
              <label className="label">Confirm Password <span className="text-danger-500">*</span></label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={form.confirmPassword}
                  onChange={(e) => handleChange('confirmPassword', e.target.value)}
                  placeholder="Re-enter password"
                  className="input-field pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-surface-400 hover:text-surface-600"
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
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
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Sign up
                </>
              )}
            </button>
          </form>

          <div className="mt-5 text-center">
            <p className="text-sm text-surface-400">
              Already have an account?{' '}
              <Link to="/login" className="text-brand-500 font-semibold hover:underline">
                Log in
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
