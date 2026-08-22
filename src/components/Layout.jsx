import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="site-shell min-h-screen relative flex flex-col">
      <Navbar />
      <main className="relative z-10 flex-1 flex flex-col">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
