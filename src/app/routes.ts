import { createBrowserRouter, redirect } from "react-router";
import LandingPage from "./pages/LandingPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  { path: "*", loader: () => redirect("/") },
]);
