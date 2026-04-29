<div align="center">
  <img src="https://img.shields.io/badge/Status-Under%20Development-orange?style=for-the-badge" alt="Status" />
  <h1>🎵 VIBIE — Join the Vibe</h1>
  <p><i>A premium, high-quality Telegram Mini Music App inspired by Spotify & YouTube Music.</i></p>

  <a href="https://t.me/vibie_bot/vibiebot"><strong>👉 Try the App on Telegram</strong></a>
  <br />
  <br />

  ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
  ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
  ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
  ![Telegram](https://img.shields.io/badge/Telegram_Mini_App-%232CA5E0.svg?style=for-the-badge&logo=telegram&logoColor=white)
  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
</div>

<hr />

## 🌟 Overview

**VIBIE** is a stylish, modern web application designed to run seamlessly as a Telegram Mini App. It offers a sleek, music-focused user experience with real-time "music rooms," beautiful animations, and a rich, interactive interface reminiscent of top-tier streaming platforms. 

Whether you want to vibe alone or see who else is in the room, Vibie delivers a smooth, native-like experience directly within Telegram.

## ✨ Key Features

- **Beautiful Landing Screen:** Captivating VIBIE branding combined with fluid entry animations.
- **Join the Vibe:** One-tap entry into dynamic music rooms.
- **Live Playback Interface:** Complete with song thumbnails, playback controls, and a dynamic interactive queue.
- **Real-Time Vibers:** Interactive "Total Vibers" popup to see who else is currently listening.
- **Siri-Style Animations:** Engaging visual feedback, featuring sleek voice/audio wave animations.
- **Premium UI/UX:** Dark/Light theme support, top-tier typography, glassmorphism effects, and smooth `framer-motion` transitions.
- **Native Navigation:** Stylish, iPhone-like bottom navigation bar tailored for mobile.

## 🛠️ Tech Stack

- **Framework:** [React 18](https://react.dev/) & [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Telegram SDK:** `@telegram-apps/sdk` for deep Telegram integration
- **Backend/State:** [Firebase](https://firebase.google.com/) (Auth/Database)
- **Drag & Drop:** `@dnd-kit`

## 🚀 Quick Start

Follow these steps to set up the project locally.

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm` or `yarn`

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/Vibie-front.git
   cd Vibie-front
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Environment Setup:**
   Create a `.env` file in the root directory and add your required environment variables (e.g., Firebase config).

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Build for production:**
   ```bash
   npm run build
   ```

## 📁 Project Structure

```text
src/
├── components/   # Reusable UI components (buttons, players, modals)
├── context/      # React Context providers (auth, theme, player state)
├── hooks/        # Custom React hooks
├── layouts/      # Page layout wrappers (e.g., Main Layout, Bottom Nav)
├── pages/        # Route components (Home, Room, Settings)
├── styles/       # Global CSS and Tailwind directives
├── utils/        # Helper functions and constants
├── firebase.js   # Firebase initialization and config
├── App.jsx       # Root application component
└── main.jsx      # Application entry point
```

## 🔗 Live Demo
Check out the live bot on Telegram:
[**@vibie_bot**](https://t.me/vibie_bot/vibiebot)

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📄 License
This project is open-source and available under the [MIT License](LICENSE).
