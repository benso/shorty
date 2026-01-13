# The 1-Day Life Reset Protocol

**Transform your life one day at a time. Break the identity loop. Turn your life into a game you can win.**

A revolutionary personal development application based on the Life Reset Protocol framework, combining journaling, goal-setting, and gamification with AI-powered insights.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.10+-blue.svg)
![React](https://img.shields.io/badge/react-18.2+-blue.svg)
![FastAPI](https://img.shields.io/badge/FastAPI-0.109+-green.svg)

## 🎯 What is the Life Reset Protocol?

The Life Reset Protocol is a structured system for personal transformation that helps you:

- **Define Your Vision & Anti-Vision**: Understand what you're moving toward AND what you're moving away from
- **Break Autopilot Mode**: Use random reminders with self-inquiry questions to stay conscious
- **Gamify Your Life**: Turn goals into missions, projects into boss fights, and daily tasks into quests
- **Track Progress**: Monitor your journey through the 3 phases of change: Dissonance, Uncertainty, and Discovery

## ✨ Features

### 📝 Morning & Evening Journaling
- **Morning**: Define your Vision (life you want) and Anti-Vision (life you fear)
- **Evening**: Reflect on wins, challenges, lessons learned, and plan tomorrow

### 🎮 Gamification System
- **Vision**: How you win
- **Anti-Vision**: What's at stake if you lose
- **1-Year Goals**: The mission
- **1-Month Projects**: The boss fight
- **Daily Levers**: The quests
- **Constraints**: The rules

### 🔔 Self-Inquiry Reminders
- Generate AI-powered questions to break autopilot mode
- Random reminders throughout the day
- Track your responses and insights

### 🤖 AI-Powered Insights
- GPT-4 integration for personalized coaching
- Vision alignment analysis
- Daily lever suggestions
- Reflection insights

### 📊 Progress Tracking
- Dashboard with key metrics
- Goal and project tracking
- Daily completion statistics
- Identity loop phase tracking

## 🏗️ Technology Stack

### Backend
- **FastAPI**: Modern, fast Python web framework
- **SQLAlchemy**: Async ORM with SQLite database
- **OpenAI GPT-4**: AI-powered insights and coaching
- **Pydantic**: Data validation and settings management
- **Python-JOSE**: JWT token authentication
- **Passlib**: Password hashing with bcrypt

### Frontend
- **React 18**: Modern UI library
- **Vite**: Next-generation frontend tooling
- **Tailwind CSS**: Utility-first CSS framework
- **Framer Motion**: Animations and transitions
- **Zustand**: Lightweight state management
- **Axios**: HTTP client
- **React Router**: Client-side routing
- **Lucide React**: Beautiful icon library

## 🚀 Quick Start

### Prerequisites
- Python 3.10 or higher
- Node.js 18 or higher
- npm or yarn

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd shorty
```

2. **Set up the backend**
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env and add your configuration:
# - SECRET_KEY (generate a secure key)
# - OPENAI_API_KEY (optional, for AI features)
```

3. **Set up the frontend**
```bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
```

### Running the Application

1. **Start the backend**
```bash
cd backend
python run.py
```
Backend will run on http://localhost:8000

2. **Start the frontend** (in a new terminal)
```bash
cd frontend
npm run dev
```
Frontend will run on http://localhost:3000

3. **Open your browser**
Navigate to http://localhost:3000

## 📖 Usage Guide

### First-Time Setup

1. **Register an account** at `/register`
2. **Sign in** at `/login`
3. **Complete your first morning journal**:
   - Define your Vision (the life you want)
   - Define your Anti-Vision (what you're moving away from)

### Daily Routine

**Morning** (5-10 minutes):
1. Journal your Vision and Anti-Vision
2. Be brutal and honest
3. Set your intentions for the day

**Throughout the Day**:
1. Use self-inquiry reminders to stay conscious
2. Check off Daily Levers as you complete them
3. Stay aligned with your vision

**Evening** (10-15 minutes):
1. Reflect on wins and challenges
2. Note lessons learned
3. Name your enemy (what held you back)
4. Plan tomorrow's focus

### Setting Up Your Game

1. **Define Your Vision**: What does winning look like?
2. **Define Your Anti-Vision**: What are you afraid of becoming?
3. **Set 1-Year Goals**: Your mission (1-3 big goals)
4. **Create 1-Month Projects**: Boss fights (focused monthly sprints)
5. **Define Daily Levers**: Quests (daily actions that compound)
6. **Set Constraints**: Rules you'll follow

## 🗂️ Project Structure

```
shorty/
├── backend/
│   ├── app/
│   │   ├── api/           # API routes
│   │   │   ├── auth.py    # Authentication
│   │   │   ├── journal.py # Journaling
│   │   │   ├── goals.py   # Goals & gamification
│   │   │   └── reminders.py # Reminders & reflections
│   │   ├── core/          # Core utilities
│   │   │   ├── config.py  # Configuration
│   │   │   ├── database.py # Database setup
│   │   │   └── security.py # Security utilities
│   │   ├── models/        # Database models
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic
│   │   │   ├── auth_service.py
│   │   │   └── ai_service.py
│   │   └── main.py        # FastAPI app
│   ├── requirements.txt
│   ├── run.py
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks & stores
│   │   ├── utils/         # Utilities
│   │   ├── styles/        # Global styles
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # Entry point
│   ├── package.json
│   ├── vite.config.js
│   └── .env.example
└── README.md
```

## 🔑 API Documentation

Once the backend is running, visit:
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative Docs**: http://localhost:8000/redoc

### Main Endpoints

#### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login and get token
- `GET /auth/me` - Get current user

#### Journal
- `POST /journal/` - Create journal entry
- `GET /journal/` - Get all entries
- `GET /journal/latest` - Get latest entry
- `PUT /journal/{id}` - Update entry
- `DELETE /journal/{id}` - Delete entry

#### Goals & Gamification
- `POST /goals/` - Create goal
- `GET /goals/` - Get all goals
- `POST /goals/projects/` - Create project
- `POST /goals/daily-levers/` - Create daily lever
- `POST /goals/daily-levers/{id}/complete` - Complete lever

#### Reminders
- `GET /reminders/generate` - Generate AI questions
- `POST /reminders/reflections/` - Create reflection
- `POST /reminders/insights/alignment` - Get vision alignment insights
- `POST /reminders/insights/levers` - Get lever suggestions

## 🎨 Key Concepts

### The Identity Loop
```
Goal → Perception → Learning → Action → Conditioning → Identity → Defense → New Goals
```

When identity feels threatened, you go into fight/flight. **You must break the loop.**

### The 3 Phases of Change

1. **Dissonance**: Feel like you don't belong. Get fed up.
2. **Uncertainty**: Don't know what's next. Experiment.
3. **Discovery**: Find your path. 6 years of progress in 6 months.

### Intelligence Defined
```
Agency × Opportunity × Intelligence
```

Intelligence = ability to iterate, persist, and see the big picture.
**Act → Sense → Compare → Act again**

## 🤖 AI Features

The app includes optional AI features powered by OpenAI GPT-4:

- **Self-Inquiry Questions**: Generate thought-provoking questions
- **Vision Alignment**: Analyze if your actions align with your vision
- **Daily Lever Suggestions**: Get personalized action recommendations
- **Reflection Insights**: Receive coaching based on your daily reflections

To enable AI features, add your OpenAI API key to the backend `.env` file:
```
OPENAI_API_KEY=sk-...
```

## 🔐 Security

- JWT-based authentication
- Bcrypt password hashing
- HTTP-only security practices
- CORS protection
- SQLAlchemy async queries to prevent SQL injection

## 🤝 Contributing

This is the best app launched in 2026! Contributions welcome:

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the 1-Day Life Reset Protocol framework
- Built with modern web technologies
- Powered by OpenAI GPT-4

## 💡 Philosophy

> "If you want a specific outcome in life, you must have the lifestyle that creates that outcome long before you reach it."

Real change = changing your **goals**, not just your actions.
All behavior is goal-oriented—even procrastination serves a purpose.

Break the identity loop. Turn life into a game. Win every day.

---

**Made with ❤️ for personal transformation in 2026**
