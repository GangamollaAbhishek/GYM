import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Dumbbell, 
  Users, 
  Activity, 
  TrendingUp, 
  CheckCircle2, 
  Calendar, 
  ShieldCheck, 
  Award,
  Layers,
  Settings,
  Plus
} from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [backendStatus, setBackendStatus] = useState({ online: false, message: 'Connecting...' });
  const [members, setMembers] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check backend health status
    const checkBackend = async () => {
      try {
        const response = await axios.get('/api/health');
        if (response.data && response.data.status === 'success') {
          setBackendStatus({
            online: true,
            message: response.data.message || 'API Connected'
          });
        }
      } catch (error) {
        setBackendStatus({
          online: false,
          message: 'Backend server offline (run npm run dev)'
        });
      }
    };

    // Fetch members and workouts demo data from API
    const fetchData = async () => {
      try {
        const [resMembers, resWorkouts] = await Promise.all([
          axios.get('/api/members').catch(() => null),
          axios.get('/api/workouts').catch(() => null)
        ]);

        if (resMembers?.data?.data) setMembers(resMembers.data.data);
        if (resWorkouts?.data?.data) setWorkouts(resWorkouts.data.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      } finally {
        setLoading(false);
      }
    };

    checkBackend();
    fetchData();
  }, []);

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">
            <Dumbbell size={24} />
          </div>
          <span className="brand-name">PULSE FIT</span>
        </div>

        <ul className="nav-menu">
          <li 
            className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <Activity size={20} />
            <span>Dashboard</span>
          </li>
          <li 
            className={`nav-item ${activeTab === 'members' ? 'active' : ''}`}
            onClick={() => setActiveTab('members')}
          >
            <Users size={20} />
            <span>Members</span>
          </li>
          <li 
            className={`nav-item ${activeTab === 'workouts' ? 'active' : ''}`}
            onClick={() => setActiveTab('workouts')}
          >
            <Dumbbell size={20} />
            <span>Workouts</span>
          </li>
          <li 
            className={`nav-item ${activeTab === 'schedule' ? 'active' : ''}`}
            onClick={() => setActiveTab('schedule')}
          >
            <Calendar size={20} />
            <span>Schedule</span>
          </li>
          <li 
            className={`nav-item ${activeTab === 'settings' ? 'active' : ''}`}
            onClick={() => setActiveTab('settings')}
          >
            <Settings size={20} />
            <span>Settings</span>
          </li>
        </ul>
      </aside>

      {/* Main Content Area */}
      <main className="main-wrapper">
        {/* Header */}
        <header className="top-header">
          <div className="header-title">
            <h1>Gym Command Center</h1>
            <p>Welcome back, Admin! Overview of active sessions & operations.</p>
          </div>

          <div className="status-badge" style={{ 
            borderColor: backendStatus.online ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)',
            color: backendStatus.online ? 'var(--accent-lime)' : '#ef4444',
            background: backendStatus.online ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)'
          }}>
            <span className="status-dot" style={{
              backgroundColor: backendStatus.online ? 'var(--accent-lime)' : '#ef4444',
              boxShadow: backendStatus.online ? '0 0 10px var(--accent-lime)' : '0 0 10px #ef4444'
            }}></span>
            {backendStatus.message}
          </div>
        </header>

        {/* Metrics Grid */}
        <section className="metrics-grid">
          <div className="metric-card cyan">
            <div className="metric-header">
              <div className="metric-icon-box">
                <Users size={24} />
              </div>
              <span className="tag premium">+12% this mo</span>
            </div>
            <div className="metric-value">1,482</div>
            <div className="metric-label">Active Gym Members</div>
          </div>

          <div className="metric-card amber">
            <div className="metric-header">
              <div className="metric-icon-box">
                <Activity size={24} />
              </div>
              <span className="tag standard">Peak Hours</span>
            </div>
            <div className="metric-value">284</div>
            <div className="metric-label">Daily Check-ins Today</div>
          </div>

          <div className="metric-card purple">
            <div className="metric-header">
              <div className="metric-icon-box">
                <TrendingUp size={24} />
              </div>
              <span className="tag premium">+18.4%</span>
            </div>
            <div className="metric-value">$34.8k</div>
            <div className="metric-label">Monthly Revenue</div>
          </div>

          <div className="metric-card lime">
            <div className="metric-header">
              <div className="metric-icon-box">
                <Award size={24} />
              </div>
              <span className="tag premium">Certified</span>
            </div>
            <div className="metric-value">24</div>
            <div className="metric-label">On-Duty Trainers</div>
          </div>
        </section>

        {/* Main Content Grid */}
        <div className="grid-two-col">
          {/* Members Table */}
          <div className="content-card">
            <div className="card-title-bar">
              <h2>Recent Gym Members</h2>
              <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Plus size={16} /> Add Member
              </button>
            </div>

            <table className="table-custom">
              <thead>
                <tr>
                  <th>Member Name</th>
                  <th>Membership Plan</th>
                  <th>Status</th>
                  <th>Expiration Date</th>
                </tr>
              </thead>
              <tbody>
                {members.length > 0 ? (
                  members.map((member) => (
                    <tr key={member.id}>
                      <td style={{ fontWeight: 600 }}>{member.name}</td>
                      <td>
                        <span className={`tag ${member.plan.includes('Premium') || member.plan.includes('VIP') ? 'premium' : 'standard'}`}>
                          {member.plan}
                        </span>
                      </td>
                      <td>
                        <span style={{ color: 'var(--accent-lime)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> {member.status}
                        </span>
                      </td>
                      <td style={{ color: 'var(--text-muted)' }}>{member.expiryDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
                      Loading member roster from backend API...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Featured Workouts & Quick Stats */}
          <div className="content-card">
            <div className="card-title-bar">
              <h2>Popular Workouts</h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {workouts.length > 0 ? (
                workouts.map((w) => (
                  <div key={w.id} style={{
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius-sm)',
                    padding: '16px',
                    display: 'flex',
                    justifySpace: 'between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <div style={{ fontWeight: '700', fontSize: '1rem', color: 'var(--text-main)' }}>{w.title}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginTop: '4px' }}>
                        Category: {w.category} • {w.duration}
                      </div>
                    </div>
                    <span className="tag premium" style={{ marginLeft: 'auto' }}>
                      🔥 {w.caloriesBurned} kcal
                    </span>
                  </div>
                ))
              ) : (
                <div style={{ color: 'var(--text-muted)', textAlign: 'center' }}>Loading workout modules...</div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
