import { useState } from "react";
import "./app.css"; // replaced by each UI framework

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="ai-root">
      {/* Header */}
      <header className="ai-header">
        <img src="/appinit.svg" className="ai-logo" alt="AppInit Logo" />

        <h1 className="ai-title">AppInit + React</h1>
        <p className="ai-subtitle">Start building with the AppInit OS.</p>
      </header>

      {/* Card */}
      <div className="ai-card">
        <button className="ai-button" onClick={() => setCount((c) => c + 1)}>
          Count: {count}
        </button>

        <p className="ai-tip">
          Edit <code>src/App.tsx</code> and save to test HMR.
        </p>
      </div>

      {/* Footer */}
      <footer className="ai-footer">
        <a href="https://appinit.dev/docs" target="_blank">
          AppInit Documentation →
        </a>
      </footer>
    </div>
  );
}
