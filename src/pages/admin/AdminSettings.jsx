/**
 * @file AdminSettings.jsx
 * @description Admin Settings component for managing system configuration, user profile overview,
 * 1-click database seeding (migrating static project data to Firebase Firestore), and inspecting 
 * Firebase environment variables.
 * 
 * Path: src/pages/admin/AdminSettings.jsx
 */

import React, { useState } from 'react';

// Layout & Context Dependencies
import AdminLayout from '../../components/admin/AdminLayout';
import { useAuth } from '../../context/AuthContext';

// Database & Static Data Imports for Project Migration
import { seedDefaultProjects } from '../../firebase/projects';
import { projectsData } from '../../data/projectsData';

// Icon Set from Lucide React
import { 
  ShieldCheck, 
  Database, 
  Key, 
  Server, 
  CheckCircle2, 
  AlertCircle, 
  Loader2,
  Lock,
  Globe
} from 'lucide-react';

/**
 * AdminSettings Component
 * 
 * Provides an administrative dashboard page for:
 * 1. Viewing active authenticated admin user details (Email, User ID, Provider).
 * 2. Executing a 1-click migration routine to import static project array data into Firestore.
 * 3. Inspecting active Vite environment variables for Firebase configuration.
 * 
 * @returns {JSX.Element} The rendered Admin System & Data Settings page layout.
 */
export default function AdminSettings() {
  // Access current logged-in admin user details from Auth Context
  const { currentUser } = useAuth();

  // Component local states for managing data seeding process
  const [seeding, setSeeding] = useState(false);       // Tracks seeding execution status (loading spinner)
  const [seedResult, setSeedResult] = useState('');   // Stores successful migration status message
  const [seedError, setSeedError] = useState('');     // Stores migration error message if execution fails

  /**
   * Triggers the 1-click static project data migration to Firestore.
   * Prompts user for confirmation prior to calling seedDefaultProjects.
   */
  const handleSeed = async () => {
    // Confirm user intent before beginning database write operation
    if (!window.confirm('Import all default static projects into Firestore database?')) {
      return;
    }

    // Reset feedback alerts
    setSeedResult('');
    setSeedError('');

    try {
      setSeeding(true);
      // Perform database seeding operation with static projects dataset
      const res = await seedDefaultProjects(projectsData);
      setSeedResult(res.message);
    } catch (err) {
      console.error('Migration error:', err);
      setSeedError(err.message || 'Data migration failed.');
    } finally {
      setSeeding(false);
    }
  };

  // Extract public Vite environment parameters for runtime diagnostic display
  const firebaseProjectId = import.meta.env.VITE_FIREBASE_PROJECT_ID || 'Not configured';
  const firebaseAuthDomain = import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'Not configured';
  const firebaseStorageBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'Not configured';

  return (
    <AdminLayout>
      <div className="space-y-8">
        
        {/* ==================== PAGE HEADER ==================== */}
        <div className="pb-6 border-b border-cyan/20">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white font-heading tracking-tight">
            Admin System & Data Settings
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Account security, Firebase environment info, and database initial seeding.
          </p>
        </div>

        {/* ==================== SECTION 1: ADMIN ACCOUNT PROFILE ==================== */}
        <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-cyan">
            <ShieldCheck className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white font-heading">
              Authenticated Administrator Profile
            </h3>
          </div>

          {/* User Credential Details Display Card */}
          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Logged in as:</span>
              <span className="text-emerald-400 font-bold font-mono">{currentUser?.email || 'Administrator'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">Authentication Provider:</span>
              <span className="text-slate-200 font-mono">Firebase Auth (Email/Password)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400 font-mono">User ID:</span>
              <span className="text-slate-300 font-mono text-[11px] truncate max-w-xs">{currentUser?.uid || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* ==================== SECTION 2: DATA MIGRATION (1-CLICK SEED) ==================== */}
        <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-emerald-400">
            <Database className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-bold text-white font-heading">
                1-Click Static Data Migration
              </h3>
              <p className="text-xs text-slate-300">
                Populate your Firestore collection with all 15+ existing HORLARLEKX projects.
              </p>
            </div>
          </div>

          {/* Migration Success Alert Banner */}
          {seedResult && (
            <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-semibold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{seedResult}</span>
            </div>
          )}

          {/* Migration Error Alert Banner */}
          {seedError && (
            <div className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-semibold flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{seedError}</span>
            </div>
          )}

          {/* Seeding Description & Trigger Action */}
          <div className="bg-navy-950 p-4 rounded-xl border border-navy-800 space-y-3 text-xs">
            <p className="text-slate-300 leading-relaxed">
              If your Firestore database is fresh, this tool converts your hard-coded project records into Firestore documents under the <code>projects</code> collection so you can edit and manage them visually without code edits.
            </p>

            <button
              onClick={handleSeed}
              disabled={seeding}
              className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold shadow-lg transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              {seeding ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Migrating Projects...</span>
                </>
              ) : (
                <>
                  <Database className="w-4 h-4" />
                  <span>Import 15+ Hardcoded Projects to Firestore</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* ==================== SECTION 3: FIREBASE CONFIG INSPECTION ==================== */}
        <div className="bg-[#004880] p-6 sm:p-8 rounded-2xl border border-cyan/20 shadow-xl space-y-4">
          <div className="flex items-center space-x-3 text-cyan">
            <Server className="w-6 h-6" />
            <h3 className="text-lg font-bold text-white font-heading">
              Client Environment Configuration
            </h3>
          </div>

          {/* Key Environment Parameters Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">PROJECT ID</span>
              <span className="text-white font-bold truncate block">{firebaseProjectId}</span>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">AUTH DOMAIN</span>
              <span className="text-white font-bold truncate block">{firebaseAuthDomain}</span>
            </div>

            <div className="p-4 rounded-xl bg-navy-950 border border-navy-800 space-y-1">
              <span className="text-slate-400 block text-[10px] uppercase">STORAGE BUCKET</span>
              <span className="text-white font-bold truncate block">{firebaseStorageBucket}</span>
            </div>
          </div>

          {/* Client Security Clarification Box */}
          <div className="p-4 rounded-xl bg-navy-900 border border-cyan/20 text-xs text-slate-300 space-y-1">
            <span className="font-bold text-white block">Security Notice:</span>
            <p>
              Vite environment variables prefixed with <code>VITE_</code> are public client identifiers. No Firebase Admin SDK private keys or server account credentials are used in frontend code.
            </p>
          </div>
        </div>

      </div>
    </AdminLayout>
  );
}

