import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;
const secret = process.env.JWT_SECRET || 'beziera-development-secret';
const gmailUser = process.env.MAIL_USER || 'bezieravisuals@gmail.com';
const gmailPass = process.env.MAIL_PASS || '';

const mailTransport = nodemailer.createTransport({
  host: process.env.MAIL_HOST || 'smtp.gmail.com',
  port: Number(process.env.MAIL_PORT || 587),
  secure: false,
  auth: gmailPass && gmailUser ? { user: gmailUser, pass: gmailPass } : undefined
});

app.use(cors());
app.use(express.json());

const users = [];
const projects = [];
const messages = [];
const portfolio = [];

const adminEmail = 'bezieravisuals@gmail.com';
const adminPassword = 'devanithi';

const ensureDefaultAdmin = () => {
  const existingAdmin = users.find(user => user.email === adminEmail || user.username === adminEmail);

  if (existingAdmin) {
    existingAdmin.username = adminEmail;
    existingAdmin.email = adminEmail;
    existingAdmin.role = 'Main Admin';
    existingAdmin.department = 'All';
    existingAdmin.passwordHash = bcrypt.hashSync(adminPassword, 12);
    return;
  }

  users.push({
    id: 'admin-bezieravisual',
    username: adminEmail,
    email: adminEmail,
    phone: '',
    passwordHash: bcrypt.hashSync(adminPassword, 12),
    role: 'Main Admin',
    department: 'All'
  });
};

ensureDefaultAdmin();

const tokenFor = user => jwt.sign({ id: user.id, role: user.role, department: user.department }, secret, { expiresIn: '2h' });

const auth = (req, res, next) => {
  try {
    req.user = jwt.verify((req.headers.authorization || '').replace('Bearer ', ''), secret);
    next();
  } catch {
    res.status(401).json({ message: 'Authentication required' });
  }
};

const role = (...allowed) => (req, res, next) =>
  allowed.includes(req.user.role) ? next() : res.status(403).json({ message: 'Insufficient permissions' });

app.get('/api/health', (_, res) => res.json({ status: 'ok', database: process.env.MONGODB_URI ? 'configured' : 'memory-fallback' }));
app.get('/api/portfolio', (_, res) => res.json(portfolio));

