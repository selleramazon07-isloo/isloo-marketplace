import { useState } from 'react';
import { X, Upload, Loader, Image, Check } from 'lucide-react';
import { supabase, CATEGORIES } from '../lib/supabase';

interface UploadModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const LOCATIONS = [
  'F-6, Islamabad', 'F-7, Islamabad', 'F-8, Islamabad', 'F-10, Islamabad',
  'F-11, Islamabad', 'G-9, Islamabad', 'G-10, Islamabad', 'G-11, Islamabad',
  'Blue Area, Islamabad', 'DHA Phase 1, Islamabad', 'DHA Phase 2, Islamabad',
  'Bahria Town, Islamabad', 'Gulberg Greens, Islamabad', 'I-8, Islamabad',
  'E-7, Islamabad', 'Rawalpindi',
];

export default function UploadModal({ onClose, onSuccess }: UploadModalProps) {
  const [form, setForm] = useState<Record<string, string>>({
    title: '',
    description: '',
    price: '',
    category: CATEGORIES[0].name,
    subcategory: CATEGORIES[0].subcategories[0] as string,
    location: 'F-7, Islamabad',
    image_url: '',
    seller_name: '',
    seller_email: '',
    seller_phone: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const activeSubcategories = CATEGORIES.find(c => c.name === form.category)?.subcategories ?? [];

  const handleChange = (field: string, value: string) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === 'category') {
        const subs = CATEGORIES.find(c => c.name === value)?.subcategories ?? [];
        next.subcategory = subs[0] ?? '';
      }
      return next;
    });
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.seller_name.trim()) {
      setError('Title and your name are required.');
      return;
    }
    setLoading(true);
    try {
      const { error: insertError } = await supabase.from('listings').insert({
        title: form.title.trim(),
        description: form.description.trim(),
        price: parseFloat(form.price) || 0,
        category: form.category,
        subcategory: form.subcategory,
        location: form.location,
        image_url: form.image_url.trim(),
        seller_name: form.seller_name.trim(),
        seller_email: form.seller_email.trim(),
        seller_phone: form.seller_phone.trim(),
        user_id: null,
      });
      if (insertError) throw insertError;
      setSuccess(true);
      setTimeout(() => onSuccess(), 800);
    } catch {
      setError('Failed to post listing. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-lg sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-surface-100 flex-shrink-0">
          <div>
            <h2 className="text-lg font-bold text-surface-900">Post New Listing</h2>
            <p className="text-xs text-surface-400 mt-0.5">Fill in the details to list your item</p>
          </div>
          <button onClick={onClose} className="p-2 text-surface-400 hover:text-surface-600 hover:bg-surface-50 rounded-xl transition-colors">
            <X size={18} />
          </button>
        </div>

        {success ? (
          <div className="flex-1 flex flex-col items-center justify-center py-16 px-6 animate-scale-in">
            <div className="w-16 h-16 bg-success-50 rounded-2xl flex items-center justify-center mb-4">
              <Check size={32} className="text-success-500" />
            </div>
            <h3 className="text-lg font-bold text-surface-900 mb-1">Listing Posted!</h3>
            <p className="text-sm text-surface-500 text-center">Your ad is now live on Isloo.com</p>
          </div>
        ) : (
          <>
            {/* Form */}
            <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
              {/* Title */}
              <div>
                <label className="label">Title <span className="text-danger-500">*</span></label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="e.g. iPhone 14 Pro Max 256GB"
                  className="input-field"
                />
              </div>

              {/* Category, Subcategory & Price */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="label">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="input-field"
                  >
                    {CATEGORIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Type</label>
                  <select
                    value={form.subcategory}
                    onChange={(e) => handleChange('subcategory', e.target.value)}
                    className="input-field"
                  >
                    {activeSubcategories.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label">Price (PKR)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => handleChange('price', e.target.value)}
                    placeholder="0"
                    min="0"
                    className="input-field"
                  />
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="label">Location</label>
                <select
                  value={form.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  className="input-field"
                >
                  {LOCATIONS.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              {/* Description */}
              <div>
                <label className="label">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  placeholder="Describe your item in detail..."
                  rows={3}
                  className="input-field resize-none"
                />
              </div>

              {/* Image URL */}
              <div>
                <label className="label">Image URL</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-surface-400">
                    {form.image_url ? <Image size={16} className="text-brand-500" /> : <Image size={16} />}
                  </div>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => handleChange('image_url', e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="input-field pl-10"
                  />
                </div>
              </div>

              {/* Seller info */}
              <div className="border-t border-surface-100 pt-4">
                <p className="label mb-3">Your Contact Info</p>

                <div className="mb-3">
                  <label className="label">Your Name <span className="text-danger-500">*</span></label>
                  <input
                    type="text"
                    value={form.seller_name}
                    onChange={(e) => handleChange('seller_name', e.target.value)}
                    placeholder="Your full name"
                    className="input-field"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="label">Phone</label>
                    <input
                      type="tel"
                      value={form.seller_phone}
                      onChange={(e) => handleChange('seller_phone', e.target.value)}
                      placeholder="0300-1234567"
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="label">Email</label>
                    <input
                      type="email"
                      value={form.seller_email}
                      onChange={(e) => handleChange('seller_email', e.target.value)}
                      placeholder="you@email.com"
                      className="input-field"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-danger-50 border border-danger-100 text-danger-600 text-sm px-4 py-3 rounded-xl animate-fade-in">
                  {error}
                </div>
              )}
            </form>

            {/* Footer */}
            <div className="flex-shrink-0 px-5 py-4 border-t border-surface-100 flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader size={15} className="animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    <Upload size={15} />
                    Post Listing
                  </>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
