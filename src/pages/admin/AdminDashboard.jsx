import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllProjects, seedDefaultProjects } from '../../firebase/projects';
import { getAllTeamMembers } from '../../firebase/team';
import { projectsData } from '../../data/projectsData';
import { 
  FolderKanban, 
  CheckCircle, 
  FileEdit, 
  Star, 
  PlusCircle, 
  ArrowRight, 
  RefreshCw, 
  Database,
  Users,
  UserPlus,
  ShieldCheck,
  Building,
  AlertCircle
} from 'lucide-react';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [seeding, setSeeding] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [projData, teamData] = await Promise.all([
        getAllProjects(),
        getAllTeamMembers()
      ]);
      setProjects(projData);
      setTeamMembers(teamData);
    } catch (err) {
      console.warn('Dashboard fetch error:', err.message);
      setError(err.message || 'Failed to load data from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSeedData = async () => {
    if (!window.confirm('Import all default static projects into Firestore database?')) {
      return;
    }
    try {
      setSeeding(true);
      setSeedStatus('Importing default projects...');
      const res = await seedDefaultProjects(projectsData);
      setSeedStatus(res.message);
      await fetchDashboardData();
    } catch (err) {
      console.error('Seeding error:', err);
      setSeedStatus(`Import failed: ${err.message}`);
    } finally {
      setSeeding(false);
    }
  };

  // Metrics
  const totalProjects = projects.length;
  const publishedProjects = projects.filter((p) => p.status === 'published').length;
  const draftProjects = projects.filter((p) => p.status === 'draft').length;
  
  const totalTeamMembers = teamMembers.length;
  const publishedTeamMembers = teamMembers.filter((m) => m.status === 'published').length;

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Dashboard Overview
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Welcome back. Manage portfolio, team members, media library, and admin permissions.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchDashboardData}
              className="p-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white border border-cyan/20 text-xs font-bold transition-all flex items-center space-x-2"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-cyan' : ''}`} />
              <span className="hidden sm:inline">Refresh</span>
            </button>

            <Link
              to="/admin/projects/new"
              className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold transition-all shadow-lg flex items-center space-x-2 border border-cyan/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {/* Status Alerts */}
        {seedStatus && (
          <div className="p-4 rounded-xl bg-cyan/10 border border-cyan/40 text-cyan text-xs font-semibold flex items-center justify-between">
            <span>{seedStatus}</span>
            <button onClick={() => setSeedStatus('')} className="text-slate-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-200 text-xs flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block text-amber-300">Firebase Firestore Notice</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Overview Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          
          {/* Total Projects */}
          <div className="bg-[#004880] p-5 rounded-2xl border border-cyan/20 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider font-mono">Projects</span>
              <div className="p-2 rounded-xl bg-navy-900 text-cyan">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">
              {loading ? '...' : totalProjects}
            </div>
            <p className="text-[10px] text-slate-300">Total portfolio items</p>
          </div>

          {/* Published Projects */}
          <div className="bg-[#004880] p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-mono">Published</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">
              {loading ? '...' : publishedProjects}
            </div>
            <p className="text-[10px] text-slate-300">Live projects</p>
          </div>

          {/* Draft Projects */}
          <div className="bg-[#004880] p-5 rounded-2xl border border-amber-500/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider font-mono">Drafts</span>
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <FileEdit className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">
              {loading ? '...' : draftProjects}
            </div>
            <p className="text-[10px] text-slate-300">Unpublished drafts</p>
          </div>

          {/* Team Members */}
          <div className="bg-[#004880] p-5 rounded-2xl border border-cyan/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-cyan uppercase tracking-wider font-mono">Team</span>
              <div className="p-2 rounded-xl bg-cyan/20 text-cyan">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">
              {loading ? '...' : totalTeamMembers}
            </div>
            <p className="text-[10px] text-slate-300">Total key personnel</p>
          </div>

          {/* Published Team Members */}
          <div className="bg-[#004880] p-5 rounded-2xl border border-emerald-500/30 shadow-xl space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-emerald-300 uppercase tracking-wider font-mono">Live Team</span>
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-black text-white font-heading">
              {loading ? '...' : publishedTeamMembers}
            </div>
            <p className="text-[10px] text-slate-300">Published on website</p>
          </div>

        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Add Project Card */}
          <Link 
            to="/admin/projects/new" 
            className="group bg-gradient-to-br from-[#004880] to-navy-900 p-6 rounded-2xl border border-cyan/30 hover:border-cyan transition-all shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <PlusCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan transition-colors">
                Create New Project
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Add facade, cladding, or signage projects with image uploads, video walkthroughs, and description breakdown.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan group-hover:translate-x-1 transition-transform">
              <span>Launch Project Form</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Add Team Member Card */}
          <Link 
            to="/admin/team/new" 
            className="group bg-gradient-to-br from-[#004880] to-navy-900 p-6 rounded-2xl border border-cyan/30 hover:border-cyan transition-all shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <UserPlus className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan transition-colors">
                Add Team Member
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Register key personnel with professional photo uploads, LinkedIn links, position details, and display ordering.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan group-hover:translate-x-1 transition-transform">
              <span>Add Personnel</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

          {/* Admin Allowlist Card */}
          <Link 
            to="/admin/administrators" 
            className="group bg-gradient-to-br from-[#004880] to-navy-900 p-6 rounded-2xl border border-cyan/30 hover:border-cyan transition-all shadow-xl space-y-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan/20 text-cyan flex items-center justify-center group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white font-heading group-hover:text-cyan transition-colors">
                Manage Administrators
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Authorize administrator email addresses for strict access control and manage access permissions.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan group-hover:translate-x-1 transition-transform">
              <span>View Allowlist</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </Link>

        </div>

        {/* Recent Projects Preview Table */}
        <div className="bg-[#004880] rounded-2xl border border-cyan/20 shadow-xl overflow-hidden">
          <div className="p-6 border-b border-cyan/20 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white font-heading">Recent Portfolio Additions</h3>
              <p className="text-xs text-slate-300 mt-0.5">Projects registered</p>
            </div>
            <Link 
              to="/admin/projects"
              className="text-xs font-bold text-cyan hover:underline flex items-center space-x-1"
            >
              <span>View All Projects</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            {loading ? (
              <div className="p-8 text-center text-slate-400 text-xs font-mono">
                Loading project records...
              </div>
            ) : projects.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <Building className="w-12 h-12 text-slate-500 mx-auto" />
                <p className="text-slate-300 text-sm font-medium">No projects found yet.</p>
                <div className="flex justify-center space-x-4">
                  <Link
                    to="/admin/projects/new"
                    className="px-4 py-2 rounded-xl bg-cyan text-white text-xs font-bold hover:bg-cyan-hover"
                  >
                    Add First Project
                  </Link>
                  <button
                    onClick={handleSeedData}
                    className="px-4 py-2 rounded-xl bg-navy-900 border border-cyan/30 text-cyan text-xs font-bold hover:bg-navy-800"
                  >
                    Import 15+ Default Projects
                  </button>
                </div>
              </div>
            ) : (
              <table className="w-full text-left text-xs text-slate-200">
                <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                  <tr>
                    <th className="py-3.5 px-6">Project Title</th>
                    <th className="py-3.5 px-6">Type & Location</th>
                    <th className="py-3.5 px-6">Year</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-navy-800">
                  {projects.slice(0, 5).map((project) => (
                    <tr key={project.id} className="hover:bg-navy-900/60 transition-colors">
                      <td className="py-4 px-6 font-semibold text-white max-w-xs truncate">
                        {project.title}
                      </td>
                      <td className="py-4 px-6 text-slate-300">
                        <span className="block font-medium">{project.projectType || project.category}</span>
                        <span className="text-[11px] text-slate-400">{project.location}</span>
                      </td>
                      <td className="py-4 px-6 text-slate-300 font-mono">
                        {project.year}
                      </td>
                      <td className="py-4 px-6">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                          project.status === 'published'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {project.status === 'published' ? 'Published' : 'Draft'}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="px-3 py-1.5 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan hover:text-white font-bold transition-colors inline-block"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}