app.post('/api/auth/signup', async (req, res) => {
  const { username, email, phone, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email and password are required' });
  }

  if (users.some(user => user.email === email || user.username === username)) {
    return res.status(409).json({ message: 'Username or email already exists' });
  }

  const user = {
    id: `u${Date.now()}`,
    username,
    email,
    phone,
    passwordHash: await bcrypt.hash(password, 12),
    role: 'Client/User',
    department: null
  };

  users.push(user);

  const welcomeMessage = `Hi ${username},\n\nWelcome to **BeZierA Visuals!** 🎉\n\nWe're thrilled to have you join our creative community, where ideas are transformed into stunning visuals, powerful digital experiences, and innovative solutions.\n\n## Your Account is Ready\nYour BeZierA account has been successfully created, and you can now access your personalized dashboard to:\n\n- Submit your creative project ideas.\n- Track your project status in real time.\n- Communicate with our creative team.\n- Receive project updates and completed work.\n- Explore our premium portfolio.\n\n## Our Services\n\n- Graphic Designing\n- 3D Animation & Modeling\n- Full-Stack Development\n- Video Editing\n\n## Our Promise\n**"Your Vision. Our Creativity. Beyond Imagination."**\n\nEvery project is crafted with creativity, precision, and professionalism to bring your vision to life.\n\n## Need Help?\nWe're always here to assist you.\n\n**Contact Us**\n\n- 📞 Phone: 9443104878\n- 📧 Email: bezieravisual@gmail.com\n- 💬 WhatsApp: 9443104878\n- 📷 Instagram: beziera_visuals\n- 💼 LinkedIn: BeZierA Visuals\nThank you for choosing **BeZierA Visuals**.\n\nWe look forward to creating something extraordinary together.\n\nWarm regards,\n\n**The BeZierA Visuals Team**\n\n*Your Vision. Our Creativity. Beyond Imagination.*\n\n© 2026 BeZierA Visuals. All Rights Reserved.`;

  try {
    if (gmailPass && gmailPass !== 'your_google_app_password_here') {
      await mailTransport.sendMail({
        from: process.env.MAIL_FROM || 'BeZierA Visuals <bezieravisuals@gmail.com>',
        to: email,
        replyTo: 'bezieravisuals@gmail.com',
        subject: `Welcome to BeZierA Visuals, ${username}!`,
        text: welcomeMessage.replace(/\*\*/g, '').replace(/## /g, '').replace(/^- /gm, '').replace(/\n\n/g, '\n'),
        html: `<div style="font-family: Arial, sans-serif; line-height: 1.7; color: #111827;">
          <p>Hi <strong>${username}</strong>,</p>
          <p>Welcome to <strong>BeZierA Visuals!</strong> 🎉</p>
          <p>We're thrilled to have you join our creative community, where ideas are transformed into stunning visuals, powerful digital experiences, and innovative solutions.</p>
          <h3>Your Account is Ready</h3>
          <p>Your BeZierA account has been successfully created, and you can now access your personalized dashboard to:</p>
          <ul>
            <li>Submit your creative project ideas.</li>
            <li>Track your project status in real time.</li>
            <li>Communicate with our creative team.</li>
            <li>Receive project updates and completed work.</li>
            <li>Explore our premium portfolio.</li>
          </ul>
          <h3>Our Services</h3>
          <ul>
            <li>Graphic Designing</li>
            <li>3D Animation & Modeling</li>
            <li>Full-Stack Development</li>
            <li>Video Editing</li>
          </ul>
          <p><strong>"Your Vision. Our Creativity. Beyond Imagination."</strong></p>
          <p>Every project is crafted with creativity, precision, and professionalism to bring your vision to life.</p>
          <h3>Need Help?</h3>
          <p>We're always here to assist you.</p>
          <p><strong>Contact Us</strong></p>
          <ul>
            <li>📞 Phone: 9443104878</li>
            <li>📧 Email: bezieravisuals@gmail.com</li>
            <li>💬 WhatsApp: 9443104878</li>
            <li>📷 Instagram: beziera_visuals</li>
            <li>💼 LinkedIn: BeZierA Visuals</li>
          </ul>
          <p>Thank you for choosing <strong>BeZierA Visuals</strong>.</p>
          <p>We look forward to creating something extraordinary together.</p>
          <p>Warm regards,<br /><strong>The BeZierA Visuals Team</strong></p>
          <p><em>Your Vision. Our Creativity. Beyond Imagination.</em></p>
          <p>© 2026 BeZierA Visuals. All Rights Reserved.</p>
        </div>`
      });
    }
  } catch (error) {
    console.error('Signup welcome email failed:', error);
  }

  res.status(201).json({
    token: tokenFor(user),
    user: { ...user, passwordHash: undefined }
  });
});

app.post('/api/auth/login', async (req, res) => {
  const user = users.find(item => item.email === req.body.identifier || item.username === req.body.identifier);
  if (!user || !(await bcrypt.compare(req.body.password || '', user.passwordHash))) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  res.json({ token: tokenFor(user), user: { ...user, passwordHash: undefined } });
});

app.get('/api/me', auth, (req, res) => res.json(users.find(user => user.id === req.user.id)));

app.get('/api/projects', auth, (req, res) => {
  if (req.user.role === 'Main Admin') return res.json(projects);
  if (req.user.department && req.user.department !== 'All') {
    return res.json(projects.filter(project => project.department === req.user.department || project.clientId === req.user.id));
  }
  res.json(projects.filter(project => project.clientId === req.user.id));
});

app.post('/api/projects', auth, (req, res) => {
  const project = {
    id: `pr${Date.now()}`,
    clientId: req.user.id,
    department: req.body.department || 'Development',
    name: req.body.name || req.body.title,
    title: req.body.title || req.body.name,
    service: req.body.service,
    details: req.body.details,
    status: 'Submitted',
    progress: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  projects.push(project);
  res.status(201).json(project);
});

app.patch('/api/projects/:id', auth, role('Main Admin', 'Graphic Design Manager', '3D Manager', 'Development Manager', 'Video Editing Manager'), (req, res) => {
  const project = projects.find(item => item.id === req.params.id);
  if (!project) return res.sendStatus(404);
  if (req.body.progress !== undefined && (!Number.isInteger(Number(req.body.progress)) || Number(req.body.progress) < 0 || Number(req.body.progress) > 100)) {
    return res.status(400).json({ message: 'Progress must be a whole number from 0 to 100.' });
  }
  if (req.body.status !== undefined && !['Submitted', 'In Progress', 'Completed'].includes(req.body.status)) {
    return res.status(400).json({ message: 'Invalid project status.' });
  }
  Object.assign(project, req.body, { updatedAt: new Date().toISOString() });
  res.json(project);
});

app.delete('/api/projects/:id', auth, (req, res) => {
  const project = projects.find(item => item.id === req.params.id);
  if (!project) return res.sendStatus(404);

  const allowedRole = req.user.role === 'Main Admin' || req.user.department === project.department;
  if (!allowedRole || (req.user.role !== 'Main Admin' && project.status !== 'Completed')) {
    return res.status(403).json({ message: 'Only the admin can remove active projects. Managers can remove completed projects.' });
  }

  const index = projects.findIndex(item => item.id === req.params.id);
  projects.splice(index, 1);
  res.json({ message: 'Project deleted' });
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body || {};
  const payload = { name, email, message, createdAt: new Date().toISOString() };
  messages.push(payload);

  try {
    if (!gmailPass || gmailPass === 'your_google_app_password_here') {
      return res.status(500).json({ message: 'Gmail SMTP is not configured. Add a valid Google App Password to MAIL_PASS in .env.' });
    }

    const recipient = process.env.MAIL_TO || 'bezieravisuals@gmail.com';
    const mailFrom = process.env.MAIL_FROM || 'BeZierA Contact <bezieravisuals@gmail.com>';
    await mailTransport.sendMail({
      from: mailFrom,
      to: recipient,
      replyTo: email || recipient,
      subject: `New enquiry from ${name || 'Website visitor'}`,
      text: `Name: ${name || 'Not provided'}\nEmail: ${email || 'Not provided'}\n\nMessage:\n${message || ''}`,
      html: `<h3>New contact enquiry</h3><p><strong>Name:</strong> ${name || 'Not provided'}</p><p><strong>Email:</strong> ${email || 'Not provided'}</p><p><strong>Message:</strong></p><p>${(message || '').replace(/\n/g, '<br />')}</p>`
    });

    res.status(201).json({ message: 'Message received and sent to BeZierA.' });
  } catch (error) {
    console.error('Mail send failed:', error);
    res.status(500).json({ message: 'Email delivery failed. Check the Gmail App Password in .env.' });
  }
});

app.get('/api/admin/analytics', auth, role('Main Admin', 'Department Manager'), (_, res) =>
  res.json({
    totals: {
      users: users.length,
      projects: projects.length,
      active: projects.filter(p => p.status === 'In Progress').length,
      completed: projects.filter(p => p.status === 'Completed').length,
      pending: projects.filter(p => p.status === 'Submitted').length
    },
    monthly: [12, 18, 16, 24, 31, 27, 35, 42, 38, 49, 44, 56]
  })
);

app.listen(port, () => console.log(`BeZierA API running at http://localhost:${port}`));
