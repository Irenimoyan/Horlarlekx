import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';
import { 
  getAuthorizedAdmins, 
  addAdminEmail, 
  removeAdminEmail 
} from '../../firebase/admins';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  RefreshCw, 
  Lock,
  KeyRound,
  Info
} from 'lucide-react';

export default function AdminAdministrators() {
  const { currentUser } = useAuth();
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // New admin email input state
  const [newEmail, setNewEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Deletion modal state
  const [adminToDelete, setAdminToDelete] = useState(null);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAuthorizedAdmins();
      setAdmins(data);
    } catch (err) {
      console.error('Error fetching admin allowlist:', err);
      setError('Failed to load administrator allowlist.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAddAdmin = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newEmail.trim()) {
      setError('Please enter a valid administrator email address.');
      return;
    }

    try {
      setSubmitting(true);
      await addAdminEmail(newEmail.trim(), currentUser?.email || 'Admin User');
      setSuccess(`Successfully authorized administrator email: ${newEmail.trim()}`);
      setNewEmail('');
      await fetchAdmins();
    } catch (err) {
      console.error('Add admin error:', err);
      setError(err.message || 'Failed to authorize administrator email.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!adminToDelete) return;
    setError('');
    setSuccess('');

    if (admins.length <= 1) {
      setError('You must have at least one active administrator.');
      setAdminToDelete(null);
      return;
    }

    try {
      await removeAdminEmail(adminToDelete.id, adminToDelete.email);
      setSuccess(`Revoked administrator access for: ${adminToDelete.email}`);
      setAdminToDelete(null);
      await fetchAdmins();
    } catch (err) {
      console.error('Remove admin error:', err);
      setError(err.message || 'Failed to revoke administrator access.');
      setAdminToDelete(null);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Administrator Allowlist Management
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Control which email addresses are authorized to access the HORLAR SERVICE Admin Dashboard.
            </p>
          </div>
          <button
            onClick={fetchAdmins}
            className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-cyan/20 text-xs font-bold transition-all flex items-center space-x-2 self-start sm:self-auto"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan' : ''}`} />
            <span>Refresh Allowlist</span>
          </button>
        </div>

        {/* Alert Notifications */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button onClick={() => setError('')} className="text-red-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{success}</span>
            </div>
            <button onClick={() => setSuccess('')} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {/* Add Administrator Form Card */}
        <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-cyan">
            <UserPlus className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Authorize New Administrator
              </h3>
              <p className="text-xs text-slate-300">
                Grant admin access to a team member by email. Adding an email authorizes their Firebase account without storing passwords.
              </p>
            </div>
          </div>

          <form onSubmit={handleAddAdmin} className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <div className="flex-1 relative">
              <input
                type="email"
                required
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="e.g. admin@horlarlekx.com"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold shadow-lg transition-all flex items-center justify-center space-x-2 disabled:opacity-50 border border-cyan/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>{submitting ? 'Authorizing...' : 'Add Administrator'}</span>
            </button>
          </form>
        </div>

        {/* Authorized Administrators List Table */}
        <div className="bg-[#004880] rounded-2xl border border-cyan/20 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-cyan/20 flex items-center justify-between">
            <div className="flex items-center space-x-2 text-cyan">
              <ShieldCheck className="w-5 h-5" />
              <h3 className="text-lg font-bold text-white font-heading">Authorized Administrator Accounts</h3>
            </div>
            <span className="text-xs font-mono text-slate-300">
              Total: <strong className="text-white">{admins.length}</strong>
            </span>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                Loading authorized administrator accounts...
              </div>
            ) : admins.length === 0 ? (
              <div className="p-8 text-center text-slate-300 text-xs">
                No administrator records found.
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Email Address</th>
                    <th className="py-3.5 px-6">Admin Status</th>
                    <th className="py-3.5 px-6">Authorized By</th>
                    <th className="py-3.5 px-6">Date Added</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {admins.map((admin) => {
                    const isSelf = currentUser?.email && admin.email.toLowerCase() === currentUser.email.toLowerCase();
                    const isOnlyAdmin = admins.length <= 1;

                    return (
                      <tr key={admin.id} className="hover:bg-navy-900/60 transition-colors">
                        <td className="py-4 px-6 font-semibold text-white">
                          <div className="flex items-center space-x-2">
                            <span>{admin.email}</span>
                            {isSelf && (
                              <span className="px-2 py-0.5 rounded text-[10px] bg-cyan/20 text-cyan border border-cyan/30 font-mono font-bold">
                                You
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active Administrator
                          </span>
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                          {admin.addedBy || 'System'}
                        </td>
                        <td className="py-4 px-6 text-slate-300 font-mono text-[11px]">
                          {admin.createdAt ? (typeof admin.createdAt === 'string' ? admin.createdAt.slice(0, 10) : new Date(admin.createdAt.seconds * 1000).toLocaleDateString()) : 'N/A'}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => setAdminToDelete(admin)}
                            disabled={isOnlyAdmin}
                            title={isOnlyAdmin ? 'You must have at least one active administrator.' : 'Revoke Admin Access'}
                            className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white font-bold transition-all disabled:opacity-40 disabled:hover:bg-red-600/20 disabled:hover:text-red-300 flex items-center space-x-1 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Remove Access</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Security & Production Custom Claims Info Notice */}
        <div className="p-6 rounded-2xl bg-navy-900 border border-cyan/20 text-xs text-slate-300 space-y-2">
          <div className="flex items-center space-x-2 text-cyan font-bold text-sm">
            <Info className="w-4 h-4" />
            <span>Security & Custom Claims Architecture</span>
          </div>
          <p className="leading-relaxed">
            Authorized administrator emails registered above can access the Admin Dashboard.
          </p>
        </div>

      </div>

      {/* Confirmation Modal for Removing Admin Access */}
      {adminToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#004880] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-red-500/40 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Lock className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Confirm Revoking Administrator Access
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Are you sure you want to remove administrator access from user <strong className="text-white font-mono">{adminToDelete.email}</strong>?
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-navy-800">
              <button
                onClick={() => setAdminToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                Remove Access
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
