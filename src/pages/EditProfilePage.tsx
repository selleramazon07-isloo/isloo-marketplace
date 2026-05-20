import { useState, useEffect, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Save, Loader, User, Mail, Phone, Camera } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

export default function EditProfilePage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', avatar_url: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!user) return;

    const loadProfile = async () => {
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        const p = data as Profile;
        setForm({
          full_name: p.full_name || '',
          email: p.email || user.email || '',
          phone: p.phone || '',
          avatar_url: p.avatar_url || '',
        });
      }
      setLoading(false);
    };

    loadProfile();
  }, [user]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!form.full_name.trim()) return setError('Full name is required.');

    setSaving(true);
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: form.full_name.trim(),
        phone: form.phone.trim(),
        avatar_url: form.avatar_url.trim(),
      })
      .eq('id', user!.id);

    setSaving(false);

    if (updateError) {
      setError('Failed to update profile. Please try again.');
      return;
    }

    setSuccess(true);
    setTimeout(() => navigate('/dashboard'), 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="animate-spin text-brand-500" />
          <p className="text-surface-400 text-sm">Loading profile...</p>
        </div>
      </div>
    );
  }

  const initials = form.full_name
    ? form.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?';

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <div className="bg-white border-b border-surface-100 sticky top-0 z-40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 h-16 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="btn-ghost p-2">
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-lg font-bold text-surface-900">Edit Profile</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
        {/* Avatar preview */}
        <div className="flex justify-center mb-8 animate-fade-in">
          <div className="relative group">
            <div className="w-24 h-24 rounded-2xl bg-brand-500 flex items-center justify-center overflow-hidden shadow-glow">
              {form.avatar_url ? (
                <img src={form.avatar_url} alt="" className="w-full h-full object-cover" />
              ) : (
                <span className="text-white font-bold text-3xl">{initials}</span>
              )}
            </div>
            <div className="absolute inset-0 rounded-2xl bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
              <Camera size={20} className="text-white" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border border-surface-100 shadow-card p-6 animate-fade-in-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label">Full Name <span className="text-danger-500">*</span></label>
              <div className="relative">
                <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="text"
                  value={form.full_name}
                  onChange={(e) => { setForm(p => ({ ...p, full_name: e.target.value })); setError(''); }}
                  placeholder="Muhammad Ali"
                  className="input-field pl-10"
                  autoFocus
                />
              </div>
            </div>

            <div>
              <label className="label">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="email"
                  value={form.email}
                  disabled
                  className="input-field pl-10 bg-surface-50 text-surface-400 cursor-not-allowed"
                />
              </div>
              <p className="text-xs text-surface-400 mt-1">Email cannot be changed</p>
            </div>

            <div>
              <label className="label">Phone Number</label>
              <div className="relative">
                <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400" />
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm(p => ({ ...p, phone: e.target.value }))}
                  placeholder="0300-1234567"
                  className="input-field pl-10"
                />
              </div>
            </div>

            <div>
              <label className="label">Avatar URL</label>
              <input
                type="url"
                value={form.avatar_url}
                onChange={(e) => setForm(p => ({ ...p, avatar_url: e.target.value }))}
                placeholder="https://example.com/photo.jpg"
                className="input-field"
              />
            </div>

            {error && (
              <div className="bg-danger-50 border border-danger-100 text-danger-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-success-50 border border-success-100 text-success-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                Profile updated successfully!
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="btn-secondary flex-1 justify-center"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="btn-primary flex-1 justify-center disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <Loader size={14} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save size={14} />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
