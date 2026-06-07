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
  Maximize2, 
  ChevronLeft,
  Settings
} from 'lucide-react';
import './App.css';

// Import local assets
import weddingInviteBg from './assets/wedding_invite_bg.png';
import weddingCouple from './assets/wedding_couple.png';

interface EventTimeline {
  id: string;
  title: string;
  date: string;
  time: string;
  venue: string;
  mapsUrl: string;
}

interface InvitationData {
  brideName: string;
  groomName: string;
  eventDate: string;
  eventTime: string;
  inviteMessage: string;
  hosts: string;
  rsvpPhone: string;
  registry: string;
  theme: 'royal' | 'pastel' | 'emerald' | 'peacock';
  coverPreset: 'mandap' | 'couple';
  musicUrl: string;
  events: EventTimeline[];
}

interface RSVP {
  id: string;
  name: string;
  attending: 'yes' | 'no' | 'maybe';
  guests: number;
  food: 'veg' | 'non-veg' | 'any';
  message: string;
  date: string;
}

const defaultData: InvitationData = {
  brideName: "Priya",
  groomName: "Rahul",
  eventDate: "2026-11-20",
  eventTime: "18:00",
  inviteMessage: "We request the honor of your presence as we step into our forever. Together with our families, we invite you to share in our joy as we tie the knot.",
  hosts: "Sharma & Verma Families",
  rsvpPhone: "+919876543210",
  registry: "Your blessings are our greatest gift. If you wish to convey blessings physically, a gift envelope box will be placed at the venue reception.",
  theme: "royal",
  coverPreset: "mandap",
  musicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  events: [
    {
      id: "1",
      title: "Haldi & Mehendi",
      date: "2026-11-19",
      time: "11:00 AM",
      venue: "Courtyard Garden, The Leela Palace, New Delhi",
      mapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
    },
    {
      id: "2",
      title: "Wedding Ceremony (Phere)",
      date: "2026-11-20",
      time: "06:00 PM",
      venue: "Grand Ballroom, The Leela Palace, New Delhi",
      mapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
    },
    {
      id: "3",
      title: "Grand Reception",
      date: "2026-11-21",
      time: "07:30 PM",
      venue: "Royal Lawn, The Leela Palace, New Delhi",
      mapsUrl: "https://maps.google.com/?q=The+Leela+Palace+New+Delhi"
    }
  ]
};

// Simple Base64 Helper that handles unicode strings safely
const encodeData = (data: InvitationData): string => {
  try {
    const jsonStr = JSON.stringify(data);
    const utf8Str = encodeURIComponent(jsonStr);
    return btoa(utf8Str);
  } catch (e) {
    console.error("Encoding failed", e);
    return "";
  }
};

