import { X, MapPin, Phone, Mail, Clock, Tag, Star, Share2, Heart, MessageCircle } from 'lucide-react';
import { Listing } from '../lib/supabase';
import { useState } from 'react';

interface ListingModalProps {
  listing: Listing;
  onClose: () => void;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(1)} Crore`;
  if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lac`;
  if (price >= 1000) return `PKR ${price.toLocaleString()}`;
  return `PKR ${price}`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-PK', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

export default function ListingModal({ listing, onClose }: ListingModalProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white w-full sm:max-w-2xl sm:rounded-2xl overflow-hidden shadow-2xl max-h-[95vh] flex flex-col animate-slide-up sm:animate-scale-in">
        {/* Image */}
        <div className="relative bg-surface-100 aspect-video sm:aspect-[16/9] overflow-hidden flex-shrink-0">
          {listing.image_url && !imgError ? (
            <img
              src={listing.image_url}
              alt={listing.title}
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
              <span className="text-brand-200 text-7xl font-black">{listing.category[0]}</span>
            </div>
          )}

          {/* Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white p-2 rounded-xl shadow-md transition-all duration-200 hover:scale-105"
          >
            <X size={18} className="text-surface-700" />
          </button>

          {listing.is_featured && (
            <div className="absolute top-3 left-3 badge bg-warning-500 text-white shadow-sm">
              <Star size={11} fill="currentColor" />
              Featured
            </div>
          )}

          {/* Price overlay */}
          <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg">
            <p className="text-xl font-black text-brand-600">{formatPrice(listing.price)}</p>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-5 sm:p-6">
            {/* Title row */}
            <div className="flex items-start justify-between gap-3 mb-4">
              <h2 className="text-xl font-bold text-surface-900 leading-snug">{listing.title}</h2>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => setLiked(!liked)}
                  className="p-2 rounded-lg hover:bg-surface-50 transition-colors"
                >
                  <Heart size={18} className={liked ? 'fill-danger-500 text-danger-500' : 'text-surface-400'} />
                </button>
                <button className="p-2 rounded-lg hover:bg-surface-50 transition-colors">
                  <Share2 size={18} className="text-surface-400" />
                </button>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 bg-surface-50 px-3 py-1.5 rounded-full border border-surface-100">
                <Tag size={13} className="text-brand-500" />
                {listing.category}
              </span>
              {listing.subcategory && (
                <span className="inline-flex items-center gap-1.5 text-sm text-brand-600 bg-brand-50 px-3 py-1.5 rounded-full border border-brand-100">
                  {listing.subcategory}
                </span>
              )}
              <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 bg-surface-50 px-3 py-1.5 rounded-full border border-surface-100">
                <MapPin size={13} className="text-brand-500" />
                {listing.location}
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-surface-600 bg-surface-50 px-3 py-1.5 rounded-full border border-surface-100">
                <Clock size={13} className="text-brand-500" />
                {formatDate(listing.created_at)}
              </span>
            </div>

            {/* Description */}
            {listing.description && (
              <div className="mb-6">
                <h3 className="label mb-2">Description</h3>
                <p className="text-surface-600 text-sm leading-relaxed">{listing.description}</p>
              </div>
            )}

            {/* Seller */}
            <div className="bg-surface-50 rounded-2xl p-4 border border-surface-100">
              <h3 className="text-sm font-bold text-surface-800 mb-3">Seller Information</h3>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-glow">
                  <span className="text-white font-bold text-sm">
                    {listing.seller_name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-surface-900 text-sm">{listing.seller_name}</p>
                  <p className="text-xs text-surface-400">Verified member</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {listing.seller_phone && (
                  <a
                    href={`tel:${listing.seller_phone}`}
                    className="btn-primary bg-success-500 hover:bg-success-600 shadow-none"
                  >
                    <Phone size={15} />
                    Call Seller
                  </a>
                )}
                {listing.seller_email ? (
                  <a
                    href={`mailto:${listing.seller_email}`}
                    className="btn-secondary"
                  >
                    <Mail size={15} />
                    Email
                  </a>
                ) : listing.seller_phone ? (
                  <a
                    href={`https://wa.me/${listing.seller_phone.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-secondary"
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </a>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
