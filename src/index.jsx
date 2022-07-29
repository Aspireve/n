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
link.href = isDark ? "/antd.dark.min.css" : "/antd.min.css";
head.appendChild(link);

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
