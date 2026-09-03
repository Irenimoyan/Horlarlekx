import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { 
  createProject, 
  updateProject, 
  getProjectById, 
  uploadProjectImages,
  generateSlug 
} from '../../firebase/projects';
import { 
  ArrowLeft, 
  Upload, 
  Trash2, 
  Star, 
  ArrowUp, 
  ArrowDown, 
  Check, 
  Loader2, 
  Video, 
  Plus,
  Image as ImageIcon,
  CheckCircle2,
  FileEdit,
  Globe
} from 'lucide-react';

const PROJECT_TYPES = [
  'Residential',
  'Commercial',
  'Industrial',
  'Institutional',
  'Corporate',
  'Other'
];

const AVAILABLE_SERVICES = [
  'ACP / ALUCOBOND Cladding',
  'Exterior Building Cladding',
  'Building Facade Solutions',
  '3D Architectural Designs',
  'Floating Panels',
  'Signage',
  'Pylon Signs',
  'Aluminium Works',
  'Glass Installation',
  'Glass Railings',
  'Aluminium Roofing',
  'Carpentry Works',
  'Furniture',
  'Metal Works',
  'Suspended Ceilings',
  'General Contracting',
  'Building Finishing',
  'Corporate & Commercial Branding',
  'Other'
];

