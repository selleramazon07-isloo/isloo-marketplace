import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { Listing } from '../lib/supabase';
import { useState } from 'react';

interface ListingCardProps {
  listing: Listing;
  onClick: (listing: Listing) => void;
}

function formatPrice(price: number): string {
  if (price >= 10000000) return `PKR ${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `PKR ${(price / 100000).toFixed(1)} Lac`;
  if (price >= 1000) return `PKR ${price.toLocaleString()}`;
  return `PKR ${price}`;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

export default function ListingCard({ listing, onClick }: ListingCardProps) {
  const [liked, setLiked] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <div
      onClick={() => onClick(listing)}
      className="group card cursor-pointer overflow-hidden"
    >
      {/* Image */}
      <div className="relative overflow-hidden bg-surface-100 aspect-[4/3]">
        {listing.image_url && !imgError ? (
          <img
            src={listing.image_url}
            alt={listing.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-50 to-brand-100">
            <span className="text-brand-200 text-5xl font-black">{listing.category[0]}</span>
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Featured badge */}
        {listing.is_featured && (
          <div className="absolute top-2.5 left-2.5 badge bg-warning-500 text-white shadow-sm">
            <Star size={10} fill="currentColor" />
            Featured
          </div>
        )}

        {/* Category tag */}
        <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-sm text-xs font-semibold text-brand-600 px-2.5 py-1 rounded-full shadow-sm">
          {listing.subcategory || listing.category}
        </div>

        {/* Like button */}
        <button
          onClick={(e) => { e.stopPropagation(); setLiked(!liked); }}
          className="absolute bottom-2.5 right-2.5 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110"
        >
          <Heart size={14} className={liked ? 'fill-danger-500 text-danger-500' : 'text-surface-400'} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="font-semibold text-surface-900 text-sm leading-snug line-clamp-2 group-hover:text-brand-600 transition-colors duration-200 mb-1.5">
          {listing.title}
        </h3>

        <p className="text-brand-600 font-bold text-base mb-2.5">
          {formatPrice(listing.price)}
        </p>

        <div className="flex items-center justify-between text-xs text-surface-400">
          <span className="flex items-center gap-1 truncate">
            <MapPin size={11} className="flex-shrink-0 text-surface-300" />
            <span className="truncate">{listing.location}</span>
          </span>
          <span className="flex items-center gap-1 flex-shrink-0 ml-2">
            <Clock size={11} />
            {timeAgo(listing.created_at)}
          </span>
        </div>
      </div>
    </div>
  );
}
