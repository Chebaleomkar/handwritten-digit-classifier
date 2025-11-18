# 🎨 Frontend - Handwritten Digit Classifier

A modern, responsive web interface built with **Next.js** and **React** that allows users to draw digits and receive real-time AI predictions.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **UI Library**: [React](https://react.dev/)
- **Styling**: [TailwindCSS](https://tailwindcss.com/) (Glassmorphism design)
- **Graphics**: HTML5 Canvas API
- **State Management**: React Hooks (`useState`, `useRef`, `useEffect`)

## 🧠 Core Logic & Flow

The frontend operates on a simple but efficient event-driven architecture:

1.  **Capture**: The `<canvas>` element tracks mouse/touch movements to render strokes in real-time.
2.  **Process**: When "Predict" is clicked, the canvas content is converted to a Base64 PNG string using `canvas.toDataURL()`.
3.  **Interact**: This string is sent via a `POST` request to the FastAPI backend.
4.  **Display**: The asynchronous response (prediction class & confidence score) is rendered with a smooth animation.

## 🚀 Key Features

- **Dual Input Support**: Works seamlessly with both Mouse (Desktop) and Touch (Mobile/Tablet).
- **Dynamic Model Switching**: Users can toggle between CNN and MLP backends instantly.
- **Accessibility (A11y)**: Fully accessible with ARIA labels and keyboard navigation support.
- **Responsive Layout**: Adaptive design that scales from mobile screens to large desktop monitors.

## 📦 Setup & Run

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.
