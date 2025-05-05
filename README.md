
# Spark and Prepper 📚✨  
*Shake Up Your Study Routine with AI-Powered Tools*
![image](https://github.com/user-attachments/assets/712924db-bdfb-44d9-8df7-b27efa93baa5)


## 🚀 About the Project

**Spark and Prepper** is an AI-powered web app designed to make studying more efficient and interactive. Upload your course materials — like lecture notes, syllabi, or slides — and let our system turn them into structured study guides, quizzes, flashcards, mock exams, and cheat sheets powered by Google's Gemini API.

Whether you're preparing for finals or just want to keep up with your coursework, Spark and Prepper helps you study smarter, not harder.



## ✨ Features

- 📄 Upload lecture notes, syllabi, and more
- 🤖 AI-generated **Study Guides**
- 📝 Auto-generated **Flashcards**
- 🎓 Practice with **Mock Exams**
- 💡 Create custom **Cheat Sheets**
- 💬 Chat with an AI Study Companion (Chatbot)
 ![studyguide](https://github.com/user-attachments/assets/5a9cd11c-c80a-4a5f-ba47-d3ef0ca486ce)

## 🛠️ Built With

- **Front-End:**  
  - [React](https://react.dev/)  
  - [Tailwind CSS](https://tailwindcss.com/)  
  - [Vite](https://vitejs.dev/)  
  - [React Router](https://reactrouter.com/)

- **Back-End:**  
  - [Node.js](https://nodejs.org/)  
  - [Express.js](https://expressjs.com/)  
  - [Firebase](https://firebase.google.com/) (Storage & Auth)

- **AI Integration:**  
  - [Gemini API](https://developers.google.com/)

## 🌐 Check Out More
-[Devpost](https://devpost.com/software/sparkandprepper)



## 📦 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed
- Firebase project & Gemini API key

### Installation

You'll need **two terminals**: one for the backend server and another for the frontend client.

---

#### 🖥️ Terminal 1: Backend Setup

```bash
# Clone the repository
git clone https://github.com/seifotefa/sparkandprepper.git
cd sparkandprepper

# Go into backend folder
cd backend

# Install dependencies
npm install

# Start the backend server
node server.js
```

---

#### 🖥️ Terminal 2: Frontend Setup

```bash
# Open a new terminal
cd sparkandprepper

# Go into frontend folder
cd sparkandpepper_frontend

# Install dependencies
npm install

# Run the frontend app
npm run dev
```

---

3. **Set up Firebase and API keys:**

Create a `.env` file and add:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
```

```firebaseKey.json
your firebaseKey in json format
```

4. **Run the app:**

```bash
npm run dev
```
in the frontend 

## 📚 How It Works

- Users upload their course materials.
- Backend (Node.js + Express) sends files to the **Gemini API**.
- Gemini processes and creates custom study guides, flashcards, and quizzes.
- Firebase stores uploaded files and user data.
- Frontend displays interactive tools to help users study.

## 🤝 Team

- **Seif Otefa** — Fullstack Developer, Project Lead, Connecting Back and Front End, Gemini API Integration
- **Youseph El-Khouly** — Backend Developer, Gemini API Integration, Firebase Integration  
- **Ahmed Aly** — Frontend Developer, UI/UX, Demo and Designs

## 📖 Challenges Faced

- Gemini API integration across multiple file types
- File upload handling with Firebase Storage
- Building smooth, responsive UI/UX
- Authentication (implemented as a functional demo)

## 🎯 What's Next

- Improve authentication with full Firebase Auth
- Support more file types (PPT, images)
- Enhance AI accuracy for study guide generation
- Mobile-friendly version

---


---

> “Shake up your study routine with **Spark and Prepper** — because smarter studying leads to bigger wins.” 🚀
