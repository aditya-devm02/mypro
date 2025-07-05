# Personal Finance Visualizer

<p align="center">
  <img src="public/globe.svg" alt="Personal Finance Visualizer" width="120" />
</p>

<p align="center">
  <b>Track your expenses, visualize your spending, and stay on budget with a beautiful, modern web app.</b>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#getting-started-local-development">Getting Started</a> •
  <a href="#deployment-render">Deployment</a> •
  <a href="#customization">Customization</a>
</p>

---

## 🚀 Live Demo

> **[🌐 View the Live App](https://mypro-ny93.onrender.com/)**  

---

## 📝 Project Overview

Personal Finance Visualizer is a full-stack, modern web application designed to help users:
- Effortlessly track daily expenses and categorize them
- Set and monitor monthly budgets
- Visualize spending patterns with interactive charts
- Stay motivated with a clean, aesthetic, and responsive UI

Built with a focus on user experience, performance, and scalability, this project demonstrates advanced React, Next.js, and MongoDB skills, as well as best practices in UI/UX and deployment.

---

## ✨ Features

- **Transaction Tracking:** Add, view, and categorize expenses with ease
- **Budget Management:** Set monthly budgets per category and monitor progress
- **Data Visualizations:**
  - Pie chart for category breakdown
  - Bar chart for budget vs. actuals
- **Responsive & Modern UI:**
  - Built with shadcn/ui, custom glassmorphism, and dark mode
  - Mobile-friendly and accessible
- **Indian Rupee Support:** All amounts use ₹ and Indian number formatting
- **Instant Feedback:** Animations, loading states, and error handling
- **Secure & Scalable:** Uses MongoDB Atlas for cloud data storage

---


---

## 🔒 Security & Best Practices

- **Never commit your MongoDB URI, passwords, or any secrets to GitHub.**
- Always keep your `.env`, `.env.local`, and any secret files out of version control.
- Your `.gitignore` should include:
  ```
  .env
  .env.local
  ```
- If you ever accidentally push secrets, change your MongoDB password immediately and update your environment variables on Render.

---

## 🏗️ Architecture
`

- **Next.js App Router** for full-stack React and API routes
- **MongoDB Atlas** for cloud database
- **Recharts** for interactive data visualizations
- **shadcn/ui** for beautiful, accessible UI components
- **Render** for seamless cloud deployment

---

## 🛠️ Tech Stack

![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232a?logo=react&logoColor=61dafb)
![MongoDB](https://img.shields.io/badge/MongoDB-4ea94b?logo=mongodb&logoColor=white)
![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-18181b?logo=react&logoColor=white)
![Recharts](https://img.shields.io/badge/Recharts-ff7300?logo=recharts&logoColor=white)
![Render](https://img.shields.io/badge/Render-46e3b7?logo=render&logoColor=white)

---

## 🧑‍💻 Getting Started (Local Development)

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or yarn install
   ```
3. **Set up environment variables:**
   - Create a `.env.local` file in the root:
     ```env
     MONGODB_URI=your-mongodb-connection-string
     ```
   - For local dev, you can use MongoDB Atlas or a local MongoDB instance.
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## 🚀 Deployment (Render)
1. **Push your code to GitHub.**
2. **Create a new Web Service on [Render](https://render.com/).**
3. **Set the environment variable:**
   - `MONGODB_URI` = your MongoDB Atlas connection string (must include `/finance` as the database name)
4. **Deploy!**

---

## 🔑 Environment Variables
- `MONGODB_URI` — MongoDB Atlas connection string, e.g.
  ```
  mongodb+srv://username:password@cluster.mongodb.net/finance?retryWrites=true&w=majority&appName=Cluster0
  ```

---

## 🎨 Customization
- **Edit categories:** `src/lib/models.ts`
- **UI components:** `src/components/ui/`
- **Main dashboard:** `src/app/page.tsx`
- **Budgets:** `src/app/budgets/page.tsx`
- **Transactions:** `src/app/transactions/page.tsx`

---

## 💡 Why This Project?

- **Demonstrates full-stack skills:** Next.js App Router, API routes, MongoDB, cloud deployment
- **Modern UI/UX:** Responsive, accessible, and visually appealing
- **Real-world value:** Solves a common problem with a delightful user experience
- **Production-ready:** Handles errors, loading states, and is easily extensible
- **Great for portfolios:** Showcases both technical and design skills

---
MIT
