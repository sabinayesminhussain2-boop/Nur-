import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";
import CartDrawer from "./CartDrawer";
import SearchOverlay from "./SearchOverlay";
import AssistantDrawer from "./AssistantDrawer";
import Toasts from "./Toasts";
import { useScrollTop } from "../hooks/useScrollTop";

export default function Layout() {
  useScrollTop();
  return (
    <div className="flex min-h-screen flex-col bg-ink">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <AssistantDrawer />
      <Toasts />
    </div>
  );
}
