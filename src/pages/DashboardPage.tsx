import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { User, Wallet, ArrowUpRight, ArrowDownLeft, CreditCard as Edit3, LogOut, Plus, Clock, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  avatar_url: string;
}

interface WalletData {
  id: string;
  balance: number;
  status: string;
}

interface Transaction {
  id: string;
  amount: number;
  type: 'credit' | 'debit';
  status: string;
  created_at: string;
}

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      setLoading(true);

      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (profileData) setProfile(profileData as Profile);

      const { data: walletData } = await supabase
        .from('wallets')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (walletData) {
        setWallet(walletData as WalletData);

        const { data: txData } = await supabase
          .from('transactions')
          .select('*')
          .eq('wallet_id', walletData.id)
          .order('created_at', { ascending: false })
          .limit(20);

        if (txData) setTransactions(txData as Transaction[]);
      }

      setLoading(false);
    };

    loadData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const initials = profile?.full_name
    ? profile.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : user?.email?.charAt(0).toUpperCase() ?? '?';

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-50">
        <div className="flex flex-col items-center gap-3">
          <Loader size={32} className="animate-spin text-brand-500" />
          <p className="text-surface-400 text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-surface-50">
      {/* Top bar */}
      <div className="bg-white border-b border-surface-100 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-500 rounded-xl flex items-center justify-center shadow-glow">
              <span className="text-white font-black text-sm">i</span>
            </div>
            <span className="text-xl font-black tracking-tight">
              <span className="text-brand-500">isloo</span><span className="text-brand-300">.com</span>
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <Link to="/" className="btn-ghost text-xs">
              Marketplace
            </Link>
            <button onClick={handleSignOut} className="btn-ghost text-xs text-danger-500 hover:text-danger-600 hover:bg-danger-50">
              <LogOut size={14} />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-surface-900 mb-6">My Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Profile Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden animate-fade-in-up">
            <div className="bg-gradient-to-br from-brand-500 to-brand-700 px-6 py-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-brand-900/20 rounded-full blur-xl" />
              <div className="relative flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/20 flex-shrink-0">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                  ) : (
                    <span className="text-white font-bold text-xl">{initials}</span>
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="text-white font-bold text-lg truncate">{profile?.full_name || 'User'}</h2>
                  <p className="text-white/70 text-sm truncate">{profile?.email || user?.email}</p>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-surface-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <User size={14} className="text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-surface-400 text-xs">Full Name</p>
                  <p className="text-surface-800 font-medium truncate">{profile?.full_name || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-surface-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail size={14} className="text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-surface-400 text-xs">Email</p>
                  <p className="text-surface-800 font-medium truncate">{profile?.email || user?.email || 'Not set'}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-sm">
                <div className="w-8 h-8 bg-surface-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone size={14} className="text-surface-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-surface-400 text-xs">Phone</p>
                  <p className="text-surface-800 font-medium truncate">{profile?.phone || 'Not set'}</p>
                </div>
              </div>

              <Link
                to="/edit-profile"
                className="btn-secondary w-full mt-4 justify-center"
              >
                <Edit3 size={14} />
                Edit Profile
              </Link>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="bg-gradient-to-br from-surface-800 to-surface-900 px-6 py-5 relative overflow-hidden">
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-brand-500/20 rounded-full blur-xl" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-surface-700/50 rounded-full blur-xl" />
              {/* Card pattern */}
              <div className="absolute inset-0 opacity-[0.04]" style={{
                backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)',
                backgroundSize: '20px 20px',
              }} />
              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Wallet size={16} className="text-brand-400" />
                    <span className="text-white/60 text-xs font-medium uppercase tracking-wider">Isloo Wallet</span>
                  </div>
                  <span className={`badge ${wallet?.status === 'active' ? 'bg-success-500/20 text-success-400' : 'bg-surface-600 text-surface-400'}`}>
                    {wallet?.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="text-white/50 text-xs font-medium mb-1">Available Balance</p>
                <p className="text-white text-3xl font-black tracking-tight">
                  Rs.{wallet ? Number(wallet.balance).toLocaleString() : '0'}
                </p>
              </div>
            </div>

            <div className="p-5">
              <button className="btn-primary w-full justify-center mb-4">
                <Plus size={14} />
                Add Money
              </button>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-success-50 rounded-xl p-3 text-center">
                  <ArrowDownLeft size={16} className="text-success-500 mx-auto mb-1" />
                  <p className="text-xs text-surface-500">Received</p>
                  <p className="text-sm font-bold text-success-600">
                    Rs.{transactions.filter(t => t.type === 'credit' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-danger-50 rounded-xl p-3 text-center">
                  <ArrowUpRight size={16} className="text-danger-500 mx-auto mb-1" />
                  <p className="text-xs text-surface-500">Spent</p>
                  <p className="text-sm font-bold text-danger-600">
                    Rs.{transactions.filter(t => t.type === 'debit' && t.status === 'completed').reduce((s, t) => s + Number(t.amount), 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Transaction History */}
        <div className="mt-8 bg-white rounded-2xl border border-surface-100 shadow-card overflow-hidden animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="px-5 py-4 border-b border-surface-100 flex items-center justify-between">
            <h3 className="font-bold text-surface-900">Transaction History</h3>
            <span className="badge bg-surface-50 text-surface-500 border border-surface-100">
              {transactions.length}
            </span>
          </div>

          {transactions.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-14 h-14 bg-surface-50 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <Clock size={24} className="text-surface-300" />
              </div>
              <p className="text-surface-500 font-medium text-sm">No transactions yet</p>
              <p className="text-surface-400 text-xs mt-1">Your transaction history will appear here</p>
            </div>
          ) : (
            <div className="divide-y divide-surface-50">
              {transactions.map((tx) => (
                <div key={tx.id} className="px-5 py-3.5 flex items-center gap-3 hover:bg-surface-50/50 transition-colors">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    tx.type === 'credit' ? 'bg-success-50' : 'bg-danger-50'
                  }`}>
                    {tx.type === 'credit' ? (
                      <ArrowDownLeft size={16} className="text-success-500" />
                    ) : (
                      <ArrowUpRight size={16} className="text-danger-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-surface-800 capitalize">{tx.type}</p>
                    <p className="text-xs text-surface-400">
                      {new Date(tx.created_at).toLocaleDateString('en-PK', {
                        day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
                      })}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-success-600' : 'text-danger-600'}`}>
                      {tx.type === 'credit' ? '+' : '-'}Rs.{Number(tx.amount).toLocaleString()}
                    </p>
                    <div className="flex items-center gap-1 justify-end">
                      {tx.status === 'completed' && <CheckCircle size={10} className="text-success-500" />}
                      {tx.status === 'pending' && <Clock size={10} className="text-warning-500" />}
                      {tx.status === 'failed' && <AlertCircle size={10} className="text-danger-500" />}
                      <span className={`text-xs capitalize ${
                        tx.status === 'completed' ? 'text-success-500' :
                        tx.status === 'pending' ? 'text-warning-500' : 'text-danger-500'
                      }`}>
                        {tx.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Mail({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
    </svg>
  );
}

function Phone({ size, className }: { size: number; className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
    </svg>
  );
}
