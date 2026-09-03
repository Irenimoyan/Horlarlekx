import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAllProjects } from '../../firebase/projects';
import { Image as ImageIcon, ExternalLink, Loader2, Search, FolderKanban } from 'lucide-react';

export default function AdminMedia() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        setLoading(true);
        const data = await getAllProjects();
        setProjects(data);
      } catch (err) {
        console.error('Media fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMedia();
  }, []);

  // Consolidate all images across projects
  const mediaItems = [];
  projects.forEach((proj) => {
    if (Array.isArray(proj.images)) {
      proj.images.forEach((imgUrl, idx) => {
        mediaItems.push({
          id: `${proj.id}-${idx}`,
          url: imgUrl,
          projectId: proj.id,
          projectTitle: proj.title,
          projectSlug: proj.slug,
          isFeatured: proj.featuredImage === imgUrl || idx === 0,
        });
      });
    }
  });

  const filteredMedia = mediaItems.filter((item) => {
    if (!search) return true;
    return item.projectTitle?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <AdminLayout>
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-cyan/20">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
              Media Gallery Management
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm mt-1">
              View uploaded architectural photos across all project showcases.
            </p>
          </div>

          <div className="flex items-center space-x-2 text-xs font-mono bg-navy-900 px-4 py-2 rounded-xl border border-cyan/20 text-cyan">
            <ImageIcon className="w-4 h-4" />
            <span>{mediaItems.length} Photos Registered</span>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-[#004880] p-4 rounded-2xl border border-cyan/20 shadow-xl">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <Search className="w-4 h-4" />
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search media by project title..."
              className="w-full pl-10 pr-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-400 text-xs focus:outline-none focus:border-cyan"
            />
          </div>
        </div>

        {/* Media Grid */}
        <div className="bg-[#004880] p-6 rounded-2xl border border-cyan/20 shadow-xl">
          {loading ? (
            <div className="p-12 text-center text-slate-300 text-xs font-mono flex items-center justify-center space-x-2">
              <Loader2 className="w-5 h-5 animate-spin text-cyan" />
              <span>Gathering project media assets...</span>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="p-12 text-center space-y-3">
              <ImageIcon className="w-10 h-10 text-slate-500 mx-auto" />
              <p className="text-slate-300 text-sm font-semibold">No media images found.</p>
              <p className="text-xs text-slate-400">Upload images by creating or editing a project.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredMedia.map((item) => (
                <div 
                  key={item.id}
                  className="group relative bg-navy-950 rounded-xl overflow-hidden border border-navy-700 aspect-square shadow-md flex flex-col justify-between"
                >
                  <img
                    src={item.url}
                    alt={item.projectTitle}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Project Tag Overlay */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-2.5 text-[10px] text-slate-200">
                    <p className="font-bold text-white truncate">{item.projectTitle}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-[9px] text-cyan font-mono">
                        {item.isFeatured ? 'Featured' : 'Photo'}
                      </span>
                      <Link
                        to={`/admin/projects/edit/${item.projectId}`}
                        className="text-slate-300 hover:text-white flex items-center space-x-0.5 font-bold"
                      >
                        <span>Manage</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </AdminLayout>
  );
}
