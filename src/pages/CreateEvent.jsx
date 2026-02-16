import React, { useState, useEffect, useRef } from "react";
import Sidebar from "../components/Sidebar";
import CentroAdminBg from "../images/CENTRO_ADMIN.png";
import { Link, useNavigate } from "react-router-dom";
import supabase from "../config/supabaseClient";

// Icons
import OpportunitiesIcon from "../images/opportunities.svg";
import TimeIcon from "../images/time.svg";
import FileIcon from "../images/file.svg";
import DateIcon from "../images/date.svg";

// Reusable Modal Component with Smooth Animations
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

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn"
      onClick={handleBackdropClick}
    >
      <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]"></div>
      <div
        className="relative rounded-lg shadow-2xl p-6 w-96 text-center z-[10000] border-4 border-emerald-800 transform animate-scaleIn"
        style={{ backgroundColor: "#fade97" }}
      >
        <h2 className="text-xl font-bold text-emerald-800 mb-4">{title}</h2>
        <p className="text-gray-700 mb-6">{message}</p>

        <div className="flex justify-center gap-4">
          {type === "confirm" ? (
            <>
              <button
                onClick={onConfirm}
                className="bg-emerald-700 text-white px-5 py-2 rounded-lg hover:bg-emerald-900 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Yes
              </button>
              <button
                onClick={onCancel}
                className="bg-gray-500 text-white px-5 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={onCancel}
              className="bg-emerald-700 text-white px-6 py-2 rounded-lg hover:bg-emerald-900 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              OK
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// 🔹 Event Type Modal Component 
function EventTypeModal({ onSelect, onCancel }) {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };

    document.addEventListener("keydown", handleEscapeKey);
    return () => document.removeEventListener("keydown", handleEscapeKey);
  }, [onCancel]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onCancel();
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-[9999] animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* Backdrop with gradient blur */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-emerald-900/20 to-black/40 backdrop-blur-sm"></div>
      <div
        className="relative rounded-3xl p-10 w-[620px] text-center z-[10000] transform animate-scaleIn shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #ffffff 0%, #f0fdf4 50%, #ecfdf5 100%)",
          border: "3px solid #10b981",
        }}
      >
        <div
          className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center shadow-xl"
          style={{ 
            background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
            boxShadow: "0 10px 30px rgba(16, 185, 129, 0.4)"
          }}
        >
          <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-emerald-900 mb-2">Select Event Type</h2>
        <p className="text-emerald-600 text-sm mb-8 font-medium">Choose the type of event you want to create</p>

        <div className="flex flex-col gap-4 mb-6 px-8">
          <button
            onClick={() => onSelect('single')}
            className="group relative overflow-hidden rounded-2xl p-5 font-semibold text-base text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.97] shadow-lg hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-emerald-300"
            style={{ background: "linear-gradient(135deg, #059669 0%, #10b981 100%)" }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-all duration-300" />
            <div className="relative flex items-center justify-between px-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Single Event</div>
                  <div className="text-emerald-100 text-xs font-normal">Perfect for one-day activities</div>
                </div>
              </div>
              <svg className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>

          <button
            onClick={() => onSelect('multiple')}
            className="group relative overflow-hidden rounded-2xl p-5 font-semibold text-base text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.97] shadow-lg hover:shadow-2xl cursor-pointer border-2 border-transparent hover:border-emerald-300"
            style={{ background: "linear-gradient(135deg, #047857 0%, #059669 100%)" }}
          >
            <div className="absolute inset-0 bg-white/0 group-hover:bg-white/15 transition-all duration-300" />
            <div className="relative flex items-center justify-between px-3">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center group-hover:bg-white/30 transition-all duration-300">
                  <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="text-left">
                  <div className="font-bold text-lg">Multiple Event</div>
                  <div className="text-emerald-100 text-xs font-normal">For multi-day programs</div>
                </div>
              </div>
              <svg className="w-6 h-6 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </button>
        </div>

        <button
          onClick={onCancel}
          className="mt-4 text-emerald-700 hover:text-emerald-900 transition-all duration-200 text-sm font-semibold flex items-center gap-2 mx-auto cursor-pointer hover:gap-3 group"
        >
          <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span>Go back to dashboard</span>
        </button>
      </div>
    </div>
  );
}

