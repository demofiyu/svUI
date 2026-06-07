import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Calendar, 
  MapPin, 
  Clock, 
  VolumeX, 
  Volume2, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Share2, 
  Sliders, 
  ClipboardList, 
  Sparkles, 
  ChevronLeft,
  Settings,
  LogOut,
  Phone,
  User,
  PlusCircle,
  Eye
} from 'lucide-react';
import './index.css';

// Import local assets (Vite will load these)
import weddingInviteBg from './assets/wedding_invite_bg.png';
import weddingCouple from './assets/wedding_couple.png';
import partyInviteBg from './assets/party_invite_bg.png';
import poojaInviteBg from './assets/pooja_invite_bg.png';
import pathInviteBg from './assets/path_invite_bg.png';
import publicInviteBg from './assets/public_invite_bg.png';
import generalInviteBg from './assets/general_invite_bg.png';

const getBackgroundImage = (type: string) => {
  switch (type) {
    case 'wedding': return weddingInviteBg;
    case 'party': return partyInviteBg;
    case 'pooja': return poojaInviteBg;
    case 'path': return pathInviteBg;
    case 'public': return publicInviteBg;
    case 'general': return generalInviteBg;
    default: return generalInviteBg;
  }
};

interface EventTimeline {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  mapsUrl: string;
}

interface InvitationDetails {
  hosts: string;
  message: string;
  rsvpPhone: string;
  registry: string;
  // Wedding specific
  brideName?: string;
  groomName?: string;
  // Party specific
  partyHost?: string;
  partyTheme?: string;
  // Pooja specific
  deityName?: string;
  poojaName?: string;
  // Path specific
  pathType?: string;
  paathText?: string;
  // Public specific
  speakers?: string;
  organizer?: string;
  // General
  generalTitle?: string;
}

interface Invitation {
  id: string;
  userPhone: string; // Owner
  type: 'wedding' | 'party' | 'pooja' | 'path' | 'public' | 'general';
  title: string;
  date: string;
  time: string;
  musicUrl: string;
  theme: 'wedding' | 'party' | 'pooja' | 'path' | 'public' | 'general';
  details: InvitationDetails;
  events: EventTimeline[];
}

interface RSVP {
  id: string;
  invitationId: string;
  name: string;
  attending: 'yes' | 'no' | 'maybe';
  guests: number;
  food: string;
  message: string;
  date: string;
}

interface UserProfile {
  phone: string;
  name: string;
}

// Simple Base64 Helper that handles unicode strings safely
const encodeData = (data: Invitation): string => {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Str = encodeURIComponent(jsonStr);
    return btoa(utf8Str);
  } catch (e) {
    console.error("Encoding failed", e);
    return "";
  }
};

