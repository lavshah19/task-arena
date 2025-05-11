import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../../component/context/AuthContext";
import { Check, Link2, StickyNote, Loader2 } from "lucide-react";

const CreateProgressForm = ({ challengeId, onClose, fetchChallenge }) => {
  const { token } = useAuth();

  const [completed, setCompleted] = useState(false);
  const [submissionLink, setSubmissionLink] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const baseUrl = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        `${baseUrl}/challenge/createprogress/${challengeId}`,
        {
          completed,
          submissionLink,
          notes,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Progress submitted successfully!");
      fetchChallenge();
      onClose();
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to submit progress.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-5 border rounded-lg bg-white shadow-sm transition-all">
      <h4 className="font-semibold mb-4 text-lg text-blue-700 border-b pb-2">Submit Your Progress</h4>

      <div className="mb-4">
        <label className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 p-2 rounded-md transition-colors">
          <div className={`w-5 h-5 border rounded ${completed ? 'bg-blue-500 border-blue-600' : 'border-gray-300'} flex items-center justify-center`}>
            {completed && <Check className="h-4 w-4 text-white" />}
          </div>
          <input
            type="checkbox"
            checked={completed}
            onChange={(e) => setCompleted(e.target.checked)}
            className="sr-only"
          />
          <span className="font-medium text-gray-700">Challenge Completed?</span>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Submission Link</label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Link2 className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="https://..."
            value={submissionLink}
            onChange={(e) => setSubmissionLink(e.target.value)}
            className="block w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <StickyNote className="h-5 w-5 text-gray-400" />
          </div>
          <textarea
            placeholder="Share details about your progress..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            className="block w-full pl-10 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm mb-4 ${
          message.includes("success") 
            ? "bg-green-50 text-green-700 border border-green-200" 
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message}
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
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
        >
          {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          {loading ? "Submitting..." : "Submit Progress"}
        </button>
      </div>
    </form>
  );
};

export default CreateProgressForm;
