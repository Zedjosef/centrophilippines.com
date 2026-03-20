// src/pages/EventPage.jsx - Complete Dynamic Event Page with Report Generation
  import React, { useState, useEffect } from "react";
  import { Link, useParams, useNavigate } from "react-router-dom";
  import Sidebar from "../components/Sidebar";
  import CentroAdminBg from "../images/CENTRO_ADMIN.png";
  import supabase from "../config/supabaseClient";
  import jsPDF from "jspdf";
  import "jspdf-autotable";

  // PDF Generation Loading Overlay
  function PDFLoadingOverlay({ isVisible }) {
    if (!isVisible) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-9999 flex items-center justify-center">
        <div className="bg-white p-10 rounded-2xl shadow-2xl flex flex-col items-center gap-5 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center opacity-10">
            <div className="w-32 h-32 bg-emerald-600 rounded-full animate-ping"></div>
          </div>
          <div className="relative">
            <svg className="animate-spin h-16 w-16" viewBox="0 0 50 50">
              <circle className="opacity-25" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" style={{ color: '#10b981' }} />
              <circle className="opacity-75" cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" fill="none" strokeDasharray="80" strokeDashoffset="60" strokeLinecap="round" style={{ color: '#059669' }} />
            </svg>
          </div>
          <div className="flex gap-2">
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-emerald-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
          <div className="text-center z-10">
            <p className="text-emerald-700 font-bold text-xl mb-2">Generating PDF Report</p>
            <p className="text-gray-600 text-sm">This may take a few moments...</p>
          </div>
        </div>
      </div>
    );
  }

  // Validation Error Popup
  function ValidationErrorPopup({ message, onClose }) {
    if (!message) return null;
    return (
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-[0_8px_25px_rgba(0,0,0,0.25)] w-full max-w-sm border border-red-300 overflow-hidden">
          <div className="bg-red-600 px-6 py-3">
            <h3 className="text-lg font-semibold text-white tracking-wide">Error</h3>
          </div>
          <div className="px-6 py-5 bg-white">
            <p className="text-gray-800 text-[15px] leading-relaxed">{message}</p>
          </div>
          <div className="px-6 py-3 flex justify-end">
            <button onClick={onClose} className="px-5 py-2 bg-red-600 text-white rounded-md font-medium shadow hover:bg-red-700 transition-all active:scale-95 cursor-pointer">OK</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Task Detail Modal ────────────────────────────────────────────────────────
  function TaskDetailModal({ task, onClose }) {
    if (!task) return null;
    const fmtTime = (t) => {
      if (!t) return null;
      const [h, m] = t.split(':');
      const hr = parseInt(h);
      return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
    };
    const fmtDate = (d) => {
      if (!d) return null;
      return new Date(d + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };
    const parsedBullets = task.description
      ? String(task.description).split('-').map(s => s.trim()).filter(Boolean)
      : [];
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center p-4" onClick={onClose}>
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ width: '480px', maxHeight: '85vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
          <div style={{ background: 'linear-gradient(135deg, #064e3b, #065f46)' }} className="px-6 py-5 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: '#065f46', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: 'white', fontWeight: 700, fontSize: 14, fontFamily: 'Montserrat, sans-serif' }}>{task.index + 1}</span>
              </div>
              <div>
                <p className="text-white font-montserrat text-xs font-semibold uppercase tracking-wider">Task {task.index + 1}</p>
                <h3 className="text-white font-bold font-montserrat text-lg leading-tight">{task.title}</h3>
              </div>
            </div>
            <button onClick={onClose} className="cursor-pointer" style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
          <div className="px-6 py-5" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div style={{ width: 3, height: 16, background: '#065f46', borderRadius: 2 }} />
                <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-montserrat">Task Details</p>
              </div>
              {parsedBullets.length > 1 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {parsedBullets.map((bullet, i) => (
                    <div key={i} className="flex items-start gap-3" style={{ background: '#f0fdf4', borderRadius: 10, padding: '10px 12px', border: '1px solid #d1fae5' }}>
                      <span style={{ width: 22, height: 22, borderRadius: '50%', background: '#065f46', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700, flexShrink: 0, marginTop: 1 }}>{i + 1}</span>
                      <span className="text-gray-700 font-montserrat text-sm leading-relaxed">{bullet}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#f0fdf4', borderRadius: 10, padding: '12px 14px', border: '1px solid #d1fae5' }}>
                  <p className="text-gray-700 font-montserrat text-sm leading-relaxed">{task.description || "No description provided."}</p>
                </div>
              )}
            </div>
            {(task.startDate || task.endDate) && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div style={{ width: 3, height: 16, background: '#065f46', borderRadius: 2 }} />
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider font-montserrat">Schedule</p>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  {task.startDate && (
                    <div style={{ background: '#f0fdf4', border: '1px solid #a7f3d0', borderRadius: 12, padding: '14px 16px' }}>
                      <div className="flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-emerald-600 font-montserrat font-bold" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Start</p>
                      </div>
                      <p className="text-emerald-900 font-montserrat font-bold text-sm">{fmtDate(task.startDate)}</p>
                    </div>
                  )}
                  {task.endDate && (
                    <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 12, padding: '14px 16px' }}>
                      <div className="flex items-center gap-1 mb-2">
                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#ea580c" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        <p className="text-orange-600 font-montserrat font-bold" style={{ fontSize: 10, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Deadline</p>
                      </div>
                      <p className="text-orange-900 font-montserrat font-bold text-sm">{fmtDate(task.endDate)}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div style={{ padding: '0 24px 24px', display: 'flex', justifyContent: 'flex-end' }}>
            <button onClick={onClose} className="cursor-pointer font-montserrat font-semibold" style={{ padding: '10px 28px', background: '#065f46', color: 'white', borderRadius: 10, border: 'none', fontSize: 14, transition: 'background 0.2s' }} onMouseEnter={e => e.target.style.background = '#047857'} onMouseLeave={e => e.target.style.background = '#065f46'}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── Individual Task Card ─────────────────────────────────────────────────────
  function TaskCard({ task, onOpenModal }) {
    const fmtTime = (t) => {
      if (!t) return null;
      const parts = t.split(':');
      const h = parseInt(parts[0]);
      const m = parts[1];
      const ampm = h >= 12 ? 'PM' : 'AM';
      return `${h % 12 || 12}:${m} ${ampm}`;
    };
    const fmtDate = (d) => {
      if (!d) return null;
      const dt = new Date(d + 'T00:00:00');
      return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };
    const startTimeStr = fmtTime(task.startTime);
    const endTimeStr = fmtTime(task.endTime);
    const startDateStr = fmtDate(task.startDate);
    const endDateStr = fmtDate(task.endDate);
    return (
      <button onClick={() => onOpenModal(task)} className="w-full flex items-stretch gap-0 bg-white hover:bg-emerald-50 border border-emerald-200 hover:border-emerald-400 rounded-2xl shadow-sm hover:shadow-md transition-all cursor-pointer group overflow-hidden">
        <div className="w-2 bg-emerald-700 group-hover:bg-emerald-500 transition-colors flex-shrink-0 rounded-l-2xl" />
        <div className="flex items-center justify-center px-4 bg-emerald-50 group-hover:bg-emerald-100 transition-colors flex-shrink-0">
          <span className="w-9 h-9 bg-emerald-800 text-white rounded-full flex items-center justify-center font-bold text-sm font-montserrat">{task.index + 1}</span>
        </div>
        <div className="flex-1 py-4 px-4 text-left min-w-0">
          <p className="font-bold text-emerald-900 font-montserrat text-base leading-tight">{task.title}</p>
          <div className="flex flex-wrap gap-4 mt-2">
            {startDateStr && endDateStr && (
              <span className="flex items-center gap-1 text-xs text-emerald-700 font-montserrat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                <span className="font-semibold">{startDateStr} – {endDateStr}</span>
              </span>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {task.startDate && (() => {
              const now = new Date();
              const start = new Date(`${task.startDate}T${task.startTime || '00:00:00'}Z`);
              const end = new Date(`${task.endDate}T${task.endTime || '23:59:59'}Z`);
              const diffToStart = start - now;
              const diffToEnd = end - now;
              if (diffToEnd < 0) return <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-xs font-bold font-montserrat px-3 py-1 rounded-full">✓ Done</span>;
              else if (diffToStart <= 0) { const hLeft = Math.floor(diffToEnd / 3600000); const mLeft = Math.floor((diffToEnd % 3600000) / 60000); return <span className="inline-flex items-center gap-1 bg-emerald-500 text-white text-xs font-bold font-montserrat px-3 py-1 rounded-full animate-pulse">🟢 Active · {hLeft}h {mLeft}m left</span>; }
              else { const dAway = Math.floor(diffToStart / 86400000); const hAway = Math.floor((diffToStart % 86400000) / 3600000); return <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-bold font-montserrat px-3 py-1 rounded-full">🕐 {dAway > 0 ? `${dAway}d ` : ''}{hAway}h away</span>; }
            })()}
            {!startDateStr && task.deadline && <span className="text-xs text-gray-400 font-montserrat">Deadline: {new Date(task.deadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>}
          </div>
        </div>
        <div className="flex items-center pr-4 pl-2 flex-shrink-0">
          <span className="w-8 h-8 rounded-full bg-emerald-800 text-white flex items-center justify-center group-hover:bg-emerald-600 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
          </span>
        </div>
      </button>
    );
  }

  // ─── Info Card Component ──────────────────────────────────────────────────────
  function InfoCard({ title, icon, accentColor, bgColor, borderColor, items = [], text = null }) {
    return (
      <div style={{
        background: 'white', borderRadius: '14px', overflow: 'hidden',
        border: `1px solid ${borderColor || '#e5e7eb'}`,
        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          background: bgColor, padding: '11px 16px',
          display: 'flex', alignItems: 'center', gap: '10px',
          borderBottom: `1px solid ${borderColor || '#e5e7eb'}`,
        }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', flexShrink: 0 }}>
            {icon}
          </div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 12, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>
            {title}
          </p>
        </div>
        <div style={{ padding: '14px 16px', flex: 1 }}>
          {text ? (
            <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, color: '#374151', lineHeight: 1.65, margin: 0 }}>{text}</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item, index) => (
                <div key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: accentColor, flexShrink: 0, marginTop: 6 }} />
                  <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, color: '#374151', lineHeight: 1.55, margin: 0 }}>{item.trim()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── Event Info Card (compact, fixed height for grid use) ────────────────────
  function EventInfoCard({ label, accentColor, bgColor, borderColor, icon, children }) {
    return (
      <div style={{
        background: 'white', borderRadius: 12, overflow: 'hidden',
        border: `1px solid ${borderColor}`,
        boxShadow: '0 2px 6px rgba(0,0,0,0.06)',
        display: 'flex', flexDirection: 'column', flex: 1,
      }}>
        {/* Header strip */}
        <div style={{
          background: bgColor, padding: '8px 12px',
          display: 'flex', alignItems: 'center', gap: 8,
          borderBottom: `1px solid ${borderColor}`,
        }}>
          <div style={{ width: 26, height: 26, borderRadius: 7, background: accentColor, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            {icon}
          </div>
          <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 700, fontSize: 11, color: accentColor, textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{label}</p>
        </div>
        {/* Body */}
        <div style={{ padding: '10px 12px', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          {children}
        </div>
      </div>
    );
  }

  // ─── Tasks Section ────────────────────────────────────────────────────────────
  function TasksSection({ eventId, eventData }) {
    const [tasks, setTasks] = useState([]);
    const [loadingTasks, setLoadingTasks] = useState(true);
    const [isMultipleEvent, setIsMultipleEvent] = useState(false);
    const [selectedTask, setSelectedTask] = useState(null);
    const SUFFIXES = ["one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve","thirteen","fourteen","fifteen"];

    useEffect(() => { if (!eventId) return; fetchTasks(); }, [eventId]);

    const fetchTasks = async () => {
      try {
        setLoadingTasks(true);
        const { data, error } = await supabase.from("Task_Reports").select("*").eq("event_id", eventId).single();
        if (error || !data) { setIsMultipleEvent(false); setTasks([]); return; }
        const parsedTasks = [];
        SUFFIXES.forEach((suffix, index) => {
          const desc = data[`description_${suffix}`];
          if (desc && String(desc).trim().length > 0) {
            const raw = String(desc).trim();
            const colonIndex = raw.indexOf(":");
            let title = `Task ${index + 1}`, description = raw;
            if (colonIndex > -1 && colonIndex <= 60) { const pt = raw.substring(0, colonIndex).trim(); const pd = raw.substring(colonIndex + 1).trim(); if (pt.length > 0) { title = pt; description = pd; } }
            const startRaw = data[`task_start_${suffix}`] || null;
            const endRaw = data[`task_end_${suffix}`] || null;
            const parseTimestamp = (raw) => {
              if (!raw) return { date: null, time: null };
              const d = new Date(raw); if (isNaN(d)) return { date: null, time: null };
              const date = d.toISOString().split('T')[0];
              const hours = String(d.getUTCHours()).padStart(2, '0');
              const minutes = String(d.getUTCMinutes()).padStart(2, '0');
              return { date, time: `${hours}:${minutes}:00` };
            };
            const { date: startDate, time: startTime } = parseTimestamp(startRaw);
            const { date: endDate, time: endTime } = parseTimestamp(endRaw);
            parsedTasks.push({ index, title, description, deadline: endRaw, startDate, endDate, startTime, endTime });
          }
        });
        if (parsedTasks.length > 0) { setIsMultipleEvent(true); setTasks(parsedTasks); }
        else { setIsMultipleEvent(false); setTasks([]); }
      } catch (err) { console.error("fetchTasks error:", err); setIsMultipleEvent(false); setTasks([]); }
      finally { setLoadingTasks(false); }
    };

    if (loadingTasks) return null;
    if (!isMultipleEvent || tasks.length === 0) return null;
    return (
      <>
        {selectedTask && <TaskDetailModal task={selectedTask} onClose={() => setSelectedTask(null)} />}
        <div className="border-t border-emerald-100 pt-5 mt-2">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-xl text-emerald-900 font-montserrat">Event Tasks</h3>
            <span className="bg-emerald-100 text-emerald-800 text-sm font-semibold font-montserrat rounded-full px-3 py-1">{tasks.length}</span>
          </div>
          <p className="text-xs text-gray-400 font-montserrat mb-3 pl-1">{eventData?.event_id} · {eventData?.event_title}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', width: '100%' }}>
            {tasks.map((task) => <TaskCard key={task.index} task={task} onOpenModal={setSelectedTask} />)}
          </div>
        </div>
      </>
    );
  }
  // ─────────────────────────────────────────────────────────────────────────────

  function EventPage() {
    const { eventId } = useParams();
    const navigate = useNavigate();
    const [activeButton, setActiveButton] = useState("Event Details");
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [validationError, setValidationError] = useState("");
    const [error, setError] = useState("");
    const [eventImage, setEventImage] = useState(null);
    const [volunteerStats, setVolunteerStats] = useState({ totalJoined: 0, totalLimit: 0, submissions: 0, ongoingCount: 0, pendingCount: 0 });
    const [ngoLogo, setNgoLogo] = useState("");
    const [ngoName, setNgoName] = useState("");
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);
    const [currentStatus, setCurrentStatus] = useState("");
    const [sidebarCollapsed, setSidebarCollapsed] = useState(localStorage.getItem("sidebarCollapsed") === "true" || false);
    const eventColors = ["bg-emerald-800/90"];

    const calculateEventStatus = (eventDate, startTime, endTime) => {
      if (!eventDate || !startTime || !endTime) return "UPCOMING";
      const now = new Date();
      const eventDateObj = new Date(eventDate);
      const [startHours, startMinutes] = startTime.split(':');
      const eventStart = new Date(eventDateObj);
      eventStart.setHours(parseInt(startHours), parseInt(startMinutes), 0);
      const [endHours, endMinutes] = endTime.split(':');
      const eventEnd = new Date(eventDateObj);
      eventEnd.setHours(parseInt(endHours), parseInt(endMinutes), 0);
      if (now < eventStart) return "UPCOMING";
      else if (now >= eventStart && now <= eventEnd) return "ONGOING";
      else return "COMPLETED";
    };

    useEffect(() => {
      if (!eventData) return;
      const updateStatus = () => {
        const newStatus = calculateEventStatus(eventData.date, eventData.time_start, eventData.time_end);
        setCurrentStatus(newStatus);
        if (newStatus !== eventData.status) updateEventStatusInDB(newStatus);
      };
      updateStatus();
      const interval = setInterval(updateStatus, 60000);
      return () => clearInterval(interval);
    }, [eventData]);

    const updateEventStatusInDB = async (newStatus) => {
      try {
        const { error } = await supabase.from("Event_Information").update({ status: newStatus }).eq("event_id", eventId);
        if (error) throw error;
        setEventData(prev => ({ ...prev, status: newStatus }));
      } catch (err) { console.error("Error updating event status:", err); }
    };

    useEffect(() => { if (eventId) { fetchEventData(); fetchVolunteerStats(); fetchNgoDetails(); } }, [eventId]);

    const fetchEventData = async () => {
      try {
        setLoading(true);
        const adminData = JSON.parse(localStorage.getItem("admin"));
        if (!adminData || !adminData.NGO_Information) { setError("Admin session not found. Please log in again."); setTimeout(() => navigate("/login"), 2000); return; }
        const adminNgoCode = adminData.NGO_Information.ngo_code;
        const { data, error } = await supabase.from("Event_Information").select("*").eq("event_id", eventId).single();
        if (error) throw error;
        if (!data) { setError("Event not found"); return; }
        if (data.ngo_id !== adminNgoCode) { setError("You don't have permission to view this event"); return; }
        setEventData(data);
        if (data.event_image) setEventImage(data.event_image);
        setError("");
      } catch (err) { console.error("Error fetching event:", err); setError("Failed to load event data"); }
      finally { setLoading(false); }
    };

    const fetchNgoDetails = async () => {
      try {
        const adminData = JSON.parse(localStorage.getItem("admin"));
        const adminId = adminData?.admin_id;
        if (!adminId) return;
        const { data, error } = await supabase.from("NGO_Information").select("ngo_logo, name").eq("admin_id", adminId).single();
        if (error) throw error;
        setNgoLogo(data?.ngo_logo || "");
        setNgoName(data?.name || "CENTRO Organization");
      } catch (err) { console.error("Error fetching NGO details:", err); }
    };

    const fetchVolunteerStats = async () => {
      try {
        const { data: eventUsers, error: volError } = await supabase.from("Event_User").select("user_id, status").eq("event_id", eventId);
        if (volError) { console.error("Error fetching volunteers:", volError); return; }
        if (!eventUsers || eventUsers.length === 0) { setVolunteerStats({ totalJoined: 0, submissions: 0, ongoingCount: 0, pendingCount: 0 }); return; }
        const ongoingCount = eventUsers.filter(v => v.status === "ONGOING").length;
        const pendingCount = eventUsers.filter(v => v.status === "PENDING").length;
        const totalJoined = eventUsers.length;
        const userIds = eventUsers.map(v => v.user_id);
        const { data: taskSubmissions, error: submissionsError } = await supabase.from("Task_Submissions").select("user_id, task_one, task_two, task_three, status").eq("event_id", eventId).in("user_id", userIds);
        if (submissionsError) console.error("Error fetching task submissions:", submissionsError);
        const completeSubmissions = taskSubmissions ? taskSubmissions.filter(sub => sub.status === "APPROVED").length : 0;
        setVolunteerStats({ totalJoined, submissions: completeSubmissions, ongoingCount, pendingCount });
      } catch (err) { console.error("Error fetching volunteer stats:", err); setVolunteerStats({ totalJoined: 0, submissions: 0, ongoingCount: 0, pendingCount: 0 }); }
    };

    const formatDate = (dateString) => {
      if (!dateString) return "TBA";
      return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    const formatTime = (timeString) => {
      if (!timeString) return "TBA";
      const [hours, minutes] = timeString.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    };

    const calculateDuration = (startTime, endTime) => {
      if (!startTime || !endTime) return "TBA";
      const start = new Date(`2000-01-01T${startTime}`);
      const end = new Date(`2000-01-01T${endTime}`);
      const diffMs = end - start;
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      if (diffHours && diffMinutes) return `${diffHours} hours ${diffMinutes} minutes`;
      if (diffHours) return `${diffHours} hours`;
      return `${diffMinutes} minutes`;
    };

    const parseObjectives = (objectiveString) => {
      if (!objectiveString) return ["No objectives specified"];
      return objectiveString.split('-').filter(obj => obj.trim().length > 0);
    };

    const parseBulletPoints = (textString) => {
      if (!textString) return [];
      return textString.split('-').filter(item => item.trim().length > 0);
    };

    const getHeaderColor = (eventId) => {
      if (!eventId) return "bg-yellow-400";
      let hash = 0;
      for (let i = 0; i < eventId.length; i++) { hash = ((hash << 5) - hash) + eventId.charCodeAt(i); hash = hash & hash; }
      const index = Math.abs(hash) % eventColors.length;
      return eventColors[index];
    };

    const splitToBullets = (text) => {
      if (!text) return [];
      return String(text).replace(/\r\n/g, "\n").replace(/\n/g, " - ").split("-").map(s => s.trim()).filter(Boolean);
    };

    const addLogo = async (doc, x, y, width, height, opacity = 1) => {
      if (!ngoLogo) return;
      try {
        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = ngoLogo;
        await new Promise((resolve) => {
          img.onload = () => {
            try { if (doc.setGState) doc.setGState(new doc.GState({ opacity })); } catch {}
            const aspect = img.width / img.height;
            let finalW = width, finalH = height;
            if (aspect > 1) { finalH = width / aspect; if (finalH > height) { finalH = height; finalW = height * aspect; } }
            else { finalW = height * aspect; if (finalW > width) { finalW = width; finalH = width / aspect; } }
            const offsetX = (width - finalW) / 2, offsetY = (height - finalH) / 2;
            try { doc.addImage(img, "PNG", x + offsetX, y + offsetY, finalW, finalH); } catch (e) { console.warn(e); }
            try { if (doc.setGState) doc.setGState(new doc.GState({ opacity: 1 })); } catch {}
            resolve();
          };
          img.onerror = () => resolve();
        });
      } catch (err) { console.error("addLogo err", err); }
    };

    const addEventImageRight = async (doc, imageUrl, currentY, pageWidth, pageHeight) => {
      if (!imageUrl) return { imageHeight: 0, imageAdded: false };
      try {
        const img = new Image(); img.crossOrigin = "Anonymous"; img.src = imageUrl;
        return await new Promise((resolve) => {
          img.onload = () => {
            const maxImgWidth = 60;
            const aspectRatio = img.width / img.height || 1;
            const imgWidth = maxImgWidth;
            const imgHeight = maxImgWidth / aspectRatio;
            if (currentY + imgHeight + 10 > pageHeight - 20) { resolve({ imageHeight: 0, imageAdded: false }); return; }
            const imgX = pageWidth - imgWidth - 16;
            doc.setDrawColor(0); doc.setLineWidth(0.3);
            doc.rect(imgX - 1, currentY - 1, imgWidth + 2, imgHeight + 2);
            try { doc.addImage(img, "JPEG", imgX, currentY, imgWidth, imgHeight); } catch (e) { console.warn(e); }
            resolve({ imageHeight: imgHeight, imageAdded: true });
          };
          img.onerror = () => resolve({ imageHeight: 0, imageAdded: false });
        });
      } catch (err) { console.error("addEventImageRight err", err); return { imageHeight: 0, imageAdded: false }; }
    };

    const handleGenerateEventReport = async () => {
      if (!eventData) return;
      setIsGeneratingReport(true);
      try {
        const { data: eventUsers } = await supabase.from("Event_User").select("user_id, status").eq("event_id", eventId);
        const doc = new jsPDF("p", "mm", "a4");
        const pageW = doc.internal.pageSize.getWidth();
        const pageH = doc.internal.pageSize.getHeight();
        let y = 25;
        if (ngoLogo) {
          try {
            const img = new Image(); img.crossOrigin = "Anonymous"; img.src = ngoLogo;
            await new Promise((resolve) => { img.onload = () => { const w = 70, h = 70, cx = pageW / 2 - w / 2; doc.addImage(img, "PNG", cx, 20, w, h); resolve(); }; img.onerror = () => resolve(); });
          } catch {}
        }
        y = 100;
        doc.setFont("helvetica", "bold"); doc.setFontSize(22); doc.setTextColor(0, 100, 0);
        doc.text(ngoName || "CENTRO Organization", pageW / 2, y, { align: "center" });
        y += 12; doc.setFontSize(18); doc.setTextColor(0, 0, 0);
        doc.text("Event Report", pageW / 2, y, { align: "center" });
        y += 12; doc.setFontSize(14);
        doc.text(eventData.event_title, pageW / 2, y, { align: "center" });
        y += 8; doc.setFontSize(12); doc.setTextColor(100, 100, 100);
        doc.text(formatDate(eventData.date), pageW / 2, y, { align: "center" });
        y += 20;
        const eventVols = eventUsers || [];
        const approved = eventVols.filter((v) => v.status === "APPROVED").length;
        const pending = eventVols.filter((v) => v.status === "PENDING").length;
        const rejected = eventVols.filter((v) => v.status === "REJECTED").length;
        doc.setDrawColor(0, 100, 0); doc.setFillColor(245, 250, 245);
        doc.roundedRect(20, y, pageW - 40, 60, 3, 3, "FD");
        y += 10; doc.setFontSize(14); doc.setTextColor(0, 100, 0);
        doc.text("Event Summary", 25, y); doc.setTextColor(0, 0, 0); doc.setFontSize(11); y += 8;
        doc.text(`•  Event ID: ${eventData.event_id}`, 30, y); y += 6;
        doc.text(`•  Status: ${eventData.status || "TBA"}`, 30, y); y += 6;
        doc.text(`•  Total Volunteers: ${eventVols.length}`, 30, y); y += 6;
        doc.text(`•  Approved: ${approved}`, 30, y); y += 6;
        doc.text(`•  Pending: ${pending}`, 30, y); y += 6;
        doc.text(`•  Rejected: ${rejected}`, 30, y);
        doc.addPage(); y = 25;
        if (ngoLogo) { try { await addLogo(doc, pageW - 35, pageH - 35, 25, 25, 0.06); } catch {} }
        doc.setFillColor(235, 247, 235); doc.roundedRect(14, y - 5, pageW - 28, 10, 2, 2, "F");
        doc.setFont("helvetica", "bold"); doc.setFontSize(12);
        doc.text(eventData.event_title || "Untitled Event", 16, y); y += 10;
        const imageStartY = y;
        const { imageHeight, imageAdded } = await addEventImageRight(doc, eventData.event_image, imageStartY, pageW, pageH);
        const leftColWidth = imageAdded ? pageW - 90 : pageW - 32;
        const printKV = (label, value) => {
          if (y > pageH - 30) { doc.addPage(); y = 25; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(label, 16, y);
          doc.setFont("helvetica", "normal");
          const wrapped = doc.splitTextToSize(String(value || "-"), leftColWidth - 24);
          wrapped.forEach((line, i) => { if (y + i * 5 > pageH - 30) { doc.addPage(); y = 25; } doc.text(line, 40, y + i * 5); });
          y += Math.max(6, wrapped.length * 5);
        };
        printKV("Event ID:", eventData.event_id || "-");
        printKV("Status:", eventData.status || "TBA");
        printKV("Date:", eventData.event_type === 'multiple' && eventData.event_end_date ? `${formatDate(eventData.date)} until ${formatDate(eventData.event_end_date)}`
 : formatDate(eventData.date));
        printKV("Time:", `${formatTime(eventData.time_start)} – ${formatTime(eventData.time_end)}${calculateDuration(eventData.time_start, eventData.time_end) ? ` (${calculateDuration(eventData.time_start, eventData.time_end)})` : ""}`);
        printKV("Call Time:", eventData.call_time ? formatTime(eventData.call_time) : "TBA");
        printKV("Location:", eventData.location || "TBA");
        if (imageAdded && y < imageStartY + imageHeight + 5) y = imageStartY + imageHeight + 5;
        const sections = [
          { label: "Event Objectives:", content: splitToBullets(eventData.event_objectives) },
          { label: "Event Description:", content: eventData.description ? [eventData.description] : [] },
          { label: "What to Expect:", content: splitToBullets(eventData.what_expect) },
          { label: "Volunteer Guidelines:", content: splitToBullets(eventData.volunteer_guidelines) },
          { label: "Volunteer Opportunities:", content: splitToBullets(eventData.volunteer_opportunities) }
        ];
        const fullWidth = pageW - 32;
        for (const sec of sections) {
          if (sec.content.length > 0) {
            if (y > pageH - 30) { doc.addPage(); y = 25; }
            doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text(sec.label, 16, y); y += 6;
            doc.setFont("helvetica", "normal");
            sec.content.forEach((line) => {
              const wrapped = doc.splitTextToSize(line, fullWidth - 12);
              wrapped.forEach((ln) => { if (y > pageH - 30) { doc.addPage(); y = 25; } doc.text(`•  ${ln}`, 20, y); y += 5; });
            });
            y += 3;
          }
        }
        if (eventVols.length > 0) {
          if (y > pageH - 30) { doc.addPage(); y = 25; }
          doc.setFont("helvetica", "bold"); doc.setFontSize(10); doc.text("Volunteer Engagement:", 16, y); y += 6;
          doc.setFont("helvetica", "normal");
          doc.text(`•  Total Volunteers Joined: ${eventVols.length}`, 20, y); y += 5;
          doc.text(`•  Approved: ${approved}`, 20, y); y += 5;
          doc.text(`•  Pending: ${pending}`, 20, y); y += 5;
          doc.text(`•  Rejected: ${rejected}`, 20, y); y += 8;
        }
        const totalPages = doc.internal.getNumberOfPages();
        const generatedDate = new Date().toLocaleString("en-US", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit" });
        for (let i = 1; i <= totalPages; i++) {
          doc.setPage(i); doc.setFontSize(8); doc.setTextColor(100, 100, 100);
          doc.text(`Page ${i} of ${totalPages}`, pageW / 2, pageH - 10, { align: "center" });
          doc.text(`Generated: ${generatedDate}`, 14, pageH - 10);
        }
        doc.save(`${ngoName || "NGO"}_${eventData.event_id}_Report.pdf`);
      } catch (err) {
        setValidationError("Failed to generate report. Please try again.");
      } finally {
        setIsGeneratingReport(false);
      }
    };

    if (loading) return (
      <div className="flex min-h-screen bg-no-repeat bg-center" style={{ backgroundImage: `url(${CentroAdminBg})`, backgroundSize: "100% 100%" }}>
        <PDFLoadingOverlay isVisible={isGeneratingReport} />
        <ValidationErrorPopup message={validationError} onClose={() => setValidationError("")} />
        <Sidebar onCollapseChange={setSidebarCollapsed} />
        <main className="flex-1 p-4 overflow-y-auto transition-all duration-300" style={{ filter: isGeneratingReport || validationError ? "blur(3px)" : "none", marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-emerald-900 mx-auto"></div>
            <p className="mt-4 text-emerald-900 font-montserrat font-semibold text-lg">Loading event data...</p>
          </div>
        </main>
      </div>
    );

    if (error || !eventData) return (
      <div className="flex min-h-screen bg-no-repeat bg-center" style={{ backgroundImage: `url(${CentroAdminBg})`, backgroundSize: "100% 100%" }}>
        <PDFLoadingOverlay isVisible={isGeneratingReport} />
        <ValidationErrorPopup message={validationError} onClose={() => setValidationError("")} />
        <Sidebar onCollapseChange={setSidebarCollapsed} />
        <main className="flex-1 p-4 overflow-y-auto transition-all duration-300" style={{ filter: isGeneratingReport || validationError ? "blur(3px)" : "none", marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}>
          <div className="bg-white rounded-lg shadow border-2 border-emerald-800 overflow-hidden p-8 text-center">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-3xl font-bold font-montserrat text-red-600 mb-4">Error</h2>
            <p className="text-gray-700 font-montserrat text-lg mb-6">{error || "Event not found"}</p>
            <Link to="/manage-reports" className="inline-block bg-emerald-900 text-white px-6 py-3 rounded-lg hover:bg-emerald-700 transition-colors">← Back to Events</Link>
          </div>
        </main>
      </div>
    );

    const isSingle = eventData.event_type !== 'multiple';
    const hasCallTime = isSingle && eventData.call_time;

    return (
      <div className="flex min-h-screen bg-no-repeat bg-center" style={{ backgroundImage: `url(${CentroAdminBg})`, backgroundSize: "100% 100%" }}>
        <PDFLoadingOverlay isVisible={isGeneratingReport} />
        <ValidationErrorPopup message={validationError} onClose={() => setValidationError("")} />
        <Sidebar onCollapseChange={setSidebarCollapsed} />

        <main
          className="flex-1 p-4 overflow-y-auto transition-all duration-300"
          style={{ filter: isGeneratingReport || validationError ? "blur(3px)" : "none", marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}
        >
          <div className="bg-white rounded-lg shadow overflow-hidden h-full flex flex-col">

            {/* ── Header Banner ── */}
            <div className={`${getHeaderColor(eventData.event_id)} rounded-t-full py-3 font-montserrat font-bold text-3xl shadow-md text-emerald-900 border-emerald-800 relative`}>
              <div className="text-center flex flex-col items-center gap-1">
                <span className="text-white font-montserrat font-extrabold">{eventData.event_id}</span>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${eventData.event_type === 'multiple' ? 'bg-yellow-400 text-emerald-900' : 'bg-emerald-200 text-emerald-900'}`}>
                  {eventData.event_type === 'multiple' ? 'Multiple Event' : ' Single Event'}
                </span>
              </div>
            </div>

            <div className="p-6 flex gap-8 flex-1 overflow-auto">

              {/* ══ LEFT COLUMN ══ */}
              <div className="flex-1 overflow-y-auto pr-4" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* Event Title + Generate Report */}
                <div className="flex items-center gap-4">
                  <h2 className="text-4xl font-bold font-montserrat text-emerald-800 leading-snug hover:text-emerald-700 transition-colors" title="Event Title">
                    {eventData.event_title}
                  </h2>
                  <button
                    onClick={handleGenerateEventReport}
                    disabled={isGeneratingReport}
                    className="bg-emerald-600 text-white font-montserrat font-semibold px-4 py-2 rounded-full hover:bg-emerald-700 shadow-lg transition-colors disabled:opacity-50 flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    {isGeneratingReport ? (
                      <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div><span>Generating...</span></>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate Report
                      </>
                    )}
                  </button>
                </div>

                {/* ── TOP ROW: Image + Info Cards ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', alignItems: 'stretch' }}>

                  {/* Event Image */}
                  <div style={{ borderRadius: 16, overflow: 'hidden', height: 250, boxShadow: '0 4px 16px rgba(0,0,0,0.12)', cursor: 'pointer', flexShrink: 0 }} title="Event Image">
                    {eventImage ? (
                      <img src={eventImage} alt="Event" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setEventImage(null)} />
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#f0fdf4', border: '2px dashed #a7f3d0', borderRadius: 16 }}>
                        <span style={{ fontSize: 36, marginBottom: 8 }}>📸</span>
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontWeight: 600, color: '#065f46', fontSize: 13 }}>Add Event Image</p>
                      </div>
                    )}
                  </div>

                  {/* ── Info Cards: adaptive layout by event type ── */}
                  {isSingle ? (
                    // SINGLE EVENT: 2×2 grid — always fits exactly 250px
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: '8px', height: 250 }}>

                      {/* DATE */}
                      <EventInfoCard
                        label="Date"
                        accentColor="#065f46" bgColor="#f0fdf4" borderColor="#a7f3d0"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
                      >
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.3 }}>
                          {formatDate(eventData.date)}
                        </p>
                      </EventInfoCard>

                      {/* TIME */}
                      <EventInfoCard
                        label="Time"
                        accentColor="#1d4ed8" bgColor="#eff6ff" borderColor="#bfdbfe"
                        icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
                      >
                        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                          {formatTime(eventData.time_start)} – {formatTime(eventData.time_end)}
                        </p>
                        {eventData.time_start && eventData.time_end && (
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 12, color: '#6b7280', margin: '3px 0 0' }}>
                            {calculateDuration(eventData.time_start, eventData.time_end)}
                          </p>
                        )}
                      </EventInfoCard>

                      {/* LOCATION — spans full width if no call time */}
                      <div style={{ gridColumn: hasCallTime ? 'span 1' : 'span 2', display: 'flex' }}>
                        <EventInfoCard
                          label="Location"
                          accentColor="#b45309" bgColor="#fffbeb" borderColor="#fde68a"
                          icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                        >
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.3 }}>
                            {eventData.location || "TBA"}
                          </p>
                        </EventInfoCard>
                      </div>

                      {/* CALL TIME — only if present */}
                      {hasCallTime && (
                        <EventInfoCard
                          label="Call Time"
                          accentColor="#7c3aed" bgColor="#f5f3ff" borderColor="#ddd6fe"
                          icon={<svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>}
                        >
                          <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0 }}>
                            {formatTime(eventData.call_time)}
                          </p>
                        </EventInfoCard>
                      )}
                    </div>
                  ) : (
                    // MULTIPLE EVENT: From + Until sa itaas, Event Duration + Location sa baba
<div style={{ display: 'flex', flexDirection: 'column', gap: '8px', height: 250 }}>

  {/* FROM + UNTIL — side by side sa itaas */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
    <EventInfoCard
      label="From"
      accentColor="#065f46" bgColor="#f0fdf4" borderColor="#a7f3d0"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
    >
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.4 }}>
        {formatDate(eventData.date)}
      </p>
    </EventInfoCard>

    <EventInfoCard
      label="Until"
      accentColor="#0f766e" bgColor="#f0fdfa" borderColor="#99f6e4"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>}
    >
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.4 }}>
        {formatDate(eventData.event_end_date || eventData.date)}
      </p>
    </EventInfoCard>
  </div>

  {/* EVENT DURATION + LOCATION — side by side sa baba */}
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', flex: 1 }}>
    <EventInfoCard
      label="Event Duration"
      accentColor="#7c3aed" bgColor="#f5f3ff" borderColor="#ddd6fe"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
    >
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 14, fontWeight: 700, color: '#1f2937', margin: 0 }}>
        {(() => {
          if (!eventData.date || !eventData.event_end_date) return "TBA";
          const start = new Date(eventData.date);
          const end = new Date(eventData.event_end_date);
          const diffDays = Math.round((end - start) / (1000 * 60 * 60 * 24));
          const weeks = Math.floor(diffDays / 7);
          const days = diffDays % 7;
          if (weeks > 0 && days > 0) return `${weeks} week${weeks > 1 ? 's' : ''} and ${days} day${days > 1 ? 's' : ''}`;
          if (weeks > 0) return `${weeks} week${weeks > 1 ? 's' : ''}`;
          return `${diffDays} day${diffDays > 1 ? 's' : ''}`;
        })()}
      </p>
    </EventInfoCard>

    <EventInfoCard
      label="Location"
      accentColor="#b45309" bgColor="#fffbeb" borderColor="#fde68a"
      icon={<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
    >
      <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: 15, fontWeight: 700, color: '#1f2937', margin: 0, lineHeight: 1.4 }}>
        {eventData.location || "TBA"}
      </p>
    </EventInfoCard>
  </div>

</div>
                  )}
                </div>
                {/* ── End TOP ROW ── */}

                {/* ── Info Cards Grid (2 columns) ── */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>

                  <InfoCard
                    title="Event Objectives"
                    icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>}
                    accentColor="#065f46" bgColor="#f0fdf4" borderColor="#a7f3d0"
                    items={parseObjectives(eventData.event_objectives)}
                  />

                  {eventData.description && (
                    <InfoCard
                      title="Event Description"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>}
                      accentColor="#1d4ed8" bgColor="#eff6ff" borderColor="#bfdbfe"
                      text={eventData.description}
                    />
                  )}

                  {eventData.what_expect && (
                    <InfoCard
                      title="What to Expect"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
                      accentColor="#b45309" bgColor="#fffbeb" borderColor="#fde68a"
                      items={parseBulletPoints(eventData.what_expect)}
                      text={parseBulletPoints(eventData.what_expect).length === 0 ? eventData.what_expect : null}
                    />
                  )}

                  {eventData.volunteer_guidelines && (
                    <InfoCard
                      title="Volunteer Guidelines"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                      accentColor="#7c3aed" bgColor="#f5f3ff" borderColor="#ddd6fe"
                      items={parseBulletPoints(eventData.volunteer_guidelines)}
                      text={parseBulletPoints(eventData.volunteer_guidelines).length === 0 ? eventData.volunteer_guidelines : null}
                    />
                  )}

                  {eventData.volunteer_opportunities && (
                    <InfoCard
                      title="Volunteer Opportunities"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" /></svg>}
                      accentColor="#0f766e" bgColor="#f0fdfa" borderColor="#99f6e4"
                      items={parseBulletPoints(eventData.volunteer_opportunities)}
                      text={parseBulletPoints(eventData.volunteer_opportunities).length === 0 ? eventData.volunteer_opportunities : null}
                    />
                  )}

                  {eventData.preferred_skills && (
                    <InfoCard
                      title="Preferred Skills"
                      icon={<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>}
                      accentColor="#c2410c" bgColor="#fff7ed" borderColor="#fed7aa"
                      items={parseBulletPoints(eventData.preferred_skills)}
                      text={parseBulletPoints(eventData.preferred_skills).length === 0 ? eventData.preferred_skills : null}
                    />
                  )}

                </div>
              </div>
              {/* ══ END LEFT COLUMN ══ */}

              {/* ══ RIGHT COLUMN ══ */}
              <div className="w-80 space-y-4 flex-shrink-0 overflow-y-auto">
                <div className="text-center space-y-3">
                  <div className={`px-6 py-2 rounded-full text-center font-bold transition-all duration-500 ${
                    currentStatus === 'ONGOING' ? 'bg-emerald-500 text-white animate-pulse' :
                    currentStatus === 'UPCOMING' ? 'bg-yellow-500 text-white' :
                    currentStatus === 'COMPLETED' ? 'bg-gray-500 text-white' :
                    'bg-blue-500 text-white'
                  }`}>
                    {currentStatus || eventData.status}
                  </div>
                </div>

                <div className="bg-emerald-900 rounded-lg p-6 text-center shadow-lg transition-colors font-montserrat">
                  <p className="text-xl font-semibold text-white mb-2">Complete Submissions</p>
                  <p className="text-5xl font-bold text-yellow-400 mb-2">{volunteerStats.submissions}</p>
                  <p className="text-l text-yellow-500 font-bold">out of {eventData.volunteers_limit || "unlimited"} volunteers</p>
                  <Link to={`/folder/${eventId}`}>
                    <button className="bg-emerald-600 text-white font-semibold font-montserrat px-8 py-2 rounded-full mt-4 hover:bg-emerald-700 transition-colors cursor-pointer">Files</button>
                  </Link>
                </div>

                <div className="bg-emerald-900 rounded-lg p-6 text-center shadow-lg transition-colors font-montserrat">
                  <p className="text-lg font-semibold text-white mb-2">Total Volunteers Joined</p>
                  <p className="text-6xl font-bold text-yellow-400 mb-2">{volunteerStats.totalJoined}</p>
                  <div className="text-l text-white space-y-1 font-montserrat">
                    <p><span className="font-semibold text-yellow-500">{volunteerStats.ongoingCount}</span> Going</p>
                    <p><span className="font-semibold text-yellow-500">{volunteerStats.pendingCount}</span> Pending</p>
                    {eventData.volunteers_limit && <p className="mt-2 text-white font-semibold">Limit: {eventData.volunteers_limit}</p>}
                  </div>
                </div>

                {eventData.created_at && (
                  <div className="bg-emerald-900 rounded-lg p-4 text-center font-montserrat">
                    <p className="text-l text-yellow-400 font-bold">Event Created</p>
                    <p className="font-semibold text-white">{formatDate(eventData.created_at)}</p>
                  </div>
                )}

                <div className="text-center pt-4">
                  <Link to="/manage-reports">
                    <button className="bg-emerald-900 text-white font-montserrat font-semibold px-8 py-3 rounded-lg hover:bg-emerald-700 shadow-lg transition-colors cursor-pointer">Back</button>
                  </Link>
                </div>
              </div>
              {/* ══ END RIGHT COLUMN ══ */}

            </div>

            {/* ── FULL WIDTH — Tasks + Verify ── */}
            <div className="px-6 pb-6">
              <TasksSection eventId={eventId} eventData={eventData} />
              <div className="flex justify-center pt-4">
                <Link to={`/event/${eventData.event_id}/first`}>
                  <button className="bg-emerald-900 text-white font-montserrat font-semibold px-8 py-3 mt-6 rounded-lg hover:bg-emerald-700 shadow-lg transition-colors cursor-pointer">
                    Verify
                  </button>
                </Link>
              </div>
            </div>

          </div>
        </main>
      </div>
    );
  }

  export default EventPage;