import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, Box, Check, ChevronDown, Code2, Eye, Film, Globe, Menu, Palette, Play, Send, Sparkles, Trash2, UserRound, X } from 'lucide-react';
import './styles.css';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';
const services = [
  { icon: Palette, number: '01', title: 'Graphic design', copy: 'Professional visual systems that communicate ideas with clarity and impact.', tone: 'coral' },
  { icon: Box, number: '02', title: '3D animation / modeling', copy: 'High-quality models, animation and visualization with dimensional thinking.', tone: 'lime' },
  { icon: Code2, number: '03', title: 'Full-stack development', copy: 'Modern, scalable digital products from frontend to backend and beyond.', tone: 'violet' },
  { icon: Film, number: '04', title: 'Video editing', copy: 'Rhythm-led edits, motion graphics and visual storytelling that lands.', tone: 'teal' }
];
const projects = [];

function App() {
  const [page, setPage] = useState('home');
  const [selectedService, setSelectedService] = useState('');
  const [menu, setMenu] = useState(false);
  const [profile, setProfile] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('beziera-token');
    if (!token) return;

    fetch(`${API}/me`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async response => {
        const data = await response.json();
        if (!response.ok) throw Error(data.message || 'Session expired.');
        setUser(data);
      })
      .catch(() => localStorage.removeItem('beziera-token'));
  }, []);

  const navigate = (next, service = '') => {
    setPage(next);
    setSelectedService(next === 'idea' ? service : '');
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const logout = () => {
    localStorage.removeItem('beziera-token');
    setUser(null);
    setProfile(false);
    navigate('home');
  };

  return <div className="app">
    <div className="noise" />
    <header className="nav">
      <button className="brand" onClick={() => navigate('home')}><span className="brand-mark">B</span><span>BeZierA</span></button>
      <nav className={menu ? 'nav-links open' : 'nav-links'}>
        {[['home', 'Home'], ['about', 'What we are'], ['services', 'What we do'], ['work', 'Portfolio'], ['contact', 'Contact us']]
          .map(([id, label]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => navigate(id)}>{label}</button>)}
      </nav>
      <div className="nav-actions">
        <button className="profile-trigger" aria-label="Profile menu" onClick={() => setProfile(!profile)}><UserRound size={17} /> <ChevronDown size={14} /></button>
        <button className="menu-trigger" onClick={() => setMenu(!menu)}>{menu ? <X /> : <Menu />}</button>
        {profile && <div className="profile-menu">
          <strong>{user ? user.username : 'Make something great'}</strong>
          <button onClick={() => navigate(user ? 'dashboard' : 'login')}>{user ? 'User dashboard' : 'Login'}</button>
          <button onClick={() => user ? logout() : navigate('signup')}>{user ? 'Log out' : 'Sign up'}</button>
          {!user && <button onClick={() => navigate('admin-login')}>Manager login</button>}
        </div>}
      </div>
    </header>

    <main>
      <AnimatePresence mode="wait">
        <motion.div key={page} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: .35 }}>
          {page === 'home' && <Home navigate={navigate} />}
          {page === 'about' && <About />}
          {page === 'services' && <Services navigate={navigate} />}
          {page === 'work' && <Work />}
          {page === 'contact' && <Contact />}
          {page === 'idea' && <Idea navigate={navigate} user={user} selectedService={selectedService} />}
          {page === 'login' && <Auth mode="login" setUser={setUser} navigate={navigate} />}
          {page === 'admin-login' && <Auth mode="admin-login" setUser={setUser} navigate={navigate} />}
          {page === 'signup' && <Auth mode="signup" setUser={setUser} navigate={navigate} />}
          {page === 'dashboard' && <Dashboard user={user} navigate={navigate} />}
        </motion.div>
      </AnimatePresence>
    </main>
    <Footer navigate={navigate} />
  </div>;
}

function Home({ navigate }) {
  return <>
    <section className="hero">
      <div className="hero-grid" />
      <div className="orb orb-one" />
      <div className="orb orb-two" />
      <div className="hero-copy">
        <p className="eyebrow"><Sparkles size={14} /> Independent creative technology studio</p>
        <h1>Be<span>Z</span>ierA</h1>
        <p className="slogan">Your vision. Our creativity.<br /><em>Beyond imagination.</em></p>
        <p className="lede">Transforming ideas into powerful visual experiences, digital products and creative solutions.</p>
        <div className="hero-actions">
          <button className="button primary" onClick={() => navigate('idea')}>Your idea <ArrowUpRight size={17} /></button>
          <button className="text-button" onClick={() => navigate('work')}>Explore our work <ArrowUpRight size={16} /></button>
        </div>
      </div>
      <div className="hero-stamp">BEZIERA<br /><small>STUDIO / 2026</small></div>
    </section>
    <section className="marquee">
      <span>Ideas in motion</span>
      <span>Digital craft</span>
      <span>Beautifully useful</span>
      <span>Ideas in motion</span>
    </section>
  </>;
}

