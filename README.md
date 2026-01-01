# 🎯 2026 New Year Resolutions Tracker

A full-stack web application to track your goals, resolutions, and daily habits for 2026.
<img width="1850" height="968" alt="image" src="https://github.com/user-attachments/assets/8f8c1b2c-cbbe-467d-a2d6-364958c5f7fa" />


![React](https://img.shields.io/badge/React-18.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-18.0-green)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)

## ✨ Features

- 📊 **Dashboard**: Track total resolutions, completion rate, and progress
- 🎯 **Resolutions**: Create goals with tasks, categories, and deadlines
- 📅 **Daily Habits**: Track daily habits with streaks and history
- 📈 **Progress Tracking**: Visual progress bars and statistics
- 🏷️ **Categories**: Organize by Health, Career, Personal Growth, etc.
- 🔥 **Streak Tracking**: Monitor consecutive days for daily habits
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Tailwind CSS
- Lucide Icons

**Backend:**
- Node.js
- Express
- MongoDB
- Mongoose

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [MongoDB](https://www.mongodb.com/try/download/community) (v6.0 or higher)
- npm (comes with Node.js)

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/e-hady/resolutions-tracker.git
cd resolutions-tracker
```

### 2. Install MongoDB

**Ubuntu/Debian:**
```bash
# Import MongoDB public key
wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -

# Add MongoDB repository
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB
sudo systemctl start mongod

# Enable MongoDB to start on boot
sudo systemctl enable mongod

# Verify MongoDB is running
sudo systemctl status mongod
```

**macOS:**
```bash
brew tap mongodb/brew
brew install mongodb-community@6.0
brew services start mongodb-community@6.0
```

**Windows:**
Download and install from [MongoDB Download Center](https://www.mongodb.com/try/download/community)

### 3. Setup Backend

```bash
cd dev
npm install
```

Create `.env` file in the `dev` folder:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/resolutions-tracker
```

Start the backend:
```bash
npm run dev
```

You should see:
```
✅ Connected to MongoDB
🚀 Server running on http://localhost:5000
```

### 4. Setup Frontend

Open a new terminal:

```bash
cd app
npm install
```

Start the frontend:
```bash
npm start
```

The app will open at `http://localhost:3000`

## 📁 Project Structure

```
resolutions-tracker/
├── app/                    # React Frontend
│   ├── public/
│   ├── src/
│   │   ├── App.js         # Main component
│   │   ├── api.js         # API calls
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
├── dev/                    # Node.js Backend
│   ├── server.js          # Express server
│   ├── .env               # Environment variables
│   └── package.json
│
└── README.md
```

## 🔧 Configuration

### Backend Configuration

Edit `dev/.env`:
```env
PORT=5000                                          # Backend port
MONGODB_URI=mongodb://localhost:27017/resolutions-tracker
```

### Frontend Configuration

If your backend runs on a different port, edit `app/src/api.js`:
```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## 📖 API Endpoints

### Resolutions
- `GET /api/resolutions` - Get all resolutions
- `POST /api/resolutions` - Create a new resolution
- `PUT /api/resolutions/:id` - Update a resolution
- `DELETE /api/resolutions/:id` - Delete a resolution

### Daily Habits
- `GET /api/daily-habits` - Get all daily habits
- `POST /api/daily-habits` - Create a new daily habit
- `PUT /api/daily-habits/:id` - Update a daily habit
- `DELETE /api/daily-habits/:id` - Delete a daily habit
- `POST /api/daily-habits/reset` - Reset all habits for new day

### Health Check
- `GET /api/health` - Check if server is running

## 🎨 Usage

### Creating a Resolution
1. Click "Add New Resolution"
2. Fill in title, description, and deadline
3. Add tasks (optional)
4. Select category
5. Click "Create Resolution"

### Creating a Daily Habit
1. Click "Add Daily Habit"
2. Fill in title and description
3. Select category and deadline (optional)
4. Click "Create Habit"
5. Check off the habit daily to track streaks

### Tracking Progress
- Check off tasks to update resolution progress
- Mark daily habits as complete each day
- View detailed stats by clicking the chart icon on habits
- Filter by category using the filter buttons

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Check if MongoDB is running
sudo systemctl status mongod

# Start MongoDB if not running
sudo systemctl start mongod
```

### Port Already in Use
```bash
# Kill process on port 5000
sudo lsof -t -i:5000 | xargs kill -9

# Or change PORT in dev/.env
```

### Frontend Build Errors
```bash
cd app
rm -rf node_modules package-lock.json
npm install
npm start
```

## 🚢 Deployment

### Backend Deployment (Heroku Example)

```bash
cd dev
heroku create your-app-name
heroku addons:create mongolab
git push heroku main
```

### Frontend Deployment (Vercel Example)

```bash
cd app
npm run build
vercel deploy
```

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request




## 🙏 Acknowledgments

- Icons by [Lucide](https://lucide.dev/)
- UI styling with [Tailwind CSS](https://tailwindcss.com/)
- Built with [React](https://react.dev/) and [Express](https://expressjs.com/)



⭐ If you like this project, please give it a star on GitHub!
