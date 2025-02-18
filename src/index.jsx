import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// テーマ
const theme = new URLSearchParams(window.location.search).get("theme");
const isDark = theme === "dark";
document.documentElement.style.colorScheme = isDark ? "dark" : "light";
const head = document.getElementsByTagName("head")[0];
const link = document.createElement("link");
link.rel = "stylesheet";
link.href = isDark ? "/n/antd.dark.min.css" : "/n/antd.min.css";
head.appendChild(link);

link.onload = () => {
  const root = ReactDOM.createRoot(document.getElementById('app'));
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};
