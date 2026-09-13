import React, { useState, useEffect } from 'react';
import { Scholarship } from '../../types';
import { X, Plus, Save, Trash2 } from 'lucide-react';

interface ScholarshipAdminModalProps {
  scholarship: Scholarship | null; // null for creating new
  isOpen: boolean;
  onClose: () => void;
  onSave: (scholarship: Scholarship) => Promise<void>;
  onDelete?: (scholarshipId: string) => Promise<void>;
}

export const ScholarshipAdminModal: React.FC<ScholarshipAdminModalProps> = ({
  scholarship,
  isOpen,
  onClose,
  onSave,
  onDelete
}) => {
  const isEditing = Boolean(scholarship);

  const [formData, setFormData] = useState<Scholarship>({
    scholarshipId: scholarship?.scholarshipId || `sch_manual_${Date.now()}`,
    scholarshipName: scholarship?.scholarshipName || '',
    provider: scholarship?.provider || '',
    providerType: scholarship?.providerType || 'Government',
    description: scholarship?.description || '',
    eligibility: scholarship?.eligibility || '',
    educationLevel: scholarship?.educationLevel || 'Graduation',
    eligibleCourses: scholarship?.eligibleCourses || ['B.Tech', 'B.Sc'],
    eligibleStates: scholarship?.eligibleStates || ['All India'],
    category: scholarship?.category || 'All',
    gender: scholarship?.gender || 'All',
    minimumPercentage: scholarship?.minimumPercentage || 50,
    maximumFamilyIncome: scholarship?.maximumFamilyIncome || 250000,
    scholarshipAmount: scholarship?.scholarshipAmount || '₹50,000 / year',
    applicationStartDate: scholarship?.applicationStartDate || new Date().toISOString().split('T')[0],
    applicationEndDate: scholarship?.applicationEndDate || '',
    documentsRequired: scholarship?.documentsRequired || ['Aadhaar Card', 'Marksheet', 'Income Certificate'],
    selectionProcess: scholarship?.selectionProcess || 'Merit and financial eligibility verification.',
    renewalAvailable: scholarship?.renewalAvailable ?? true,
    officialWebsite: scholarship?.officialWebsite || 'https://scholarships.gov.in',
    applicationLink: scholarship?.applicationLink || 'https://scholarships.gov.in',
    status: scholarship?.status || 'Open',
    createdAt: scholarship?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  });

  const [coursesInput, setCoursesInput] = useState(
    scholarship?.eligibleCourses?.join(', ') || 'B.Tech, B.Sc'
  );
  const [statesInput, setStatesInput] = useState(
    scholarship?.eligibleStates?.join(', ') || 'All India'
  );
  const [docsInput, setDocsInput] = useState(
    scholarship?.documentsRequired?.join('\n') || 'Aadhaar Card\nMarksheet\nIncome Certificate'
  );

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!isOpen) return;
    if (scholarship) {
      setFormData(scholarship);
      setCoursesInput(scholarship.eligibleCourses?.join(', ') || '');
      setStatesInput(scholarship.eligibleStates?.join(', ') || '');
      setDocsInput(scholarship.documentsRequired?.join('\n') || '');
    } else {
      setFormData({
        scholarshipId: `sch_manual_${Date.now()}`,
        scholarshipName: '',
        provider: '',
        providerType: 'Government',
        description: '',
        eligibility: '',
        educationLevel: 'Graduation',
        eligibleCourses: ['B.Tech', 'B.Sc'],
        eligibleStates: ['All India'],
        category: 'All',
        gender: 'All',
        minimumPercentage: 50,
        maximumFamilyIncome: 250000,
        scholarshipAmount: '₹50,000 / year',
        applicationStartDate: new Date().toISOString().split('T')[0],
        applicationEndDate: '',
        documentsRequired: ['Aadhaar Card', 'Marksheet', 'Income Certificate'],
        selectionProcess: 'Merit and financial eligibility verification.',
        renewalAvailable: true,
        officialWebsite: 'https://scholarships.gov.in',
        applicationLink: 'https://scholarships.gov.in',
        status: 'Open',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
      setCoursesInput('B.Tech, B.Sc');
      setStatesInput('All India');
      setDocsInput('Aadhaar Card\nMarksheet\nIncome Certificate');
    }
  }, [scholarship, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.scholarshipName.trim()) {
      newErrors.scholarshipName = 'Scholarship Name is required';
    }
    if (!formData.provider.trim()) {
      newErrors.provider = 'Provider / Organization name is required';
    }
    if (!formData.scholarshipAmount.trim()) {
      newErrors.scholarshipAmount = 'Award Amount / Benefit is required';
    }
    if (!formData.eligibility.trim()) {
      newErrors.eligibility = 'Eligibility summary is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setFieldErrors(newErrors);
      setErrorMsg('Please provide required information for all highlighted fields.');
      return;
    }

    setFieldErrors({});
    setIsSubmitting(true);
    setErrorMsg(null);

    const formatUrl = (u: string) => {
      if (!u || !u.trim()) return '';
      const trimmed = u.trim();
      if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) return trimmed;
      return `https://${trimmed}`;
    };

    try {
      const parsedCourses = coursesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedStates = statesInput
        .split(',')
        .map(s => s.trim())
        .filter(Boolean);
      const parsedDocs = docsInput
        .split('\n')
        .map(s => s.trim())
        .filter(Boolean);

      const finalPayload: Scholarship = {
        ...formData,
        officialWebsite: formatUrl(formData.officialWebsite) || 'https://scholarships.gov.in',
        applicationLink: formatUrl(formData.applicationLink) || 'https://scholarships.gov.in',
        eligibleCourses: parsedCourses.length > 0 ? parsedCourses : ['All'],
        eligibleStates: parsedStates.length > 0 ? parsedStates : ['All India'],
        documentsRequired: parsedDocs,
        updatedAt: new Date().toISOString()
      };

      await onSave(finalPayload);
      onClose();
    } catch (err) {
      console.error('Save scholarship error:', err);
      setErrorMsg(err instanceof Error ? err.message : 'Failed to save scholarship');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!scholarship || !onDelete) return;
    if (confirm(`Are you sure you want to delete "${scholarship.scholarshipName}"?`)) {
      try {
        setIsSubmitting(true);
        await onDelete(scholarship.scholarshipId);
        onClose();
      } catch (err) {
        setErrorMsg('Failed to delete scholarship');
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white border-4 border-black text-stone-900 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-6 relative my-auto text-left">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-stone-100 hover:bg-stone-200 border-2 border-black cursor-pointer"
        >
          <X className="w-5 h-5 text-black" />
        </button>

        <h2 className="text-2xl font-display font-black uppercase text-stone-900 mb-4 pr-8">
          {isEditing ? 'Edit Scholarship Record' : 'Add New Verified Scholarship'}
        </h2>

        {errorMsg && (
          <div className="p-3 bg-red-100 border-2 border-red-500 text-red-900 text-xs font-bold mb-4">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Scholarship Name *
              </label>
              <input
                type="text"
                value={formData.scholarshipName}
                onChange={e => {
                  setFormData({ ...formData, scholarshipName: e.target.value });
                  if (fieldErrors.scholarshipName) {
                    setFieldErrors(prev => ({ ...prev, scholarshipName: '' }));
                  }
                }}
                className={`w-full p-2 border-2 text-xs font-semibold focus:bg-amber-50 ${
                  fieldErrors.scholarshipName ? 'border-red-600 bg-red-50/50' : 'border-black'
                }`}
                placeholder="e.g. NSP Post Matric Scholarship"
                required
              />
              {fieldErrors.scholarshipName && (
                <p className="text-[11px] font-bold text-red-600 mt-1">⚠️ {fieldErrors.scholarshipName}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Provider / Organization *
              </label>
              <input
                type="text"
                value={formData.provider}
                onChange={e => {
                  setFormData({ ...formData, provider: e.target.value });
                  if (fieldErrors.provider) {
                    setFieldErrors(prev => ({ ...prev, provider: '' }));
                  }
                }}
                className={`w-full p-2 border-2 text-xs font-semibold focus:bg-amber-50 ${
                  fieldErrors.provider ? 'border-red-600 bg-red-50/50' : 'border-black'
                }`}
                placeholder="e.g. Ministry of Social Justice"
                required
              />
              {fieldErrors.provider && (
                <p className="text-[11px] font-bold text-red-600 mt-1">⚠️ {fieldErrors.provider}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Provider Type
              </label>
              <select
                value={formData.providerType}
                onChange={e => setFormData({ ...formData, providerType: e.target.value as any })}
                className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
              >
                <option value="Government">Government</option>
                <option value="Private">Private</option>
                <option value="NGO">NGO</option>
                <option value="University">University</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Award Amount / Benefit *
              </label>
              <input
                type="text"
                value={formData.scholarshipAmount}
                onChange={e => {
                  setFormData({ ...formData, scholarshipAmount: e.target.value });
                  if (fieldErrors.scholarshipAmount) {
                    setFieldErrors(prev => ({ ...prev, scholarshipAmount: '' }));
                  }
                }}
                className={`w-full p-2 border-2 text-xs font-semibold ${
                  fieldErrors.scholarshipAmount ? 'border-red-600 bg-red-50/50' : 'border-black'
                }`}
                placeholder="e.g. ₹50,000 / year"
                required
              />
              {fieldErrors.scholarshipAmount && (
                <p className="text-[11px] font-bold text-red-600 mt-1">⚠️ {fieldErrors.scholarshipAmount}</p>
              )}
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Status
              </label>
              <select
                value={formData.status}
                onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
              >
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Draft">Draft</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
          </div>

          {/* Description & Eligibility */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full p-2 border-2 border-black text-xs font-medium"
              placeholder="Brief overview of the scholarship purpose..."
            />
          </div>

          <div>
            <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
              Eligibility Summary *
            </label>
            <textarea
              value={formData.eligibility}
              onChange={e => {
                setFormData({ ...formData, eligibility: e.target.value });
                if (fieldErrors.eligibility) {
                  setFieldErrors(prev => ({ ...prev, eligibility: '' }));
                }
              }}
              rows={2}
              className={`w-full p-2 border-2 text-xs font-medium ${
                fieldErrors.eligibility ? 'border-red-600 bg-red-50/50' : 'border-black'
              }`}
              placeholder="Summary of who can apply..."
              required
            />
            {fieldErrors.eligibility && (
              <p className="text-[11px] font-bold text-red-600 mt-1">⚠️ {fieldErrors.eligibility}</p>
            )}
          </div>

          {/* Category, Gender, Education Level */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Education Level
              </label>
              <select
                value={formData.educationLevel}
                onChange={e => setFormData({ ...formData, educationLevel: e.target.value as any })}
                className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
              >
                <option value="10th">10th</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Polytechnic">Polytechnic</option>
                <option value="ITI">ITI</option>
                <option value="Graduation">Graduation</option>
                <option value="Post Graduation">Post Graduation</option>
                <option value="All">All</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Social Category
              </label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
              >
                <option value="All">All Categories</option>
                <option value="General">General</option>
                <option value="OBC">OBC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
                <option value="EWS">EWS</option>
                <option value="Minority">Minority</option>
                <option value="Disabled">Disabled</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Gender Restriction
              </label>
              <select
                value={formData.gender}
                onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                className="w-full p-2 border-2 border-black text-xs font-bold bg-white"
              >
                <option value="All">All (Male & Female)</option>
                <option value="Female">Female Only</option>
                <option value="Male">Male Only</option>
              </select>
            </div>
          </div>

          {/* Income & Marks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Min Percentage % Required
              </label>
              <input
                type="text"
                inputMode="decimal"
                value={formData.minimumPercentage === 0 ? '' : formData.minimumPercentage}
                onChange={e => {
                  const raw = e.target.value.replace(/[^0-9.]/g, '');
                  const parsed = parseFloat(raw);
                  setFormData({ ...formData, minimumPercentage: isNaN(parsed) ? 0 : parsed });
                }}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="e.g. 60"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Max Family Income Cap (₹)
              </label>
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={formData.maximumFamilyIncome === 0 ? '' : formData.maximumFamilyIncome}
                onChange={e => {
                  const raw = e.target.value.replace(/\D/g, '');
                  setFormData({ ...formData, maximumFamilyIncome: raw === '' ? 0 : parseInt(raw, 10) });
                }}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="e.g. 250000"
              />
            </div>
          </div>

          {/* Courses & States comma separated */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Eligible Courses (comma-separated)
              </label>
              <input
                type="text"
                value={coursesInput}
                onChange={e => setCoursesInput(e.target.value)}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="e.g. B.Tech, B.Sc, Diploma"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Eligible States (comma-separated)
              </label>
              <input
                type="text"
                value={statesInput}
                onChange={e => setStatesInput(e.target.value)}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="e.g. Andhra Pradesh, Telangana, All India"
              />
            </div>
          </div>

          {/* Start and End Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Start Date
              </label>
              <input
                type="date"
                value={formData.applicationStartDate}
                onChange={e => setFormData({ ...formData, applicationStartDate: e.target.value })}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Deadline Date
              </label>
              <input
                type="date"
                value={formData.applicationEndDate}
                onChange={e => setFormData({ ...formData, applicationEndDate: e.target.value })}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
              />
            </div>
          </div>

          {/* Required Documents (one per line) */}
          <div>
            <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
              Required Documents (one document per line)
            </label>
            <textarea
              value={docsInput}
              onChange={e => setDocsInput(e.target.value)}
              rows={3}
              className="w-full p-2 border-2 border-black text-xs font-mono"
              placeholder="Aadhaar Card&#10;Class 10th Marksheet&#10;Income Certificate"
            />
          </div>

          {/* Web Links */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Official Website Link
              </label>
              <input
                type="text"
                value={formData.officialWebsite}
                onChange={e => setFormData({ ...formData, officialWebsite: e.target.value })}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="https://scholarships.gov.in"
              />
            </div>

            <div>
              <label className="block text-xs font-mono font-bold uppercase mb-1 text-stone-700">
                Application Link
              </label>
              <input
                type="text"
                value={formData.applicationLink}
                onChange={e => setFormData({ ...formData, applicationLink: e.target.value })}
                className="w-full p-2 border-2 border-black text-xs font-semibold"
                placeholder="https://scholarships.gov.in/apply"
              />
            </div>
          </div>

          {/* Submit / Cancel Buttons */}
          <div className="border-t-2 border-dashed border-stone-300 pt-4 flex items-center justify-between gap-3">
            {isEditing && onDelete ? (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSubmitting}
                className="px-4 py-2 bg-red-100 text-red-800 border-2 border-black hover:bg-red-200 font-bold uppercase text-xs flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            ) : <div />}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-stone-100 text-stone-800 border-2 border-black hover:bg-stone-200 font-bold uppercase text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2 bg-amber-300 text-black border-2 border-black hover:bg-amber-400 font-bold uppercase text-xs flex items-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : isEditing ? 'Update Scholarship' : 'Save & Publish'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
