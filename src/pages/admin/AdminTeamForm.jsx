import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  createTeamMember, 
  updateTeamMember, 
  getTeamMemberById, 
  uploadTeamPhoto 
} from '../../firebase/team';
import { 
  UserPlus, 
  ArrowLeft, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Linkedin, 
  Mail, 
  Phone, 
  Layers, 
  Eye
} from 'lucide-react';

export default function AdminTeamForm() {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    bio: '',
    yearsOfExperience: '',
    photoUrl: '',
    linkedin: '',
    email: '',
    phone: '',
    displayOrder: 1,
    status: 'published'
  });

  useEffect(() => {
    if (isEditing) {
      const loadMember = async () => {
        try {
          setLoading(true);
          const data = await getTeamMemberById(id);
          if (data) {
            setFormData({
              name: data.name || '',
              role: data.role || '',
              bio: data.bio || '',
              yearsOfExperience: data.yearsOfExperience || '',
              photoUrl: data.photoUrl || '',
              linkedin: data.linkedin || '',
              email: data.email || '',
              phone: data.phone || '',
              displayOrder: Number(data.displayOrder) || 1,
              status: data.status || 'published'
            });
          } else {
            setError('Team member not found.');
          }
        } catch (err) {
          console.error('Error loading team member:', err);
          setError('Failed to load team member data.');
        } finally {
          setLoading(false);
        }
      };
      loadMember();
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setUploadingPhoto(true);
    setUploadProgress(0);

    try {
      const downloadUrl = await uploadTeamPhoto(file, (progress) => {
        setUploadProgress(progress);
      });
      setFormData((prev) => ({
        ...prev,
        photoUrl: downloadUrl
      }));
      setSuccess('Professional photo uploaded successfully to Firebase Storage.');
    } catch (err) {
      console.error('Photo upload error:', err);
      setError(err.message || 'Failed to upload photo.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name.trim() || !formData.role.trim()) {
      setError('Please provide at least Full Name and Job Title / Position.');
      return;
    }

    try {
      setSaving(true);
      if (isEditing) {
        await updateTeamMember(id, formData);
        setSuccess('Team member updated successfully.');
      } else {
        await createTeamMember(formData);
        setSuccess('Team member created and published successfully.');
      }
      setTimeout(() => {
        navigate('/admin/team');
      }, 1000);
    } catch (err) {
      console.error('Error saving team member:', err);
      setError(err.message || 'Failed to save team member.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-white">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-cyan mb-2" />
          <p className="text-xs font-mono text-slate-300">Loading team member details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <Link
              to="/admin/team"
              className="inline-flex items-center space-x-1.5 text-xs text-cyan hover:underline mb-2 font-mono"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Team Members</span>
            </Link>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              {isEditing ? 'Edit Team Member' : 'Add New Team Member'}
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Fill in key details, upload a professional photo, and set display status.
            </p>
          </div>
        </div>

        {/* Feedback Alerts */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
                Full Name <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. John Doe"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

            {/* Position / Role */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
                Position / Job Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                name="role"
                required
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Project Manager / Lead Fabricator"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

            {/* Years of Experience */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
                Years of Experience
              </label>
              <input
                type="text"
                name="yearsOfExperience"
                value={formData.yearsOfExperience}
                onChange={handleChange}
                placeholder="e.g. 8"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

            {/* Display Order */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
                Display Order (Numeric Sorting)
              </label>
              <input
                type="number"
                name="displayOrder"
                min="1"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-1">
                <Linkedin className="w-3.5 h-3.5 text-cyan" />
                <span>LinkedIn Profile URL</span>
              </label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/username"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-200 uppercase font-mono flex items-center space-x-1">
                <Mail className="w-3.5 h-3.5 text-cyan" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="team@horlarlekx.com"
                className="w-full bg-navy-950 border border-navy-800 rounded-xl px-4 py-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan"
              />
            </div>

          </div>

          {/* Biography */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
              Biography & Role Description
            </label>
            <textarea
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              placeholder="Describe professional experience, leadership, key achievements, and project involvement..."
              className="w-full bg-navy-950 border border-navy-800 rounded-xl p-4 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan leading-relaxed"
            />
          </div>

          {/* Photo Upload Section */}
          <div className="space-y-3 pt-2">
            <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
              Professional Photo (Firebase Storage)
            </label>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-24 h-24 rounded-2xl overflow-hidden bg-navy-950 border border-navy-800 shrink-0 shadow-inner flex items-center justify-center">
                {formData.photoUrl ? (
                  <img src={formData.photoUrl} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <Eye className="w-8 h-8 text-slate-600" />
                )}
              </div>

              <div className="flex-1 space-y-2">
                <label className="cursor-pointer inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-cyan text-xs font-bold border border-cyan/30 transition-colors">
                  {uploadingPhoto ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                      <span>Uploading ({uploadProgress}%)...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Upload Professional Photo</span>
                    </>
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handlePhotoUpload}
                    disabled={uploadingPhoto}
                    className="hidden"
                  />
                </label>
                <p className="text-[11px] text-slate-400">
                  Accepted formats: WebP, JPEG, PNG. Max file size: 10MB. Automatically optimized for web fast loading.
                </p>
                {formData.photoUrl && (
                  <input
                    type="text"
                    readOnly
                    value={formData.photoUrl}
                    className="w-full bg-navy-950/60 border border-navy-800 rounded-lg px-3 py-1.5 text-[11px] font-mono text-slate-400 truncate"
                  />
                )}
              </div>
            </div>
          </div>

          {/* Status Selection */}
          <div className="space-y-2 pt-2 border-t border-navy-800">
            <label className="block text-xs font-bold text-slate-200 uppercase font-mono">
              Publication Status
            </label>
            <div className="flex items-center space-x-6 pt-1">
              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-200 font-bold">
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={formData.status === 'published'}
                  onChange={handleChange}
                  className="accent-emerald-400 w-4 h-4"
                />
                <span className="text-emerald-400">Published (Visible on Public Website)</span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer text-xs text-slate-200 font-bold">
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={formData.status === 'draft'}
                  onChange={handleChange}
                  className="accent-amber-400 w-4 h-4"
                />
                <span className="text-amber-300">Draft (Admin Dashboard Only)</span>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-4 pt-4 border-t border-navy-800">
            <Link
              to="/admin/team"
              className="px-5 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 text-xs font-bold"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving || uploadingPhoto}
              className="px-6 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-2 border border-cyan/40 disabled:opacity-50"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>{isEditing ? 'Save Changes' : 'Create & Publish Team Member'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
