import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Breadcrumbs from '../components/Breadcrumbs';
import Badge from '../components/Badge';
import Button from '../components/Button';
import { CheckCircle2, ChevronRight, ChevronLeft, Upload, PhoneCall, Send, ShieldCheck, FileText, Check } from 'lucide-react';
import { companyInfo } from '../data/companyInfo';

export default function RequestQuotePage() {
  const [searchParams] = useSearchParams();
  const initialService = searchParams.get('service');

  const [currentStep, setCurrentStep] = useState(1);

  // Form state
  const [formData, setFormData] = useState({
    // Step 1
    fullName: '',
    companyName: '',
    email: '',
    phone: '',
    whatsappNumber: '',
    // Step 2
    projectType: 'Commercial',
    projectLocation: '',
    // Step 3
    selectedServices: initialService ? [initialService] : [],
    // Step 4
    projectDescription: '',
    estimatedMeasurements: '',
    estimatedBudget: '',
    startDate: '',
    additionalNotes: '',
    // Step 5
    uploadedFiles: []
  });

  const [submitted, setSubmitted] = useState(false);

  const allServicesOptions = [
    'ACP/ALUCOBOND Cladding',
    'Exterior Cladding',
    'Facade Solutions',
    '3D Design',
    'Floating Panels',
    'Signage',
    'Pylon Sign',
    'Aluminium Works',
    'Glass Works',
    'Glass Railings',
    'Aluminium Roofing',
    'Carpentry',
    'Furniture',
    'Metal Works',
    'Suspended Ceiling',
    'General Contracting',
    'Building Finishing',
    'Corporate Branding',
    'Other'
  ];

  const projectTypesOptions = [
    'Residential',
    'Commercial',
    'Industrial',
    'Office',
    'School',
    'Hotel',
    'Shopping Centre',
    'Other'
  ];

  const toggleServiceSelection = (serviceName) => {
    if (formData.selectedServices.includes(serviceName)) {
      setFormData({
        ...formData,
        selectedServices: formData.selectedServices.filter((s) => s !== serviceName)
      });
    } else {
      setFormData({
        ...formData,
        selectedServices: [...formData.selectedServices, serviceName]
      });
    }
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      const filesArr = Array.from(e.target.files).map((file) => file.name);
      setFormData({
        ...formData,
        uploadedFiles: [...formData.uploadedFiles, ...filesArr]
      });
    }
  };

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handlePrev = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);
    try {
      await fetch("https://formspree.io/f/mdenrnzr", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          companyName: formData.companyName,
          email: formData.email,
          phone: formData.phone,
          whatsappNumber: formData.whatsappNumber,
          projectType: formData.projectType,
          projectLocation: formData.projectLocation,
          selectedServices: formData.selectedServices.join(', '),
          projectDescription: formData.projectDescription,
          estimatedMeasurements: formData.estimatedMeasurements,
          startDate: formData.startDate,
          estimatedBudget: formData.estimatedBudget,
          uploadedFiles: formData.uploadedFiles.join(', ')
        })
      });
    } catch (err) {
      console.error("Formspree submission error:", err);
    }
  };

  const stepsList = [
    { num: 1, label: 'Contact Info' },
    { num: 2, label: 'Project Type' },
    { num: 3, label: 'Services' },
    { num: 4, label: 'Specifications' },
    { num: 5, label: 'Upload & Submit' }
  ];

  return (
    <div className="pt-28 pb-20 bg-navy-950 text-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Breadcrumbs items={[{ label: 'Request a Quote' }]} />

        {/* Page Header */}
        <div className="py-6 border-b border-navy-800 text-center flex flex-col items-center">
          <div className="mb-4 bg-white p-2 rounded-xl shadow-xl border border-brand-orange/40">
            <img
              src="/logo.jpg"
              alt="HORLARS SERVICES Logo"
              className="h-14 sm:h-16 w-auto object-contain rounded-lg"
            />
          </div>
          <Badge variant="orange">High-Converting Quote Engine</Badge>
          <h1 className="text-3xl sm:text-5xl font-black text-white font-heading tracking-tight mt-3">
            Tell Us About Your Project
          </h1>
          <p className="mt-3 text-base text-slate-300 max-w-xl mx-auto">
            Share your project details and our technical team will review your requirements and prepare an itemized quotation.
          </p>
        </div>

        {/* Step Indicator Bar */}
        {!submitted && (
          <div className="py-8">
            <div className="grid grid-cols-5 gap-2 text-center">
              {stepsList.map((st) => (
                <button
                  key={st.num}
                  onClick={() => setCurrentStep(st.num)}
                  className={`py-3 px-2 rounded-xl text-xs font-bold transition-all border ${
                    currentStep === st.num
                      ? 'bg-brand-orange text-white border-brand-orange shadow-lg shadow-brand-orange/30'
                      : currentStep > st.num
                      ? 'bg-navy-900 text-emerald-400 border-emerald-500/40'
                      : 'bg-navy-900/60 text-slate-400 border-navy-800'
                  }`}
                >
                  <div className="flex items-center justify-center space-x-1">
                    {currentStep > st.num ? (
                      <Check className="w-3.5 h-3.5" />
                    ) : (
                      <span>Step {st.num}</span>
                    )}
                  </div>
                  <span className="hidden sm:block text-[11px] font-normal truncate mt-0.5">{st.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Form Container */}
        <div className="bg-navy-900 p-6 sm:p-10 rounded-2xl border border-navy-800 shadow-2xl">
          
          {submitted ? (
            /* Submission Confirmation Screen */
            <div className="text-center py-12 space-y-6">
              <div className="w-20 h-20 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto border-2 border-emerald-500 shadow-xl">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <Badge variant="emerald" size="lg">Quotation Request Received</Badge>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-heading">
                Thank you for contacting HORLARLEKX.
              </h2>

              <p className="text-slate-300 text-base max-w-lg mx-auto leading-relaxed">
                Our technical team will review your project specifications and contact you shortly to confirm measurements or send your itemized estimate.
              </p>

              <div className="pt-4 p-6 rounded-xl bg-navy-950 border border-navy-800 max-w-md mx-auto space-y-3">
                <span className="text-xs text-slate-400 font-mono block">NEED IMMEDIATE ASSISTANCE?</span>
                <Button
                  href={`https://wa.me/2347055534249?text=Hello%20HORLARLEKX,%20I%20just%20submitted%20a%20quote%20request%20for%20${encodeURIComponent(formData.fullName || 'my project')}.`}
                  variant="whatsapp"
                  size="md"
                  icon={PhoneCall}
                  className="w-full"
                >
                  Chat Directly on WhatsApp
                </Button>
              </div>

              <div className="pt-4">
                <Button onClick={() => { setSubmitted(false); setCurrentStep(1); }} variant="outline" size="sm">
                  Submit Another Quote Request
                </Button>
              </div>
            </div>
          ) : (
            <form action="https://formspree.io/f/mdenrnzr" method="POST" onSubmit={handleSubmit} className="space-y-6">
              {/* Hidden Inputs for Formspree submission of all multi-step data */}
              <input type="hidden" name="fullName" value={formData.fullName} />
              <input type="hidden" name="companyName" value={formData.companyName} />
              <input type="hidden" name="email" value={formData.email} />
              <input type="hidden" name="phone" value={formData.phone} />
              <input type="hidden" name="whatsappNumber" value={formData.whatsappNumber} />
              <input type="hidden" name="projectType" value={formData.projectType} />
              <input type="hidden" name="projectLocation" value={formData.projectLocation} />
              <input type="hidden" name="selectedServices" value={formData.selectedServices.join(', ')} />
              <input type="hidden" name="projectDescription" value={formData.projectDescription} />
              <input type="hidden" name="estimatedMeasurements" value={formData.estimatedMeasurements} />
              <input type="hidden" name="startDate" value={formData.startDate} />
              <input type="hidden" name="estimatedBudget" value={formData.estimatedBudget} />
              <input type="hidden" name="uploadedFiles" value={formData.uploadedFiles.join(', ')} />
              
              {/* STEP 1: Contact Information */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="border-b border-navy-800 pb-3">
                    <h3 className="text-xl font-bold text-white font-heading">Step 1 — Contact Information</h3>
                    <p className="text-xs text-slate-400">Provide your contact details so our team can reach you with the estimate.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Arc. Babatunde Johnson"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Company / Organization Name (Optional)</label>
                    <input
                      type="text"
                      name="companyName"
                      placeholder="e.g. Horizon Real Estate Developments Ltd"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="client@company.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="07055534249"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">WhatsApp Number (For fast estimate chat)</label>
                    <input
                      type="tel"
                      name="whatsappNumber"
                      placeholder="07055534249"
                      value={formData.whatsappNumber}
                      onChange={(e) => setFormData({ ...formData, whatsappNumber: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>
              )}

              {/* STEP 2: Project Information */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="border-b border-navy-800 pb-3">
                    <h3 className="text-xl font-bold text-white font-heading">Step 2 — Project Information</h3>
                    <p className="text-xs text-slate-400">Select the building category and site location.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-2">Project Type *</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {projectTypesOptions.map((pt) => (
                        <button
                          type="button"
                          key={pt}
                          onClick={() => setFormData({ ...formData, projectType: pt })}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all text-center ${
                            formData.projectType === pt
                              ? 'bg-brand-orange text-white border-brand-orange shadow-md'
                              : 'bg-navy-950 text-slate-300 border-navy-800 hover:border-navy-700'
                          }`}
                        >
                          {pt}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Site Location *</label>
                    <input
                      type="text"
                      name="projectLocation"
                      required
                      placeholder="e.g. Victoria Island, Lagos State / Idi Iroko Road, Ogun State"
                      value={formData.projectLocation}
                      onChange={(e) => setFormData({ ...formData, projectLocation: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>
              )}

              {/* STEP 3: Service Required (Multi-Select) */}
              {currentStep === 3 && (
                <div className="space-y-4">
                  <div className="border-b border-navy-800 pb-3">
                    <h3 className="text-xl font-bold text-white font-heading">Step 3 — Service Required</h3>
                    <p className="text-xs text-slate-400">Select all services that apply to your project (Multiple selections allowed).</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-96 overflow-y-auto pr-1">
                    {allServicesOptions.map((serv) => {
                      const isSelected = formData.selectedServices.includes(serv);
                      return (
                        <button
                          type="button"
                          key={serv}
                          onClick={() => toggleServiceSelection(serv)}
                          className={`p-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-between text-left ${
                            isSelected
                              ? 'bg-brand-orange/20 text-brand-orange border-brand-orange'
                              : 'bg-navy-950 text-slate-300 border-navy-800 hover:border-navy-700'
                          }`}
                        >
                          <span>{serv}</span>
                          <div className={`w-5 h-5 rounded flex items-center justify-center border ${
                            isSelected ? 'bg-brand-orange text-white border-brand-orange' : 'border-slate-600'
                          }`}>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-xs text-slate-400">
                    Selected Services ({formData.selectedServices.length}): <span className="text-brand-orange font-bold">{formData.selectedServices.join(', ') || 'None selected yet'}</span>
                  </p>
                </div>
              )}

              {/* STEP 4: Project Details */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <div className="border-b border-navy-800 pb-3">
                    <h3 className="text-xl font-bold text-white font-heading">Step 4 — Project Details</h3>
                    <p className="text-xs text-slate-400">Provide measurements, description, and expected start date.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Project Description *</label>
                    <textarea
                      rows={3}
                      name="projectDescription"
                      required
                      placeholder="Describe the scope of work (e.g. Retrofitting 4-story commercial building exterior with silver ACP cladding)..."
                      value={formData.projectDescription}
                      onChange={(e) => setFormData({ ...formData, projectDescription: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Measurements (sq.m or linear meters)</label>
                      <input
                        type="text"
                        name="estimatedMeasurements"
                        placeholder="e.g. approx 450 sq.m facade area"
                        value={formData.estimatedMeasurements}
                        onChange={(e) => setFormData({ ...formData, estimatedMeasurements: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Expected Start Date</label>
                      <input
                        type="text"
                        name="startDate"
                        placeholder="e.g. Immediately / Next Month"
                        value={formData.startDate}
                        onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                        className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Estimated Budget — Optional</label>
                    <input
                      type="text"
                      name="estimatedBudget"
                      placeholder="e.g. Open to recommendation / Budget range"
                      value={formData.estimatedBudget}
                      onChange={(e) => setFormData({ ...formData, estimatedBudget: e.target.value })}
                      className="w-full px-4 py-3 bg-navy-950 border border-navy-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-brand-orange"
                    />
                  </div>
                </div>
              )}

              {/* STEP 5: File Upload & Final Review */}
              {currentStep === 5 && (
                <div className="space-y-4">
                  <div className="border-b border-navy-800 pb-3">
                    <h3 className="text-xl font-bold text-white font-heading">Step 5 — Upload Drawings & Submit</h3>
                    <p className="text-xs text-slate-400">Upload site photos, architectural drawings, or project documents.</p>
                  </div>

                  <div className="border-2 border-dashed border-navy-700 rounded-2xl p-8 text-center bg-navy-950 hover:border-brand-orange transition-colors">
                    <Upload className="w-10 h-10 text-brand-orange mx-auto mb-3" />
                    <h4 className="text-sm font-bold text-white">Upload Building Photos or Drawings</h4>
                    <p className="text-xs text-slate-400 mt-1">Supports JPG, PNG, PDF, DWG files.</p>

                    <label className="mt-4 inline-flex items-center px-4 py-2 rounded-lg bg-navy-800 hover:bg-brand-orange text-xs font-bold text-white cursor-pointer transition-colors">
                      <span>Select Files to Upload</span>
                      <input type="file" name="uploadedFiles" multiple onChange={handleFileUpload} className="hidden" />
                    </label>

                    {formData.uploadedFiles.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-navy-800 space-y-1 text-xs text-emerald-400 font-mono">
                        <span className="text-slate-300 font-sans block">Uploaded Files:</span>
                        {formData.uploadedFiles.map((fn, idx) => (
                          <div key={idx} className="flex items-center justify-center space-x-1">
                            <FileText className="w-3.5 h-3.5" />
                            <span>{fn}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 text-xs space-y-2">
                    <h4 className="font-bold text-white uppercase text-[11px] font-mono">Quotation Request Summary:</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
                      <div>Name: <span className="text-white font-semibold">{formData.fullName || 'Not provided'}</span></div>
                      <div>Location: <span className="text-white font-semibold">{formData.projectLocation || 'Not provided'}</span></div>
                      <div>Services: <span className="text-brand-orange font-bold">{formData.selectedServices.join(', ') || 'General'}</span></div>
                      <div>Type: <span className="text-white font-semibold">{formData.projectType}</span></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-navy-800 flex items-center justify-between">
                {currentStep > 1 ? (
                  <Button type="button" onClick={handlePrev} variant="outline" size="md" icon={ChevronLeft}>
                    Previous
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 5 ? (
                  <Button type="button" onClick={handleNext} variant="primary" size="md" icon={ChevronRight} iconPosition="right">
                    Next Step
                  </Button>
                ) : (
                  <Button type="submit" variant="primary" size="lg" icon={Send} iconPosition="right">
                    SUBMIT PROJECT REQUEST
                  </Button>
                )}
              </div>

            </form>
          )}

        </div>

      </div>
    </div>
  );
}
