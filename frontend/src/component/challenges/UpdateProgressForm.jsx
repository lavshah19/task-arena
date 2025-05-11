import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import { Link, Edit, Check, Loader } from "lucide-react"; // Lucide icons

const UpdateProgressForm = ({ challengeId, currentProgress, onClose, fetchChallenge }) => {
  const { token } = useAuth();
  const [submissionLink, setSubmissionLink] = useState(currentProgress.submissionLink || "");
  const [notes, setNotes] = useState(currentProgress.notes || "");
  const [completed, setCompleted] = useState(currentProgress.completed || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.patch(
        `${baseUrl}/challenge/updateprogress/${challengeId}`,
        { completed, submissionLink, notes },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.success) {
        fetchChallenge();
        onClose();
      } else {
        setError(res.data.message || "Failed to update progress.");
      }
    } catch (error) {
      console.error("Update error:", error);
      setError("Error updating progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-amber-50 p-5 rounded-lg border border-amber-100 shadow-sm transition-all">
      <h4 className="font-semibold mb-4 text-lg text-amber-700 border-b border-amber-200 pb-2">Update Your Progress</h4>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Submission Link</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Link className="h-5 w-5 text-amber-500" />
          </div>
          <input
            type="text" 
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            placeholder="https://..."
            className="w-full pl-10 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <Edit className="h-5 w-5 text-amber-500" />
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Share details about your progress..."
            rows={4}
            className="w-full pl-10 p-3 border rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-amber-100 p-2 rounded-md transition-colors">
          <div className={`w-5 h-5 border rounded ${completed ? 'bg-amber-500 border-amber-600' : 'border-gray-300'} flex items-center justify-center`}>
            {completed && <Check className="h-4 w-4 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium text-gray-700">Mark as Completed</span>
        </label>
      </div>

      {error && (
        <div className="p-3 rounded-lg text-sm mb-4 bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex gap-3 justify-end">
        <button 
          type="button" 
          onClick={onClose} 
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors font-medium flex items-center gap-2"
          disabled={loading}
        >
          {loading && <Loader className="animate-spin h-4 w-4 text-white" />}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
};

export default UpdateProgressForm;
