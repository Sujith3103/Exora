import ReactDOM from "react-dom/client";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import './index.css'
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);


{ document.documentElement.style.setProperty('--primary', 'oklch(0.205 0 0)') }
{ document.documentElement.style.setProperty('--secondary', 'oklch(0.97 0 0)') }
