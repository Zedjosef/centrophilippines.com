import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import CentroAdminBg from "../images/CENTRO_ADMIN.png";
import { useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

// Icons
import DatesIcon from "../images/date.svg";
import FileIcon from "../images/file.svg";
import PriorityIcon from "../images/priority.svg";
import ExpiryIcon from "../images/expiry.svg";
import EventIcon from "../images/event.svg";

// 🔹 Reusable Modal Component
function ConfirmationModal({ title, message, onConfirm, onCancel, type = "confirm" }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50 animate-fadeIn"
    >
      {/* Background Blur */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Modal Box */}
      <div
        className="relative bg-white rounded-lg shadow-lg p-6 w-96 text-center z-50 border-4 border-green-800 transform animate-scaleIn"
        style={{ backgroundColor: "#fff4d9" }}
      >
        <h2 className="text-xl font-bold text-green-900 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          {type === "confirm" ? (
            <>
              <button
                onClick={onConfirm}
                className="bg-green-700 text-white px-5 py-2 rounded-lg hover:bg-green-900 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={onCancel}
                className="bg-red-600 text-white px-5 py-2 rounded-lg hover:bg-red-700 cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="bg-green-700 text-white px-6 py-2 rounded-lg hover:bg-green-900 cursor-pointer"
            >
              OK
            </button>
          )}
        </div>
      </div>

      {/* 🔹 Animations (fadeIn + scaleIn) */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .animate-fadeIn { animation: fadeIn 0.2s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.2s ease-out; }
      `}</style>
    </div>
  );
}

function ModernDatePicker({ value, onChange, minDate, placeholder = "Select date...", openDirection = "down" }) {
  const [open, setOpen] = React.useState(false);
  const [viewYear, setViewYear] = React.useState(null);
  const [viewMonth, setViewMonth] = React.useState(null);
  const wrapperRef = React.useRef(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const minD = minDate ? new Date(minDate + 'T00:00:00') : null;

  useEffect(() => {
    const base = value ? new Date(value + 'T00:00:00') : today;
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
  }, [value]);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  const getDays = () => {
    const firstDay = new Date(viewYear, viewMonth, 1).getDay();
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const daysInPrev = new Date(viewYear, viewMonth, 0).getDate();
    const days = [];
    for (let i = firstDay - 1; i >= 0; i--) days.push({ day: daysInPrev - i, currentMonth: false, date: new Date(viewYear, viewMonth - 1, daysInPrev - i) });
    for (let i = 1; i <= daysInMonth; i++) days.push({ day: i, currentMonth: true, date: new Date(viewYear, viewMonth, i) });
    const remaining = 42 - days.length;
    for (let i = 1; i <= remaining; i++) days.push({ day: i, currentMonth: false, date: new Date(viewYear, viewMonth + 1, i) });
    return days;
  };

  const toYMD = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const formatDisplay = (dateStr) => {
    if (!dateStr) return null;
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  };

  const isToday = (date) => date.toDateString() === today.toDateString();
  const isSelected = (date) => value && toYMD(date) === value;
  const isDisabled = (date) => { const d = new Date(date); d.setHours(0,0,0,0); return minD && d < minD; };

  const prevMonth = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const nextMonth = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  if (viewYear === null) return null;

  return (
    <div style={{ position: 'relative', width: '100%' }} ref={wrapperRef}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'white', border: open ? '1.5px solid #059669' : '1px solid #86efac',
          borderRadius: 10, padding: '9px 14px', cursor: 'pointer',
          boxShadow: open ? '0 0 0 3px rgba(5,150,105,0.13)' : '0 1px 3px rgba(0,0,0,0.06)',
          transition: 'all 0.2s', userSelect: 'none'
        }}
      >
        <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <span style={{ flex: 1, fontSize: '1rem', color: value ? '#374151' : '#9ca3af' }}>
          {value ? formatDisplay(value) : placeholder}
        </span>
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
        </svg>
      </div>
      {open && (
        <div style={{
          position: 'absolute', ...(openDirection === 'up' ? { bottom: 'calc(100% + 6px)' } : { top: 'calc(100% + 6px)' }), left: 0, zIndex: 9999,
          background: 'white', borderRadius: 16,
          boxShadow: '0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)',
          padding: 20, minWidth: 300,
          animation: 'calPopIn 0.18s cubic-bezier(.4,0,.2,1)'
        }}>
          <style>{`@keyframes calPopIn { from { opacity:0; transform:translateY(-8px) scale(0.97); } to { opacity:1; transform:translateY(0) scale(1); } }`}</style>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:16 }}>
            <button onClick={prevMonth} style={{ width:32, height:32, borderRadius:8, border:'none', background:'#f0fdf4', color:'#059669', cursor:'pointer', fontSize:'1.1rem' }}>‹</button>
            <span style={{ fontWeight:700, fontSize:'1rem', color:'#065f46' }}>{monthNames[viewMonth]} {viewYear}</span>
            <button onClick={nextMonth} style={{ width:32, height:32, borderRadius:8, border:'none', background:'#f0fdf4', color:'#059669', cursor:'pointer', fontSize:'1.1rem' }}>›</button>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:3 }}>
            {dayNames.map(d => <div key={d} style={{ textAlign:'center', fontSize:'0.7rem', fontWeight:700, color:'#6b7280', padding:'4px 0 8px', textTransform:'uppercase', letterSpacing:'0.05em' }}>{d}</div>)}
            {getDays().map((item, i) => (
              <button key={i} onClick={() => { if (!isDisabled(item.date) && item.currentMonth) { onChange(toYMD(item.date)); setOpen(false); } }}
                style={{
                  aspectRatio:'1', display:'flex', alignItems:'center', justifyContent:'center',
                  borderRadius: isSelected(item.date) ? 8 : 8,
                  border: isToday(item.date) && !isSelected(item.date) ? '1.5px solid #6ee7b7' : 'none',
                  background: isSelected(item.date) ? 'linear-gradient(135deg,#059669,#10b981)' : isToday(item.date) ? '#f0fdf4' : 'transparent',
                  color: isSelected(item.date) ? 'white' : isToday(item.date) ? '#059669' : !item.currentMonth ? '#e5e7eb' : isDisabled(item.date) ? '#d1d5db' : '#374151',
                  fontWeight: isSelected(item.date) ? 700 : isToday(item.date) ? 800 : 500,
                  fontSize:'0.82rem', cursor: isDisabled(item.date) || !item.currentMonth ? 'not-allowed' : 'pointer',
                  boxShadow: isSelected(item.date) ? '0 4px 12px rgba(5,150,105,0.35)' : 'none',
                  transition:'all 0.15s'
                }}
              >{item.day}</button>
            ))}
          </div>
          <div style={{ display:'flex', justifyContent:'space-between', marginTop:14, paddingTop:12, borderTop:'1px solid #f3f4f6' }}>
            <button onClick={() => { onChange(''); setOpen(false); }} style={{ fontSize:'0.8rem', fontWeight:600, padding:'5px 14px', borderRadius:7, border:'none', background:'#fef2f2', color:'#ef4444', cursor:'pointer' }}>Clear</button>
            <button onClick={() => { onChange(toYMD(today)); setOpen(false); }} style={{ fontSize:'0.8rem', fontWeight:600, padding:'5px 14px', borderRadius:7, border:'none', background:'#d1fae5', color:'#059669', cursor:'pointer' }}>Today</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ModernDateTimePicker({ value, onChange, placeholder = "Select date & time..." }) {
  const [dateVal, setDateVal] = React.useState('');
  const [timeVal, setTimeVal] = React.useState('');
  const [openTime, setOpenTime] = React.useState(false);
  const timeRef = React.useRef(null);

  useEffect(() => {
    if (value) {
      const [d, t] = value.split('T');
      setDateVal(d || '');
      setTimeVal(t ? t.slice(0,5) : '');
    }
  }, []);

  useEffect(() => {
    const handleClick = (e) => { if (timeRef.current && !timeRef.current.contains(e.target)) setOpenTime(false); };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const generateTimes = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
      for (let m = 0; m < 60; m += 30) {
        const hh = String(h).padStart(2,'0');
        const mm = String(m).padStart(2,'0');
        const ampm = h >= 12 ? 'PM' : 'AM';
        const dh = h === 0 ? 12 : h > 12 ? h - 12 : h;
        times.push({ value: `${hh}:${mm}`, label: `${dh}:${mm} ${ampm}` });
      }
    }
    return times;
  };

  const times = generateTimes();

  const handleDateChange = (d) => {
    setDateVal(d);
    if (d && timeVal) onChange(`${d}T${timeVal}`);
    else if (d) onChange(`${d}T00:00`);
  };

  const handleTimeChange = (t) => {
    setTimeVal(t);
    if (dateVal) onChange(`${dateVal}T${t}`);
    setOpenTime(false);
  };

  const displayTime = () => {
    if (!timeVal) return null;
    const found = times.find(t => t.value === timeVal);
    return found ? found.label : timeVal;
  };

  return (
    <div style={{ display:'flex', gap:8, alignItems:'center' }}>
      <div style={{ flex: 2 }}>
        <ModernDatePicker
          value={dateVal}
          onChange={handleDateChange}
          placeholder="Select date..."
        />
      </div>
      <div ref={timeRef} style={{ position:'relative', flex:1 }}>
        <div
          onClick={() => setOpenTime(o => !o)}
          style={{
            display:'flex', alignItems:'center', gap:6,
            background:'white', border: openTime ? '1.5px solid #059669' : '1px solid #86efac',
            borderRadius:10, padding:'9px 12px', cursor:'pointer',
            boxShadow: openTime ? '0 0 0 3px rgba(5,150,105,0.13)' : '0 1px 3px rgba(0,0,0,0.06)',
            transition:'all 0.2s', userSelect:'none'
          }}
        >
          <svg width="15" height="15" fill="none" viewBox="0 0 24 24" stroke="#059669" strokeWidth={2}>
            <circle cx="12" cy="12" r="10"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2"/>
          </svg>
          <span style={{ flex:1, fontSize:'1rem', color: timeVal ? '#374151' : '#9ca3af' }}>
            {displayTime() || 'Time...'}
          </span>
          <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
          </svg>
        </div>
        {openTime && (
          <div style={{
            position:'absolute', top:'calc(100% + 6px)', left:0, zIndex:9999,
            background:'white', borderRadius:12, padding:'6px 0',
            boxShadow:'0 20px 60px rgba(0,0,0,0.15)', minWidth:140, maxHeight:220, overflowY:'auto'
          }}>
            {times.map(t => (
              <div key={t.value} onClick={() => handleTimeChange(t.value)}
                style={{
                  padding:'8px 16px', fontSize:'0.95rem', cursor:'pointer',
                  fontWeight: timeVal === t.value ? 700 : 400,
                  color: timeVal === t.value ? '#059669' : '#374151',
                  background: timeVal === t.value ? '#f0fdf4' : 'transparent'
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f0fdf4'}
                onMouseLeave={e => e.currentTarget.style.background = timeVal === t.value ? '#f0fdf4' : 'transparent'}
              >
                {timeVal === t.value && <span style={{ marginRight:6, color:'#059669' }}>✓</span>}
                {t.label}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CreateAnnouncement() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [ngoCode, setNgoCode] = useState("");
  const [loading, setLoading] = useState(false);

  // Form states
  const [title, setTitle] = useState("");
  const [postDate, setPostDate] = useState("");
  const [priorityType, setPriorityType] = useState("");
  const [announcementType, setAnnouncementType] = useState("");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [expiryDate, setExpiryDate] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );
  // Event options
  const [events, setEvents] = useState([]);

  // Modal Config
  const [modalConfig, setModalConfig] = useState(null);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      setAdminData(admin);
      setNgoCode(admin.NGO_Information?.ngo_code || "");
      fetchEvents(admin.NGO_Information?.ngo_code);
    }

    const now = new Date();
    const formattedDate = now.toISOString().slice(0, 16);
    setPostDate(formattedDate);
  }, []);

  const fetchEvents = async (ngoId) => {
    if (!ngoId) return;
    try {
      const { data, error } = await supabase
        .from("Event_Information")
        .select("event_id, event_title, date")
        .eq("ngo_id", ngoId)
        .order("date", { ascending: true });

      if (error) throw error;
      setEvents(data || []);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const getNextAnnouncementId = async () => {
    try {
      const { data, error } = await supabase
        .from("Announcements")
        .select("announcement_id")
        .order("announcement_id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastId = data[0].announcement_id;
        const number = parseInt(lastId.split("-")[2]);
        return `ANN-2025-${String(number + 1).padStart(4, "0")}`;
      } else {
        return "ANN-2025-0001";
      }
    } catch (error) {
      console.error("Error getting next announcement ID:", error);
      return "ANN-2025-0001";
    }
  };

  const uploadFile = async (file) => {
    if (!file) return null;
    try {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `announcements/${fileName}`;
      const { error } = await supabase.storage
        .from("centro_bucket")
        .upload(filePath, file);

      if (error) throw error;
      const { data: publicData } = supabase.storage
        .from("centro_bucket")
        .getPublicUrl(filePath);

      return publicData.publicUrl;
    } catch (error) {
      console.error("Error uploading file:", error);
      setModalConfig({
        title: "Upload Error",
        message: "There was an error uploading the file. Please try again.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return null;
    }
  };

  // Handle file selection and preview
  const handleFileSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      
      // Create preview for images
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => setFilePreview(e.target.result);
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  // Get file icon based on file type
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();
    
    const iconStyle = "w-12 h-12 mx-auto mb-2";
    
    switch (extension) {
      case 'pdf':
        return (
          <div className={`${iconStyle} bg-red-100 rounded-lg flex items-center justify-center`}>
            <span className="text-red-600 font-bold text-xs">PDF</span>
          </div>
        );
      case 'doc':
      case 'docx':
        return (
          <div className={`${iconStyle} bg-blue-100 rounded-lg flex items-center justify-center`}>
            <span className="text-blue-600 font-bold text-xs">DOC</span>
          </div>
        );
      case 'xls':
      case 'xlsx':
        return (
          <div className={`${iconStyle} bg-green-100 rounded-lg flex items-center justify-center`}>
            <span className="text-green-600 font-bold text-xs">XLS</span>
          </div>
        );
      case 'txt':
        return (
          <div className={`${iconStyle} bg-gray-100 rounded-lg flex items-center justify-center`}>
            <span className="text-gray-600 font-bold text-xs">TXT</span>
          </div>
        );
      default:
        return (
          <div className={`${iconStyle} bg-gray-100 rounded-lg flex items-center justify-center`}>
            <span className="text-gray-600 font-bold text-xs">FILE</span>
          </div>
        );
    }
  };

  // 🔹 Form Validation with Modal
  const validateForm = () => {
    const missingFields = [];
    if (!title.trim()) missingFields.push("Title");
    if (!postDate) missingFields.push("Post Date & Time");
    if (!priorityType) missingFields.push("Priority Type");
    if (!announcementType) missingFields.push("Announcement Type");
    if (announcementType === "Event" && !selectedEvent) missingFields.push("Event Selection");
    if (!message.trim()) missingFields.push("Message");

    if (missingFields.length > 0) {
      setModalConfig({
        title: "Incomplete Form",
        message: "Please complete all required fields first.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return false;
    }
    return true;
  };

  const createAnnouncement = async (isDraft = false) => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      const announcementId = await getNextAnnouncementId();
      let fileUrl = null;

      if (selectedFile) {
        fileUrl = await uploadFile(selectedFile);
        if (!fileUrl) {
          setLoading(false);
          return;
        }
      }

      const announcementData = {
        announcement_id: announcementId,
        ngo_id: ngoCode,
        event_id: announcementType === "Event" ? selectedEvent : null,
        title: title.trim(),
        message: message.trim(),
        post_date: postDate,
        priority_type: priorityType,
        attachment_file: fileUrl,
        expiry_date: expiryDate || null,
        status: isDraft ? "DRAFT" : "PUBLISHED",
        created_at: new Date().toISOString(),
        created_by: adminData?.admin_id,
        announcement_type: announcementType,
      };

      const { error } = await supabase
        .from("Announcements")
        .insert([announcementData]);

      if (error) throw error;

      setModalConfig({
        title: "Success",
        message: `Announcement ${isDraft ? "saved as draft" : "published"} successfully!`,
        onCancel: () => {
          setModalConfig(null);
          navigate("/dashboard");
        },
        type: "alert",
      });
    } catch (error) {
      console.error("Error creating announcement:", error);
      setModalConfig({
        title: "Error",
        message: "Error creating announcement. Please try again.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
    } finally {
      setLoading(false);
    }
  };

  const formatEventOption = (event) => {
    const eventDate = new Date(event.date).toLocaleDateString();
    return `${event.event_title} (${eventDate})`;
  };

  return (
    <div
      className="flex min-h-screen bg-no-repeat bg-center"
      style={{
        backgroundImage: `url(${CentroAdminBg})`,
        backgroundSize: "100% 100%",
      }}
    >
<Sidebar onCollapseChange={setSidebarCollapsed} />

      <main 
        className="flex-1 p-4 overflow-y-auto transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? "5rem" : "16rem" }}
      >        
            <div className="w-full max-w-6xl rounded-2xl border-green-800 p-2 sm:p-8">
        <div className="border-2 border-emerald-900 rounded-lg mb-2 p-3 bg-emerald-900 text-white text-center text-2xl font-bold shadow-md">
            CREATE ANNOUNCEMENT
          </div>

          <div
          className="rounded-lg p-6 md:p-8 border-4 border-green-800 shadow-lg"
            style={{ backgroundColor: "#fff4d9" }}
          >
            {/* Title */}
            <div className="mb-6">
              <label className="block mb-2 font-semibold text-lg text-green-900">Title <span className="text-red-600">*</span> </label>
              <input
                type="text"
                placeholder="Enter announcement title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full p-3 rounded border bg-white border-green-300 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer"
              />
            </div>

            {/* Post Date & Priority */}
<div className="w-full flex flex-wrap gap-6 mb-6">
  {/* Post Date & Time */}
  <div className="flex-1 min-w-[250px]">
    <label className="block mb-2 font-semibold text-lg text-green-900">
      Post Date & Time <span className="text-red-600">*</span>
    </label>
    <ModernDateTimePicker
      value={postDate}
      onChange={(val) => setPostDate(val)}
      placeholder="Select post date & time..."
    />
  </div>

  {/* Priority Type */}
  <div className="flex-1 min-w-[200px]">
    <label className="block mb-2 font-semibold text-lg text-green-900">
      Priority Type <span className="text-red-600">*</span>
    </label>
    <div className="flex items-center border border-green-300 bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
      <img src={PriorityIcon} alt="Priority" className="w-5 h-5 mr-2 opacity-70" />
      <select
        value={priorityType}
        onChange={(e) => setPriorityType(e.target.value)}
        className="w-full border-none focus:outline-none cursor-pointer bg-transparent text-gray-700"
      >
        <option value="">Select priority type</option>
        <option value="High">High</option>
        <option value="Medium">Medium</option>
        <option value="Low">Low</option>
      </select>
    </div>
  </div>
</div>

            {/* Announcement Type */}
  <div className="flex-1 min-w-[250px]">
              <label className="block mb-2 font-semibold text-lg text-green-900">Announcement Type <span className="text-red-600">*</span></label>
    <div className="flex items-center mb-2 border bg-white border-green-300 rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
                <img src={EventIcon} alt="Announcement Type" className="w-5 h-5 mr-2" />
                <select
                  value={announcementType}
                  onChange={(e) => {
                    setAnnouncementType(e.target.value);
                    if (e.target.value !== "Event") {
                      setSelectedEvent(""); // Reset event selection if not "Event" type
                    }
                  }}
        className="w-full border-none focus:outline-none cursor-pointer bg-transparent text-gray-700"
                >
                  <option value="">Select announcement type</option>
                  <option value="All">All (Organization-wide)</option>
                  <option value="Event">Event-specific</option>
                </select>
              </div>
            </div>

            {/* Event Selection - Only show when "Event" is selected */}
            {announcementType === "Event" && (
              <div className="mb-4">
                <label className="block mb-2 font-semibold text-lg text-green-900">Select Event <span className="text-red-600">*</span></label>
                <div className="flex items-center border bg-white border-green-300 rounded px-3">
                  <img src={EventIcon} alt="Event" className="w-5 h-5 mr-2" />
                  <select
                    value={selectedEvent}
                    onChange={(e) => setSelectedEvent(e.target.value)}
                    className="w-full p-2 border-none focus:outline-none cursor-pointer"
                  >
                    <option value="">Select event </option>
                    {events.map((event) => (
                      <option key={event.event_id} value={event.event_id}>
                        {event.event_id} - {formatEventOption(event)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* Message */}
            <div className="mb-4">
              <label className="block mb-2 font-semibold text-lg text-green-900">Message <span className="text-red-600">*</span></label>
              <textarea
                placeholder="Enter your announcement message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full p-3 rounded bg-white border border-green-300 h-40 focus:outline-none focus:ring-2 focus:ring-green-700 cursor-pointer"
              />
            </div>

           {/* File & Expiry Date */}
<div className="w-full flex flex-wrap gap-6 mb-8">
  {/* Attach File */}
  <div className="flex-1 min-w-[280px]">
    <label className="block mb-2 font-semibold text-lg text-green-900">
      Attach File (Optional)
    </label>
    <div className="flex items-center border border-green-300 bg-white rounded-lg px-4 py-2 shadow-sm hover:shadow-md transition-shadow">
      <img src={FileIcon} alt="File" className="w-5 h-5 mr-2 opacity-70" />
      <input
        type="file"
        accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.gif,.txt"
        onChange={handleFileSelection}
        className="w-full border-none focus:outline-none cursor-pointer bg-transparent text-gray-700"
      />
    </div>

    {/* File Preview */}
    {selectedFile && (
      <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg text-center">
        {filePreview ? (
          <div>
            <img
              src={filePreview}
              alt="Preview"
              className="max-w-full max-h-32 object-contain mx-auto rounded border"
            />
            <p className="text-sm text-gray-600 mt-2 font-medium">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        ) : (
          <div>
            {getFileIcon(selectedFile.name)}
            <p className="text-sm text-gray-700 font-medium">
              {selectedFile.name}
            </p>
            <p className="text-xs text-gray-500">
              {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
        )}
        <button
          type="button"
          onClick={() => {
            setSelectedFile(null);
            setFilePreview(null);
            const fileInput = document.querySelector('input[type="file"]');
            if (fileInput) fileInput.value = "";
          }}
          className="mt-2 text-red-600 hover:text-red-800 text-xs font-medium"
        >
          Remove File
        </button>
      </div>
    )}
  </div>

  {/* Expiry Date */}
  <div className="flex-1 min-w-[250px]">
    <label className="block mb-2 font-semibold text-lg text-green-900">
      Expiry Date (Optional)
    </label>
    <ModernDatePicker
      value={expiryDate}
      onChange={(val) => setExpiryDate(val)}
      minDate={new Date().toISOString().split("T")[0]}
      placeholder="Select expiry date..."
      openDirection="up"
    />
  </div>
</div>
            {/* Buttons with Confirmation */}
            <div className="flex flex-wrap gap-6 justify-center text-lg pb-6">
              <button
                disabled={loading}
                onClick={() =>
                  setModalConfig({
                    title: "Publish",
                    message: "Are you sure you want to publish this announcement?",
                    onConfirm: () => {
                      setModalConfig(null);
                      createAnnouncement(false);
                    },
                    onCancel: () => setModalConfig(null),
                  })
                }
                className="bg-green-700 text-white px-6 py-2 rounded-2xl border-green-800 border-2 hover:bg-green-900 disabled:opacity-50 cursor-pointer font-semibold"
              >
                {loading ? "Publishing..." : "Publish"}
              </button>

              <button
                onClick={() =>
                  setModalConfig({
                    title: "Discard",
                    message: "Are you sure you want to discard this announcement?",
                    onConfirm: () => {
                      setModalConfig(null);
                      navigate("/dashboard");
                    },
                    onCancel: () => setModalConfig(null),
                  })
                }
                className="bg-red-600 text-white px-6 py-2 rounded-2xl border-red-700 border-2 hover:bg-red-700 cursor-pointer font-semibold"
              >
                Discard
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* 🔹 Show Modal */}
      {modalConfig && (
        <ConfirmationModal
          title={modalConfig.title}
          message={modalConfig.message}
          onConfirm={modalConfig.onConfirm}
          onCancel={modalConfig.onCancel}
          type={modalConfig.type || "confirm"}
        />
      )}
    </div>
  );
}

export default CreateAnnouncement;