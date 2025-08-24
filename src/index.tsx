import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import PhysioClinic from './component'

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(<React.StrictMode><PhysioClinic /></React.StrictMode>);
