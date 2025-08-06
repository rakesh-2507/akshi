const express = require('express');
const cors = require('cors');
require('dotenv').config();
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Route imports
const authRoutes = require('./routes/authRoutes');
const otpRoutes = require('./routes/otpRoutes');
const visitorRoutes = require('./routes/visitorRoutes');
const chatRoutes = require('./routes/chatRoutes');
const adminRoutes = require('./routes/adminRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const activityRoutes = require('./routes/activityRoutes');
const apartmentRoutes = require('./routes/apartmentRoutes');
const warrantyRoutes = require('./routes/warrantyRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use('/uploads/gallery', express.static(path.join(__dirname, 'uploads/gallery')));
app.use('/uploads', express.static('uploads'));


// Route mounting
app.use('/api/auth', authRoutes);
app.use('/api/auth', otpRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/visitors', visitorRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/announcements', announcementRoutes);
app.use('/api', bookingRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/apartments', apartmentRoutes);
app.use('/api/warranty', warrantyRoutes);
app.use('/api/gallery-events', galleryRoutes); 
app.use('/api/marketplace', require('./routes/marketplaceRoutes'));
app.use('/api/profile', profileRoutes);

// Root check
app.get('/', (req, res) => {
  res.send('🏡 Apartment App Backend is running!');
});

// Start server

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});