import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Mail, Loader, ArrowLeft, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) return setError('Please enter your email address.');

    setLoading(true);
    const { error: resetError } = await resetPassword(email.trim());
    setLoading(false);

    if (resetError) {
      setError(resetError);
      return;
    }

    setSent(true);
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
          <h1 className="text-2xl font-bold text-surface-900">Reset your password</h1>
          <p className="text-surface-400 text-sm mt-1">
            {sent ? 'Check your inbox for the reset link' : "Enter your email and we'll send you a reset link"}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6">
          {sent ? (
            <div className="text-center py-6 animate-scale-in">
              <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <CheckCircle size={32} className="text-success-500" />
              </div>
              <h3 className="text-lg font-bold text-surface-900 mb-1">Email Sent!</h3>
              <p className="text-sm text-surface-500 mb-4">
                We've sent a password reset link to <span className="font-semibold text-surface-700">{email}</span>
              </p>
              <Link to="/login" className="btn-primary">
                Back to Login
              </Link>
            </div>
          ) : (
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
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail size={16} />
                    Send Reset Link
                  </>
                )}
              </button>
            </form>
          )}

          {!sent && (
            <div className="mt-5 text-center">
              <Link to="/login" className="text-sm text-brand-500 font-medium hover:underline">
                Back to login
              </Link>
            </div>
          )}
        </div>

        <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-surface-400 hover:text-brand-500 mt-6 transition-colors">
          <ArrowLeft size={14} />
          Back to marketplace
        </Link>
      </div>
    </div>
  );
}