function CreateEvent() {
  const navigate = useNavigate();
  const [adminData, setAdminData] = useState(null);
  const [ngoCode, setNgoCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageOrientation, setImageOrientation] = useState("");

  const handleImageLoad = (e) => {
    const { naturalWidth, naturalHeight } = e.target;
    if (naturalHeight > naturalWidth) {
      setImageOrientation("portrait");
    } else {
      setImageOrientation("landscape");
    }
  };

  // Wizard step state
  const [currentStep, setCurrentStep] = useState(1);

  // Form states (Page 1 - Event Details)
  const [eventTitle, setEventTitle] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventStartDate, setEventStartDate] = useState("");
  const [eventEndDate, setEventEndDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventObjectives, setEventObjectives] = useState("");
  const [location, setLocation] = useState("");
  const [locationDetails, setLocationDetails] = useState(null);
  const locationInputRef = useRef(null);
  const autocompleteRef = useRef(null);
  const [volunteersLimit, setVolunteersLimit] = useState("");
  const [callTime, setCallTime] = useState("");
  const [eventTasks, setEventTasks] = useState("");
  const [volunteerGuidelines, setVolunteerGuidelines] = useState("");
  const [volunteerOpportunities, setVolunteerOpportunities] = useState([]);
  const [preferredSkills, setPreferredSkills] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(
    localStorage.getItem("sidebarCollapsed") === "true" || false
  );
  // Add after const [sidebarCollapsed, setSidebarCollapsed] = useState...
  const [eventType, setEventType] = useState(null); // 'single' or 'multiple'
  const [showEventTypeModal, setShowEventTypeModal] = useState(true);
  const [dynamicTasks, setDynamicTasks] = useState([
    {
      id: 1,
      taskName: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: ""
    }
  ]);

  const [completionTasks, setCompletionTasks] = useState([
    { id: 1, description: "" },
    { id: 2, description: "" },
    { id: 3, description: "" }
  ]);

  // Modal states
  const [modalConfig, setModalConfig] = useState(null);

  // Volunteer opportunity options
  const opportunityOptions = [
    "Education & Youth Development",
    "Healthcare & Medical Aid",
    "Environmental Conservation",
    "Disaster Relief & Emergency Response",
    "Community Development",
    "Administrative & Technical Support",
    "Human Rights & Advocacy",
    "Animal Welfare"
  ];

  const skillOptions = [
    "Event Planning & Coordination",
    "Manual Labor & Construction",
    "Teaching & Tutoring",
    "Medical & Healthcare",
    "Graphic Design & Photography",
    "Writing & Content Creation",
    "Counseling & Mentoring",
    "Fundraising & Grant Writing",
    "Cooking & Food Service"
  ];

  // Supported image formats
  const supportedImageTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
    'image/bmp',
    'image/tiff'
  ];

  const supportedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'tiff'];

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    if (admin) {
      setAdminData(admin);
      setNgoCode(admin.NGO_Information?.ngo_code || "");
    }

    // Load Google Maps API
    const googleMapsApiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

    // Load Google Maps API
    if (!window.google) {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${googleMapsApiKey}&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onload = initializeAutocomplete;
      document.head.appendChild(script);
    } else {
      initializeAutocomplete();
    }
  }, []);

  // Initialize Google Places Autocomplete
  const initializeAutocomplete = () => {
    if (locationInputRef.current && window.google) {
      autocompleteRef.current = new window.google.maps.places.Autocomplete(
        locationInputRef.current,
        {
          types: ['establishment', 'geocode'],
          componentRestrictions: { country: 'ph' }, // Restrict to Philippines
        }
      );

      autocompleteRef.current.addListener('place_changed', handlePlaceSelect);
    }
  };

  // Handle place selection
  const handlePlaceSelect = () => {
    const place = autocompleteRef.current.getPlace();

    if (place.geometry) {
      setLocation(place.formatted_address || place.name);
      setLocationDetails({
        name: place.name,
        address: place.formatted_address,
        lat: place.geometry.location.lat(),
        lng: place.geometry.location.lng(),
        place_id: place.place_id,
      });
    }
  };

  // Convert 12-hour format to 24-hour format
  const convertTo24Hour = (time12h) => {
    if (!time12h) return "";
    const [time, modifier] = time12h.split(" ");
    let [hours, minutes] = time.split(":");
    if (hours === "12") {
      hours = "00";
    }
    if (modifier === "PM") {
      hours = parseInt(hours, 10) + 12;
    }
    return `${hours}:${minutes}:00`;
  };

  // Convert 24-hour format to 12-hour format
  const convertTo12Hour = (time24h) => {
    if (!time24h) return "";
    const [hours, minutes] = time24h.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  // Validate file type and size
  const validateFile = (file) => {
    if (!supportedImageTypes.includes(file.type)) {
      const extension = file.name.split('.').pop().toLowerCase();
      if (!supportedExtensions.includes(extension)) {
        setModalConfig({
          title: "Invalid File Type",
          message: `Unsupported file type. Please upload one of the following formats: ${supportedExtensions.join(', ')}`,
          onCancel: () => setModalConfig(null),
          type: "alert",
        });
        return false;
      }
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setModalConfig({
        title: "File Too Large",
        message: "File size too large. Please upload an image smaller than 10MB.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return false;
    }

    return true;
  };

  // Handle file selection with remove functionality
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setSelectedFile(null);
      setImagePreview(null);
      return;
    }

    if (!validateFile(file)) {
      e.target.value = '';
      return;
    }

    setSelectedFile(file);

    if (file.type !== 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (event) => {
        setImagePreview(event.target.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  // Remove selected file
  const removeSelectedFile = () => {
    setSelectedFile(null);
    setImagePreview(null);
    // Reset the file input
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = '';
  };

  const validatePage1 = () => {
  // Check for missing basic fields first
  if (!eventTitle.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide an Event Title.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  // Validate date based on event type
  if (eventType === 'single') {
    if (!eventDate) {
      setModalConfig({
        title: "Incomplete",
        message: "Please select an Event Date.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return false;
    }
  } else if (eventType === 'multiple') {
    if (!eventStartDate || !eventEndDate) {
      setModalConfig({
        title: "Incomplete",
        message: "Please provide event start and end dates.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return false;
    }

    const start = new Date(eventStartDate);
    const end = new Date(eventEndDate);
    if (end < start) {
      setModalConfig({
        title: "Invalid Date Range",
        message: "Event end date must be after start date.",
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
      return false;
    }
  }

  if (!startTime) {
    setModalConfig({
      title: "Incomplete",
      message: "Please select a Start Time.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!endTime) {
    setModalConfig({
      title: "Incomplete",
      message: "Please select an End Time.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!eventDescription.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide an Event Description.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!eventObjectives.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide Event Objectives.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!location.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide a Location.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!volunteersLimit || volunteersLimit <= 0) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide a valid Volunteers Limit.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!callTime) {
    setModalConfig({
      title: "Incomplete",
      message: "Please select a Call Time.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!eventTasks.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide Event Tasks (What to Expect).",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!volunteerGuidelines.trim()) {
    setModalConfig({
      title: "Incomplete",
      message: "Please provide Volunteer Guidelines.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (volunteerOpportunities.length === 0) {
    setModalConfig({
      title: "Incomplete",
      message: "Please select at least one Volunteer Opportunity.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (preferredSkills.length === 0) {
    setModalConfig({
      title: "Incomplete",
      message: "Please select at least one Preferred Skill.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (!selectedFile) {
    setModalConfig({
      title: "Incomplete",
      message: "Please upload an Event Poster/Image.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  // Validate date is not in the past
  const dateToCheck = eventType === 'single' ? eventDate : eventStartDate;
  const selectedDate = new Date(dateToCheck);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (selectedDate < today) {
    setModalConfig({
      title: "Invalid Date",
      message: "Event date cannot be in the past.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  // Validate time logic
  const start = new Date(`1970-01-01T${convertTo24Hour(startTime)}`);
  const end = new Date(`1970-01-01T${convertTo24Hour(endTime)}`);
  const call = new Date(`1970-01-01T${convertTo24Hour(callTime)}`);

  if (start >= end) {
    setModalConfig({
      title: "Invalid Time",
      message: "End time must be after start time.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  if (call > start) {
    setModalConfig({
      title: "Invalid Call Time",
      message: "Call time must be before or equal to start time.",
      onCancel: () => setModalConfig(null),
      type: "alert",
    });
    return false;
  }

  return true;
};

  // Validate Page 2 (Completion Tasks)
  const validatePage2 = () => {
    const tasksToValidate = eventType === 'multiple' ? dynamicTasks : completionTasks;

    if (eventType === 'multiple') {
      // Validate each task has all required fields
      for (let task of tasksToValidate) {
        if (!task.taskName.trim()) {
          setModalConfig({
            title: "Incomplete Tasks",
            message: "Please provide a task name for all tasks.",
            onCancel: () => setModalConfig(null),
            type: "alert",
          });
          return false;
        }
        if (!task.description.trim()) {
          setModalConfig({
            title: "Incomplete Tasks",
            message: "Please fill in all task descriptions.",
            onCancel: () => setModalConfig(null),
            type: "alert",
          });
          return false;
        }
        if (!task.startDate || !task.endDate) {
          setModalConfig({
            title: "Incomplete Tasks",
            message: "Please provide start and end dates for all tasks.",
            onCancel: () => setModalConfig(null),
            type: "alert",
          });
          return false;
        }
        if (!task.startTime || !task.endTime) {
          setModalConfig({
            title: "Incomplete Tasks",
            message: "Please provide start and end times for all tasks.",
            onCancel: () => setModalConfig(null),
            type: "alert",
          });
          return false;
        }

        // Validate date range
        const taskStart = new Date(task.startDate);
        const taskEnd = new Date(task.endDate);
        if (taskEnd < taskStart) {
          setModalConfig({
            title: "Invalid Date Range",
            message: `Task "${task.taskName}" end date must be after start date.`,
            onCancel: () => setModalConfig(null),
            type: "alert",
          });
          return false;
        }
      }
    } else {
      const emptyTasks = tasksToValidate.filter(task => !task.description.trim());
      if (emptyTasks.length > 0) {
        setModalConfig({
          title: "Incomplete Tasks",
          message: "Please fill in all task descriptions before proceeding.",
          onCancel: () => setModalConfig(null),
          type: "alert",
        });
        return false;
      }
    }
    return true;
  };

  // Handle completion task change - only description field
  const handleTaskChange = (id, value) => {
    setCompletionTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, description: value } : task
      )
    );
  };
  // Add after handleTaskChange function
  const addDynamicTask = () => {
    const newId = Math.max(...dynamicTasks.map(t => t.id), 0) + 1;
    setDynamicTasks(prev => [...prev, {
      id: newId,
      taskName: "",
      description: "",
      startDate: "",
      endDate: "",
      startTime: "",
      endTime: ""
    }]);
  };

  const removeDynamicTask = (id) => {
    if (dynamicTasks.length > 1) {
      setDynamicTasks(prev => prev.filter(task => task.id !== id));
    }
  };

  const handleDynamicTaskChange = (id, field, value) => {
    setDynamicTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, [field]: value } : task
      )
    );
  };

  // Get next event ID
  const getNextEventId = async () => {
    try {
      const { data, error } = await supabase
        .from("Event_Information")
        .select("event_id")
        .order("event_id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastId = data[0].event_id;
        const number = parseInt(lastId.split("-")[2]);
        return `EVENT-2025-${String(number + 1).padStart(4, "0")}`;
      } else {
        return "EVENT-2025-0001";
      }
    } catch (error) {
      console.error("Error getting next event ID:", error);
      return "EVENT-2025-0001";
    }
  };

  // Get next task ID
  const getNextTaskId = async () => {
    try {
      const { data, error } = await supabase
        .from("Task_Reports")
        .select("task_id")
        .order("task_id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastId = data[0].task_id;
        const number = parseInt(lastId.split("-")[2]);
        return `TASK-2025-${String(number + 1).padStart(4, "0")}`;
      } else {
        return "TASK-2025-0001";
      }
    } catch (error) {
      console.error("Error getting next task ID:", error);
      return "TASK-2025-0001";
    }
  };

  // Upload image to Supabase Storage
  const uploadEventImage = async (file) => {
    if (!file) return null;

    setImageUploading(true);
    try {
      const fileExt = file.name.split('.').pop().toLowerCase();
      const timestamp = Date.now();
      const randomStr = Math.random().toString(36).substring(2, 15);
      const fileName = `event_${ngoCode}_${timestamp}_${randomStr}.${fileExt}`;
      const filePath = `event_images/${fileName}`;

      const uploadOptions = {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type
      };

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("centro_bucket")
        .upload(filePath, file, uploadOptions);

      if (uploadError) {
        if (uploadError.message.includes('row_level_security')) {
          const { data: retryData, error: retryError } = await supabase.storage
            .from("centro_bucket")
            .upload(filePath, file, {
              ...uploadOptions,
              upsert: true
            });

          if (retryError) {
            throw retryError;
          }
        } else {
          throw uploadError;
        }
      }

      const { data: urlData } = supabase.storage
        .from("centro_bucket")
        .getPublicUrl(filePath);

      if (!urlData || !urlData.publicUrl) {
        throw new Error('Failed to get public URL');
      }

      return urlData.publicUrl;

    } catch (error) {
      console.error("Error uploading image:", error);

      if (error.message.includes('row_level_security')) {
        setModalConfig({
          title: "Storage Permission Error",
          message: "Storage permission error. Please make sure you're logged in as an admin.",
          onCancel: () => setModalConfig(null),
          type: "alert",
        });
      } else {
        setModalConfig({
          title: "Upload Error",
          message: `Error uploading image: ${error.message}. Please try again.`,
          onCancel: () => setModalConfig(null),
          type: "alert",
        });
      }

      return null;
    } finally {
      setImageUploading(false);
    }
  };

  // Create task report entry - only use description fields
  const createTaskReport = async (eventId, taskId) => {
    try {
      const taskData = {
        task_id: taskId,
        event_id: eventId,
        ngo_id: ngoCode,
      };

      const tasksToUse = eventType === 'multiple' ? dynamicTasks : completionTasks;

      tasksToUse.forEach((task, index) => {
        if (index === 0) {
          taskData.description_one = task.description;
        } else if (index === 1) {
          taskData.description_two = task.description;
        } else if (index === 2) {
          taskData.description_three = task.description;
        }
      });

      const { data, error } = await supabase
        .from("Task_Reports")
        .insert([taskData])
        .select();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error("Error creating task report:", error);
      throw error;
    }
  };



  // Create event in database
  const publishEvent = async () => {
    setLoading(true);
    try {
      const eventId = await getNextEventId();
      const taskId = await getNextTaskId();
      let imageUrl = null;

      if (selectedFile) {
        imageUrl = await uploadEventImage(selectedFile);
        if (!imageUrl) {
          setLoading(false);
          return;
        }
      }

      // Create event data (removed completion_tasks field)
      const eventData = {
        event_id: eventId,
        ngo_id: ngoCode,
        event_title: eventTitle.trim(),
        event_type: eventType,
        date: eventDate,
        time_start: convertTo24Hour(startTime),
        time_end: convertTo24Hour(endTime),
        description: eventDescription.trim(),
        event_objectives: eventObjectives.trim(),
        location: location.trim(),
        volunteers_limit: parseInt(volunteersLimit),
        call_time: convertTo24Hour(callTime),
        what_expect: eventTasks.trim(),
        volunteer_guidelines: volunteerGuidelines.trim(),
        volunteer_opportunities: volunteerOpportunities.join("-"),
        event_image: imageUrl,
        volunteer_joined: 0,
        status: "UPCOMING",
        preferred_skills: preferredSkills.join("-"),
        created_at: new Date().toISOString().split('T')[0]
      };

      // Insert event first
      const { data: insertedEvent, error: eventError } = await supabase
        .from("Event_Information")
        .insert([eventData])
        .select();

      if (eventError) throw eventError;

      // Then create task report
      await createTaskReport(eventId, taskId);

      setModalConfig({
        title: "Success",
        message: "Event and completion tasks published successfully!",
        onCancel: () => {
          setModalConfig(null);
          navigate("/dashboard");
        },
        type: "alert",
      });

    } catch (error) {
      console.error("Error creating event:", error);
      setModalConfig({
        title: "Error",
        message: `Error creating event: ${error.message}. Please try again.`,
        onCancel: () => setModalConfig(null),
        type: "alert",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle opportunity selection
  const handleOpportunityChange = (opportunity) => {
    setVolunteerOpportunities(prev => {
      if (prev.includes(opportunity)) {
        return prev.filter(item => item !== opportunity);
      } else {
        return [...prev, opportunity];
      }
    });
  };

  const handleSkillChange = (skill) => {
    setPreferredSkills(prev => {
      if (prev.includes(skill)) {
        return prev.filter(item => item !== skill);
      } else {
        return [...prev, skill];
      }
    });
  };

  // Generate time options
  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const time24 = `${String(hour).padStart(2, '0')}:${String(min).padStart(2, '0')}`;
        const time12 = convertTo12Hour(time24);
        times.push({ value: time12, label: time12 });
      }
    }
    return times;
  };

  const timeOptions = generateTimeOptions();

  // Navigation functions
  const goToStep1 = () => setCurrentStep(1);
  const goToStep2 = () => {
    if (validatePage1()) {
      setCurrentStep(2);
    }
  };
  const goToStep3 = () => {
    if (validatePage2()) {
      setCurrentStep(3);
    }
  };
  const goToPrevious = () => setCurrentStep(prev => Math.max(1, prev - 1));
  const fileInputRef = useRef(null);

  // Render Step 1 - Event Details
  const renderStep1 = () => (
    <div
      className="rounded-lg shadow-xl p-6 w-full border-4 border-emerald-800"
      style={{ backgroundColor: "#fade97" }}
    >
      <h3 className="text-xl font-bold text-emerald-800 mb-4">Step 1: Event Details</h3>

      {/* Event Title */}
      <div className="mb-4">
        <label className="block font-semibold text-lg text-emerald-800 mb-1">
          Event Title <span className="text-red-600">*</span>
        </label>
        <input
          type="text"
          placeholder="Enter Event Title"
          value={eventTitle}
          onChange={(e) => setEventTitle(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white border border-gray-300 cursor-pointer"
        />
      </div>

      {/* Date & Time Container */}
      {eventType === 'single' ? (
        // Single Event - Original Date & Time
        <div className="w-full flex flex-wrap gap-6 mb-6">
          <div className="flex-1 min-w-[250px]">
            <label className="block font-semibold text-lg text-emerald-800 mb-1">
              Date  <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border bg-white border-gray-300 rounded px-4 py-2">
              <img src={DateIcon} alt="Date" className="w-5 h-5 mr-2" />
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full border-none focus:outline-none cursor-pointer text-gray-700 bg-transparent"
              />
            </div>
          </div>

          <div className="flex-1 min-w-[200px]">
            <label className="block font-semibold text-lg text-emerald-800 mb-1">
              Time <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3">
              <img src={TimeIcon} alt="Time" className="w-5 h-5 mr-2" />
              <select
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border-none focus:outline-none cursor-pointer bg-transparent text-gray-700"
              >
                <option value="">Start Time</option>
                {timeOptions.map((time) => (
                  <option key={`start-${time.value}`} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
              <select
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-1/2 p-2 focus:outline-none cursor-pointer"
              >
                <option value="">End Time</option>
                {timeOptions.map((time) => (
                  <option key={`end-${time.value}`} value={time.value}>
                    {time.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      ) : (
        // Multiple Event - Date Range & Time (fixed one-liner)
        <div className="w-full mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Event Date Range */}
            <div>
              <label className="block font-semibold text-lg text-emerald-800 mb-1">
                Event Duration <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 gap-2">
                <img src={DateIcon} alt="Date" className="w-4 h-4 opacity-60 flex-shrink-0" />
                <input
                  type="date"
                  value={eventStartDate}
                  onChange={(e) => setEventStartDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-0 flex-1 border-none focus:outline-none cursor-pointer text-gray-700 bg-transparent text-sm min-w-0"
                />
                <span className="text-gray-400 text-xs font-medium flex-shrink-0">to</span>
                <input
                  type="date"
                  value={eventEndDate}
                  onChange={(e) => setEventEndDate(e.target.value)}
                  min={eventStartDate || new Date().toISOString().split('T')[0]}
                  className="w-0 flex-1 border-none focus:outline-none cursor-pointer text-gray-700 bg-transparent text-sm min-w-0"
                />
              </div>
            </div>

            {/* Event Time */}
            <div>
              <label className="block font-semibold text-lg text-emerald-800 mb-1">
                Event Time <span className="text-red-600">*</span>
              </label>
              <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2 gap-2">
                <img src={TimeIcon} alt="Time" className="w-4 h-4 opacity-60 flex-shrink-0" />
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-0 flex-1 border-none focus:outline-none cursor-pointer bg-transparent text-gray-700 text-sm min-w-0"
                >
                  <option value="">Start Time</option>
                  {timeOptions.map((time) => (
                    <option key={`start-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
                <span className="text-gray-400 text-xs flex-shrink-0">—</span>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-0 flex-1 border-none focus:outline-none cursor-pointer bg-transparent text-gray-700 text-sm min-w-0"
                >
                  <option value="">End Time</option>
                  {timeOptions.map((time) => (
                    <option key={`end-${time.value}`} value={time.value}>
                      {time.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Location with Google Maps Autocomplete */}
      <div className="mb-4">
        <label className="block font-semibold text-lg text-green-800 mb-1">
          Location <span className="text-red-600">*</span>
        </label>
        <input
          ref={locationInputRef}
          type="text"
          placeholder="Search for a location..."
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white border border-gray-300 cursor-pointer focus:outline-none focus:border-green-500"
        />
        {locationDetails && (
          <div className="mt-2 p-2 bg-emerald-50 rounded border border-emerald-200 text-sm">
            <p className="text-emerald-800">
              <span className="font-semibold">Selected:</span> {locationDetails.name}
            </p>
            <p className="font-bold text-xs">{locationDetails.address}</p>
          </div>
        )}
      </div>

      {/* Event Description */}
      <div className="mb-4">
        <label className="block mb-2 font-semibold text-lg text-emerald-900">
          Event Description <span className="text-red-600">*</span>
        </label>
        <textarea
          placeholder="Enter Event Description"
          value={eventDescription}
          onChange={(e) => setEventDescription(e.target.value)}
          className="w-full p-3 rounded bg-white border border-gray-300 h-40 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
          rows={3}
        />
      </div>

      {/* Event Objectives */}
      <div className="mb-4">
        <label className="block font-semibold text-lg text-emerald-800 mb-1">
          Event Objectives <span className="text-red-600">*</span>
        </label>
        <textarea
          placeholder="Enter Objectives (separate each objective with a dash '-')"
          value={eventObjectives}
          onChange={(e) => setEventObjectives(e.target.value)}
          className="w-full p-3 rounded bg-white border border-gray-300 h-40 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer"
          rows={2}
        />
        <p className="text-sm text-emerald-700 mt-1">
          Example: Increase community awareness-Promote environmental conservation-Foster volunteer engagement
        </p>
      </div>

      {/* Volunteers Limit & Call Time - Side by side */}
      <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Volunteers Limit */}
        <div className="flex flex-col">
          <label className="block font-semibold text-lg text-emerald-800 mb-1">
            Volunteers Limit <span className="text-red-600">*</span>
          </label>
          <input
            type="number"
            placeholder="Enter Number of Volunteers"
            value={volunteersLimit}
            onChange={(e) => setVolunteersLimit(e.target.value)}
            min="1"
            className="w-full border border-gray-300 focus:outline-none rounded-lg cursor-pointer px-4 bg-white text-gray-700"
            style={{ height: "42px" }}
          />
        </div>

        {/* Call Time */}
        <div className="flex flex-col">
          <label className="block font-semibold text-lg text-emerald-800 mb-1">
            Call Time <span className="text-red-600">*</span>
          </label>
          <div className="flex items-center border bg-white border-gray-300 rounded-lg px-4 gap-2" style={{ height: "42px" }}>
            <img src={TimeIcon} alt="Time" className="w-4 h-4 opacity-60 flex-shrink-0" />
            <select
              value={callTime}
              onChange={(e) => setCallTime(e.target.value)}
              className="flex-1 border-none focus:outline-none cursor-pointer bg-transparent text-gray-700 text-sm"
            >
              <option value="">Select Time</option>
              {timeOptions.map((time) => (
                <option key={`call-${time.value}`} value={time.value}>
                  {time.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Event Tasks */}
      <div className="mb-4">
        <label className="block font-semibold text-lg text-emerald-800 mb-1">
          Event Tasks (What to Expect) <span className="text-red-600">*</span>
        </label>
        <textarea
          placeholder="Enter what volunteers can expect (separate each task with a dash '-')"
          value={eventTasks}
          onChange={(e) => setEventTasks(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white border border-gray-300 cursor-pointer"
          rows={2}
        />
        <p className="text-sm text-emerald-700 mt-1">
          Example: Setup event materials-Assist participants-Clean up after event
        </p>
      </div>

      {/* Volunteer Guidelines */}
      <div className="mb-4">
        <label className="block font-semibold text-lg text-emerald-800 mb-1">
          Volunteer Guidelines <span className="text-red-600">*</span>
        </label>
        <textarea
          placeholder="Enter volunteer guidelines (separate each guideline with a dash '-')"
          value={volunteerGuidelines}
          onChange={(e) => setVolunteerGuidelines(e.target.value)}
          className="w-full px-4 py-2 rounded bg-white border border-gray-300 cursor-pointer"
          rows={2}
        />
        <p className="text-sm text-emerald-700 mt-1">
          Example: Arrive on time-Wear appropriate attire-Follow safety protocols
        </p>
      </div>

      {/* Upload Poster, Volunteer Opportunities & Preferred Skills - 3 columns */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Upload Event Poster */}
        <div className="flex flex-col">
          <label className="block font-semibold text-lg text-emerald-800 mb-1">
            Upload Event Poster/Image <span className="text-red-600">*</span>
          </label>
          <div className="flex flex-col border border-gray-300 rounded-lg bg-white overflow-hidden">
            {/* Clickable preview zone — auto opens file picker */}
            <div
              className="flex items-center justify-center bg-gray-50 border-b border-gray-100 flex-shrink-0 cursor-pointer transition-colors duration-200 group"
              style={{ height: "200px" }}
              onClick={() => fileInputRef.current?.click()}
              title="Click to upload image"
            >
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Preview"
                  onLoad={handleImageLoad}
                  className="object-contain rounded"
                  style={{ maxHeight: "195px", maxWidth: "100%", width: "auto" }}
                />
              ) : (
                <div className="flex flex-col items-center gap-2 text-gray-300 group-hover:text-emerald-400 transition-colors select-none">
                  <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span className="text-xs font-medium">Click to upload image</span>
                </div>
              )}
            </div>
            {/* Controls */}
            <div className="p-3 flex flex-col gap-1.5">
              <label className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-200 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                <img src={FileIcon} alt="Upload" className="w-4 h-4 opacity-60 flex-shrink-0" />
                <span className="text-xs text-emerald-700 font-medium truncate">
                  {selectedFile ? selectedFile.name : "Choose image file..."}
                </span>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept={supportedImageTypes.join(',')}
                  onChange={handleFileSelect}
                  className="sr-only"
                />
              </label>
              <p className="text-xs text-gray-400">Formats: {supportedExtensions.join(', ')} · Max 10MB</p>
              {selectedFile && (
                <button
                  type="button"
                  onClick={removeSelectedFile}
                  className="text-xs text-red-500 hover:text-red-700 font-medium text-left transition-colors cursor-pointer"
                >
                  ✕ Remove image
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Volunteer Opportunities */}
        <div className="flex flex-col">
          <label className="block font-semibold text-lg text-emerald-800 mb-1">
            Volunteer Opportunities <span className="text-red-600">*</span>
          </label>
          <div className="border bg-white border-gray-300 rounded p-3 flex-1 flex flex-col max-h-[280px]">
            <div className="flex items-center mb-2">
              <img
                src={OpportunitiesIcon}
                alt="Opportunities"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium">Select all that apply:</span>
            </div>
            <div className="grid grid-cols-1 gap-1 overflow-y-auto flex-1 pr-1">
              {opportunityOptions.map((option) => (
                <label key={option} className="flex items-center text-sm cursor-pointer group hover:bg-emerald-50 px-2 py-2 rounded transition-colors">
                  <div className="relative flex items-center w-full">
                    <input
                      type="checkbox"
                      checked={volunteerOpportunities.includes(option)}
                      onChange={() => handleOpportunityChange(option)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${volunteerOpportunities.includes(option)
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                      {volunteerOpportunities.includes(option) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`ml-3 text-sm group-hover:text-emerald-800 transition-all duration-200 ${volunteerOpportunities.includes(option)
                        ? 'text-emerald-800 font-bold'
                        : 'text-gray-700 font-normal'
                      }`}>
                      {option}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Preferred Skills */}
        <div className="flex flex-col">
          <label className="block font-semibold text-lg text-emerald-800 mb-1">
            Preferred Skills <span className="text-red-600">*</span>
          </label>
          <div className="border bg-white border-gray-300 rounded p-3 flex-1 flex flex-col max-h-[280px]">
            <div className="flex items-center mb-2">
              <img
                src={OpportunitiesIcon}
                alt="Skills"
                className="w-5 h-5 mr-2"
              />
              <span className="text-sm font-medium">Select all that apply:</span>
            </div>
            <div className="grid grid-cols-1 gap-1 overflow-y-auto flex-1 pr-1">
              {skillOptions.map((skill) => (
                <label key={skill} className="flex items-center text-sm cursor-pointer group hover:bg-emerald-50 px-2 py-2 rounded transition-colors">
                  <div className="relative flex items-center w-full">
                    <input
                      type="checkbox"
                      checked={preferredSkills.includes(skill)}
                      onChange={() => handleSkillChange(skill)}
                      className="sr-only"
                    />
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 flex-shrink-0 ${preferredSkills.includes(skill)
                        ? 'bg-emerald-600 border-emerald-600'
                        : 'border-gray-300 group-hover:border-emerald-400'
                      }`}>
                      {preferredSkills.includes(skill) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className={`ml-3 text-sm group-hover:text-emerald-800 transition-all duration-200 ${preferredSkills.includes(skill)
                        ? 'text-emerald-800 font-bold'
                        : 'text-gray-700 font-normal'
                      }`}>
                      {skill}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Step 1 Buttons */}
      <div className="flex justify-between">
        <button
          onClick={() => setModalConfig({
            title: "Close",
            message: "Are you sure you want to close? All progress will be lost.",
            onConfirm: () => {
              setModalConfig(null);
              navigate("/dashboard");
            },
            onCancel: () => setModalConfig(null),
          })}
          className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          Close
        </button>
        <button
          onClick={goToStep2}
          className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-900 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => {
    const tasksToRender = eventType === 'multiple' ? dynamicTasks : completionTasks;

    return (
      <div
        className="rounded-lg shadow-xl p-6 w-full border-4 border-emerald-800"
        style={{ backgroundColor: "#fade97" }}
      >
        <h3 className="text-xl font-bold text-emerald-800 mb-4">
          Step 2: {eventType === 'multiple' ? 'Event Tasks' : 'Completion Tasks'}
        </h3>

        <p className="text-emerald-700 mb-6">
          {eventType === 'multiple'
            ? "Define different tasks for this multi-day event. Each task can have its own schedule and description."
            : "Define three tasks that need to be completed for this event. These will be used to track event progress."}
        </p>

        <div className="space-y-6 mb-6">
          {tasksToRender.map((task, index) => (
            <div key={task.id} className="bg-white rounded-lg border-2 border-emerald-400 p-5 shadow-md">
              <div className="flex items-start justify-between mb-4">
                <h4 className="font-bold text-xl text-emerald-900">
                  {eventType === 'multiple' ? `Task ${index + 1}` : `Task ${index + 1}`}
                  <span className="text-red-600">*</span>
                </h4>
                {eventType === 'multiple' && tasksToRender.length > 1 && (
                 <button
  type="button"
  onClick={(e) => {
    e.preventDefault();
    removeDynamicTask(task.id);
  }}
  className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer bg-red-50 px-3 py-1 rounded"
>
  Remove
</button>
                )}
              </div>

              {eventType === 'multiple' ? (
                <>
                  {/* Task Name */}
                  <div className="mb-4">
                    <label className="block font-semibold text-emerald-800 mb-1">
                      Task Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g., Registration, Processing, Distribution"
                      value={task.taskName}
                      onChange={(e) => handleDynamicTaskChange(task.id, 'taskName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  {/* Date & Time Range — strict one liner, no stacking */}
                  <div className="mb-4">
                    <div className="flex gap-4">
                      {/* Date Range */}
                      <div className="flex-1 min-w-0">
                        <label className="block font-semibold text-emerald-800 mb-1">
                          Date Range <span className="text-red-600">*</span>
                        </label>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-2 py-2 gap-1">
                          <img src={DateIcon} alt="Date" className="w-4 h-4 opacity-60 flex-shrink-0" />
                          <input
                            type="date"
                            value={task.startDate}
                            onChange={(e) => handleDynamicTaskChange(task.id, 'startDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-0 flex-1 border-none focus:outline-none cursor-pointer text-gray-700 bg-transparent text-xs min-w-0"
                          />
                          <span className="text-gray-400 text-xs flex-shrink-0">→</span>
                          <input
                            type="date"
                            value={task.endDate}
                            onChange={(e) => handleDynamicTaskChange(task.id, 'endDate', e.target.value)}
                            min={task.startDate || new Date().toISOString().split('T')[0]}
                            className="w-0 flex-1 border-none focus:outline-none cursor-pointer text-gray-700 bg-transparent text-xs min-w-0"
                          />
                        </div>
                      </div>

                      {/* Time Range */}
                      <div className="flex-1 min-w-0">
                        <label className="block font-semibold text-emerald-800 mb-1">
                          Time Range <span className="text-red-600">*</span>
                        </label>
                        <div className="flex items-center bg-white border border-gray-300 rounded-lg px-2 py-2 gap-1">
                          <img src={TimeIcon} alt="Time" className="w-4 h-4 opacity-60 flex-shrink-0" />
                          <select
                            value={task.startTime}
                            onChange={(e) => handleDynamicTaskChange(task.id, 'startTime', e.target.value)}
                            className="w-0 flex-1 border-none focus:outline-none cursor-pointer bg-transparent text-gray-700 text-xs min-w-0"
                          >
                            <option value="">Start</option>
                            {timeOptions.map((time) => (
                              <option key={`task${task.id}-start-${time.value}`} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                          <span className="text-gray-400 text-xs flex-shrink-0">→</span>
                          <select
                            value={task.endTime}
                            onChange={(e) => handleDynamicTaskChange(task.id, 'endTime', e.target.value)}
                            className="w-0 flex-1 border-none focus:outline-none cursor-pointer bg-transparent text-gray-700 text-xs min-w-0"
                          >
                            <option value="">End</option>
                            {timeOptions.map((time) => (
                              <option key={`task${task.id}-end-${time.value}`} value={time.value}>
                                {time.label}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block font-semibold text-emerald-800 mb-1">
                      Task Description <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      placeholder="Describe what needs to be done in this task..."
                      value={task.description}
                      onChange={(e) => handleDynamicTaskChange(task.id, 'description', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
                      rows={3}
                    />
                    <p className="text-sm text-emerald-600 mt-1">
                      Separate sub-tasks with dashes (-). Example: Check-in volunteers-Assign groups-Brief team leaders
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <textarea
                    placeholder="Enter task description..."
                    value={task.description}
                    onChange={(e) => handleTaskChange(task.id, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-emerald-500 resize-none"
                    rows={3}
                  />
                  <p className="text-sm text-emerald-600 mt-1">
                    Separate multiple task points with dashes (-). Example: Setup materials-Assign roles-Monitor progress
                  </p>
                </>
              )}
            </div>
          ))}
        </div>
         {eventType === 'multiple' && (
        <button
          type="button"
          onClick={addDynamicTask}
          className="w-full bg-emerald-600 text-white px-4 py-3 rounded-lg hover:bg-emerald-700 transition-all duration-200 mb-6 cursor-pointer font-semibold"
        >
          + Add Another Task
        </button>
      )}

        {/* Step 2 Buttons */}
        <div className="flex justify-between">
          <button
            onClick={goToPrevious}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Previous
          </button>
          <button
            onClick={goToStep3}
            className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-900 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Confirm
          </button>
        </div>
      </div>
    );
  };

  const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const day = String(date.getDate()).padStart(2, '0');        
  const year = date.getFullYear();                            
  
  return `${month}-${day}-${year}`; 
};

  // Render Step 3 
  const renderStep3 = () => (
    <div
      className="rounded-lg shadow-xl p-6 w-full border-4 border-emerald-800"
      style={{ backgroundColor: "#fade97" }}
    >
      <h3 className="text-xl font-bold text-emerald-800 mb-4">Step 3: Event Overview</h3>

      <p className="text-emerald-700 mb-6">
        Review all event details before publishing. Make sure everything is correct.
      </p>

      <div className="space-y-6">
  {/* Event Details Section */}
  <div className="bg-white rounded-lg p-4 border border-emerald-300">
    <h4 className="font-semibold text-emerald-800 mb-3 text-lg border-b border-emerald-200 pb-2">
      Event Details
    </h4>

    {/* Upper Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <p className="text-sm text-emerald-600 font-medium">Event Title:</p>
        <p className="text-gray-800">{eventTitle}</p>
      </div>
      <div>
        <p className="text-sm text-emerald-600 font-medium">
          {eventType === 'multiple' ? 'Event Duration' : 'Event Date'}
        </p>
        <p className="text-gray-800">
          {eventType === 'multiple' 
            ? `${formatDate(eventStartDate)} to ${formatDate(eventEndDate)}` 
            : formatDate(eventDate)}
        </p>
      </div>
      <div>
        <p className="text-sm text-emerald-600 font-medium">Time:</p>
        <p className="text-gray-800">{startTime} - {endTime}</p>
      </div>
      <div>
        <p className="text-sm text-emerald-600 font-medium">Location:</p>
        <p className="text-gray-800">{location}</p>
      </div>
      <div>
        <p className="text-sm text-emerald-600 font-medium">Volunteers Limit:</p>
        <p className="text-gray-800">{volunteersLimit}</p>
      </div>
      <div>
        <p className="text-sm text-emerald-600 font-medium">Call Time:</p>
        <p className="text-gray-800">{callTime}</p>
      </div>
    </div>

    {/* Divider / Gap */}
    <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-emerald-100 pt-4">
      
      {/* LEFT SIDE: Long Descriptions*/}
      <div className="space-y-4">
        <div>
          <p className="text-sm text-emerald-600 font-medium">Description:</p>
          <p className="text-gray-800 text-sm">{eventDescription}</p>
        </div>

        <div>
          <p className="text-sm text-emerald-600 font-medium">Objectives:</p>
          <p className="text-gray-800 text-sm">{eventObjectives}</p>
        </div>

        <div>
          <p className="text-sm text-emerald-600 font-medium">What to Expect:</p>
          <p className="text-gray-800 text-sm">{eventTasks}</p>
        </div>

        <div>
          <p className="text-sm text-emerald-600 font-medium">Volunteer Guidelines:</p>
          <p className="text-gray-800 text-sm">{volunteerGuidelines}</p>
        </div>

        <div>
          <p className="text-sm text-emerald-600 font-medium">Volunteer Opportunities:</p>
          <p className="text-gray-800 text-sm">{volunteerOpportunities.join(", ")}</p>
        </div>

        <div>
          <p className="text-sm text-emerald-600 font-medium">Preferred Skills:</p>
          <p className="text-gray-800 text-sm">{preferredSkills.join(", ")}</p>
        </div>
      </div>

      <div className="flex flex-col">
  <p className="text-sm text-emerald-600 font-medium mb-2">Event Image:</p>
  {imagePreview ? (
    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-2 min-h-[150px]">
      <img
  src={imagePreview}
  alt="Event"
  onLoad={handleImageLoad}
  /* Pinagsamang logic ng orientation at custom class */
  className="event-image-preview object-contain rounded shadow-md mx-auto max-w-full"
  style={{ 
    maxHeight: '180px', // Sakto lang na laki
    width: 'auto',
    /* Automatic border logic */
    border: imageOrientation === "portrait" 
      ? "2px solid #b0b0b0"  // Makapal at dark green kung Portrait
      : "2px solid #b0b0b0"   // Manipis at light green kung Landscape
  }}
/>
    </div>
    
  ) : (
    <div className="border border-dashed border-gray-300 rounded-lg h-32 flex items-center justify-center text-gray-400 text-sm italic">
      No image uploaded
    </div>
  )}
</div>

    </div>
  </div>
</div>

   {/* Completion Tasks Section */}
<div className="bg-white rounded-lg p-4 border border-emerald-300 mt-6">
  <h4 className="font-semibold text-emerald-800 mb-3 text-lg border-b border-emerald-200 pb-2">
    {eventType === 'multiple' ? 'Event Tasks' : 'Completion Tasks'}
  </h4>
  <div className="space-y-4">
    {(eventType === 'multiple' ? dynamicTasks : completionTasks).map((task, index) => (
      <div key={task.id} className="border border-emerald-200 rounded-lg p-4 bg-emerald-50">
        <div className="flex items-start">
          <span className="w-8 h-8 bg-emerald-600 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 flex-shrink-0 mt-1">
            {index + 1}
          </span>
          <div className="flex-1">
            <h5 className="font-semibold text-emerald-800 mb-2">
              {eventType === 'multiple' ? task.taskName : `Task ${index + 1}`}
            </h5>
            
            {eventType === 'multiple' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-3 text-sm">
                {/* Clearer Start Schedule */}
                <div>
                  <p className="text-gray-700">
                    <span className="font-bold text-emerald-700">Start Date:</span> {formatDate(task.startDate)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-emerald-700">End Date:</span> {formatDate(task.endDate)}
                  </p>
                </div>

                {/* Clearer End Schedule */}
                <div>
                  <p className="text-gray-700">
                    <span className="font-bold text-emerald-700">Start Time:</span> {task.startTime}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-bold text-emerald-700">End Time:</span> {task.endTime}
                  </p>
                </div>
              </div>
            )}
            
            <p className="text-emerald-800 text-[11px] font-bold uppercase mb-1">Task Description:</p>
            <p className="text-gray-700 text-sm italic">{task.description}</p>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>

      {/* Step 3 Buttons */}
      <div className="flex justify-between mt-6">
        <div className="flex gap-3">
          <button
            onClick={goToStep1}
            className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Edit
          </button>
          <button
            onClick={() => setModalConfig({
              title: "Discard",
              message: "Are you sure you want to discard this event? All progress will be lost.",
              onConfirm: () => {
                setModalConfig(null);
                navigate("/dashboard");
              },
              onCancel: () => setModalConfig(null),
            })}
            className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            Discard
          </button>
        </div>
        <button
          onClick={() => setModalConfig({
            title: "Publish",
            message: "Are you sure you want to publish this event? Once published, it will be visible to volunteers and tasks will be created in the Task Reports system.",
            onConfirm: () => {
              setModalConfig(null);
              publishEvent();
            },
            onCancel: () => setModalConfig(null),
          })}
          disabled={loading || imageUploading}
          className="bg-emerald-700 text-white px-6 py-2 rounded-full hover:bg-emerald-900 disabled:opacity-50 transition-all duration-200 transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          {loading ? "Publishing..." : imageUploading ? "Uploading Image..." : "Publish"}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Event Type Selection Modal */}
      {showEventTypeModal && !eventType && (
        <EventTypeModal
          onSelect={(type) => {
            setEventType(type);
            setShowEventTypeModal(false);
          }}
          onCancel={() => navigate("/dashboard")}
        />
      )}

      {/* Only show main content after event type is selected */}
      {eventType && (
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
            <div className="w-full max-w-6xl">
              {/* Progress Indicator */}
              <div className="mb-6">
                <div className="flex items-center justify-between bg-white rounded-lg p-4 border-4 border-emerald-800 shadow-lg">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${currentStep >= 1 ? 'bg-emerald-700' : 'bg-gray-400'
                      }`}>
                      1
                    </div>
                    <div className={`h-1 w-20 ${currentStep > 1 ? 'bg-emerald-700' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${currentStep >= 2 ? 'bg-emerald-700' : 'bg-gray-400'
                      }`}>
                      2
                    </div>
                    <div className={`h-1 w-20 ${currentStep > 2 ? 'bg-emerald-700' : 'bg-gray-300'}`}></div>
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full text-white font-bold ${currentStep >= 3 ? 'bg-emerald-700' : 'bg-gray-400'
                      }`}>
                      3
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Step {currentStep} of 3</p>
                    <p className="font-semibold text-emerald-800">
                      {currentStep === 1 && "Event Details"}
                      {currentStep === 2 && "Completion Tasks"}
                      {currentStep === 3 && "Review & Publish"}
                    </p>
                  </div>
                </div>
              </div>


              {/* Header */}
              <div className="text-center mb-4 p-2 border-2 border-emerald-900 rounded-lg bg-emerald-900 shadow-md">
                <h2 className="text-2xl font-bold text-white">
                  CREATE / SCHEDULE AN EVENT {eventType === 'multiple' && '(MULTIPLE EVENT)'}
                </h2>
              </div>

              {/* Step Content */}
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>
          </main>

          {/* Show Confirmation Modal */}
          {modalConfig && (
            <ConfirmationModal
              title={modalConfig.title}
              message={modalConfig.message}
              onConfirm={modalConfig.onConfirm}
              onCancel={modalConfig.onCancel}
              type={modalConfig.type || "confirm"}
            />
          )}

          {/* CSS Animations */}
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
      )}
    </>

  );
}
export default CreateEvent;