function About() {
  return <section className="section about">
    <div className="section-intro">
      <p className="eyebrow">01 / What we are</p>
      <h2>We make the<br /><em>unfamiliar</em> feel right.</h2>
    </div>
    <div className="about-body">
      <p className="big-copy">BeZierA is a creative technology company focused on transforming ideas into innovative digital experiences.</p>
      <p>We sit at the intersection of good taste and good engineering. Every engagement starts with curiosity and ends with something useful.</p>
      <div className="value-grid">{['Creativity', 'Innovation', 'Quality', 'Technology'].map((x, i) => <div className="value" key={x}><span>0{i + 1}</span><strong>{x}</strong></div>)}</div>
    </div>
  </section>;
}

function Services({ navigate }) {
  return <section className="section services">
    <div className="section-intro">
      <p className="eyebrow">02 / What we do</p>
      <h2>Small team.<br /><em>Wide orbit.</em></h2>
      <button className="button primary" onClick={() => navigate('idea')}>Start a project <ArrowUpRight size={17} /></button>
    </div>
    <div className="service-grid">
      {services.map(({ icon: Icon, ...service }) => <motion.article whileHover={{ y: -8 }} className={`service-card ${service.tone}`} key={service.title} onClick={() => navigate('idea', service.title)}>
        <div className="card-top"><span>{service.number}</span><Icon size={28} /></div>
        <h3>{service.title}</h3>
        <p>{service.copy}</p>
        <ArrowUpRight className="card-arrow" />
      </motion.article>)}
    </div>
  </section>;
}

function Work() {
  const items = projects;
  return <section className="section work">
    <div className="work-heading">
      <div>
        <p className="eyebrow">03 / Portfolio</p>
        <h2>Nothing here yet.<br /><em>Waiting for the next story.</em></h2>
      </div>
      <p className="work-note">The portfolio will appear here once there is work to share.</p>
    </div>
    {items.length === 0 ? <div className="empty-state"><h3>No projects available.</h3><p>There are currently no portfolio items to display.</p></div> : <div className="project-grid">{items.map(project => <motion.article layout className="project" key={project.title}><div className="project-art" style={{ background: project.color }}><span>{project.label}</span><div className="project-lines" /><button aria-label={`View ${project.title}`}><Play size={16} fill="currentColor" /></button></div><div className="project-meta"><div><p>{project.category}</p><h3>{project.title}</h3></div><ArrowUpRight size={19} /><small>{project.description}</small></div></motion.article>)}</div>}
  </section>;
}

function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  return <section className="section contact">
    <div>
      <p className="eyebrow">04 / Contact</p>
      <h2>Let's make<br /><em>something real.</em></h2>
      <p className="contact-copy">Have a thought, a half-formed idea, or a beautiful problem? We would like to hear it.</p>
      <div className="contact-links">
        <a href="mailto:bezieravisuals@gmail.com">bezieravisuals@gmail.com <ArrowUpRight size={16} /></a>
        <a href="https://www.instagram.com/beziera_visuals?igsh=eGE3dDE2a3IzbzNn" target="_blank" rel="noreferrer">Instagram <Globe size={16} /></a>
        <a href="https://www.linkedin.com/in/beziera-visuals-6a1037431?utm_source=share_via&utm_content=profile&utm_medium=member_android" target="_blank" rel="noreferrer">LinkedIn <Globe size={16} /></a>
      </div>
    </div>
    <form className="contact-form" onSubmit={async e => {
      e.preventDefault();
      const form = new FormData(e.currentTarget);
      const payload = {
        name: String(form.get('name') || ''),
        email: String(form.get('email') || ''),
        message: String(form.get('message') || '')
      };

      try {
        const response = await fetch(`${API}/contact`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || 'Unable to send your message.');
        setSent(true);
      } catch (error) {
        setError(error.message || 'Unable to connect to the studio API.');
      }
    }}>
      <label>Name<input name="name" required placeholder="Your name" /></label>
      <label>Email<input name="email" required type="email" placeholder="you@company.com" /></label>
      <label>Message<textarea name="message" required placeholder="Tell us about the thing..." /></label>
      {error && <p className="form-error">{error}</p>}
      <button className="button primary" type="submit">{sent ? <><Check size={16} /> Message sent</> : <>Send message <Send size={16} /></>}</button>
    </form>
  </section>;
}

