'use client';

import { useState } from 'react';

export default function AnalyzerForm() {
  const [formData, setFormData] = useState({
    role: '',
    company: '',
    jobType: 'Full-time',
    jobDescription: '',
    cvText: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // TODO: Phase 2 - Koneksi ke API Route
    console.log('Data siap dianalisis:', formData);

    setTimeout(() => {
      setIsLoading(false);
      alert('Simulasi analisis selesai! Cek console.');
    }, 1500);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-lg border border-gray-100">
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-800">Detail Lamaran</h2>
        <p className="text-sm text-gray-500">Masukkan informasi lowongan dan CV Anda untuk dianalisis.</p>
      </div>

      {/* Baris Pertama: Role, Company, Job Type */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Target Role</label>
          <input type="text" name="role" value={formData.role} onChange={handleChange} placeholder="e.g. Software Engineer" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
        <div className="flex flex-col gap-2">
          <label className="text-sm font-semibold text-gray-700">Company</label>
          <input type="text" name="company" value={formData.company} onChange={handleChange} placeholder="e.g. Google" className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" required />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="jobType" className="text-sm font-semibold text-gray-700">
            Job Type
          </label>
          <select id="jobType" defaultValue="" name="jobType" value={formData.jobType} onChange={handleChange} className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
            <option value="" disabled>
              Select job type
            </option>
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
            <option value="Freelance">Freelance</option>
          </select>
        </div>
      </div>

      {/* Input Job Description */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">Job Description</label>
        <textarea
          name="jobDescription"
          value={formData.jobDescription}
          onChange={handleChange}
          placeholder="Paste Job Description lengkap di sini..."
          className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[150px]"
          required
        />
      </div>

      {/* Input CV Text */}
      <div className="flex flex-col gap-2">
        <label className="text-sm font-semibold text-gray-700">CV / Resume Text (Sementara menggunakan teks)</label>
        <textarea name="cvText" value={formData.cvText} onChange={handleChange} placeholder="Paste isi teks CV Anda di sini..." className="p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none min-h-[200px]" required />
      </div>

      {/* Submit Button */}
      <button type="submit" disabled={isLoading} className="mt-2 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-4 rounded-xl transition-colors disabled:bg-gray-400 text-lg">
        {isLoading ? 'Menganalisis dengan AI...' : 'Analyze Application'}
      </button>
    </form>
  );
}
