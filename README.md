<div align="center">

# ⏱️ ChronoFlow

**A high-performance, precision stopwatch with a sleek dark-themed UI.**

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

<br />

> **ChronoFlow** is built with a "Functionality First, Presentation Second" approach. It ensures true millisecond accuracy by eliminating JavaScript interval drift, all wrapped in a premium, responsive interface.

---

## 🚀 Live Preview

 ![ChronoFlow Preview](./src/assets/preview.png)
 ![ChronoFlow Preview](./src/assets/preview1.png)

---

## ✨ Core Features

* 🎯 **Precision Timing** — Utilizes `Date.now()` delta calculations to completely bypass native `setInterval` drift for 100% accurate millisecond tracking.
* ⛳ **Advanced Lap Tracking** — Seamlessly records absolute time alongside individual lap durations.
* 🚦 **Smart Highlighting** — Automatically calculates and color-codes the fastest (green) and slowest (red) laps in real-time.
* 💫 **Interactive UI Components** — Features a dynamic, glowing SVG progress ring that visually tracks the 60-second cycle.
* 📱 **Responsive Architecture** — Built with Tailwind CSS for a flawless layout that adapts perfectly from desktop (side-by-side) to mobile (stacked).

---

## 🛠️ Quick Start

Follow these steps to run ChronoFlow on your local machine.

### Prerequisites
* Node.js (v18 or higher)
* npm

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/HardikSoni1994/chronoflow.git
cd chronoflow
