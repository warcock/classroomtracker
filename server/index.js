import  express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import rateLimit from 'express-rate-limit'
import { createServer } from 'http'
import { Server } from 'socket.io'
import cors from 'cors'
import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()
const server = createServer(app)
const io = new Server(server, {
  cors: { origin: "*" }
})

// Rate limiting disabled for development


app.use(morgan('combined'));

const allowedOrigins = [
  "https://classroomtracker.onrender.com", // your frontend Render URL
  "http://localhost:5173" // for local dev
];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(helmet());

app.use(express.json())

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'classroom-tracker-secret-key-2024'

// MongoDB Schemas
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nickname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['student', 'teacher', 'admin'], default: 'student' },
  avatar: { type: String, default: 'emoji:😀' },
  createdAt: { type: Date, default: Date.now }
})

const taskSchema = new mongoose.Schema({
  classroomId: String,
  name: String,
  description: String,
  subject: String,
  dateAssigned: Date,
  dueDate: Date,
  completed: { type: Boolean, default: false },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
})

const messageSchema = new mongoose.Schema({
  classroomId: String,
  author: String,
  content: String,
  timestamp: { type: Date, default: Date.now }
})

const classroomSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now }
})

const User = mongoose.model('User', userSchema)
const Task = mongoose.model('Task', taskSchema)
const Message = mongoose.model('Message', messageSchema)
const Classroom = mongoose.model('Classroom', classroomSchema)

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).json({ error: 'Access token required' })
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token' })
    }
    req.user = user
    next()
  })
}

// Authentication Routes
// Avataaars options and generator for backend
const avataaarsOptions = {
  topType: [
    'NoHair', 'ShortHairShortFlat', 'ShortHairShortRound', 'ShortHairDreads01', 'LongHairStraight', 'LongHairCurly', 'Hat', 'Hijab', 'Turban', 'WinterHat2', 'Eyepatch', 'LongHairBigHair', 'LongHairBun', 'LongHairCurvy', 'LongHairFro', 'LongHairFroBand', 'LongHairNotTooLong', 'LongHairShavedSides', 'LongHairMiaWallace', 'LongHairStraight2', 'LongHairStraightStrand', 'ShortHairDreads02', 'ShortHairFrizzle', 'ShortHairShaggy', 'ShortHairShaggyMullet', 'ShortHairSides', 'ShortHairTheCaesar', 'ShortHairTheCaesarSidePart'
  ],
  accessoriesType: [
    'Blank', 'Kurt', 'Prescription01', 'Prescription02', 'Round', 'Sunglasses', 'Wayfarers'
  ],
  hairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'PastelPink', 'Platinum', 'Red', 'SilverGray'
  ],
  facialHairType: [
    'Blank', 'BeardMedium', 'BeardLight', 'BeardMajestic', 'MoustacheFancy', 'MoustacheMagnum'
  ],
  facialHairColor: [
    'Auburn', 'Black', 'Blonde', 'BlondeGolden', 'Brown', 'BrownDark', 'Platinum', 'Red'
  ],
  clotheType: [
    'BlazerShirt', 'BlazerSweater', 'CollarSweater', 'GraphicShirt', 'Hoodie', 'Overall', 'ShirtCrewNeck', 'ShirtScoopNeck', 'ShirtVNeck'
  ],
  clotheColor: [
    'Black', 'Blue01', 'Blue02', 'Blue03', 'Gray01', 'Gray02', 'Heather', 'PastelBlue', 'PastelGreen', 'PastelOrange', 'PastelRed', 'PastelYellow', 'Pink', 'Red', 'White'
  ],
  eyeType: [
    'Close', 'Cry', 'Default', 'Dizzy', 'EyeRoll', 'Happy', 'Hearts', 'Side', 'Squint', 'Surprised', 'Wink', 'WinkWacky'
  ],
  eyebrowType: [
    'Angry', 'AngryNatural', 'Default', 'DefaultNatural', 'FlatNatural', 'RaisedExcited', 'RaisedExcitedNatural', 'SadConcerned', 'SadConcernedNatural', 'UnibrowNatural', 'UpDown', 'UpDownNatural'
  ],
  mouthType: [
    'Concerned', 'Default', 'Disbelief', 'Eating', 'Grimace', 'Sad', 'ScreamOpen', 'Serious', 'Smile', 'Tongue', 'Twinkle', 'Vomit'
  ],
  skinColor: [
    'Tanned', 'Yellow', 'Pale', 'Light', 'Brown', 'DarkBrown', 'Black'
  ]
};
function getRandomAvatarConfig() {
  const config = {};
  for (const key in avataaarsOptions) {
    const opts = avataaarsOptions[key];
    config[key] = opts[Math.floor(Math.random() * opts.length)];
  }
  return config;
}

