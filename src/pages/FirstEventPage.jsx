// src/pages/MultipleEventPage.jsx
// ✅ UPDATED: Supports dynamic tasks 1–15 (from Task_Reports description_one to description_fifteen)
// ✅ UPDATED: Reads task_one through task_fifteen from Task_Submissions
import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import CentroAdminBg from "../images/CENTRO_ADMIN.png";
import supabase from "../config/supabaseClient";
import {
  X,
  ChevronRight,
  ChevronLeft,
  FileText,
  Image as ImageIcon,
  File,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS — single source of truth for column names
// These must match your Supabase Task_Reports and Task_Submissions column names
// ─────────────────────────────────────────────────────────────────────────────
const TASK_SUFFIXES = [
  "one", "two", "three", "four", "five",
  "six", "seven", "eight", "nine", "ten",
  "eleven", "twelve", "thirteen", "fourteen", "fifteen",
];

// Build column name arrays once
const DESC_KEYS    = TASK_SUFFIXES.map((s) => `description_${s}`); // description_one ... description_fifteen
const TASK_KEYS    = TASK_SUFFIXES.map((s) => `task_${s}`);        // task_one ... task_fifteen
const DEADLINE_KEYS = TASK_SUFFIXES.map((s) => `deadline_${s}`);    // deadline_one ... deadline_fifteen

// ─────────────────────────────────────────────────────────────────────────────
// File Preview Modal
// ─────────────────────────────────────────────────────────────────────────────
function FilePreviewModal({ isOpen, onClose, files, currentIndex, setCurrentIndex }) {
  const [loading, setLoading] = useState(true);
  const [zoom, setZoom] = useState(1);

  useEffect(() => {
    if (isOpen && files.length > 0 && currentIndex >= 0) {
      setLoading(true);
      setZoom(1);
      setTimeout(() => setLoading(false), 300);
    }
  }, [isOpen, currentIndex, files]);

  const handleBackdropClick = (e) => { if (e.target === e.currentTarget) onClose(); };
  if (!isOpen) return null;

  const currentFile = files[currentIndex];
  const isImage = currentFile?.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i);
  const isPDF   = currentFile?.url?.match(/\.pdf$/i);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn" onClick={handleBackdropClick}>
      <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" />
      <div
        className="relative bg-white rounded-xl shadow-2xl w-[815px] h-[817px] mx-4 z-[10000] flex flex-col border-2 border-gray-300"
        style={{ maxWidth: "calc(100vw - 32px)", maxHeight: "calc(100vh - 32px)" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between p-4 border-b bg-gray-50">
          <div className="flex-1 pr-4">
            {currentFile?.taskName && (() => {
              const parts = currentFile.taskName.split(":");
              const title = parts[0]?.trim() || "Task Description";
              const description = parts.slice(1).join(":").trim();
              return (
                <>
                  <h4 className="text-sm font-montserrat font-semibold text-gray-700 mb-2">{title}:</h4>
                  <ul className="list-none space-y-1">
                    {description.split("-").map((item, idx) =>
                      item.trim() && (
                        <li key={idx} className="text-sm text-gray-600 flex items-start">
                          <span className="text-emerald-600 mr-2">•</span>
                          <span>{item.trim()}</span>
                        </li>
                      )
                    )}
                  </ul>
                  <p className="text-center text-emerald-900 italic font-medium mt-3">{currentFile?.fileName}</p>
                </>
              );
            })()}
          </div>
          <a href={currentFile.url} target="_blank" rel="noopener noreferrer"
            className="flex-shrink-0 px-4 py-2 rounded-lg border-2 border-emerald-600 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm transition-all">
            Open in New Tab
          </a>
        </div>

        {/* Body */}
        <div className="flex-1 relative overflow-auto bg-gray-100">
          {loading ? (
            <div className="flex items-center justify-center h-full"><div className="text-gray-500">Loading...</div></div>
          ) : (
            <div className="w-full h-full flex items-center justify-center p-4">
              {isImage ? (
                <img src={currentFile.url} alt={currentFile.fileName} className="object-contain transition-transform duration-200"
                  style={{ transform: `scale(${zoom})`, maxWidth: "100%", maxHeight: "100%" }} />
              ) : isPDF ? (
                <div className="text-center">
                  <FileText className="w-20 h-20 text-red-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2 text-lg font-semibold">{currentFile.fileName}</p>
                  <p className="text-gray-600 mb-6">PDF Document</p>
                  <a href={currentFile.url} target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Open in New Tab
                  </a>
                </div>
              ) : (
                <div className="text-center">
                  <File className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-700 mb-2 text-lg font-semibold">{currentFile.fileName}</p>
                  <a href={currentFile.url} target="_blank" rel="noopener noreferrer"
                    className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-medium transition-colors">
                    Open in New Tab
                  </a>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">File {currentIndex + 1} of {files.length}</span>
              {isImage && (
                <div className="flex items-center gap-2">
                  <button onClick={() => setZoom((p) => Math.max(p - 0.25, 0.5))} disabled={zoom <= 0.5}
                    className={`p-2 rounded-lg border-2 transition-all ${zoom <= 0.5 ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"}`}>
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button onClick={() => setZoom(1)} className="p-2 rounded-lg border-2 bg-white border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700 transition-all">
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button onClick={() => setZoom((p) => Math.min(p + 0.25, 3))} disabled={zoom >= 3}
                    className={`p-2 rounded-lg border-2 transition-all ${zoom >= 3 ? "bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed" : "bg-white border-gray-300 text-gray-700 hover:bg-emerald-50 hover:border-emerald-500 hover:text-emerald-700"}`}>
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <span className="text-sm text-gray-600 ml-2">{Math.round(zoom * 100)}%</span>
                </div>
              )}
            </div>
            <button onClick={onClose} className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white text-gray-700 hover:bg-red-50 hover:border-red-500 hover:text-red-700 font-medium text-sm transition-all">
              Close
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}.animate-fadeIn{animation:fadeIn 0.2s ease-out}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Confirmation Modal
// ─────────────────────────────────────────────────────────────────────────────
function ConfirmationModal({ isOpen, onClose, onConfirm, action, count }) {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "unset";
    return () => (document.body.style.overflow = "unset");
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-2xl p-4 max-w-md w-full animate-scaleIn border-2 border-emerald-900">
        <div className={`text-center w-full p-4 rounded-xl font-montserrat font-bold text-2xl ${action === "Approve" ? "bg-emerald-100 text-emerald-900" : "bg-red-100 text-red-900"}`}>
          {action === "Approve" ? "Approval" : "Rejection"}
        </div>
        <div className="p-8 text-center">
          <p className="text-gray-700 text-lg leading-relaxed mb-8">
            Are you sure you want to <br />{action} {count} volunteer{count > 1 ? "s" : ""}?
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button onClick={onConfirm} className={`w-full sm:w-auto px-6 py-3 rounded-xl text-lg font-semibold text-white shadow-md cursor-pointer ${action === "Approve" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-red-600 hover:bg-red-700"} transition-all duration-200 hover:scale-105 active:scale-95`}>
              {action}
            </button>
            <button onClick={onClose} className="w-full sm:w-auto px-6 py-3 rounded-xl text-lg font-semibold cursor-pointer bg-gray-200 text-gray-800 border border-gray-300 hover:bg-gray-300 transition-all duration-200 hover:scale-105 active:scale-95">
              Cancel
            </button>
          </div>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}.animate-fadeIn{animation:fadeIn 0.2s ease-out}.animate-scaleIn{animation:scaleIn 0.2s ease-out}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Success Modal
// ─────────────────────────────────────────────────────────────────────────────
function SuccessModal({ isOpen, onClose, action, count }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      const timer = setTimeout(onClose, 2000);
      return () => { clearTimeout(timer); document.body.style.overflow = "unset"; };
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      <div className="relative bg-white rounded-xl shadow-2xl p-8 w-96 max-w-md mx-4 z-[10000] transform animate-scaleIn border-2 border-emerald-900">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-emerald-800 mb-2">Success!</h2>
          <p className="text-gray-600 text-lg">
            Successfully {action === "Approve" ? "Approved" : "Rejected"} {count} volunteer{count > 1 ? "s" : ""}
          </p>
        </div>
      </div>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes scaleIn{from{opacity:0;transform:scale(0.9)}to{opacity:1;transform:scale(1)}}.animate-fadeIn{animation:fadeIn 0.2s ease-out}.animate-scaleIn{animation:scaleIn 0.2s ease-out}`}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Task List Panel — Step 1: Choose which task to review
// ✅ DYNAMIC: reads ALL tasks from Task_Reports (description_one to description_fifteen)
// ─────────────────────────────────────────────────────────────────────────────
function TaskListPanel({ eventId, eventTitle, taskReport, volunteers, onSelectTask }) {
  // Build task list from all DESC_KEYS that have data in taskReport
  const tasks = TASK_SUFFIXES
    .map((suffix, idx) => ({
      number: idx + 1,
      taskKey: TASK_KEYS[idx],       // "task_one", "task_two", ...
      descKey: DESC_KEYS[idx],       // "description_one", "description_two", ...
    }))
    .filter((t) => taskReport?.[t.descKey]); // only show tasks that exist

  // Per-task stats: count how many volunteers submitted / approved / rejected / pending
  const getTaskStats = (taskKey) => {
    let pending = 0, approved = 0, rejected = 0, notSubmitted = 0;
    volunteers.forEach((v) => {
      const fileUrl = v.submission?.[taskKey];
      const status  = v.submission?.status;
      if (!fileUrl || !fileUrl.trim()) { notSubmitted++; return; }
      if (status === "ApproveD") approved++;
      else if (status === "RejectED") rejected++;
      else pending++;
    });
    return { pending, approved, rejected, notSubmitted };
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-full relative">
      {/* Header */}
      <div className="bg-emerald-900 text-center rounded-t-lg py-2 font-bold text-3xl text-white">
        {eventId}
      </div>

      {/* Close button */}
      <div className="absolute top-2 right-6 z-50">
        <Link to={`/event/${eventId}`}
          className="flex items-center justify-center bg-emerald-900 text-white rounded-full w-10 h-10 hover:bg-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105"
          title="Close and return to Event Page">
          <X className="w-5 h-5" />
        </Link>
      </div>

      <div className="p-6">
        <h1 className="text-center text-3xl font-bold text-emerald-900 mb-2">{eventTitle}</h1>
        <p className="text-center text-gray-500 text-sm mb-2">
          Select a task below to review volunteer submissions
        </p>

        {/* Overall summary bar */}
        <div className="mb-8 text-center text-sm text-gray-600 flex flex-wrap justify-center gap-6">
          <span>Total Volunteers: <span className="font-semibold">{volunteers.length}</span></span>
          <span>Approved: <span className="font-semibold text-emerald-700">{volunteers.filter(v => v.submission?.status === "ApproveD").length}</span></span>
          <span>Rejected: <span className="font-semibold text-red-600">{volunteers.filter(v => v.submission?.status === "RejectED").length}</span></span>
          <span>Pending: <span className="font-semibold text-orange-600">{volunteers.filter(v => !v.submission?.status || v.submission?.status === "PENDING").length}</span></span>
        </div>

        {/* Task cards — one per task that exists in Task_Reports */}
        <div className="space-y-4">
          {tasks.map((task) => {
            const stats   = getTaskStats(task.taskKey);
            const rawDesc = taskReport?.[task.descKey] || "";
            const parts   = rawDesc.split(":");
            const title   = parts[0]?.trim();
            const desc    = parts.slice(1).join(":").trim();

            return (
              <button
                key={task.number}
                onClick={() => onSelectTask(task.number)}
                className="w-full text-left bg-white border-2 border-gray-200 hover:bg-emerald-50 shadow-md hover:border-emerald-600 rounded-xl px-6 py-5 transition-all duration-200 hover:shadow-md group flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-start gap-4 flex-1">
                  {/* Task number badge */}
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-lg">
                    {task.number}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wide">
                        Task {task.number}
                      </span>
                    </div>
                    <h3 className="font-bold text-emerald-900 text-lg leading-tight">{title}</h3>
                    {desc && <p className="text-gray-500 text-sm mt-1 line-clamp-1">{desc}</p>}

                    {/* Per-task mini stats */}
                    <div className="flex gap-4 mt-3 text-xs">
                      <span className="flex items-center gap-1 text-orange-600">
                        <Clock className="w-3 h-3" />{stats.pending} pending
                      </span>
                      <span className="flex items-center gap-1 text-emerald-700">
                        <CheckCircle className="w-3 h-3" />{stats.approved} approved
                      </span>
                      <span className="flex items-center gap-1 text-red-500">
                        <XCircle className="w-3 h-3" />{stats.rejected} rejected
                      </span>
                      {stats.notSubmitted > 0 && (
                        <span className="text-gray-400">{stats.notSubmitted} not submitted</span>
                      )}
                    </div>
                  </div>
                </div>

                <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-emerald-600 flex-shrink-0 ml-4 transition-colors" />
              </button>
            );
          })}

          {tasks.length === 0 && (
            <div className="text-center py-12 text-gray-400 italic">
              No tasks configured for this event.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Task Detail Panel — Step 2: Review submissions for one specific task
// ✅ DYNAMIC: uses taskNumber to find the right column names
// ─────────────────────────────────────────────────────────────────────────────
function TaskDetailPanel({ eventId, eventTitle, taskNumber, taskReport, volunteers, onBack, onRefresh }) {
  // Convert taskNumber (1-based) to array index (0-based)
  const idx     = taskNumber - 1;
  const taskKey = TASK_KEYS[idx];   // e.g. "task_three" for taskNumber=3
  const descKey = DESC_KEYS[idx];   // e.g. "description_three"

  const rawDesc  = taskReport?.[descKey] || "";
  const parts    = rawDesc.split(":");
  const taskTitle = parts[0]?.trim() || `Task ${taskNumber}`;
  const taskDesc  = parts.slice(1).join(":").trim();

  // Deadline if available
  const deadline  = taskReport?.[DEADLINE_KEYS[idx]];

  const [selectedVolunteers, setSelectedVolunteers] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [individualModalOpen, setIndividualModalOpen] = useState(false);
  const [individualAction, setIndividualAction] = useState("");
  const [individualVolunteerId, setIndividualVolunteerId] = useState(null);
  const [updating, setUpdating] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successAction, setSuccessAction] = useState("");
  const [successCount, setSuccessCount] = useState(0);
  const [filePreviewOpen, setFilePreviewOpen] = useState(false);
  const [previewFiles, setPreviewFiles] = useState([]);
  const [currentFileIndex, setCurrentFileIndex] = useState(0);

  // Only show volunteers who submitted this specific task
  const relevantVolunteers = volunteers.filter((v) => {
    const fileUrl = v.submission?.[taskKey];
    return fileUrl && fileUrl.trim();
  });

  const pendingVolunteers = relevantVolunteers.filter(
    (v) => v.submission?.status !== "ApproveD" && v.submission?.status !== "RejectED"
  );

  // Sort: unprocessed first, then alphabetically by ID
  const sortedVolunteers = [...relevantVolunteers].sort((a, b) => {
    const aProcessed = ["ApproveD", "RejectED"].includes(a.submission?.status);
    const bProcessed = ["ApproveD", "RejectED"].includes(b.submission?.status);
    if (aProcessed && !bProcessed) return 1;
    if (!aProcessed && bProcessed) return -1;
    return a.volunteer_id.localeCompare(b.volunteer_id, undefined, { numeric: true, sensitivity: "base" });
  });

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    try {
      const parts = url.split("/");
      const decoded = decodeURIComponent(parts[parts.length - 1]);
      const match = decoded.match(/^\d+_(.+)$/);
      return match ? match[1] : decoded;
    } catch { return url; }
  };

  const getFileType = (url) => {
    if (!url) return "unknown";
    const ext = url.split(".").pop().toLowerCase();
    if (["jpg", "jpeg", "png", "gif", "webp", "svg"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    if (["doc", "docx"].includes(ext)) return "document";
    return "file";
  };

  const getFileIcon = (fileType) => {
    switch (fileType) {
      case "image":    return <ImageIcon className="w-4 h-4 text-blue-600" />;
      case "pdf":      return <FileText  className="w-4 h-4 text-red-600"  />;
      case "document": return <FileText  className="w-4 h-4 text-blue-700" />;
      default:         return <File      className="w-4 h-4 text-gray-600" />;
    }
  };

  const handleFileClick = (volunteer) => {
    const url = volunteer.submission?.[taskKey];
    if (!url) return;
    setPreviewFiles([{
      url,
      fileName: getFileNameFromUrl(url),
      taskName: rawDesc,
      fileType: getFileType(url),
    }]);
    setCurrentFileIndex(0);
    setFilePreviewOpen(true);
  };

  const updateStatus = async (volunteerIds, action) => {
    try {
      setUpdating(true);
      const selectedVols = volunteers.filter((v) => volunteerIds.includes(v.id));
      const userIds = selectedVols.map((v) => v.volunteer_id);
      const submissionStatus = action === "Approve" ? "ApproveD" : "RejectED";

      const { error } = await supabase
        .from("Task_Submissions")
        .update({ status: submissionStatus })
        .eq("event_id", eventId)
        .in("user_id", userIds);

      if (error) throw error;
      await onRefresh();
    } catch (err) {
      console.error("Update error:", err);
      alert(`Failed to update status: ${err.message || "Unknown error"}`);
    } finally {
      setUpdating(false);
    }
  };

  const handleBulkAction = (action) => {
    if (selectedVolunteers.length === 0) { alert("Please select at least one volunteer."); return; }
    setBulkAction(action);
    setModalOpen(true);
  };

  const handleConfirm = async () => {
    setModalOpen(false);
    const count = selectedVolunteers.length;
    await updateStatus(selectedVolunteers, bulkAction);
    setSelectedVolunteers([]);
    setSuccessAction(bulkAction);
    setSuccessCount(count);
    setSuccessModalOpen(true);
  };

  const handleIndividualAction = (volunteerId, action) => {
    setIndividualVolunteerId(volunteerId);
    setIndividualAction(action);
    setIndividualModalOpen(true);
  };

  const handleIndividualConfirm = async () => {
    setIndividualModalOpen(false);
    await updateStatus([individualVolunteerId], individualAction);
    setSuccessAction(individualAction);
    setSuccessCount(1);
    setSuccessModalOpen(true);
  };

  const toggleSelect   = (id) => setSelectedVolunteers((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  const handleSelectAll = (checked) => setSelectedVolunteers(checked ? pendingVolunteers.map((v) => v.id) : []);

  const formatDeadline = (ts) => {
    if (!ts) return null;
    try {
      return new Date(ts).toLocaleString("en-US", {
        year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit",
      });
    } catch { return ts; }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg max-w-full relative">
      {/* Header */}
      <div className="bg-emerald-900 text-center rounded-t-lg py-2 font-bold text-3xl text-white">
        {eventId}
      </div>

      {/* Close button */}
      <div className="absolute top-2 right-6 z-50">
        <Link to={`/event/${eventId}`}
          className="flex items-center justify-center bg-emerald-900 text-white rounded-full w-10 h-10 hover:bg-emerald-700 shadow-lg transition-all duration-300 transform hover:scale-105"
          title="Close and return to Event Page">
          <X className="w-5 h-5" />
        </Link>
      </div>

      <div className="p-6">
        {/* Back button */}
        <div className="flex items-center gap-3 mb-2">
          <button onClick={onBack} className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-medium text-sm transition-colors cursor-pointer">
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        </div>

        <h1 className="text-center text-3xl font-bold text-emerald-900 mb-1">{eventTitle}</h1>

        {/* Task info card */}
        <div className="mx-auto max-w-2xl bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 mt-4">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-emerald-900 text-white flex items-center justify-center font-bold text-base">
              {taskNumber}
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-emerald-600 uppercase tracking-wide mb-1">Task {taskNumber}</p>
              <h2 className="font-bold text-emerald-900 text-xl">{taskTitle}</h2>
              {taskDesc && (
                <div className="mt-1">
                  {taskDesc.split("-").map((item, i) =>
                    item.trim() ? (
                      <p key={i} className="text-gray-600 text-sm flex items-start gap-1">
                        <span className="text-emerald-500 mt-0.5">•</span>{item.trim()}
                      </p>
                    ) : null
                  )}
                </div>
              )}
              {deadline && (
                <p className="text-xs text-amber-700 mt-2 font-semibold">
                  📅 Deadline: {formatDeadline(deadline)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-5 text-center text-sm text-gray-600 flex flex-wrap justify-center gap-6">
          <span>Submitted: <span className="font-semibold">{relevantVolunteers.length}</span></span>
          <span>Approved: <span className="font-semibold text-emerald-700">{relevantVolunteers.filter(v => v.submission?.status === "ApproveD").length}</span></span>
          <span>Rejected: <span className="font-semibold text-red-600">{relevantVolunteers.filter(v => v.submission?.status === "RejectED").length}</span></span>
          <span>Pending: <span className="font-semibold text-orange-600">{pendingVolunteers.length}</span></span>
        </div>

        {/* Bulk action buttons */}
        {pendingVolunteers.length > 0 && (
          <div className="flex justify-start gap-3 mb-4">
            <button onClick={() => handleBulkAction("Approve")} disabled={selectedVolunteers.length === 0 || updating}
              className={`px-6 py-2 rounded-full font-bold text-white cursor-pointer ${selectedVolunteers.length > 0 && !updating ? "bg-emerald-700 hover:bg-emerald-800" : "bg-gray-400 cursor-not-allowed"}`}>
              {updating ? "Processing..." : "Approve"}
            </button>
            <button onClick={() => handleBulkAction("Reject")} disabled={selectedVolunteers.length === 0 || updating}
              className={`px-6 py-2 rounded-full font-bold text-white cursor-pointer ${selectedVolunteers.length > 0 && !updating ? "bg-red-500 hover:bg-red-700" : "bg-gray-400 cursor-not-allowed"}`}>
              {updating ? "Processing..." : "Reject"}
            </button>
          </div>
        )}

        {/* Volunteer table */}
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border border-gray-400">
            <thead>
              <tr className="bg-emerald-900 text-white text-lg font-bold">
                <th className="px-6 py-3 border border-gray-400 text-center w-16">
                  {pendingVolunteers.length > 0 && (
                    <input type="checkbox"
                      checked={selectedVolunteers.length > 0 && selectedVolunteers.length === pendingVolunteers.length}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                      disabled={updating} />
                  )}
                </th>
                <th className="px-6 py-3 border border-gray-400 text-center">Volunteer ID</th>
                <th className="px-6 py-3 border border-gray-400 text-center">Name</th>
                <th className="px-6 py-3 border border-gray-400 text-center">Submitted File</th>
                <th className="px-6 py-3 border border-gray-400 text-center">Certificate Status</th>
              </tr>
            </thead>
            <tbody className="text-center text-emerald-900 bg-white">
              {sortedVolunteers.length > 0 ? (
                sortedVolunteers.map((v) => {
                  const fileUrl = v.submission?.[taskKey];
                  const fileName = getFileNameFromUrl(fileUrl);
                  const fileType = getFileType(fileUrl);
                  const isPending = v.submission?.status !== "ApproveD" && v.submission?.status !== "RejectED";

                  return (
                    <tr key={v.id} className="hover:bg-gray-50">
                      <td className="px-4 py-2 border border-gray-400 font-medium">
                        {isPending && (
                          <input type="checkbox"
                            checked={selectedVolunteers.includes(v.id)}
                            onChange={() => toggleSelect(v.id)}
                            className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 cursor-pointer"
                            disabled={updating} />
                        )}
                      </td>
                      <td className="px-4 py-2 border border-gray-400 font-medium">{v.volunteer_id}</td>
                      <td className="px-4 py-2 border border-gray-400 font-medium">{v.name}</td>
                      <td className="px-4 py-2 border border-gray-400 font-medium">
                        {fileUrl ? (
                          <button onClick={() => handleFileClick(v)}
                            className="flex items-center gap-2 mx-auto text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 px-2 py-1 rounded transition-colors cursor-pointer">
                            {getFileIcon(fileType)}
                            <span className="underline text-sm">{fileName}</span>
                          </button>
                        ) : (
                          <span className="text-gray-400 italic text-sm">Not submitted</span>
                        )}
                      </td>
                      <td className="px-4 py-4 border border-gray-400 font-medium">
                        {v.submission?.status === "ApproveD" ? (
                          <span className="px-4 py-2 rounded-full font-bold text-white text-sm bg-emerald-600">Approved</span>
                        ) : v.submission?.status === "RejectED" ? (
                          <span className="px-4 py-2 rounded-full font-bold text-white text-sm bg-red-500">Rejected</span>
                        ) : (
                          <div className="flex justify-center gap-2">
                            <button onClick={() => handleIndividualAction(v.id, "Approve")} disabled={updating}
                              className={`${updating ? "bg-gray-400 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-700"} text-white px-4 py-1 rounded-full font-medium text-sm transition-colors cursor-pointer`}>
                              {updating ? "..." : "Approve"}
                            </button>
                            <button onClick={() => handleIndividualAction(v.id, "Reject")} disabled={updating}
                              className={`${updating ? "bg-gray-400 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"} text-white px-4 py-1 rounded-full font-medium text-sm transition-colors cursor-pointer`}>
                              {updating ? "..." : "Reject"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-4 py-8 text-center text-gray-500">
                    No volunteers have submitted this task yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <ConfirmationModal isOpen={modalOpen}           onClose={() => setModalOpen(false)}           onConfirm={handleConfirm}           action={bulkAction}         count={selectedVolunteers.length} />
      <ConfirmationModal isOpen={individualModalOpen} onClose={() => setIndividualModalOpen(false)} onConfirm={handleIndividualConfirm} action={individualAction}   count={1} />
      <SuccessModal      isOpen={successModalOpen}    onClose={() => setSuccessModalOpen(false)}                                        action={successAction}       count={successCount} />
      <FilePreviewModal  isOpen={filePreviewOpen}     onClose={() => setFilePreviewOpen(false)}     files={previewFiles}                currentIndex={currentFileIndex} setCurrentIndex={setCurrentFileIndex} />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page Component
// ─────────────────────────────────────────────────────────────────────────────
function MultipleEventPage() {
  const { eventId } = useParams();
  const [eventTitle, setEventTitle]     = useState("");
  const [loadingTitle, setLoadingTitle] = useState(true);
  const [volunteers, setVolunteers]     = useState([]);
  const [taskReport, setTaskReport]     = useState(null);
  const [selectedTask, setSelectedTask] = useState(null); // null = task list view; 1-15 = detail view
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );

  const fetchEventDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("Event_Information")
        .select("event_title")
        .eq("event_id", eventId)
        .single();
      if (error) throw error;
      setEventTitle(data?.event_title || "Untitled Event");
    } catch (err) {
      console.error("Error fetching event title:", err);
      setEventTitle("Untitled Event");
    } finally {
      setLoadingTitle(false);
    }
  };

  const fetchVolunteers = async () => {
    try {
      // 1. Get all users in this event
      const { data: eventUsers, error: eventError } = await supabase
        .from("Event_User")
        .select("user_id, userEvent_id")
        .eq("event_id", eventId);
      if (eventError) throw eventError;
      if (!eventUsers || eventUsers.length === 0) { setVolunteers([]); return; }

      const userIds = eventUsers.map((eu) => eu.user_id);

      // 2. Get volunteer names
      const { data: users } = await supabase
        .from("LoginInformation")
        .select("user_id, firstname, lastname")
        .in("user_id", userIds);

      // 3. Fetch ALL Task_Reports columns (description_one through description_fifteen + deadlines)
      //    Using select("*") so we never miss a column
      const { data: taskReportData, error: taskError } = await supabase
        .from("Task_Reports")
        .select("*")
        .eq("event_id", eventId)
        .single();

      if (taskError && taskError.code !== "PGRST116") {
        console.error("Error fetching task descriptions:", taskError);
      }
      setTaskReport(taskReportData || null);

      // 4. Fetch ALL Task_Submissions columns (task_one through task_fifteen + status)
      //    Using select("*") so we never miss a task column
      const { data: taskSubmissions } = await supabase
        .from("Task_Submissions")
        .select("*")
        .eq("event_id", eventId)
        .in("user_id", userIds);

      // Build a quick lookup: user_id → submission row
      const submissionMap = {};
      taskSubmissions?.forEach((sub) => { submissionMap[sub.user_id] = sub; });

      // 5. Combine everything into volunteer objects
      const volunteersData = eventUsers.map((eu) => {
        const user       = users?.find((u) => u.user_id === eu.user_id);
        const submission = submissionMap[eu.user_id] || null;
        return {
          id:           eu.userEvent_id,
          volunteer_id: eu.user_id,
          name:         user ? `${user.firstname} ${user.lastname}` : "Unknown",
          submission,
          taskReport:   taskReportData,
        };
      });

      setVolunteers(volunteersData);
    } catch (err) {
      console.error("Error fetching volunteers:", err);
      setVolunteers([]);
    }
  };

  useEffect(() => {
    if (eventId) {
      fetchEventDetails();
      fetchVolunteers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [eventId]);

  return (
    <div className="flex min-h-screen bg-no-repeat bg-center"
      style={{ backgroundImage: `url(${CentroAdminBg})`, backgroundSize: "100% 100%" }}>
      <Sidebar onCollapseChange={setSidebarCollapsed} />

      <main className="flex-1 p-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}>
        {selectedTask === null ? (
          <TaskListPanel
            eventId={eventId}
            eventTitle={loadingTitle ? "Loading..." : eventTitle}
            taskReport={taskReport}
            volunteers={volunteers}
            onSelectTask={setSelectedTask}
          />
        ) : (
          <TaskDetailPanel
            eventId={eventId}
            eventTitle={loadingTitle ? "Loading..." : eventTitle}
            taskNumber={selectedTask}
            taskReport={taskReport}
            volunteers={volunteers}
            onBack={() => setSelectedTask(null)}
            onRefresh={fetchVolunteers}
          />
        )}
      </main>
    </div>
  );
}

export default MultipleEventPage;