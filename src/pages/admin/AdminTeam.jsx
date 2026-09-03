import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getAllTeamMembers, 
  deleteTeamMember, 
  seedDefaultTeamMembers, 
  updateTeamMember 
} from '../../firebase/team';
import { keyPersonnel } from '../../data/teamData';
import { 
  Users, 
  UserPlus, 
  Search, 
  CheckCircle, 
  FileEdit, 
  Trash2, 
  Edit, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  ArrowUpDown,
  Linkedin,
  Mail,
  Phone
} from 'lucide-react';

export default function AdminTeam() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filtering & search
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Deletion modal state
  const [memberToDelete, setMemberToDelete] = useState(null);

  const fetchMembers = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllTeamMembers();
      
      // Auto-seed if database is empty
      if (data.length === 0) {
        await seedDefaultTeamMembers(keyPersonnel);
        const seeded = await getAllTeamMembers();
        setMembers(seeded);
      } else {
        setMembers(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
      setError('Failed to load team members from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === 'published' ? 'draft' : 'published';
    try {
      await updateTeamMember(member.id, { ...member, status: newStatus });
      setSuccess(`Updated status for "${member.name}" to ${newStatus}.`);
      await fetchMembers();
    } catch (err) {
      console.error('Status update error:', err);
      setError('Failed to update status.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!memberToDelete) return;
    try {
      await deleteTeamMember(memberToDelete.id, memberToDelete.photoUrl);
      setSuccess(`Successfully deleted team member "${memberToDelete.name}".`);
      setMemberToDelete(null);
      await fetchMembers();
    } catch (err) {
      console.error('Delete member error:', err);
      setError(err.message || 'Failed to delete team member.');
      setMemberToDelete(null);
    }
  };

  // Filtered members list
  const filteredMembers = members.filter((m) => {
    const matchesSearch = 
      (m.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (m.role || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Team Member Management
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Add, edit, publish, or remove key personnel displayed on the public HORLARLEKX website.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchMembers}
              className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-cyan/20 text-xs font-bold transition-all flex items-center space-x-2"
              title="Refresh Team List"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/admin/team/new"
              className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold transition-all shadow-lg flex items-center space-x-2 border border-cyan/40"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add Team Member</span>
            </Link>
          </div>
        </div>

        {/* Alerts */}
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

        {/* Filters & Search */}
        <div className="bg-[#004880] p-4 rounded-2xl border border-cyan/20 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search team member by name or role..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <span className="text-xs text-slate-300 font-mono">Status:</span>
            <div className="flex bg-navy-950 p-1 rounded-xl border border-navy-800 text-xs">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'all' ? 'bg-cyan text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                All ({members.length})
              </button>
              <button
                onClick={() => setStatusFilter('published')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'published' ? 'bg-emerald-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Published ({members.filter(m => m.status === 'published').length})
              </button>
              <button
                onClick={() => setStatusFilter('draft')}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  statusFilter === 'draft' ? 'bg-amber-500 text-white shadow' : 'text-slate-400 hover:text-white'
                }`}
              >
                Draft ({members.filter(m => m.status === 'draft').length})
              </button>
            </div>
          </div>
        </div>

        {/* Team Members List Table */}
        <div className="bg-[#004880] rounded-2xl border border-cyan/20 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                Loading team members...
              </div>
            ) : filteredMembers.length === 0 ? (
              <div className="p-12 text-center space-y-3">
                <Users className="w-10 h-10 text-slate-500 mx-auto" />
                <p className="text-slate-300 text-sm font-medium">No team members match your criteria.</p>
                <Link
                  to="/admin/team/new"
                  className="px-4 py-2 rounded-xl bg-cyan text-white text-xs font-bold hover:bg-cyan-hover inline-block"
                >
                  Add Team Member
                </Link>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Member</th>
                    <th className="py-3.5 px-6">Position / Role</th>
                    <th className="py-3.5 px-6">Experience</th>
                    <th className="py-3.5 px-6">Order</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-navy-900/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-navy-950 border border-navy-800 shrink-0">
                            {member.photoUrl ? (
                              <img src={member.photoUrl} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-slate-500 font-bold">
                                {member.name?.[0] || 'T'}
                              </div>
                            )}
                          </div>
                          <div>
                            <span className="font-bold text-white block">{member.name}</span>
                            {member.email && (
                              <span className="text-[11px] text-slate-400 flex items-center space-x-1">
                                <Mail className="w-3 h-3 text-cyan shrink-0" />
                                <span>{member.email}</span>
                              </span>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-medium">
                        {member.role}
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono">
                        {member.yearsOfExperience ? `${member.yearsOfExperience} Yrs` : 'N/A'}
                      </td>
                      <td className="py-4 px-6 font-mono font-bold text-cyan">
                        #{member.displayOrder || 1}
                      </td>
                      <td className="py-4 px-6">
                        <button
                          onClick={() => handleToggleStatus(member)}
                          className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                            member.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                          }`}
                        >
                          {member.status === 'published' ? (
                            <>
                              <CheckCircle className="w-3 h-3" />
                              <span>Published</span>
                            </>
                          ) : (
                            <>
                              <FileEdit className="w-3 h-3" />
                              <span>Draft</span>
                            </>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          to={`/admin/team/edit/${member.id}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan hover:text-white font-bold transition-colors inline-flex items-center space-x-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>Edit</span>
                        </Link>

                        <button
                          onClick={() => setMemberToDelete(member)}
                          className="px-3 py-1.5 rounded-lg bg-red-600/20 text-red-300 hover:bg-red-600 hover:text-white font-bold transition-colors inline-flex items-center space-x-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {memberToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-[#004880] max-w-md w-full p-6 sm:p-8 rounded-3xl border border-red-500/40 shadow-2xl space-y-5">
            <div className="w-12 h-12 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                Confirm Delete Team Member
              </h3>
              <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                Are you sure you want to permanently delete team member <strong className="text-white font-bold">{memberToDelete.name}</strong>? This action cannot be undone.
              </p>
            </div>

            <div className="flex items-center justify-end space-x-3 pt-2 border-t border-navy-800">
              <button
                onClick={() => setMemberToDelete(null)}
                className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg"
              >
                Delete Member
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
