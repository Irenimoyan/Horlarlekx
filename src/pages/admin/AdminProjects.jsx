import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  getAllProjects, 
  updateProject, 
  deleteProject, 
  seedDefaultProjects,
  deduplicateFirestoreProjects 
} from '../../firebase/projects';
import { projectsData } from '../../data/projectsData';
import { 
  PlusCircle, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle, 
  FileEdit, 
  AlertTriangle,
  Loader2,
  ExternalLink,
  Building,
  Database,
  CloudUpload,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All'); // All, published, draft
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, name
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncMessage, setSyncMessage] = useState('');

  // Delete modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      let data = await getAllProjects();
      
      // Auto-seed Firestore from localStorage & default portfolio projects if database is empty
      if (!data || data.length === 0) {
        console.log('Firestore projects collection is empty. Auto-seeding from localStorage and default projects...');
        await seedDefaultProjects(projectsData, true);
        data = await getAllProjects();
      }
      
      setProjects(data || []);
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSyncProjects = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage('');
      const res = await seedDefaultProjects(projectsData, true);
      setSyncMessage(res.message || 'Projects successfully synchronized with Firebase database.');
      await fetchProjects();
    } catch (err) {
      alert(`Sync error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleCleanDuplicates = async () => {
    try {
      setIsSyncing(true);
      setSyncMessage('');
      const res = await deduplicateFirestoreProjects();
      setSyncMessage(res.message);
      await fetchProjects();
    } catch (err) {
      alert(`Deduplication error: ${err.message}`);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleToggleStatus = async (project) => {
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    try {
      await updateProject(project.id, {
        ...project,
        status: newStatus
      });
      fetchProjects();
    } catch (err) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  const confirmDelete = (project) => {
    setProjectToDelete(project);
    setDeleteModalOpen(true);
  };

  const handleDeleteProject = async () => {
    if (!projectToDelete) return;
    try {
      setIsDeleting(true);
      await deleteProject(projectToDelete.id, projectToDelete.images || []);
      setDeleteModalOpen(false);
      setProjectToDelete(null);
      await fetchProjects();
    } catch (err) {
      alert(`Failed to delete project: ${err.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  // Filter & Search & Sort Logic
  const filteredProjects = projects.filter((project) => {
    const matchesStatus = 
      statusFilter === 'All' ? true : project.status === statusFilter.toLowerCase();

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q ? true : (
      (project.title && project.title.toLowerCase().includes(q)) ||
      (project.location && project.location.toLowerCase().includes(q)) ||
      (project.projectType && project.projectType.toLowerCase().includes(q)) ||
      (project.category && project.category.toLowerCase().includes(q)) ||
      (project.servicesProvided && project.servicesProvided.some(s => s.toLowerCase().includes(q)))
    );

    return matchesStatus && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === 'newest') {
      const tA = a.createdAt?.seconds || 0;
      const tB = b.createdAt?.seconds || 0;
      return tB - tA;
    }
    if (sortBy === 'oldest') {
      const tA = a.createdAt?.seconds || 0;
      const tB = b.createdAt?.seconds || 0;
      return tA - tB;
    }
    if (sortBy === 'name') {
      return (a.title || '').localeCompare(b.title || '');
    }
    return 0;
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Project Portfolio Management
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              Create, edit, publish, draft, or delete project showcase entries in Firebase.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0 flex-wrap sm:flex-nowrap">
            <button
              onClick={handleCleanDuplicates}
              disabled={isSyncing}
              title="Scan and delete any duplicate project entries in Firebase database"
              className="px-3.5 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-amber-300 text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 border border-amber-500/30 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Clean Duplicates</span>
            </button>

            <button
              onClick={handleSyncProjects}
              disabled={isSyncing}
              title="Upload and sync all projects from localStorage and portfolio data into Firebase database"
              className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-cyan text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 border border-cyan/30 disabled:opacity-50"
            >
              {isSyncing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-cyan" />
                  <span>Syncing to Firebase...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Sync All to Firebase</span>
                </>
              )}
            </button>

            <Link
              to="/admin/projects/new"
              className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold transition-all shadow-lg flex items-center justify-center space-x-2 border border-cyan/40"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Add New Project</span>
            </Link>
          </div>
        </div>

        {syncMessage && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center justify-between shadow-lg">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{syncMessage}</span>
            </div>
            <button onClick={() => setSyncMessage('')} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {/* Search, Filter & Sort Bar */}
        <div className="bg-[#004880] p-4 rounded-2xl border border-cyan/20 shadow-xl grid grid-cols-1 sm:grid-cols-12 gap-4">
          
          {/* Search Box */}
          <div className="sm:col-span-6 relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, location, type, service..."
              className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan"
            />
          </div>

          {/* Status Filter */}
          <div className="sm:col-span-3 flex items-center space-x-2">
            <Filter className="w-4 h-4 text-cyan shrink-0" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full py-2.5 px-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan"
            >
              <option value="All">All Statuses</option>
              <option value="Published">Published Only</option>
              <option value="Draft">Drafts Only</option>
            </select>
          </div>

          {/* Sort By */}
          <div className="sm:col-span-3 flex items-center space-x-2">
            <ArrowUpDown className="w-4 h-4 text-cyan shrink-0" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-2.5 px-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="name">Sort: Project Name</option>
            </select>
          </div>

        </div>

        {/* Content Table / Cards */}
        <div className="bg-[#004880] rounded-2xl border border-cyan/20 shadow-xl overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-300 text-xs font-mono flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan" />
              <span>Fetching projects from Firestore...</span>
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <Building className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-slate-300 text-sm font-semibold">No matching projects found.</p>
              <p className="text-xs text-slate-400">Try clearing search filters or creating a new project.</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-200">
                  <thead className="bg-navy-950 text-slate-400 uppercase tracking-wider font-mono text-[11px]">
                    <tr>
                      <th className="py-4 px-6">Image</th>
                      <th className="py-4 px-6">Project Title</th>
                      <th className="py-4 px-6">Location</th>
                      <th className="py-4 px-6">Type / Category</th>
                      <th className="py-4 px-6">Status</th>
                      <th className="py-4 px-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-navy-800">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-navy-900/60 transition-colors">
                        <td className="py-3 px-6">
                          <div className="w-14 h-10 rounded-lg overflow-hidden bg-navy-950 border border-navy-700 shrink-0">
                            {project.images?.[0] ? (
                              <img
                                src={project.images[0]}
                                alt={project.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                                No Img
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-6 font-bold text-white max-w-xs">
                          <div className="truncate">{project.title}</div>
                          {project.featured && (
                            <span className="inline-block mt-0.5 text-[9px] font-extrabold uppercase px-2 py-0.5 rounded bg-accent/20 text-pink-300 border border-accent/40">
                              Featured
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-6 text-slate-300 max-w-xs truncate">
                          {project.location}
                        </td>
                        <td className="py-3 px-6 text-slate-300">
                          <span className="font-semibold block text-slate-200">{project.projectType || 'General'}</span>
                          <span className="text-[10px] text-cyan font-mono">{project.category}</span>
                        </td>
                        <td className="py-3 px-6">
                          <button
                            onClick={() => handleToggleStatus(project)}
                            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase transition-all ${
                              project.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30 hover:bg-amber-500/30'
                            }`}
                            title="Click to toggle Draft / Published"
                          >
                            {project.status === 'published' ? (
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
                        <td className="py-3 px-6 text-right">
                          <div className="flex items-center justify-end space-x-2">
                            {project.status === 'published' && project.slug && (
                              <Link
                                to={`/projects/${project.slug}`}
                                target="_blank"
                                className="p-2 rounded-lg bg-navy-900 text-slate-300 hover:text-cyan hover:bg-navy-800 transition-colors"
                                title="View Public Page"
                              >
                                <ExternalLink className="w-4 h-4" />
                              </Link>
                            )}
                            <Link
                              to={`/admin/projects/edit/${project.id}`}
                              className="p-2 rounded-lg bg-cyan/20 text-cyan hover:bg-cyan hover:text-white transition-colors"
                              title="Edit Project"
                            >
                              <Edit3 className="w-4 h-4" />
                            </Link>
                            <button
                              onClick={() => confirmDelete(project)}
                              className="p-2 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition-colors"
                              title="Delete Project"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View (375px+) */}
              <div className="md:hidden divide-y divide-navy-800">
                {filteredProjects.map((project) => (
                  <div key={project.id} className="p-4 space-y-3">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-navy-950 border border-navy-700 shrink-0">
                        {project.images?.[0] ? (
                          <img
                            src={project.images[0]}
                            alt={project.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-500">
                            No Img
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            project.status === 'published'
                              ? 'bg-emerald-500/20 text-emerald-400'
                              : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {project.status}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400">{project.year}</span>
                        </div>

                        <h4 className="text-sm font-bold text-white mt-1 leading-snug truncate">
                          {project.title}
                        </h4>
                        <p className="text-xs text-slate-400 truncate">{project.location}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-navy-800/60 text-xs">
                      <button
                        onClick={() => handleToggleStatus(project)}
                        className="text-cyan font-bold hover:underline text-[11px]"
                      >
                        Set to {project.status === 'published' ? 'Draft' : 'Published'}
                      </button>

                      <div className="flex items-center space-x-2">
                        {project.status === 'published' && project.slug && (
                          <Link
                            to={`/projects/${project.slug}`}
                            target="_blank"
                            className="p-1.5 rounded-lg bg-navy-900 text-slate-300 hover:text-cyan"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        )}
                        <Link
                          to={`/admin/projects/edit/${project.id}`}
                          className="px-3 py-1 rounded-lg bg-cyan text-white font-bold text-xs"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => confirmDelete(project)}
                          className="p-1.5 rounded-lg bg-red-600/20 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModalOpen && projectToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="bg-[#004880] rounded-2xl border border-red-500/40 p-6 max-w-md w-full shadow-2xl space-y-6">
              <div className="flex items-center space-x-3 text-red-400">
                <div className="p-3 rounded-full bg-red-500/20">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white font-heading">Delete Project?</h3>
                  <p className="text-xs text-red-300">This action cannot be undone.</p>
                </div>
              </div>

              <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 text-xs space-y-1">
                <p className="font-bold text-white">{projectToDelete.title}</p>
                <p className="text-slate-400">{projectToDelete.location}</p>
                <p className="text-slate-400">{projectToDelete.images?.length || 0} image(s) will be deleted.</p>
              </div>

              <p className="text-slate-200 text-xs leading-relaxed">
                Are you sure you want to permanently delete this project document and its associated media files from Firestore and Firebase Storage?
              </p>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setProjectToDelete(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteProject}
                  className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold shadow-lg flex items-center space-x-2"
                >
                  {isDeleting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Deleting...</span>
                    </>
                  ) : (
                    <span>Permanently Delete</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </AdminLayout>
  );
}