function Idea({ navigate, user, selectedService }) {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async event => {
    event.preventDefault();
    const token = localStorage.getItem('beziera-token');
    if (!token || !user) {
      navigate('login');
      return;
    }

    const form = new FormData(event.currentTarget);
    const payload = {
      name: String(form.get('name') || ''),
      email: String(form.get('email') || ''),
      title: String(form.get('title') || ''),
      service: String(form.get('service') || ''),
      details: String(form.get('details') || '')
    };

    try {
      const response = await fetch(`${API}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Unable to submit your project.');
      setSent(true);
    } catch (submitError) {
      setError(submitError.message || 'Unable to connect to the studio API.');
    }
  };

  return <section className="section form-page">
    <p className="eyebrow">Your idea / Project request</p>
    <h2>Give the idea<br /><em>some room.</em></h2>
    {sent ? <div className="success"><Check /><h3>Your idea has been received.</h3><p>Our team will review your project and contact you shortly.</p><button className="text-button" onClick={() => navigate('home')}>Back home <ArrowUpRight size={16} /></button></div> : <form className="idea-form" onSubmit={submit}><input name="name" required placeholder="Full name" /><input name="email" required type="email" placeholder="Email address" /><input name="title" required placeholder="Project title" /><select name="service" required defaultValue={selectedService}><option value="" disabled>Select a service</option>{services.map(s => <option key={s.title}>{s.title}</option>)}</select><textarea name="details" required placeholder="What are we making together?" />{error && <p className="form-error">{error}</p>}<button className="button primary" type="submit">Submit project request <ArrowUpRight size={17} /></button></form>}
  </section>;
}

function Auth({ mode, setUser, navigate }) {
  const [error, setError] = useState('');
  const isAdmin = mode === 'admin-login';

  const submit = async e => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const username = String(form.get('username') || form.get('identifier') || '').trim();
    const email = String(form.get('email') || '').trim();
    const password = String(form.get('password') || '').trim();
    const confirmPassword = String(form.get('confirmPassword') || '').trim();

    if (mode === 'signup' && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!username || !password || (mode === 'signup' && !email)) {
      setError('Please complete all required fields.');
      return;
    }

    const payload = mode === 'signup' ? { username, email, password } : { identifier: username || email, password };

    try {
      const response = await fetch(`${API}/auth/${mode === 'admin-login' ? 'login' : mode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Unable to authenticate.');
      localStorage.setItem('beziera-token', data.token);
      setUser(data.user);
      navigate('dashboard');
    } catch (err) {
      setError(err.message || 'Unable to connect to the studio API.');
    }
  };

  const pageTitle = isAdmin ? <>Admin<br /><em>access.</em></> : mode === 'login' ? <>Good to<br /><em>see you.</em></> : <>Make it<br /><em>official.</em></>;
  const eyebrow = isAdmin ? 'Studio access / Admin login' : mode === 'login' ? 'Welcome back' : 'Join the studio orbit';

  return <section className="section auth">
    <p className="eyebrow">{eyebrow}</p>
    <h2>{pageTitle}</h2>
    {error && <p className="form-error">{error}</p>}
    <form onSubmit={submit}>
      {mode === 'signup' && <label>Username<input name="username" placeholder="Your username" /></label>}
      {mode === 'signup' && <label>Email<input name="email" type="email" placeholder="you@example.com" /></label>}
      {mode !== 'signup' && <label>Username or email<input name="identifier" placeholder="Username or email" /></label>}
      <label>Password<input name="password" type="password" placeholder="Password" /></label>
      {mode === 'signup' && <label>Confirm password<input name="confirmPassword" type="password" placeholder="Confirm password" /></label>}
      <button className="button primary" type="submit">{mode === 'signup' ? 'Create account' : isAdmin ? 'Enter admin portal' : 'Login'}</button>
    </form>
  </section>;
}

function Dashboard({ user, navigate }) {
  const managerRoles = ['Main Admin', 'Graphic Design Manager', '3D Manager', 'Development Manager', 'Video Editing Manager'];
  const isServiceManager = managerRoles.includes(user?.role);
  const isAdminView = user?.role === 'Main Admin' || isServiceManager;
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const visibleProjects = isAdminView ? projects.filter(project => user?.role === 'Main Admin' || project.department === user?.department) : projects;

  useEffect(() => {
    const loadProjects = async () => {
      const token = localStorage.getItem('beziera-token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${API}/projects`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await response.json();
        if (!response.ok) throw Error(data.message || 'Unable to load projects.');
        setProjects(data);
        setError('');
      } catch (fetchError) {
        setError(fetchError.message || 'Unable to connect to the studio API.');
      } finally {
        setLoading(false);
      }
    };

    loadProjects();
    window.addEventListener('focus', loadProjects);
    return () => window.removeEventListener('focus', loadProjects);
  }, []);

  const updateProject = async (project, changes) => {
    const token = localStorage.getItem('beziera-token');
    setSavingId(project.id);
    try {
      const response = await fetch(`${API}/projects/${project.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(changes)
      });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Unable to update project.');
      setProjects(current => current.map(item => item.id === data.id ? data : item));
    } catch (updateError) {
      setError(updateError.message || 'Unable to update project.');
    } finally {
      setSavingId(null);
    }
  };

  const deleteProject = async project => {
    if (!window.confirm(`Delete ${project.name || project.title}?`)) return;
    const token = localStorage.getItem('beziera-token');
    try {
      const response = await fetch(`${API}/projects/${project.id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
      const data = await response.json();
      if (!response.ok) throw Error(data.message || 'Unable to delete project.');
      setProjects(current => current.filter(item => item.id !== project.id));
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete project.');
    }
  };

  const dashboardLabel = user?.role === 'Main Admin' ? 'Admin portal / Dashboard' : isServiceManager ? `${user?.department} / Dashboard` : 'Client portal / Dashboard';

  return <section className="section dashboard">
    <div className="dashboard-head">
      <div>
        <p className="eyebrow">{dashboardLabel}</p>
        <h2>Hello, <em>{user?.username || 'creator'}.</em></h2>
      </div>
      <button className="button outline" onClick={() => navigate('idea')}>New project <ArrowUpRight size={16} /></button>
    </div>

    {error && <p className="form-error">{error}</p>}
    {loading ? <div className="empty-state"><h3>Loading projects...</h3></div> : visibleProjects.length === 0 ? <div className="empty-state"><h3>No projects yet.</h3><p>Your project pipeline is empty right now.</p></div> : <div className="dashboard-table"><div className="table-header"><span>Project</span><span>Service</span><span>Status</span><span>Progress</span><span>Actions</span></div>{visibleProjects.map(project => <div className="table-row" key={project.id}><strong>{project.name || project.title}</strong><span>{project.service}</span>{isAdminView ? <select value={project.status} disabled={savingId === project.id} onChange={event => updateProject(project, { status: event.target.value })}><option>Submitted</option><option>In Progress</option><option>Completed</option></select> : <span className="status">{project.status}</span>}<div className="progress-wrap">{isAdminView ? <input aria-label={`Progress for ${project.name || project.title}`} type="number" min="0" max="100" defaultValue={project.progress} disabled={savingId === project.id} onBlur={event => { const progress = Number(event.target.value); if (progress !== project.progress) updateProject(project, { progress }); }} /> : <span>{project.progress}%</span>}<div className="progress"><i style={{ width: `${project.progress}%` }} /></div></div><div className="row-actions"><button className="icon-button" aria-label={`View ${project.name || project.title}`} onClick={() => setSelectedProject(project)}><Eye size={16} /></button>{user?.role === 'Main Admin' && <button className="icon-button" aria-label={`Delete ${project.name || project.title}`} onClick={() => deleteProject(project)}><Trash2 size={16} /></button>}</div></div>)}</div>}

    {selectedProject && <div className="project-modal-backdrop" onClick={() => setSelectedProject(null)}><div className="project-modal" onClick={e => e.stopPropagation()}><button className="close-modal" onClick={() => setSelectedProject(null)} aria-label="Close details"><X size={16} /></button><p className="eyebrow">Project details</p><h3>{selectedProject.title || selectedProject.name}</h3>{selectedProject.title && <p>Client: {selectedProject.name}</p>}<p>{selectedProject.details || 'No details available yet.'}</p></div></div>}
  </section>;
}

function Footer({ navigate }) {
  return <footer>
    <button className="brand" onClick={() => navigate('home')}><span className="brand-mark">B</span><span>BeZierA</span></button>
    <p>Creative technology for ideas with somewhere to go.</p>
    <div>
      <a href="https://instagram.com">Instagram</a>
      <a href="https://linkedin.com">LinkedIn</a>
      <a href="mailto:bezieravisuals@gmail.com">Gmail</a>
    </div>
    <small>© 2026 BeZierA. All rights reserved.</small>
  </footer>;
}

createRoot(document.getElementById('root')).render(<App />);