const decodeData = (hash: string): Invitation | null => {
  try {
    const base64Str = hash.replace(/^#data=/, "");
    if (!base64Str) return null;
    const utf8Str = atob(base64Str);
    const jsonStr = decodeURIComponent(utf8Str);
    return JSON.parse(jsonStr) as Invitation;
  } catch (e) {
    console.error("Decoding failed", e);
    return null;
  }
};

const getTemplateDefaults = (type: Invitation['type'], userPhone: string): Invitation => {
  const id = Date.now().toString();
  switch (type) {
    case 'wedding':
      return {
        id,
        userPhone,
        type: 'wedding',
        title: "Priya & Rahul Wedding",
        date: "2026-11-20",
        time: "18:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        theme: "wedding",
        details: {
          hosts: "Sharma & Verma Families",
          message: "Together with our families, we request the honor of your presence as we celebrate our wedding phere and marriage union.",
          rsvpPhone: userPhone,
          registry: "Your blessings are our greatest gift. A registry envelopes box will be placed at the reception.",
          brideName: "Priya",
          groomName: "Rahul"
        },
        events: [
          { id: "1", title: "Haldi & Mehendi", date: "2026-11-19", time: "11:00 AM", venue: "Courtyard, Hotel Leela, New Delhi", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Wedding Phere", date: "2026-11-20", time: "06:00 PM", venue: "Grand Ballroom, Hotel Leela, New Delhi", mapsUrl: "https://maps.google.com" }
        ]
      };
    case 'party':
      return {
        id,
        userPhone,
        type: 'party',
        title: "Kabir's 30th Birthday Bash",
        date: "2026-08-15",
        time: "20:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        theme: "party",
        details: {
          hosts: "The Malhotra Siblings",
          message: "Life begins at 30! Let's pop some champagne and dance the night away to celebrate Kabir turning 30.",
          rsvpPhone: userPhone,
          registry: "Dress Code: White & Gold Glam. Dinner and cocktails will be served.",
          partyHost: "Kabir Malhotra",
          partyTheme: "Neon White Glam"
        },
        events: [
          { id: "1", title: "Welcome Cocktails", date: "2026-08-15", time: "08:00 PM", venue: "Aura Sky Lounge, Mumbai", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Cake Cutting & Dance Floor", date: "2026-08-15", time: "10:00 PM", venue: "Aura Sky Lounge, Mumbai", mapsUrl: "https://maps.google.com" }
        ]
      };
    case 'pooja':
      return {
        id,
        userPhone,
        type: 'pooja',
        title: "Ganesh Chaturthi Pooja",
        date: "2026-09-18",
        time: "10:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
        theme: "pooja",
        details: {
          hosts: "Deshmukh Family",
          message: "Vakratunda Mahakaya Suryakoti Samaprabha! We cordially invite you to seek Ganpati Bappa's blessings at our home.",
          rsvpPhone: userPhone,
          registry: "Maha-Prasad (Bhandara Lunch) will be served post Aarti.",
          deityName: "Lord Ganesha",
          poojaName: "Ganesh Sthapana & Aarti"
        },
        events: [
          { id: "1", title: "Ganesh Pran-Pratishtha & Aarti", date: "2026-09-18", time: "10:00 AM", venue: "Deshmukh Niwas, Thane East", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Maha Prasad & Lunch", date: "2026-09-18", time: "01:00 PM", venue: "Deshmukh Niwas, Thane East", mapsUrl: "https://maps.google.com" }
        ]
      };
    case 'path':
      return {
        id,
        userPhone,
        type: 'path',
        title: "Sri Akhand Path Sahib",
        date: "2026-07-24",
        time: "09:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
        theme: "path",
        details: {
          hosts: "S. Gurpreet Singh & Sardarni Jasmeet Kaur",
          message: "Lakh Khushian Patshahian Je Satgur Nadar Kare. We invite you to join us in the Bhog of Sri Akhand Path Sahib.",
          rsvpPhone: userPhone,
          registry: "Guru Ka Langar will be served continuously throughout the Paath.",
          pathType: "Akhand Path Sahib",
          paathText: "Arambh: July 24th, Bhog: July 26th"
        },
        events: [
          { id: "1", title: "Arambh Sri Akhand Path", date: "2026-07-24", time: "09:00 AM", venue: "Singh Residence, Sector 34, Chandigarh", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Bhog & Kirtan Darbar", date: "2026-07-26", time: "09:30 AM", venue: "Gurdwara Sahib, Sector 34, Chandigarh", mapsUrl: "https://maps.google.com" }
        ]
      };
    case 'public':
      return {
        id,
        userPhone,
        type: 'public',
        title: "Community Tree Plantation Drive",
        date: "2026-06-21",
        time: "08:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        theme: "public",
        details: {
          hosts: "Green Earth Foundation",
          message: "Join hands with us this Environment Day to plant 500 saplings across the neighborhood park. Bring your families!",
          rsvpPhone: userPhone,
          registry: "Refreshments, plant saplings, and gardening tools will be provided by the foundation.",
          speakers: "Chief Guest: Environmentalist Dr. R.S. Prasad",
          organizer: "Green Earth Youth Wing"
        },
        events: [
          { id: "1", title: "Sapling Planting Session", date: "2026-06-21", time: "08:00 AM", venue: "Nehru Botanical Park, Hyderabad", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Guest Address & Refreshments", date: "2026-06-21", time: "10:30 AM", venue: "Central Amphitheatre, Nehru Park", mapsUrl: "https://maps.google.com" }
        ]
      };
    default:
      return {
        id,
        userPhone,
        type: 'general',
        title: "Griha Pravesh (Housewarming)",
        date: "2026-10-10",
        time: "16:00",
        musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
        theme: "general",
        details: {
          hosts: "Nisha & Sumit Rawat",
          message: "A home is made of bricks & beams; a home is made of hopes & dreams. Please join us to celebrate our new home!",
          rsvpPhone: userPhone,
          registry: "High tea and dinner will be served.",
          generalTitle: "Rawat Family's Griha Pravesh"
        },
        events: [
          { id: "1", title: "Griha Pravesh Havan", date: "2026-10-10", time: "04:00 PM", venue: "Tower C, Flat 1002, Sunway Heights, Noida", mapsUrl: "https://maps.google.com" },
          { id: "2", title: "Celebration Dinner", date: "2026-10-10", time: "07:30 PM", venue: "Club House Party Hall, Sunway Heights", mapsUrl: "https://maps.google.com" }
        ]
      };
  }
};

function App() {
  // Navigation / View modes:
  // 'guest' -> Fullscreen preview mode of a shared invitation card
  // 'auth' -> Phone login screen
  // 'dashboard' -> Logged in dashboard displaying saved invites
  // 'editor' -> Split-screen editing invitation details
  const [viewState, setViewState] = useState<'guest' | 'auth' | 'dashboard' | 'editor'>('auth');
  
  // Authenticated User Profile
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  
  // Login input states
  const [loginPhone, setLoginPhone] = useState('');
  const [loginName, setLoginName] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  // Creator state
  const [userInvites, setUserInvites] = useState<Invitation[]>([]);
  const [activeInvite, setActiveInvite] = useState<Invitation | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'theme' | 'rsvps'>('details');
  const [copied, setCopied] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);

  // Mobile layout state
  const [showBuilderOnMobile, setShowBuilderOnMobile] = useState(true);

  // Create Type selector modal state
  const [showCreateSelect, setShowCreateSelect] = useState(false);

  // RSVP Guest form input states
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpFood, setRsvpFood] = useState('veg');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Audio elements
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown clock state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Initial load checks
  useEffect(() => {
    // 1. Check if guest is visiting via shared hash-link
    const hash = window.location.hash;
    if (hash && hash.startsWith('#data=')) {
      const decoded = decodeData(hash);
      if (decoded) {
        setActiveInvite(decoded);
        setViewState('guest');
        setShowBuilderOnMobile(false);
        return; // Don't look at login state
      }
    }

    // 2. Check login state
    const savedUser = localStorage.getItem('sv_current_user');
    if (savedUser) {
      try {
        const u = JSON.parse(savedUser) as UserProfile;
        setCurrentUser(u);
        setViewState('dashboard');
        loadUserInvitations(u.phone);
      } catch (e) {
        console.error(e);
      }
    } else {
      setViewState('auth');
    }

    // Load global RSVPs list
    const savedRsvps = localStorage.getItem('sv_rsvps');
    if (savedRsvps) {
      try {
        setRsvps(JSON.parse(savedRsvps));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Fetch invitations for logged in user
  const loadUserInvitations = (phone: string) => {
    const savedInvites = localStorage.getItem('sv_invitations');
    if (savedInvites) {
      try {
        const list = JSON.parse(savedInvites) as Invitation[];
        setUserInvites(list.filter(inv => inv.userPhone === phone));
      } catch (e) {
        console.error(e);
      }
    }
  };

  // Save current active invite modifications back to local storage list
  useEffect(() => {
    if (activeInvite && currentUser && viewState === 'editor') {
      const savedInvites = localStorage.getItem('sv_invitations');
      let allInvites: Invitation[] = [];
      if (savedInvites) {
        try {
          allInvites = JSON.parse(savedInvites) as Invitation[];
        } catch (e) {
          console.error(e);
        }
      }
      
      const index = allInvites.findIndex(x => x.id === activeInvite.id);
      if (index > -1) {
        allInvites[index] = activeInvite;
      } else {
        allInvites.push(activeInvite);
      }
      
      localStorage.setItem('sv_invitations', JSON.stringify(allInvites));
      setUserInvites(allInvites.filter(inv => inv.userPhone === currentUser.phone));
    }
  }, [activeInvite, viewState]);

  // Audio Playback handler
  useEffect(() => {
    if (activeInvite) {
      if (audioRef.current) {
        const wasPlaying = isPlaying;
        audioRef.current.pause();
        audioRef.current = new Audio(activeInvite.musicUrl);
        audioRef.current.loop = true;
        if (wasPlaying) {
          audioRef.current.play().catch(err => console.log("Blocked:", err));
        }
      } else {
        audioRef.current = new Audio(activeInvite.musicUrl);
        audioRef.current.loop = true;
      }
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [activeInvite?.musicUrl]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error(err);
      });
    }
  };

  // Countdown timer handler
  useEffect(() => {
    if (!activeInvite) return;
    
    const calculateTime = () => {
      const difference = +new Date(activeInvite.date + 'T' + (activeInvite.time || '00:00')) - +new Date();
      let res = { days: 0, hours: 0, minutes: 0, seconds: 0 };
      if (difference > 0) {
        res = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(res);
    };

    calculateTime();
    const clockTimer = setInterval(calculateTime, 1000);
    return () => clearInterval(clockTimer);
  }, [activeInvite?.date, activeInvite?.time]);

  // Auth Submit Handlers
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPhone.trim()) return;

    let usersList: UserProfile[] = [];
    const savedUsers = localStorage.getItem('sv_users');
    if (savedUsers) {
      try {
        usersList = JSON.parse(savedUsers) as UserProfile[];
      } catch (e) {
        console.error(e);
      }
    }

    const existingUser = usersList.find(u => u.phone === loginPhone);
    
    if (existingUser) {
      // Log in
      setCurrentUser(existingUser);
      localStorage.setItem('sv_current_user', JSON.stringify(existingUser));
      setViewState('dashboard');
      loadUserInvitations(existingUser.phone);
    } else {
      // If user doesn't exist, show name input for Registration
      if (!isNewUser) {
        setIsNewUser(true);
      } else if (loginName.trim()) {
        const newUser: UserProfile = { phone: loginPhone, name: loginName };
        usersList.push(newUser);
        localStorage.setItem('sv_users', JSON.stringify(usersList));
        setCurrentUser(newUser);
        localStorage.setItem('sv_current_user', JSON.stringify(newUser));
        setViewState('dashboard');
        loadUserInvitations(newUser.phone);
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sv_current_user');
    setCurrentUser(null);
    setViewState('auth');
    setLoginPhone('');
    setLoginName('');
    setIsNewUser(false);
  };

  // Create & Edit Actions
  const handleCreateNew = (type: Invitation['type']) => {
    if (!currentUser) return;
    const defaults = getTemplateDefaults(type, currentUser.phone);
    
    // Save to list
    const saved = localStorage.getItem('sv_invitations');
    let all: Invitation[] = [];
    if (saved) {
      try {
        all = JSON.parse(saved) as Invitation[];
      } catch (e) {
        console.error(e);
      }
    }
    all.push(defaults);
    localStorage.setItem('sv_invitations', JSON.stringify(all));
    
    setActiveInvite(defaults);
    setActiveTab('details');
    setShowCreateSelect(false);
    setViewState('editor');
  };

  const handleEditInvite = (invite: Invitation) => {
    setActiveInvite(invite);
    setActiveTab('details');
    setViewState('editor');
  };

  const handleDeleteInvite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this invitation?")) {
      const saved = localStorage.getItem('sv_invitations');
      if (saved) {
        try {
          const list = JSON.parse(saved) as Invitation[];
          const filtered = list.filter(i => i.id !== id);
          localStorage.setItem('sv_invitations', JSON.stringify(filtered));
          if (currentUser) {
            setUserInvites(filtered.filter(i => i.userPhone === currentUser.phone));
          }
        } catch (err) {
          console.error(err);
        }
      }
    }
  };

  // Form Field Value changes
  const updateInviteField = (field: keyof Invitation, value: any) => {
    if (!activeInvite) return;
    setActiveInvite(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const updateDetailField = (key: keyof InvitationDetails, value: string) => {
    if (!activeInvite) return;
    setActiveInvite(prev => {
      if (!prev) return null;
      return {
        ...prev,
        details: {
          ...prev.details,
          [key]: value
        }
      };
    });
  };

  const handleEventChange = (index: number, key: keyof EventTimeline, value: string) => {
    if (!activeInvite) return;
    setActiveInvite(prev => {
      if (!prev) return null;
      const updatedEvents = [...prev.events];
      updatedEvents[index] = {
        ...updatedEvents[index],
        [key]: value
      };
      return {
        ...prev,
        events: updatedEvents
      };
    });
  };

  const addNewEvent = () => {
    if (!activeInvite) return;
    setActiveInvite(prev => {
      if (!prev) return null;
      return {
        ...prev,
        events: [
          ...prev.events,
          {
            id: Date.now().toString(),
            title: "New Sub-Event",
            date: prev.date,
            time: "12:00 PM",
            venue: "Enter Venue Address",
            mapsUrl: "https://maps.google.com"
          }
        ]
      };
    });
  };

  const removeTimelineEvent = (id: string) => {
    if (!activeInvite) return;
    setActiveInvite(prev => {
      if (!prev) return null;
      return {
        ...prev,
        events: prev.events.filter(e => e.id !== id)
      };
    });
  };

  // Sharing links
  const getShareUrl = () => {
    if (!activeInvite) return '';
    const hash = encodeData(activeInvite);
    return `${window.location.origin}${window.location.pathname}#data=${hash}`;
  };

  const handleCopyToClipboard = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // RSVP Form handler inside Invitation card
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeInvite || !rsvpName.trim()) return;

    const newRsvp: RSVP = {
      id: Date.now().toString(),
      invitationId: activeInvite.id,
      name: rsvpName,
      attending: rsvpAttending,
      guests: rsvpGuests,
      food: rsvpFood,
      message: rsvpMsg,
      date: new Date().toLocaleDateString()
    };

    // Update state and save
    const updated = [newRsvp, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('sv_rsvps', JSON.stringify(updated));

    // Send direct WhatsApp
    if (activeInvite.details.rsvpPhone) {
      const attendingStr = rsvpAttending === 'yes' ? 'Yes, attending!' : rsvpAttending === 'no' ? 'Sorry, cannot make it.' : 'Maybe attending.';
      const rsvpMsgBody = `Hi, I have RSVPed for the "${activeInvite.title}"!%0A` +
        `*Name:* ${rsvpName}%0A` +
        `*Attending:* ${attendingStr}%0A` +
        `*Guests:* ${rsvpGuests}%0A` +
        `*Details/Food:* ${rsvpFood}%0A` +
        `*Message:* ${rsvpMsg || 'None'}`;
      
      const whatsappUrl = `https://wa.me/${activeInvite.details.rsvpPhone.replace(/\+/g, '')}?text=${rsvpMsgBody}`;
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }

    setRsvpSuccess(true);
    setRsvpName('');
    setRsvpMsg('');
  };

  const getFilteredRsvps = () => {
    if (!activeInvite) return [];
    return rsvps.filter(r => r.invitationId === activeInvite.id);
  };

  const clearRsvpsForActive = () => {
    if (!activeInvite) return;
    if (window.confirm("Clear all RSVPs for this invitation?")) {
      const filtered = rsvps.filter(r => r.invitationId !== activeInvite.id);
      setRsvps(filtered);
      localStorage.setItem('sv_rsvps', JSON.stringify(filtered));
    }
  };

  // Template custom title helper
  const getInviteTypeName = (type: string) => {
    switch(type) {
      case 'wedding': return 'Wedding Invitation';
      case 'party': return 'Celebration Party';
      case 'pooja': return 'Religious Pooja';
      case 'path': return 'Holy Akhand Path';
      case 'public': return 'Public Program / Event';
      default: return 'Special Celebration';
    }
  };

  // Falling particles array
  const petals = Array.from({ length: 15 });

  return (
    <div className="app-container">
      
      {/* 1. AUTHENTICATION VIEW */}
      {viewState === 'auth' && (
        <div className="auth-wrapper">
          <div className="auth-card">
            <div className="auth-logo">Shubh<span>Viah</span></div>
            <div className="auth-subtitle">Premium Digital Invitation Portal</div>
            
            <form className="auth-form" onSubmit={handleLoginSubmit}>
              <div className="form-group">
                <label>Phone Number</label>
                <div style={{ position: 'relative' }}>
                  <Phone size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--b-text)' }} />
                  <input 
                    type="tel" 
                    required
                    style={{ paddingLeft: '40px', width: '100%' }}
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value)}
                    placeholder="Enter phone number (e.g. 9876543210)"
                  />
                </div>
              </div>

              {isNewUser && (
                <div className="form-group" style={{ animation: 'slide-up 0.2s ease-out' }}>
                  <label>Full Name</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--b-text)' }} />
                    <input 
                      type="text" 
                      required
                      style={{ paddingLeft: '40px', width: '100%' }}
                      value={loginName}
                      onChange={(e) => setLoginName(e.target.value)}
                      placeholder="Enter display name"
                    />
                  </div>
                </div>
              )}

              <button type="submit" className="auth-btn">
                {isNewUser ? 'Complete Registration' : 'Log In / Register'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. CREATOR DASHBOARD VIEW */}
      {viewState === 'dashboard' && currentUser && (
        <div className="auth-wrapper" style={{ alignItems: 'flex-start', paddingTop: '40px' }}>
          <div className="auth-card" style={{ maxWidth: '650px', width: '100%', textAlign: 'left' }}>
            
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: '1px solid var(--b-border)', paddingBottom: '16px' }}>
              <div>
                <h1 style={{ fontFamily: 'Cinzel', fontSize: '22px', color: '#fff', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Shubh<span>Viah</span> <Sparkles size={16} style={{ color: 'var(--b-accent)' }} />
                </h1>
                <div style={{ fontSize: '12px', color: 'var(--b-text)', marginTop: '4px' }}>
                  Logged in: <strong>{currentUser.name}</strong> ({currentUser.phone})
                </div>
              </div>
              <button className="logout-btn" onClick={handleLogout}>
                <LogOut size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} /> Logout
              </button>
            </div>

            {/* Content Dashboard */}
            <div className="dashboard-wrapper">
              <div className="dashboard-title-row">
                <h2>My Invitations</h2>
                <button className="create-new-btn" onClick={() => setShowCreateSelect(!showCreateSelect)}>
                  <PlusCircle size={14} /> Create Invitation
                </button>
              </div>

              {/* Create select dropdown options */}
              {showCreateSelect && (
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', 
                  gap: '8px', 
                  background: 'rgba(255,255,255,0.03)', 
                  border: '1px solid var(--b-border)', 
                  padding: '12px', 
                  borderRadius: '8px',
                  animation: 'slide-up 0.2s ease-out'
                }}>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('wedding')}>Wedding</button>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('party')}>Birthday/Party</button>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('pooja')}>Pooja Ceremony</button>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('path')}>Akhand Path</button>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('public')}>Public Event</button>
                  <button className="tab-btn active" style={{ padding: '8px' }} onClick={() => handleCreateNew('general')}>General Event</button>
                </div>
              )}

              {/* List Grid */}
              <div className="invite-grid">
                {userInvites.length === 0 ? (
                  <div className="dashboard-empty">
                    <Heart size={36} style={{ color: 'var(--b-border)' }} />
                    <p>No invitations created yet. Choose a template type above to design your first invite card!</p>
                  </div>
                ) : (
                  userInvites.map(invite => {
                    const inviteRsvps = rsvps.filter(r => r.invitationId === invite.id);
                    return (
                      <div key={invite.id} className="invite-card" onClick={() => handleEditInvite(invite)} style={{ cursor: 'pointer' }}>
                        <div className="invite-card-left">
                          <div className="invite-card-title">{invite.title}</div>
                          <div className="invite-card-meta">
                            <span className={`badge-type ${invite.type}`}>{invite.type}</span>
                            <span>
                              <Calendar size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              {invite.date}
                            </span>
                            <span>
                              <ClipboardList size={11} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                              {inviteRsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + r.guests, 0)} Attending
                            </span>
                          </div>
                        </div>
                        
                        <div className="invite-card-actions">
                          <button 
                            className="action-icon-btn" 
                            title="Preview Invitation"
                            onClick={(e) => {
                              e.stopPropagation();
                              setActiveInvite(invite);
                              setViewState('guest');
                            }}
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="action-icon-btn delete" 
                            title="Delete"
                            onClick={(e) => handleDeleteInvite(invite.id, e)}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 3. SPLIT SCREEN CREATOR / EDITOR VIEW */}
      {viewState === 'editor' && activeInvite && currentUser && (
        <>
          {/* MOBILE PREVIEW TOP BAR */}
          <div className="preview-toggle-bar">
            <button className="back-dash-btn" onClick={() => setViewState('dashboard')}>
              <ChevronLeft size={14} /> Dashboard
            </button>
            <button 
              className="toggle-view-btn"
              onClick={() => setShowBuilderOnMobile(!showBuilderOnMobile)}
            >
              {showBuilderOnMobile ? 'View Invitation' : 'Open Editor'}
            </button>
          </div>

          {/* BUILDER SIDEBAR CONTAINER */}
          <div className={`builder-panel ${!showBuilderOnMobile ? 'collapsed' : ''}`}>
            <div className="builder-header">
              <button className="back-dash-btn" onClick={() => setViewState('dashboard')}>
                <ChevronLeft size={14} /> Dashboard
              </button>
              <div className="user-badge">
                <Sparkles size={14} style={{ color: 'var(--b-accent)' }} /> 
                {getInviteTypeName(activeInvite.type)}
              </div>
            </div>

            {/* Sidebar navigation tabs */}
            <div className="builder-tabs">
              <button className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`} onClick={() => setActiveTab('details')}>
                <Settings size={14} /> Details
              </button>
              <button className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`} onClick={() => setActiveTab('timeline')}>
                <Calendar size={14} /> Timeline
              </button>
              <button className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`} onClick={() => setActiveTab('theme')}>
                <Sliders size={14} /> Visuals
              </button>
              <button className={`tab-btn ${activeTab === 'rsvps' ? 'active' : ''}`} onClick={() => setActiveTab('rsvps')}>
                <ClipboardList size={14} /> RSVPs ({getFilteredRsvps().length})
              </button>
            </div>

            {/* Builder sidebar contents */}
            <div className="builder-content">
              {activeTab === 'details' && (
                <div className="builder-section">
                  <div className="form-group">
                    <label>Invitation Header Title</label>
                    <input 
                      type="text" 
                      value={activeInvite.title} 
                      onChange={(e) => updateInviteField('title', e.target.value)}
                    />
                  </div>

                  {/* Wedding specific details */}
                  {activeInvite.type === 'wedding' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Bride's Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.brideName || ''} 
                          onChange={(e) => updateDetailField('brideName', e.target.value)}
                        />
                      </div>
                      <div className="form-group">
                        <label>Groom's Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.groomName || ''} 
                          onChange={(e) => updateDetailField('groomName', e.target.value)}
                        />
                      </div>
                    </div>
                  )}

                  {/* Party specific details */}
                  {activeInvite.type === 'party' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Party Host Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.partyHost || ''} 
                          onChange={(e) => updateDetailField('partyHost', e.target.value)}
                          placeholder="e.g. Kabir Malhotra"
                        />
                      </div>
                      <div className="form-group">
                        <label>Party Theme / Dress Code</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.partyTheme || ''} 
                          onChange={(e) => updateDetailField('partyTheme', e.target.value)}
                          placeholder="e.g. Retro Disco"
                        />
                      </div>
                    </div>
                  )}

                  {/* Pooja specific details */}
                  {activeInvite.type === 'pooja' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Deity Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.deityName || ''} 
                          onChange={(e) => updateDetailField('deityName', e.target.value)}
                          placeholder="e.g. Lord Ganesha"
                        />
                      </div>
                      <div className="form-group">
                        <label>Pooja/Ceremony Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.poojaName || ''} 
                          onChange={(e) => updateDetailField('poojaName', e.target.value)}
                          placeholder="e.g. Satyanarayan Pooja"
                        />
                      </div>
                    </div>
                  )}

                  {/* Akhand Path specific details */}
                  {activeInvite.type === 'path' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Paath Type</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.pathType || ''} 
                          onChange={(e) => updateDetailField('pathType', e.target.value)}
                          placeholder="e.g. Akhand Path Sahib"
                        />
                      </div>
                      <div className="form-group">
                        <label>Blessings Quote / Details</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.paathText || ''} 
                          onChange={(e) => updateDetailField('paathText', e.target.value)}
                          placeholder="e.g. Ek Onkar Satnam"
                        />
                      </div>
                    </div>
                  )}

                  {/* Public specific details */}
                  {activeInvite.type === 'public' && (
                    <div className="form-row">
                      <div className="form-group">
                        <label>Chief Speakers</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.speakers || ''} 
                          onChange={(e) => updateDetailField('speakers', e.target.value)}
                          placeholder="e.g. Guest Speakers"
                        />
                      </div>
                      <div className="form-group">
                        <label>Organizer Name</label>
                        <input 
                          type="text" 
                          value={activeInvite.details.organizer || ''} 
                          onChange={(e) => updateDetailField('organizer', e.target.value)}
                          placeholder="e.g. Green Foundation"
                        />
                      </div>
                    </div>
                  )}

                  {/* General specific details */}
                  {activeInvite.type === 'general' && (
                    <div className="form-group">
                      <label>Event Title Header</label>
                      <input 
                        type="text" 
                        value={activeInvite.details.generalTitle || ''} 
                        onChange={(e) => updateDetailField('generalTitle', e.target.value)}
                        placeholder="e.g. Griha Pravesh Utsav"
                      />
                    </div>
                  )}

                  <div className="form-row">
                    <div className="form-group">
                      <label>Event Date</label>
                      <input 
                        type="date" 
                        value={activeInvite.date} 
                        onChange={(e) => updateInviteField('date', e.target.value)}
                      />
                    </div>
                    <div className="form-group">
                      <label>Event Time</label>
                      <input 
                        type="time" 
                        value={activeInvite.time} 
                        onChange={(e) => updateInviteField('time', e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Hosts & Family Names</label>
                    <input 
                      type="text" 
                      value={activeInvite.details.hosts} 
                      onChange={(e) => updateDetailField('hosts', e.target.value)}
                      placeholder="e.g. Joshi Family / Rawat Family"
                    />
                  </div>

                  <div className="form-group">
                    <label>Invitation Description / Message</label>
                    <textarea 
                      rows={3} 
                      value={activeInvite.details.message} 
                      onChange={(e) => updateDetailField('message', e.target.value)}
                      placeholder="Invitation message body..."
                    />
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>RSVP Contact Phone</label>
                      <input 
                        type="text" 
                        value={activeInvite.details.rsvpPhone} 
                        onChange={(e) => updateDetailField('rsvpPhone', e.target.value)}
                        placeholder="WhatsApp phone number"
                      />
                    </div>
                    <div className="form-group">
                      <label>Music Soundtrack</label>
                      <select 
                        value={activeInvite.musicUrl} 
                        onChange={(e) => updateInviteField('musicUrl', e.target.value)}
                      >
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3">Sitar Instrumental (Preset 1)</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3">Classical Flute (Preset 2)</option>
                        <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3">Wedding Piano (Preset 3)</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Blessings & Gift Registry Note</label>
                    <textarea 
                      rows={2} 
                      value={activeInvite.details.registry} 
                      onChange={(e) => updateDetailField('registry', e.target.value)}
                      placeholder="Gift registry/note detail..."
                    />
                  </div>

                  <div className="builder-share-card">
                    <h4 style={{ color: 'var(--b-accent)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Share2 size={14} /> Share This Digital Invitation
                    </h4>
                    <p style={{ fontSize: '11px', color: 'var(--b-text)', lineHeight: '1.4' }}>
                      The guest view does not require login. Copy this link to share it on WhatsApp.
                    </p>
                    <div className="share-link-input">
                      <input type="text" readOnly value={getShareUrl().substring(0, 45) + "..."} />
                      <button className="copy-btn" onClick={handleCopyToClipboard}>
                        {copied ? <Check size={14} /> : <Copy size={14} />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'timeline' && (
                <div className="builder-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Timeline Ceremonies / Agenda</label>
                    <button className="add-btn" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={addNewEvent}>
                      <Plus size={12} /> Add Ceremony
                    </button>
                  </div>

                  <div className="builder-timeline-list">
                    {activeInvite.events.map((event, index) => (
                      <div key={event.id} className="builder-timeline-item">
                        <button className="remove-btn" onClick={() => removeTimelineEvent(event.id)}>
                          <Trash2 size={14} />
                        </button>
                        
                        <div className="form-group">
                          <label>Ceremony Title</label>
                          <input 
                            type="text" 
                            value={event.title} 
                            onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                            placeholder="e.g. Sangeet / Lunch"
                          />
                        </div>

                        <div className="form-row">
                          <div className="form-group">
                            <label>Date</label>
                            <input 
                              type="text" 
                              value={event.date} 
                              onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                            />
                          </div>
                          <div className="form-group">
                            <label>Time</label>
                            <input 
                              type="text" 
                              value={event.time} 
                              onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Venue Address</label>
                          <input 
                            type="text" 
                            value={event.venue} 
                            onChange={(e) => handleEventChange(index, 'venue', e.target.value)}
                          />
                        </div>

                        <div className="form-group">
                          <label>Google Maps Directions URL</label>
                          <input 
                            type="text" 
                            value={event.mapsUrl} 
                            onChange={(e) => handleEventChange(index, 'mapsUrl', e.target.value)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'theme' && (
                <div className="builder-section">
                  <label>Select Invitation Visual Theme</label>
                  <div className="theme-options">
                    
                    {/* Wedding Crimson */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'wedding' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'wedding')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#7d0617' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#d4af37' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#fcf8f2' }}></div>
                      </div>
                      <div className="theme-name">Royal Crimson</div>
                    </div>

                    {/* Party Purple */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'party' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'party')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#8b5cf6' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#ec4899' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#0b0f19' }}></div>
                      </div>
                      <div className="theme-name">Party Neon</div>
                    </div>

                    {/* Pooja Orange */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'pooja' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'pooja')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#d97706' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#fbbf24' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#fffcf5' }}></div>
                      </div>
                      <div className="theme-name">Saffron Pooja</div>
                    </div>

                    {/* Path Blue/Orange */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'path' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'path')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#ea580c' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#1e3a8a' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#fafaf9' }}></div>
                      </div>
                      <div className="theme-name">Divine Path</div>
                    </div>

                    {/* Public Steel */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'public' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'public')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#0f172a' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#2563eb' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#f8fafc' }}></div>
                      </div>
                      <div className="theme-name">Steel Blue</div>
                    </div>

                    {/* General Botanical */}
                    <div 
                      className={`theme-card ${activeInvite.theme === 'general' ? 'active' : ''}`}
                      onClick={() => updateInviteField('theme', 'general')}
                    >
                      <div className="theme-preview-dots">
                        <div className="theme-dot" style={{ backgroundColor: '#1e3a1e' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#8b5a2b' }}></div>
                        <div className="theme-dot" style={{ backgroundColor: '#f9fbf9' }}></div>
                      </div>
                      <div className="theme-name">Sage General</div>
                    </div>

                  </div>
                </div>
              )}

              {activeTab === 'rsvps' && (
                <div className="builder-section">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label>Guest RSVPs</label>
                    {getFilteredRsvps().length > 0 && (
                      <button className="remove-btn" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={clearRsvpsForActive}>
                        <Trash2 size={12} /> Clear All
                      </button>
                    )}
                  </div>

                  <div className="rsvp-stats">
                    <div className="stat-box">
                      <div className="stat-val">{getFilteredRsvps().filter(r => r.attending === 'yes').reduce((sum, r) => sum + r.guests, 0)}</div>
                      <div className="stat-label">Attending</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{getFilteredRsvps().filter(r => r.attending === 'maybe').length}</div>
                      <div className="stat-label">Maybe</div>
                    </div>
                    <div className="stat-box">
                      <div className="stat-val">{getFilteredRsvps().filter(r => r.attending === 'no').length}</div>
                      <div className="stat-label">Declines</div>
                    </div>
                  </div>

                  <div className="rsvp-list-table">
                    <div className="rsvp-list-header">
                      <div>Name</div>
                      <div>RSVP</div>
                      <div>Guests</div>
                      <div>Message</div>
                    </div>
                    {getFilteredRsvps().length === 0 ? (
                      <div className="rsvp-empty">No RSVPs recorded yet. Try submitting the RSVP form on the invitation preview.</div>
                    ) : (
                      getFilteredRsvps().map(r => (
                        <div key={r.id} className="rsvp-list-row">
                          <div style={{ color: '#fff', fontWeight: 500 }}>{r.name}</div>
                          <div>
                            <span className={`rsvp-status-badge ${r.attending}`}>
                              {r.attending === 'yes' ? 'Yes' : r.attending === 'no' ? 'No' : 'Maybe'}
                            </span>
                          </div>
                          <div style={{ textAlign: 'center' }}>{r.guests}</div>
                          <div style={{ fontStyle: 'italic', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={r.message}>
                            {r.message || '-'}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* PREVIEW CONTAINER FRAME */}
          <div className="preview-panel">
            <div className="preview-frame">
              
              {/* THE INVITATION COMPONENT */}
              <div className={`invite-wrapper theme-${activeInvite.theme}`}>
                
                {/* Petals container */}
                <div className="invite-petal-container">
                  {petals.map((_, i) => {
                    const left = Math.random() * 100;
                    const size = Math.random() * 14 + 10;
                    const duration = Math.random() * 8 + 6;
                    const delay = Math.random() * 5;
                    return (
                      <div 
                        key={i} 
                        className="petal"
                        style={{
                          left: `${left}%`,
                          width: `${size}px`,
                          height: `${size * 0.8}px`,
                          animationDuration: `${duration}s`,
                          animationDelay: `${delay}s`
                        }}
                      />
                    );
                  })}
                </div>

                {/* Audio controls */}
                <div className="invite-audio-control">
                  <button className={`audio-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                    {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
                  </button>
                </div>

                {/* HERO GRAPHIC BANNER */}
                <div 
                  className="invite-hero"
                  style={{
                    backgroundImage: `url(${getBackgroundImage(activeInvite.type)})`,
                    backgroundSize: activeInvite.type === 'wedding' ? '100% 100%' : 'cover'
                  }}
                >
                  {activeInvite.type === 'wedding' && <div className="invite-hero-frame"></div>}
                  
                  <div className="invite-header-label">INVITATION</div>
                  
                  {activeInvite.type === 'wedding' && (
                    <div className="invite-hero-title">
                      {activeInvite.details.brideName || 'Bride'}
                      <span className="invite-conjunction">weds</span>
                      {activeInvite.details.groomName || 'Groom'}
                    </div>
                  )}

                  {activeInvite.type === 'party' && (
                    <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                      {activeInvite.details.partyHost || 'Party'}
                      <span className="invite-conjunction no-cursive">INVITES YOU TO</span>
                      {activeInvite.details.partyTheme || 'Celebration'}
                    </div>
                  )}

                  {activeInvite.type === 'pooja' && (
                    <div className="invite-hero-title" style={{ color: 'var(--accent)' }}>
                      {activeInvite.details.poojaName || 'Pooja Invitation'}
                      <span className="invite-conjunction" style={{ fontSize: '20px' }}>In Devotion of</span>
                      {activeInvite.details.deityName || 'Lord'}
                    </div>
                  )}

                  {activeInvite.type === 'path' && (
                    <div className="invite-hero-title" style={{ color: 'var(--accent)' }}>
                      {activeInvite.details.pathType || 'Path Sahib'}
                      <span className="invite-conjunction" style={{ fontSize: '20px' }}>Divine Invitation</span>
                      <span style={{ fontSize: '18px', color: '#fff', fontFamily: 'Cinzel', display: 'block', marginTop: '10px' }}>
                        {activeInvite.details.paathText}
                      </span>
                    </div>
                  )}

                  {activeInvite.type === 'public' && (
                    <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                      {activeInvite.title}
                      <span className="invite-conjunction no-cursive" style={{ fontSize: '14px', marginTop: '15px' }}>
                        Organized by: {activeInvite.details.organizer}
                      </span>
                    </div>
                  )}

                  {activeInvite.type === 'general' && (
                    <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                      {activeInvite.details.generalTitle || activeInvite.title}
                      <span className="invite-conjunction no-cursive">YOU ARE INVITED</span>
                    </div>
                  )}

                  {activeInvite.type === 'wedding' && (
                    <img src={weddingCouple} alt="Couple portrait" className="invite-couple-img" />
                  )}

                  <div className="invite-hero-footer">
                    <div className="invite-date-badge" style={{ color: activeInvite.type === 'wedding' ? 'var(--primary)' : '#fff' }}>
                      {activeInvite.date ? new Date(activeInvite.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      }) : 'Date TBD'}
                    </div>
                  </div>
                </div>

                {/* COUNTDOWN TIMER */}
                <div className="invite-section bg-alt">
                  <div className="invite-section-title">The Celebration Begins In</div>
                  <div className="invite-divider">
                    <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                  </div>
                  <div className="countdown-grid">
                    <div className="countdown-box">
                      <div className="countdown-num">{timeLeft.days}</div>
                      <div className="countdown-lbl">Days</div>
                    </div>
                    <div className="countdown-box">
                      <div className="countdown-num">{timeLeft.hours}</div>
                      <div className="countdown-lbl">Hours</div>
                    </div>
                    <div className="countdown-box">
                      <div className="countdown-num">{timeLeft.minutes}</div>
                      <div className="countdown-lbl">Mins</div>
                    </div>
                    <div className="countdown-box">
                      <div className="countdown-num">{timeLeft.seconds}</div>
                      <div className="countdown-lbl">Secs</div>
                    </div>
                  </div>
                </div>

                {/* MESSAGE CARD */}
                <div className="invite-section">
                  <div className="invite-section-title">Greetings & Welcome</div>
                  <div className="invite-divider">
                    <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                  </div>
                  <p className="invite-message">
                    "{activeInvite.details.message}"
                  </p>
                  
                  {activeInvite.type === 'public' && activeInvite.details.speakers && (
                    <div style={{ fontSize: '12px', margin: '12px 0', color: 'var(--primary)', fontWeight: 'bold' }}>
                      Featured Speakers: {activeInvite.details.speakers}
                    </div>
                  )}

                  <div className="invite-hosts">
                    Invited By: <br />
                    <strong>{activeInvite.details.hosts}</strong>
                  </div>
                </div>

                {/* CEREMONIES TIMELINE */}
                <div className="invite-section bg-alt">
                  <div className="invite-section-title">Event Schedule</div>
                  <div className="invite-divider">
                    <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                  </div>
                  
                  <div className="timeline-card-list">
                    {activeInvite.events.map((event) => (
                      <div key={event.id} className="timeline-card">
                        <div className="timeline-card-header">
                          <h3>{event.title}</h3>
                          <span className="timeline-card-time">
                            <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                            {event.time}
                          </span>
                        </div>
                        <div className="timeline-card-date">
                          <Calendar size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          {event.date}
                        </div>
                        <div className="timeline-card-venue">
                          <MapPin size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                          {event.venue}
                        </div>
                        {event.mapsUrl && (
                          <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="direction-btn">
                            Get Directions
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* GUEST RSVP CARD */}
                <div className="invite-section">
                  <div className="invite-section-title">Are You Joining Us?</div>
                  <div className="invite-divider">
                    <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                  </div>

                  {rsvpSuccess ? (
                    <div className="rsvp-success-msg">
                      <Heart size={28} fill="currentColor" style={{ alignSelf: 'center', color: '#10b981' }} />
                      <h4>RSVP Sent Successfully!</h4>
                      <p>Your RSVP response was saved. Thank you!</p>
                      <button 
                        className="add-btn" 
                        style={{ borderStyle: 'solid', marginTop: '10px', alignSelf: 'center', padding: '6px 12px' }}
                        onClick={() => setRsvpSuccess(false)}
                      >
                        Submit Another RSVP
                      </button>
                    </div>
                  ) : (
                    <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
                      <div className="rsvp-form-group">
                        <label>Your Name</label>
                        <input 
                          type="text" 
                          required 
                          value={rsvpName} 
                          onChange={(e) => setRsvpName(e.target.value)}
                          placeholder="Enter your name" 
                        />
                      </div>

                      <div className="rsvp-form-group">
                        <label>Attendance</label>
                        <div className="rsvp-attending-toggle">
                          <button 
                            type="button" 
                            className={`attending-btn ${rsvpAttending === 'yes' ? 'active' : ''}`}
                            onClick={() => setRsvpAttending('yes')}
                          >
                            Yes, Attending
                          </button>
                          <button 
                            type="button" 
                            className={`attending-btn ${rsvpAttending === 'no' ? 'active' : ''}`}
                            onClick={() => setRsvpAttending('no')}
                          >
                            Decline
                          </button>
                        </div>
                      </div>

                      <div className="rsvp-form-group">
                        <label>Number of Guests</label>
                        <select 
                          value={rsvpGuests} 
                          onChange={(e) => setRsvpGuests(Number(e.target.value))}
                        >
                          <option value={1}>1 Guest</option>
                          <option value={2}>2 Guests</option>
                          <option value={3}>3 Guests</option>
                          <option value={4}>4 Guests</option>
                          <option value={5}>5+ Guests</option>
                        </select>
                      </div>

                      <div className="rsvp-form-group">
                        <label>Message or Preference</label>
                        <input 
                          type="text" 
                          value={rsvpFood} 
                          onChange={(e) => setRsvpFood(e.target.value)}
                          placeholder="e.g. Vegetarian / No preferences" 
                        />
                      </div>

                      <div className="rsvp-form-group">
                        <label>Wishes Note</label>
                        <textarea 
                          rows={2} 
                          value={rsvpMsg} 
                          onChange={(e) => setRsvpMsg(e.target.value)}
                          placeholder="Wishes for the host..." 
                        />
                      </div>

                      <button type="submit" className="rsvp-submit-btn">
                        Confirm RSVP & Notify
                      </button>
                    </form>
                  )}
                </div>

                {/* GIFT REGISTRY NOTE */}
                {activeInvite.details.registry && (
                  <div className="invite-section bg-alt">
                    <div className="invite-section-title">Wishes & Registry</div>
                    <div className="invite-divider">
                      <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                    </div>
                    <div className="registry-card">
                      <p>{activeInvite.details.registry}</p>
                    </div>
                  </div>
                )}

                {/* FOOTER */}
                <div className="invite-footer">
                  <div className="invite-footer-title no-cursive">
                    {activeInvite.title}
                  </div>
                  <p>Created via ShubhViah</p>
                </div>

              </div>
            </div>
          </div>
        </>
      )}

      {/* 4. FULLSCREEN GUEST VIEW MODE */}
      {viewState === 'guest' && activeInvite && (
        <div className="invitation-fullscreen">
          
          {/* Floating Back to Editor / Dashboard button */}
          <button 
            className="back-to-editor-float"
            onClick={() => {
              if (currentUser) {
                setViewState('editor');
              } else {
                // If guest opened via hash-link, let them create one by directing to auth!
                setViewState('auth');
              }
            }}
          >
            <ChevronLeft size={16} /> {currentUser ? 'Back to Editor' : 'Create Your Own Invitation'}
          </button>

          <div className={`invite-wrapper theme-${activeInvite.theme}`}>
            
            {/* Petals fall */}
            <div className="invite-petal-container">
              {petals.map((_, i) => {
                const left = Math.random() * 100;
                const size = Math.random() * 14 + 10;
                const duration = Math.random() * 8 + 6;
                const delay = Math.random() * 5;
                return (
                  <div 
                    key={i} 
                    className="petal"
                    style={{
                      left: `${left}%`,
                      width: `${size}px`,
                      height: `${size * 0.8}px`,
                      animationDuration: `${duration}s`,
                      animationDelay: `${delay}s`
                    }}
                  />
                );
              })}
            </div>

            {/* Audio player */}
            <div className="invite-audio-control">
              <button className={`audio-btn ${isPlaying ? 'playing' : ''}`} onClick={togglePlay}>
                {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
              </button>
            </div>

            {/* HERO GRAPHIC BANNER */}
            <div 
              className="invite-hero"
              style={{
                backgroundImage: `url(${getBackgroundImage(activeInvite.type)})`,
                backgroundSize: activeInvite.type === 'wedding' ? '100% 100%' : 'cover'
              }}
            >
              {activeInvite.type === 'wedding' && <div className="invite-hero-frame"></div>}
              
              <div className="invite-header-label">INVITATION</div>
              
              {activeInvite.type === 'wedding' && (
                <div className="invite-hero-title">
                  {activeInvite.details.brideName || 'Bride'}
                  <span className="invite-conjunction">weds</span>
                  {activeInvite.details.groomName || 'Groom'}
                </div>
              )}

              {activeInvite.type === 'party' && (
                <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                  {activeInvite.details.partyHost || 'Party'}
                  <span className="invite-conjunction no-cursive">INVITES YOU TO</span>
                  {activeInvite.details.partyTheme || 'Celebration'}
                </div>
              )}

              {activeInvite.type === 'pooja' && (
                <div className="invite-hero-title" style={{ color: 'var(--accent)' }}>
                  {activeInvite.details.poojaName || 'Pooja Invitation'}
                  <span className="invite-conjunction" style={{ fontSize: '20px' }}>In Devotion of</span>
                  {activeInvite.details.deityName || 'Lord'}
                </div>
              )}

              {activeInvite.type === 'path' && (
                <div className="invite-hero-title" style={{ color: 'var(--accent)' }}>
                  {activeInvite.details.pathType || 'Path Sahib'}
                  <span className="invite-conjunction" style={{ fontSize: '20px' }}>Divine Invitation</span>
                  <span style={{ fontSize: '18px', color: '#fff', fontFamily: 'Cinzel', display: 'block', marginTop: '10px' }}>
                    {activeInvite.details.paathText}
                  </span>
                </div>
              )}

              {activeInvite.type === 'public' && (
                <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                  {activeInvite.title}
                  <span className="invite-conjunction no-cursive" style={{ fontSize: '14px', marginTop: '15px' }}>
                    Organized by: {activeInvite.details.organizer}
                  </span>
                </div>
              )}

              {activeInvite.type === 'general' && (
                <div className="invite-hero-title no-cursive" style={{ color: '#fff' }}>
                  {activeInvite.details.generalTitle || activeInvite.title}
                  <span className="invite-conjunction no-cursive">YOU ARE INVITED</span>
                </div>
              )}

              {activeInvite.type === 'wedding' && (
                <img src={weddingCouple} alt="Couple portrait" className="invite-couple-img" />
              )}

              <div className="invite-hero-footer">
                <div className="invite-date-badge" style={{ color: activeInvite.type === 'wedding' ? 'var(--primary)' : '#fff' }}>
                  {activeInvite.date ? new Date(activeInvite.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Date TBD'}
                </div>
              </div>
            </div>

            {/* COUNTDOWN TIMER */}
            <div className="invite-section bg-alt">
              <div className="invite-section-title">The Celebration Begins In</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>
              <div className="countdown-grid">
                <div className="countdown-box">
                  <div className="countdown-num">{timeLeft.days}</div>
                  <div className="countdown-lbl">Days</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-num">{timeLeft.hours}</div>
                  <div className="countdown-lbl">Hours</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-num">{timeLeft.minutes}</div>
                  <div className="countdown-lbl">Mins</div>
                </div>
                <div className="countdown-box">
                  <div className="countdown-num">{timeLeft.seconds}</div>
                  <div className="countdown-lbl">Secs</div>
                </div>
              </div>
            </div>

            {/* MESSAGE CARD */}
            <div className="invite-section">
              <div className="invite-section-title">Greetings & Welcome</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>
              <p className="invite-message">
                "{activeInvite.details.message}"
              </p>

              {activeInvite.type === 'public' && activeInvite.details.speakers && (
                <div style={{ fontSize: '12px', margin: '12px 0', color: 'var(--primary)', fontWeight: 'bold' }}>
                  Featured Speakers: {activeInvite.details.speakers}
                </div>
              )}

              <div className="invite-hosts">
                Invited By: <br />
                <strong>{activeInvite.details.hosts}</strong>
              </div>
            </div>

            {/* CEREMONIES TIMELINE */}
            <div className="invite-section bg-alt">
              <div className="invite-section-title">Event Schedule</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>
              
              <div className="timeline-card-list">
                {activeInvite.events.map((event) => (
                  <div key={event.id} className="timeline-card">
                    <div className="timeline-card-header">
                      <h3>{event.title}</h3>
                      <span className="timeline-card-time">
                        <Clock size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
                        {event.time}
                      </span>
                    </div>
                    <div className="timeline-card-date">
                      <Calendar size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      {event.date}
                    </div>
                    <div className="timeline-card-venue">
                      <MapPin size={12} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                      {event.venue}
                    </div>
                    {event.mapsUrl && (
                      <a href={event.mapsUrl} target="_blank" rel="noopener noreferrer" className="direction-btn">
                        Get Directions
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* GUEST RSVP CARD */}
            <div className="invite-section">
              <div className="invite-section-title">Are You Joining Us?</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>

              {rsvpSuccess ? (
                <div className="rsvp-success-msg">
                  <Heart size={28} fill="currentColor" style={{ alignSelf: 'center', color: '#10b981' }} />
                  <h4>RSVP Sent Successfully!</h4>
                  <p>Your RSVP response was saved. Thank you!</p>
                  <button 
                    className="add-btn" 
                    style={{ borderStyle: 'solid', marginTop: '10px', alignSelf: 'center', padding: '6px 12px' }}
                    onClick={() => setRsvpSuccess(false)}
                  >
                    Submit Another RSVP
                  </button>
                </div>
              ) : (
                <form className="rsvp-form" onSubmit={handleRsvpSubmit}>
                  <div className="rsvp-form-group">
                    <label>Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={rsvpName} 
                      onChange={(e) => setRsvpName(e.target.value)}
                      placeholder="Enter your name" 
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label>Attendance</label>
                    <div className="rsvp-attending-toggle">
                      <button 
                        type="button" 
                        className={`attending-btn ${rsvpAttending === 'yes' ? 'active' : ''}`}
                        onClick={() => setRsvpAttending('yes')}
                      >
                        Yes, Attending
                      </button>
                      <button 
                        type="button" 
                        className={`attending-btn ${rsvpAttending === 'no' ? 'active' : ''}`}
                        onClick={() => setRsvpAttending('no')}
                      >
                        Decline
                      </button>
                    </div>
                  </div>

                  <div className="rsvp-form-group">
                    <label>Number of Guests</label>
                    <select 
                      value={rsvpGuests} 
                      onChange={(e) => setRsvpGuests(Number(e.target.value))}
                    >
                      <option value={1}>1 Guest</option>
                      <option value={2}>2 Guests</option>
                      <option value={3}>3 Guests</option>
                      <option value={4}>4 Guests</option>
                      <option value={5}>5+ Guests</option>
                    </select>
                  </div>

                  <div className="rsvp-form-group">
                    <label>Message or Preference</label>
                    <input 
                      type="text" 
                      value={rsvpFood} 
                      onChange={(e) => setRsvpFood(e.target.value)}
                      placeholder="e.g. Vegetarian / No preferences" 
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label>Wishes Note</label>
                    <textarea 
                      rows={2} 
                      value={rsvpMsg} 
                      onChange={(e) => setRsvpMsg(e.target.value)}
                      placeholder="Wishes for the host..." 
                    />
                  </div>

                  <button type="submit" className="rsvp-submit-btn">
                    Confirm RSVP & Notify
                  </button>
                </form>
              )}
            </div>

            {/* GIFT REGISTRY NOTE */}
            {activeInvite.details.registry && (
              <div className="invite-section bg-alt">
                <div className="invite-section-title">Wishes & Registry</div>
                <div className="invite-divider">
                  <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                </div>
                <div className="registry-card">
                  <p>{activeInvite.details.registry}</p>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="invite-footer">
              <div className="invite-footer-title no-cursive">
                {activeInvite.title}
              </div>
              <p>Created via ShubhViah</p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default App;
