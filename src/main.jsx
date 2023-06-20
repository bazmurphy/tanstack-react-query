import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

// we import these
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// these are useful devtools that we can use to watch the internal workings via the browser
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

// we create a new QueryClient to pass into the QueryClientProvider
// you could have multiple of these at different levels of your application
const queryClient = new QueryClient();

// we wrap the application in the QueryClientProvider
// you could have multiple of these wrapping different parts of your application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools />
    </QueryClientProvider>
  </React.StrictMode>
);