import { body, validationResult } from 'express-validator'

// Assign admin role to aiwaris9484@gmail.com on registration
app.post('/api/auth/register',
  [
    body('name').isString().isLength({ min: 2 }),
    body('nickname').isString().isLength({ min: 2 }),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('role').optional().isIn(['student', 'teacher'])
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { name, nickname, email, password, role } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Generate avatar config
    const avatar = JSON.stringify(getRandomAvatarConfig())

    // Assign admin role if email matches
    let assignedRole = role;
    if (email === 'aiwaris9484@gmail.com') {
      assignedRole = 'admin';
    }
    // Create new user
    const user = new User({
      name,
      nickname,
      email,
      password: hashedPassword,
      role: assignedRole,
      avatar
    })
// Middleware to check admin role
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};

// Analytics endpoint for admin
app.get('/api/admin/analytics', async (req, res) => {
  try {
    const userCount = await User.countDocuments();
    const classroomCount = await Classroom.countDocuments();
    const taskCount = await Task.countDocuments();
    const messageCount = await Message.countDocuments();
    // Add more analytics as needed
    res.json({
      users: userCount,
      classrooms: classroomCount,
      tasks: taskCount,
      messages: messageCount
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

    await user.save()

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role,
        avatar: user.avatar
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.post('/api/auth/login',
  [
    body('email').isEmail(),
    body('password').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  try {
    const { email, password } = req.body

    // Find user by email
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Invalid email or password' })
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        nickname: user.nickname,
        email: user.email,
        role: user.role
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Protected route to get user profile
app.get('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select('-password')
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Protected route to update user profile
app.put('/api/auth/profile', authenticateToken, async (req, res) => {
  try {
    const { name, nickname, avatar } = req.body
    const updateFields = { name, nickname }
    if (avatar) updateFields.avatar = avatar
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      updateFields,
      { new: true, runValidators: true, select: '-password' }
    )
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user email
app.put('/api/auth/email', authenticateToken, async (req, res) => {
  try {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email is required' })
    // Check if email is already taken
    const existing = await User.findOne({ email })
    if (existing && existing._id.toString() !== req.user.userId) {
      return res.status(400).json({ error: 'Email already in use' })
    }
    const user = await User.findByIdAndUpdate(
      req.user.userId,
      { email },
      { new: true, runValidators: true, select: '-password' }
    )
    if (!user) return res.status(404).json({ error: 'User not found' })
    res.json(user)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update user password
app.put('/api/auth/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body
    if (!currentPassword || !newPassword) return res.status(400).json({ error: 'Both current and new password are required' })
    const user = await User.findById(req.user.userId)
    if (!user) return res.status(404).json({ error: 'User not found' })
    const isValid = await bcrypt.compare(currentPassword, user.password)
    if (!isValid) return res.status(400).json({ error: 'Current password is incorrect' })
    user.password = await bcrypt.hash(newPassword, 10)
    await user.save()
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Routes
app.post('/api/classrooms', authenticateToken, async (req, res) => {
  try {
    const { code, name, password } = req.body
    
    // Check if classroom code already exists
    const existingClassroom = await Classroom.findOne({ code })
    if (existingClassroom) {
      return res.status(400).json({ error: 'Classroom code already exists' })
    }

    const classroom = new Classroom({
      code,
      name,
      password,
      createdBy: req.user.userId,
      members: [req.user.userId] // Creator is automatically a member
    })
    await classroom.save()
    res.json(classroom)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user's classrooms (both created and joined)
app.get('/api/classrooms', authenticateToken, async (req, res) => {
  try {
    const query = {
      $or: [
        { createdBy: req.user.userId },
        { members: req.user.userId }
      ]
    }
    console.log('Classroom fetch query:', query)
    const classrooms = await Classroom.find(query).populate('createdBy', 'name nickname')
    console.log('Classrooms returned:', classrooms)
    res.json(classrooms)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Join classroom
app.post('/api/classrooms/join', authenticateToken, async (req, res) => {
  try {
    const { code, password } = req.body
    
    const classroom = await Classroom.findOne({ code })
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' })
    }
    
    if (classroom.password !== password) {
      return res.status(400).json({ error: 'Incorrect password' })
    }
    
    // Check if user is already a member
    if (classroom.members.includes(req.user.userId)) {
      return res.status(400).json({ error: 'Already a member of this classroom' })
    }
    
    classroom.members.push(req.user.userId)
    await classroom.save()
    
    res.json(classroom)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Leave classroom
app.post('/api/classrooms/:code/leave', authenticateToken, async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ code: req.params.code })
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' })
    }
    
    // Check if user is a member
    if (!classroom.members.includes(req.user.userId)) {
      return res.status(400).json({ error: 'Not a member of this classroom' })
    }
    
    // Check if user is the creator
    if (classroom.createdBy.toString() === req.user.userId) {
      return res.status(400).json({ error: 'Creator cannot leave classroom. Delete it instead.' })
    }
    
    // Remove user from members
    classroom.members = classroom.members.filter(memberId => memberId.toString() !== req.user.userId)
    await classroom.save()
    
    res.json({ success: true, message: 'Successfully left classroom' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete classroom (creator only)
app.delete('/api/classrooms/:code', authenticateToken, async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ code: req.params.code })
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' })
    }
    
    // Check if user is the creator
    if (classroom.createdBy.toString() !== req.user.userId) {
      return res.status(403).json({ error: 'Only the creator can delete this classroom' })
    }
    
    // Delete all tasks and messages associated with this classroom
    await Task.deleteMany({ classroomId: req.params.code })
    await Message.deleteMany({ classroomId: req.params.code })
    
    // Delete the classroom
    await Classroom.findByIdAndDelete(classroom._id)
    
    res.json({ success: true, message: 'Classroom deleted successfully' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get tasks for a classroom (populate creator)
app.get('/api/classrooms/:code/tasks', authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ classroomId: req.params.code }).populate('createdBy', 'name nickname email')
    res.json(tasks)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create a task (set creator)
app.post('/api/classrooms/:code/tasks', authenticateToken, async (req, res) => {
  try {
    const task = new Task({
      classroomId: req.params.code,
      ...req.body,
      createdBy: req.user.userId
    })
    await task.save()
    await task.populate('createdBy', 'name nickname email')
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Delete a task
app.delete('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ error: 'Task not found' })
    // Only allow creator or teacher to delete
    if (task.createdBy.toString() !== req.user.userId && req.user.role !== 'teacher') {
      return res.status(403).json({ error: 'Not authorized to delete this task' })
    }
    await Task.findByIdAndDelete(req.params.id)
    res.json({ success: true })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Update a task (toggle completion or other fields)
app.put('/api/tasks/:id', authenticateToken, async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('createdBy', 'name nickname email')
    if (!task) return res.status(404).json({ error: 'Task not found' })
    res.json(task)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get classroom by code
app.get('/api/classrooms/:code', async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ code: req.params.code })
    if (!classroom) {
      return res.status(404).json({ error: 'Classroom not found' })
    }
    res.json(classroom)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get classroom members
app.get('/api/classrooms/:code/members', authenticateToken, async (req, res) => {
  try {
    const classroom = await Classroom.findOne({ code: req.params.code }).populate('members', 'name nickname email role avatar')
    if (!classroom) return res.status(404).json({ error: 'Classroom not found' })
    res.json(classroom.members)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

app.get('/api/classrooms/:code/messages', authenticateToken, async (req, res) => {
  try {
    const messages = await Message.find({ classroomId: req.params.code }).sort({ timestamp: 1 })
    res.json(messages)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Socket.io for real-time chat
io.on('connection', (socket) => {
  socket.on('join-classroom', (classroomId) => {
    socket.join(classroomId)
  })

  socket.on('send-message', async (data) => {
    try {
      const message = new Message({
        classroomId: data.classroomId,
        author: data.author,
        content: data.content
      })
      await message.save()
      io.to(data.classroomId).emit('new-message', message)
    } catch (error) {
      console.error('Error saving message:', error)
    }
  })
})

// Custom error handler middleware - must be last
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler for unmatched routes
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

const PORT = process.env.PORT || 3001

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://hello:helloskibidimark123@cluster0.tzi8u.mongodb.net/myDatabase?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to MongoDB Atlas')
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error)
  })
 