const decodeData = (hash: string): InvitationData | null => {
  try {
    const base64Str = hash.replace(/^#data=/, "");
    if (!base64Str) return null;
    const utf8Str = atob(base64Str);
    const jsonStr = decodeURIComponent(utf8Str);
    return JSON.parse(jsonStr) as InvitationData;
  } catch (e) {
    console.error("Decoding failed", e);
    return null;
  }
};

function App() {
  // Application view modes
  // 'creator' -> Split Screen (builder on left, preview on right)
  // 'guest' -> Fullscreen preview of the invite
  const [viewMode, setViewMode] = useState<'creator' | 'guest'>('creator');
  
  // App state
  const [inviteData, setInviteData] = useState<InvitationData>(defaultData);
  const [activeTab, setActiveTab] = useState<'details' | 'timeline' | 'theme' | 'rsvps'>('details');
  const [copied, setCopied] = useState(false);
  const [rsvps, setRsvps] = useState<RSVP[]>([]);
  
  // RSVP Form state
  const [rsvpName, setRsvpName] = useState('');
  const [rsvpAttending, setRsvpAttending] = useState<'yes' | 'no' | 'maybe'>('yes');
  const [rsvpGuests, setRsvpGuests] = useState(1);
  const [rsvpFood, setRsvpFood] = useState<'veg' | 'non-veg' | 'any'>('veg');
  const [rsvpMsg, setRsvpMsg] = useState('');
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  // Audio State & Refs
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Countdown timer state
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Mobile layout preview state (for mobile screen size toggle)
  const [showBuilderOnMobile, setShowBuilderOnMobile] = useState(true);

  // Check URL hash on load
  useEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.startsWith('#data=')) {
      const decoded = decodeData(hash);
      if (decoded) {
        setInviteData(decoded);
        setViewMode('guest'); // View fullscreen if visiting via shared link
        setShowBuilderOnMobile(false);
      }
    }

    // Load RSVPs from localStorage
    const savedRsvps = localStorage.getItem('shubhviah_rsvps');
    if (savedRsvps) {
      try {
        setRsvps(JSON.parse(savedRsvps));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Update audio source when musicUrl changes
  useEffect(() => {
    if (audioRef.current) {
      const playing = isPlaying;
      audioRef.current.pause();
      audioRef.current = new Audio(inviteData.musicUrl);
      audioRef.current.loop = true;
      if (playing) {
        audioRef.current.play().catch(err => console.log("Audio play failed: ", err));
      }
    } else {
      audioRef.current = new Audio(inviteData.musicUrl);
      audioRef.current.loop = true;
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [inviteData.musicUrl]);

  // Handle Play/Pause
  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(err => {
        console.error("Playback blocked or failed:", err);
      });
    }
  };

  // Countdown Timer Logic
  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = +new Date(inviteData.eventDate + 'T' + (inviteData.eventTime || '00:00')) - +new Date();
      let newTimeLeft = { days: 0, hours: 0, minutes: 0, seconds: 0 };

      if (difference > 0) {
        newTimeLeft = {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }
      setTimeLeft(newTimeLeft);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timer);
  }, [inviteData.eventDate, inviteData.eventTime]);

  // Generate URL Hash containing data
  const generateShareUrl = () => {
    const hash = encodeData(inviteData);
    const url = `${window.location.origin}${window.location.pathname}#data=${hash}`;
    return url;
  };

  const copyToClipboard = () => {
    const shareUrl = generateShareUrl();
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // State update handlers
  const handleBasicChange = (field: keyof InvitationData, value: string) => {
    setInviteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEventChange = (index: number, field: keyof EventTimeline, value: string) => {
    setInviteData(prev => {
      const updatedEvents = [...prev.events];
      updatedEvents[index] = {
        ...updatedEvents[index],
        [field]: value
      };
      return {
        ...prev,
        events: updatedEvents
      };
    });
  };

  const addEvent = () => {
    setInviteData(prev => ({
      ...prev,
      events: [
        ...prev.events,
        {
          id: Date.now().toString(),
          title: "New Ceremony",
          date: prev.eventDate,
          time: "12:00 PM",
          venue: "Venue Address",
          mapsUrl: "https://maps.google.com"
        }
      ]
    }));
  };

  const removeEvent = (id: string) => {
    setInviteData(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== id)
    }));
  };

  // RSVP Submission Handler
  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;

    const newRsvp: RSVP = {
      id: Date.now().toString(),
      name: rsvpName,
      attending: rsvpAttending,
      guests: rsvpGuests,
      food: rsvpFood,
      message: rsvpMsg,
      date: new Date().toLocaleDateString()
    };

    // Update list & localStorage
    const updated = [newRsvp, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('shubhviah_rsvps', JSON.stringify(updated));

    // Send via WhatsApp if enabled
    if (inviteData.rsvpPhone) {
      const attendingText = rsvpAttending === 'yes' ? 'Yes, attending!' : rsvpAttending === 'no' ? 'Sorry, cannot make it.' : 'Maybe attending.';
      const foodText = rsvpFood === 'veg' ? 'Veg' : rsvpFood === 'non-veg' ? 'Non-Veg' : 'No preference';
      const msg = `Hi ${inviteData.brideName} & ${inviteData.groomName},%0A` +
        `I have RSVPed for your wedding!%0A` +
        `*Name:* ${rsvpName}%0A` +
        `*Attending:* ${attendingText}%0A` +
        `*Guests:* ${rsvpGuests}%0A` +
        `*Food Preference:* ${foodText}%0A` +
        `*Message:* ${rsvpMsg || 'None'}`;
      
      const whatsappUrl = `https://wa.me/${inviteData.rsvpPhone.replace(/\+/g, '')}?text=${msg}`;
      
      // Delay slightly to show success animation
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 1000);
    }

    setRsvpSuccess(true);
    // Reset Form
    setRsvpName('');
    setRsvpMsg('');
  };

  // Clear RSVPs
  const clearRsvps = () => {
    if (window.confirm("Are you sure you want to clear all RSVPs?")) {
      setRsvps([]);
      localStorage.removeItem('shubhviah_rsvps');
    }
  };

  // Falling Petals array
  const petals = Array.from({ length: 15 });

  return (
    <div className="app-container">
      
      {/* MOBILE HEADER BAR */}
      <div className="preview-toggle-bar">
        <div style={{ fontFamily: 'Cinzel', fontWeight: 700, fontSize: '16px', color: '#fff' }}>
          Shubh<span>Viah</span>
        </div>
        <button 
          className="toggle-view-btn"
          onClick={() => setShowBuilderOnMobile(!showBuilderOnMobile)}
        >
          {showBuilderOnMobile ? 'View Invitation' : 'Open Editor'}
        </button>
      </div>

      {/* LEFT: BUILDER PANEL */}
      <div className={`builder-panel ${!showBuilderOnMobile && viewMode === 'creator' ? 'collapsed' : ''} ${viewMode === 'guest' ? 'collapsed' : ''}`}>
        <div className="builder-header">
          <h1>Shubh<span>Viah</span> <Sparkles size={18} style={{ color: 'var(--b-accent)' }} /></h1>
          <button 
            className="tab-btn" 
            style={{ flexDirection: 'row', gap: '5px', padding: '6px 12px', borderRadius: '4px', border: '1px solid var(--b-border)' }}
            onClick={() => setViewMode('guest')}
          >
            <Maximize2 size={12} /> Full View
          </button>
        </div>

        {/* Builder navigation tabs */}
        <div className="builder-tabs">
          <button 
            className={`tab-btn ${activeTab === 'details' ? 'active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            <Settings size={16} />
            Details
          </button>
          <button 
            className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
            onClick={() => setActiveTab('timeline')}
          >
            <Calendar size={16} />
            Timeline
          </button>
          <button 
            className={`tab-btn ${activeTab === 'theme' ? 'active' : ''}`}
            onClick={() => setActiveTab('theme')}
          >
            <Sliders size={16} />
            Themes
          </button>
          <button 
            className={`tab-btn ${activeTab === 'rsvps' ? 'active' : ''}`}
            onClick={() => setActiveTab('rsvps')}
          >
            <ClipboardList size={16} />
            RSVPs ({rsvps.length})
          </button>
        </div>

        {/* Scrollable inputs wrapper */}
        <div className="builder-content">
          {activeTab === 'details' && (
            <div className="builder-section">
              <div className="form-row">
                <div className="form-group">
                  <label>Bride's Name</label>
                  <input 
                    type="text" 
                    value={inviteData.brideName}
                    onChange={(e) => handleBasicChange('brideName', e.target.value)}
                    placeholder="Bride's Name"
                  />
                </div>
                <div className="form-group">
                  <label>Groom's Name</label>
                  <input 
                    type="text" 
                    value={inviteData.groomName}
                    onChange={(e) => handleBasicChange('groomName', e.target.value)}
                    placeholder="Groom's Name"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Wedding Date</label>
                  <input 
                    type="date" 
                    value={inviteData.eventDate}
                    onChange={(e) => handleBasicChange('eventDate', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Wedding Time</label>
                  <input 
                    type="time" 
                    value={inviteData.eventTime}
                    onChange={(e) => handleBasicChange('eventTime', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Hosts & Family Names</label>
                <input 
                  type="text" 
                  value={inviteData.hosts}
                  onChange={(e) => handleBasicChange('hosts', e.target.value)}
                  placeholder="e.g. Sharma & Verma Families"
                />
              </div>

              <div className="form-group">
                <label>Invitation Message</label>
                <textarea 
                  rows={3}
                  value={inviteData.inviteMessage}
                  onChange={(e) => handleBasicChange('inviteMessage', e.target.value)}
                  placeholder="Welcome message..."
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>RSVP WhatsApp Phone</label>
                  <input 
                    type="text" 
                    value={inviteData.rsvpPhone}
                    onChange={(e) => handleBasicChange('rsvpPhone', e.target.value)}
                    placeholder="e.g. +919876543210"
                  />
                </div>
                <div className="form-group">
                  <label>Cover Graphic Preset</label>
                  <select 
                    value={inviteData.coverPreset}
                    onChange={(e) => handleBasicChange('coverPreset', e.target.value as 'mandap' | 'couple')}
                  >
                    <option value="mandap">Royal Mandap Frame</option>
                    <option value="couple">Couple Painting</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Gift Registry / Blessings Note</label>
                <textarea 
                  rows={2}
                  value={inviteData.registry}
                  onChange={(e) => handleBasicChange('registry', e.target.value)}
                  placeholder="Registry details..."
                />
              </div>

              <div className="form-group">
                <label>Background Music (MP3 URL)</label>
                <select 
                  value={inviteData.musicUrl} 
                  onChange={(e) => handleBasicChange('musicUrl', e.target.value)}
                  style={{ marginBottom: '8px' }}
                >
                  <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3">Sitar Instrumental (Preset 1)</option>
                  <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3">Classical Flute (Preset 2)</option>
                  <option value="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3">Romantic Wedding Piano (Preset 3)</option>
                  <option value="custom">Custom Audio URL...</option>
                </select>
                {inviteData.musicUrl === 'custom' || !['https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3'].includes(inviteData.musicUrl) ? (
                  <input 
                    type="text" 
                    value={inviteData.musicUrl === 'custom' ? '' : inviteData.musicUrl}
                    onChange={(e) => handleBasicChange('musicUrl', e.target.value)}
                    placeholder="Enter direct URL to MP3 audio file"
                  />
                ) : null}
              </div>

              <div className="builder-share-card">
                <h4 style={{ color: 'var(--b-accent)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Share2 size={14} /> Share Your Digital Invitation
                </h4>
                <p style={{ fontSize: '11px', color: 'var(--b-text)', lineHeight: '1.4' }}>
                  Your invitation data is encoded completely inside the link! No server required. Guests can RSVP directly via WhatsApp.
                </p>
                <div className="share-link-input">
                  <input 
                    type="text" 
                    readOnly 
                    value={generateShareUrl().substring(0, 45) + "..."} 
                  />
                  <button className="copy-btn" onClick={copyToClipboard}>
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'timeline' && (
            <div className="builder-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Wedding Schedule/Events</label>
                <button className="add-btn" style={{ padding: '4px 10px', fontSize: '11px' }} onClick={addEvent}>
                  <Plus size={12} /> Add Event
                </button>
              </div>

              <div className="builder-timeline-list">
                {inviteData.events.map((event, index) => (
                  <div key={event.id} className="builder-timeline-item">
                    <button className="remove-btn" onClick={() => removeEvent(event.id)}>
                      <Trash2 size={14} />
                    </button>
                    
                    <div className="form-group">
                      <label>Ceremony Name</label>
                      <input 
                        type="text" 
                        value={event.title}
                        onChange={(e) => handleEventChange(index, 'title', e.target.value)}
                        placeholder="e.g. Sangeet, Phere, Reception"
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Date</label>
                        <input 
                          type="text" 
                          value={event.date}
                          onChange={(e) => handleEventChange(index, 'date', e.target.value)}
                          placeholder="e.g. Nov 20, 2026"
                        />
                      </div>
                      <div className="form-group">
                        <label>Time</label>
                        <input 
                          type="text" 
                          value={event.time}
                          onChange={(e) => handleEventChange(index, 'time', e.target.value)}
                          placeholder="e.g. 7:00 PM onwards"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Venue Address</label>
                      <input 
                        type="text" 
                        value={event.venue}
                        onChange={(e) => handleEventChange(index, 'venue', e.target.value)}
                        placeholder="Venue address"
                      />
                    </div>

                    <div className="form-group">
                      <label>Google Maps Location URL</label>
                      <input 
                        type="text" 
                        value={event.mapsUrl}
                        onChange={(e) => handleEventChange(index, 'mapsUrl', e.target.value)}
                        placeholder="Google maps link"
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
                
                {/* Royal Crimson */}
                <div 
                  className={`theme-card ${inviteData.theme === 'royal' ? 'active' : ''}`}
                  onClick={() => handleBasicChange('theme', 'royal')}
                >
                  <div className="theme-preview-dots">
                    <div className="theme-dot" style={{ backgroundColor: '#7d0617' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#d4af37' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#fcf8f2' }}></div>
                  </div>
                  <div className="theme-name">Royal Crimson</div>
                </div>

                {/* Pastel Rose */}
                <div 
                  className={`theme-card ${inviteData.theme === 'pastel' ? 'active' : ''}`}
                  onClick={() => handleBasicChange('theme', 'pastel')}
                >
                  <div className="theme-preview-dots">
                    <div className="theme-dot" style={{ backgroundColor: '#b38262' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#607968' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#f7f9f6' }}></div>
                  </div>
                  <div className="theme-name">Pastel Sage</div>
                </div>

                {/* Emerald Saffron */}
                <div 
                  className={`theme-card ${inviteData.theme === 'emerald' ? 'active' : ''}`}
                  onClick={() => handleBasicChange('theme', 'emerald')}
                >
                  <div className="theme-preview-dots">
                    <div className="theme-dot" style={{ backgroundColor: '#044030' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#c29545' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#f4f6f3' }}></div>
                  </div>
                  <div className="theme-name">Emerald Saffron</div>
                </div>

                {/* Peacock Symphony */}
                <div 
                  className={`theme-card ${inviteData.theme === 'peacock' ? 'active' : ''}`}
                  onClick={() => handleBasicChange('theme', 'peacock')}
                >
                  <div className="theme-preview-dots">
                    <div className="theme-dot" style={{ backgroundColor: '#024f6e' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#dca327' }}></div>
                    <div className="theme-dot" style={{ backgroundColor: '#f0f6f8' }}></div>
                  </div>
                  <div className="theme-name">Peacock Symphony</div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'rsvps' && (
            <div className="builder-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label>RSVPs Received (Demo)</label>
                {rsvps.length > 0 && (
                  <button className="remove-btn" style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }} onClick={clearRsvps}>
                    <Trash2 size={12} /> Clear All
                  </button>
                )}
              </div>

              <div className="rsvp-stats">
                <div className="stat-box">
                  <div className="stat-val">{rsvps.filter(r => r.attending === 'yes').reduce((sum, r) => sum + Number(r.guests), 0)}</div>
                  <div className="stat-label">Attending</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{rsvps.filter(r => r.attending === 'maybe').length}</div>
                  <div className="stat-label">Maybe</div>
                </div>
                <div className="stat-box">
                  <div className="stat-val">{rsvps.filter(r => r.attending === 'no').length}</div>
                  <div className="stat-label">Declined</div>
                </div>
              </div>

              <div className="rsvp-list-table">
                <div className="rsvp-list-header">
                  <div>Name</div>
                  <div>RSVP</div>
                  <div>Guests</div>
                  <div>Message</div>
                </div>
                {rsvps.length === 0 ? (
                  <div className="rsvp-empty">No RSVPs yet. Submit the RSVP form on the right card to see details pop up here!</div>
                ) : (
                  rsvps.map((rsvp) => (
                    <div key={rsvp.id} className="rsvp-list-row">
                      <div style={{ color: '#fff', fontWeight: 500 }}>{rsvp.name}</div>
                      <div>
                        <span className={`rsvp-status-badge ${rsvp.attending}`}>
                          {rsvp.attending === 'yes' ? 'Yes' : rsvp.attending === 'no' ? 'No' : 'Maybe'}
                        </span>
                      </div>
                      <div style={{ textAlign: 'center' }}>{rsvp.guests}</div>
                      <div style={{ fontStyle: 'italic', fontSize: '11px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={rsvp.message}>
                        {rsvp.message || '-'}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: PREVIEW SECTION */}
      <div className={viewMode === 'guest' ? 'invitation-fullscreen' : 'preview-panel'}>
        
        {/* Floating Back to Editor button for fullscreen guest mode */}
        {viewMode === 'guest' && (
          <button 
            className="back-to-editor-float"
            onClick={() => setViewMode('creator')}
          >
            <ChevronLeft size={16} /> Open Editor
          </button>
        )}

        {/* Preview Frame wraps the invite on creator screen, or acts as normal wrapper on fullscreen */}
        <div className={viewMode === 'guest' ? 'invite-wrapper' : 'preview-frame'}>
          <div className={`invite-wrapper theme-${inviteData.theme}`}>
            
            {/* FLOATING FLOWERS PETAL EFFECT */}
            <div className="invite-petal-container">
              {petals.map((_, i) => {
                const left = Math.random() * 100;
                const size = Math.random() * 15 + 10;
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

            {/* FLOATING MUSIC PLAYER */}
            <div className="invite-audio-control">
              <button 
                className={`audio-btn ${isPlaying ? 'playing' : ''}`}
                onClick={togglePlay}
                title={isPlaying ? "Mute Music" : "Play Music"}
              >
                {isPlaying ? <Volume2 size={22} /> : <VolumeX size={22} />}
              </button>
            </div>

            {/* HERO COVER BANNER */}
            <div 
              className="invite-hero"
              style={{ 
                backgroundImage: inviteData.coverPreset === 'mandap' 
                  ? `url(${weddingInviteBg})` 
                  : `linear-gradient(rgba(252,248,242,0.65), rgba(252,248,242,0.8)), url(${weddingCouple})`,
                backgroundSize: inviteData.coverPreset === 'mandap' ? '100% 100%' : 'cover'
              }}
            >
              {inviteData.coverPreset === 'mandap' && <div className="invite-hero-frame"></div>}
              
              <div className="invite-header-label">SHUBH VIVAH</div>
              
              <div className="invite-hero-title">
                {inviteData.brideName}
                <span className="invite-conjunction">weds</span>
                {inviteData.groomName}
              </div>

              {inviteData.coverPreset === 'mandap' && (
                <img 
                  src={weddingCouple} 
                  alt="Couple" 
                  className="invite-couple-img" 
                />
              )}

              <div className="invite-hero-footer">
                <div className="invite-date-badge">
                  {inviteData.eventDate ? new Date(inviteData.eventDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  }) : 'Date TBD'}
                </div>
              </div>
            </div>

            {/* COUNTDOWN TIMER SECTION */}
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

            {/* THE INVITATION MESSAGE */}
            <div className="invite-section">
              <div className="invite-section-title">Save The Date</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>
              <p className="invite-message">
                "{inviteData.inviteMessage}"
              </p>
              <div className="invite-hosts">
                With Blessings From: <br />
                <strong>{inviteData.hosts}</strong>
              </div>
            </div>

            {/* EVENTS SCHEDULE TIMELINE */}
            <div className="invite-section bg-alt">
              <div className="invite-section-title">Wedding Timeline</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>
              
              <div className="timeline-card-list">
                {inviteData.events.map((event) => (
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

            {/* RSVP SECTION */}
            <div className="invite-section">
              <div className="invite-section-title">Are You Attending?</div>
              <div className="invite-divider">
                <Heart size={14} className="invite-divider-icon" fill="currentColor" />
              </div>

              {rsvpSuccess ? (
                <div className="rsvp-success-msg">
                  <Heart size={28} fill="currentColor" style={{ alignSelf: 'center', color: '#10b981' }} />
                  <h4>Thank You for RSVPing!</h4>
                  <p>Your response has been saved. If WhatsApp opened, please send the prefilled message to notify the host.</p>
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
                      placeholder="Enter full name" 
                    />
                  </div>

                  <div className="rsvp-form-group">
                    <label>Will you join us?</label>
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
                        Regretfully Decline
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
                    <label>Food Preference</label>
                    <select 
                      value={rsvpFood}
                      onChange={(e) => setRsvpFood(e.target.value as 'veg' | 'non-veg' | 'any')}
                    >
                      <option value="veg">Vegetarian</option>
                      <option value="non-veg">Non-Vegetarian</option>
                      <option value="any">No Preference</option>
                    </select>
                  </div>

                  <div className="rsvp-form-group">
                    <label>Wishes or Message</label>
                    <textarea 
                      rows={2} 
                      value={rsvpMsg}
                      onChange={(e) => setRsvpMsg(e.target.value)}
                      placeholder="Write a message to the couple" 
                    />
                  </div>

                  <button type="submit" className="rsvp-submit-btn">
                    Confirm RSVP & Notify
                  </button>
                </form>
              )}
            </div>

            {/* GIFT REGISTRY / BLESSINGS */}
            {inviteData.registry && (
              <div className="invite-section bg-alt">
                <div className="invite-section-title">Wishes & Registry</div>
                <div className="invite-divider">
                  <Heart size={14} className="invite-divider-icon" fill="currentColor" />
                </div>
                <div className="registry-card">
                  <p>{inviteData.registry}</p>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <div className="invite-footer">
              <div className="invite-footer-title">
                {inviteData.brideName} & {inviteData.groomName}
              </div>
              <p>Made with love for our wedding day</p>
            </div>

          </div>
        </div>
      </div>
      
    </div>
  );
}

export default App;