export default function AdminProjectForm() {
  const { id } = useParams(); // If present, edit mode
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  // Form State
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [projectType, setProjectType] = useState('Commercial');
  const [category, setCategory] = useState('ACP/ALUCOBOND');
  const [client, setClient] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [overview, setOverview] = useState('');
  const [challenge, setChallenge] = useState('');
  const [solution, setSolution] = useState('');
  const [selectedServices, setSelectedServices] = useState([]);
  const [duration, setDuration] = useState('');
  const [status, setStatus] = useState('published'); // draft or published
  const [featured, setFeatured] = useState(false);
  const [videoUrlInput, setVideoUrlInput] = useState('');
  const [videos, setVideos] = useState([]);

  // Image State
  const [images, setImages] = useState([]); // array of image download URLs
  const [featuredImage, setFeaturedImage] = useState('');
  const [uploadProgress, setUploadProgress] = useState(null);

  // Status
  const [loadingInitial, setLoadingInitial] = useState(isEditMode);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isEditMode) {
      const loadProject = async () => {
        try {
          setLoadingInitial(true);
          const data = await getProjectById(id);
          if (data) {
            setTitle(data.title || '');
            setLocation(data.location || '');
            setYear(data.year || '');
            setProjectType(data.projectType || 'Commercial');
            setCategory(data.category || 'ACP/ALUCOBOND');
            setClient(data.client || '');
            setShortDescription(data.shortDescription || '');
            setOverview(data.overview || data.description || '');
            setChallenge(data.challenge || '');
            setSolution(data.solution || '');
            setSelectedServices(data.servicesProvided || []);
            setDuration(data.duration || '');
            setStatus(data.status || 'draft');
            setFeatured(Boolean(data.featured));
            setImages(data.images || []);
            setFeaturedImage(data.featuredImage || (data.images?.[0] || ''));
            setVideos(data.videos || []);
          } else {
            setError('Project not found.');
          }
        } catch (err) {
          setError(err.message || 'Failed to load project details.');
        } finally {
          setLoadingInitial(false);
        }
      };
      loadProject();
    }
  }, [id, isEditMode]);

  // Slug calculation preview
  const slugPreview = generateSlug(title);

  // Service toggle handler
  const handleServiceToggle = (service) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter((s) => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  // Image Upload Handler
  const handleImageFilesSelected = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setError('');
    try {
      setUploadProgress({ message: 'Preparing image optimization...' });
      const uploadedUrls = await uploadProjectImages(files, (progress) => {
        setUploadProgress(progress);
      });

      const updatedImages = [...images, ...uploadedUrls];
      setImages(updatedImages);
      if (!featuredImage && updatedImages.length > 0) {
        setFeaturedImage(updatedImages[0]);
      }
      setUploadProgress(null);
    } catch (err) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload images.');
      setUploadProgress(null);
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    const updated = images.filter((_, idx) => idx !== indexToRemove);
    setImages(updated);
    if (featuredImage === images[indexToRemove]) {
      setFeaturedImage(updated[0] || '');
    }
  };

  const handleMoveImage = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    const copy = [...images];
    const temp = copy[index];
    copy[index] = copy[newIndex];
    copy[newIndex] = temp;
    setImages(copy);
  };

  // Add Video URL
  const handleAddVideo = () => {
    if (!videoUrlInput.trim()) return;
    setVideos([...videos, videoUrlInput.trim()]);
    setVideoUrlInput('');
  };

  const handleRemoveVideo = (index) => {
    setVideos(videos.filter((_, i) => i !== index));
  };

  // Submit Handler
  const handleSubmit = async (e, targetStatus) => {
    if (e) e.preventDefault();
    setError('');

    const finalStatus = targetStatus || status;

    // Validation
    if (!title.trim()) {
      setError('Project Name is required.');
      return;
    }
    if (!location.trim()) {
      setError('Project Location is required.');
      return;
    }

    if (finalStatus === 'published') {
      if (selectedServices.length === 0) {
        setError('Please select at least one Service Provided before publishing.');
        return;
      }
      if (images.length === 0) {
        setError('Please upload at least one Project Image before publishing.');
        return;
      }
    }

    const payload = {
      title: title.trim(),
      location: location.trim(),
      year: year.trim() || new Date().getFullYear().toString(),
      projectType,
      category,
      client: client.trim(),
      shortDescription: shortDescription.trim(),
      overview: overview.trim(),
      description: overview.trim(),
      challenge: challenge.trim(),
      solution: solution.trim(),
      servicesProvided: selectedServices,
      duration: duration.trim(),
      status: finalStatus,
      featured,
      images,
      featuredImage: featuredImage || images[0] || '',
      videos,
    };

    try {
      setIsSaving(true);
      if (isEditMode) {
        await updateProject(id, payload);
      } else {
        await createProject(payload);
      }
      navigate('/admin/projects');
    } catch (err) {
      console.error('Save error:', err);
      setError(err.message || 'Failed to save project document.');
    } finally {
      setIsSaving(false);
    }
  };

  if (loadingInitial) {
    return (
      <AdminLayout>
        <div className="p-12 text-center text-slate-300 text-xs font-mono flex items-center justify-center space-x-2">
          <Loader2 className="w-5 h-5 animate-spin text-cyan" />
          <span>Loading project record...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-6 border-b border-cyan/20">
          <div className="flex items-center space-x-3">
            <Link
              to="/admin/projects"
              className="p-2 rounded-xl bg-navy-900 text-slate-300 hover:text-white hover:bg-navy-800 border border-cyan/20 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
                {isEditMode ? 'Edit Project Entry' : 'Add New Project'}
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-0.5">
                {isEditMode ? `Updating project ID: ${id}` : 'Fill in project details and media uploads.'}
              </p>
            </div>
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-200 text-xs font-semibold">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={(e) => handleSubmit(e, status)} className="space-y-8">
          
          {/* Section 1: Basic Project Info */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white font-heading border-b border-cyan/20 pb-3 flex items-center space-x-2">
              <span>1. Basic Project Details</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Project Name */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Project Name / Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. SANY Nigeria Company Limited - ACP Board & 3D Signage"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
                {slugPreview && (
                  <p className="text-[11px] text-cyan font-mono pt-1">
                    Auto Slug: /projects/{slugPreview}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Location *
                </label>
                <input
                  type="text"
                  required
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Fatgbems, Along Ibadan Expressway, Lagos State"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
              </div>

              {/* Year Completed */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Year Completed
                </label>
                <input
                  type="text"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  placeholder="e.g. 2026"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
              </div>

              {/* Project Type */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Project Type
                </label>
                <select
                  value={projectType}
                  onChange={(e) => setProjectType(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                >
                  {PROJECT_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Primary Category Tag
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                >
                  <option value="ACP/ALUCOBOND">ACP/ALUCOBOND</option>
                  <option value="Facades">Facades</option>
                  <option value="Signage">Signage</option>
                  <option value="Aluminium">Aluminium</option>
                  <option value="Glass">Glass</option>
                  <option value="Roofing">Roofing</option>
                  <option value="3D Designs">3D Designs</option>
                  <option value="Carpentry">Carpentry</option>
                  <option value="General Construction">General Construction</option>
                </select>
              </div>

              {/* Client */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Client Entity / Type
                </label>
                <input
                  type="text"
                  value={client}
                  onChange={(e) => setClient(e.target.value)}
                  placeholder="e.g. Private Residential / Corporate Entity"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
              </div>

              {/* Duration */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Project Duration
                </label>
                <input
                  type="text"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="e.g. 2 Days / 3 Weeks"
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
              </div>

            </div>
          </div>

          {/* Section 2: Narrative & Descriptions */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white font-heading border-b border-cyan/20 pb-3">
              2. Descriptions, Challenges & Solutions
            </h3>

            <div className="space-y-6">
              
              {/* Short Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Short Summary (Used for cards)
                </label>
                <input
                  type="text"
                  value={shortDescription}
                  onChange={(e) => setShortDescription(e.target.value)}
                  placeholder="Brief 1-2 sentence summary..."
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                />
              </div>

              {/* Full Overview */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Comprehensive Project Overview
                </label>
                <textarea
                  rows={4}
                  value={overview}
                  onChange={(e) => setOverview(e.target.value)}
                  placeholder="Detailed description of execution, site scope, materials, and handover..."
                  className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan leading-relaxed"
                />
              </div>

              {/* Challenge & Solution Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider font-mono">
                    The Challenge
                  </label>
                  <textarea
                    rows={3}
                    value={challenge}
                    onChange={(e) => setChallenge(e.target.value)}
                    placeholder="Specific architectural, weather, or site height challenges..."
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono">
                    HORLAR Service
                  </label>
                  <textarea
                    rows={3}
                    value={solution}
                    onChange={(e) => setSolution(e.target.value)}
                    placeholder="Engineering methodology and fabrication strategy..."
                    className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Section 3: Services Provided Multi-Select */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <div className="flex items-center justify-between border-b border-cyan/20 pb-3">
              <h3 className="text-lg font-bold text-white font-heading">
                3. Services Provided (Multi-select)
              </h3>
              <span className="text-xs font-mono text-cyan">
                {selectedServices.length} selected
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {AVAILABLE_SERVICES.map((service) => {
                const isSelected = selectedServices.includes(service);
                return (
                  <button
                    key={service}
                    type="button"
                    onClick={() => handleServiceToggle(service)}
                    className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-left transition-all ${
                      isSelected
                        ? 'bg-cyan text-white shadow-md border border-cyan'
                        : 'bg-navy-950 text-slate-300 hover:text-white border border-navy-800'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded flex items-center justify-center border ${
                      isSelected ? 'bg-white border-white text-cyan' : 'border-slate-500'
                    }`}>
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span className="truncate">{service}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 4: Image Uploads & Featured Image */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <div className="border-b border-cyan/20 pb-3 flex items-center justify-between">
              <h3 className="text-lg font-bold text-white font-heading">
                4. Project Images (Firebase Storage)
              </h3>
              <span className="text-xs font-mono text-slate-300">
                {images.length} Image(s) Attached
              </span>
            </div>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-cyan/40 hover:border-cyan bg-navy-950/60 p-6 rounded-2xl text-center transition-colors">
              <Upload className="w-10 h-10 text-cyan mx-auto mb-2" />
              <p className="text-sm font-bold text-white font-heading">
                Upload High-Resolution Project Images
              </p>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                JPEG, PNG, WebP supported up to 15MB. Images are automatically optimized before storage upload.
              </p>

              <label className="mt-4 inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold shadow-lg cursor-pointer transition-all">
                <ImageIcon className="w-4 h-4" />
                <span>Select Files to Upload</span>
                <input
                  type="file"
                  multiple
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleImageFilesSelected}
                  className="hidden"
                />
              </label>
            </div>

            {/* Upload Progress Bar */}
            {uploadProgress && (
              <div className="p-4 rounded-xl bg-navy-900 border border-cyan/40 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-cyan">
                  <span>{uploadProgress.message || 'Uploading...'}</span>
                  <span>{uploadProgress.fileProgress || ''}</span>
                </div>
                <div className="w-full h-2 bg-navy-950 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-cyan transition-all duration-300"
                    style={{ width: `${uploadProgress.fileProgress || 0}%` }}
                  />
                </div>
              </div>
            )}

            {/* Image Preview Grid */}
            {images.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs font-mono text-slate-300">
                  Select a photo to set as Featured Hero Image, or reorder/remove images:
                </p>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {images.map((imgUrl, idx) => {
                    const isFeatured = featuredImage === imgUrl || (!featuredImage && idx === 0);
                    return (
                      <div
                        key={idx}
                        className={`relative group rounded-xl overflow-hidden border-2 bg-navy-950 aspect-video shadow-md ${
                          isFeatured ? 'border-accent shadow-accent/20' : 'border-navy-700'
                        }`}
                      >
                        <img
                          src={imgUrl}
                          alt={`Project img ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />

                        {/* Top Badges */}
                        <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setFeaturedImage(imgUrl)}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-1 ${
                              isFeatured ? 'bg-accent text-white' : 'bg-black/60 text-slate-300 hover:text-white'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${isFeatured ? 'fill-white' : ''}`} />
                            <span>{isFeatured ? 'Featured Hero' : 'Set Featured'}</span>
                          </button>
                        </div>

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'up')}
                              className="p-1.5 rounded-lg bg-navy-900 text-white hover:bg-cyan"
                              title="Move Left"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                          )}
                          {idx < images.length - 1 && (
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'down')}
                              className="p-1.5 rounded-lg bg-navy-900 text-white hover:bg-cyan"
                              title="Move Right"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="p-1.5 rounded-lg bg-red-600 text-white hover:bg-red-700"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>

          {/* Section 5: Project Video Walkthroughs */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white font-heading border-b border-cyan/20 pb-3 flex items-center space-x-2">
              <Video className="w-5 h-5 text-amber-400" />
              <span>5. Project Video Links (YouTube / Vimeo / MP4 URL)</span>
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                value={videoUrlInput}
                onChange={(e) => setVideoUrlInput(e.target.value)}
                placeholder="Paste video URL (e.g. https://www.youtube.com/watch?v=... or direct MP4 link)"
                className="flex-1 px-4 py-2.5 bg-navy-950 border border-navy-700 rounded-xl text-white text-xs focus:outline-none focus:border-cyan"
              />
              <button
                type="button"
                onClick={handleAddVideo}
                className="px-4 py-2.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold flex items-center space-x-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Add Video</span>
              </button>
            </div>

            {videos.length > 0 && (
              <div className="space-y-2">
                {videos.map((vid, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-navy-950 border border-navy-800 text-xs">
                    <span className="text-slate-300 font-mono truncate max-w-md">{vid}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveVideo(idx)}
                      className="text-red-400 hover:text-white p-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Section 6: Status & Publication Controls */}
          <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-6">
            <h3 className="text-lg font-bold text-white font-heading border-b border-cyan/20 pb-3">
              6. Visibility & Publication Settings
            </h3>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              {/* Draft / Published Radio */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Publication Status
                </span>
                <div className="flex items-center space-x-4">
                  <label className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border ${
                    status === 'published' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' : 'bg-navy-950 text-slate-400 border-navy-800'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="published"
                      checked={status === 'published'}
                      onChange={() => setStatus('published')}
                      className="hidden"
                    />
                    <Globe className="w-4 h-4" />
                    <span>Published (Visible Publicly)</span>
                  </label>

                  <label className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border ${
                    status === 'draft' ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' : 'bg-navy-950 text-slate-400 border-navy-800'
                  }`}>
                    <input
                      type="radio"
                      name="status"
                      value="draft"
                      checked={status === 'draft'}
                      onChange={() => setStatus('draft')}
                      className="hidden"
                    />
                    <FileEdit className="w-4 h-4" />
                    <span>Draft (Admin Only)</span>
                  </label>
                </div>
              </div>

              {/* Featured Showcase Checkbox */}
              <div className="space-y-2">
                <span className="block text-xs font-bold text-slate-200 uppercase tracking-wider font-mono">
                  Featured Showcase
                </span>
                <label className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer border ${
                  featured ? 'bg-accent/20 text-pink-300 border-accent/40' : 'bg-navy-950 text-slate-400 border-navy-800'
                }`}>
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="rounded text-cyan focus:ring-cyan bg-navy-950"
                  />
                  <Star className="w-4 h-4 text-accent" />
                  <span>Mark as Featured Project</span>
                </label>
              </div>

            </div>
          </div>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-4 pt-4">
            <Link
              to="/admin/projects"
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-slate-300 text-xs font-bold text-center border border-navy-800"
            >
              Cancel
            </Link>

            <button
              type="button"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, 'draft')}
              className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center justify-center space-x-2"
            >
              <FileEdit className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="submit"
              disabled={isSaving}
              onClick={(e) => handleSubmit(e, 'published')}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-cyan hover:bg-cyan-hover text-white text-xs font-bold shadow-xl border border-cyan/40 flex items-center justify-center space-x-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEditMode ? 'Update & Publish' : 'Publish Project'}</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>
    </AdminLayout>
  );
}
