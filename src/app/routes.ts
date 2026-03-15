import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import Home from "./pages/Home";
import { Features } from "./pages/Features";
import { Docs } from "./pages/Docs";
import { Tutorials } from "./pages/Tutorials";
import { Store } from "./pages/Store";
import { ProductDetail } from "./pages/ProductDetail";
import { Brand } from "./pages/Brand";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "features", Component: Features },
      { path: "docs", Component: Docs },
      { path: "tutorials", Component: Tutorials },
      { path: "store", Component: Store },
      { path: "store/:handle", Component: ProductDetail },
      { path: "brand", Component: Brand },
      { path: "*", Component: NotFound },
    ],
  },
]);