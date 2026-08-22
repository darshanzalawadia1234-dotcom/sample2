import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TripProvider } from "@/context/TripContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import PlanTrip from "@/pages/PlanTrip";
import MyTrips from "@/pages/MyTrips";
import Explore from "@/pages/Explore";
import ItineraryBuilder from "@/pages/ItineraryBuilder";
import ItineraryView from "@/pages/ItineraryView";
import BudgetPage from "@/pages/BudgetPage";
import SharedTrip from "@/pages/SharedTrip";
import Profile from "@/pages/Profile";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import { useTrips } from "@/context/TripContext";

function RequireAuth({ children }) {
  const { authUser, authLoading } = useTrips();

  if (authLoading) {
    return <div className="min-h-screen grid place-items-center bg-[var(--warm-paper)] text-[var(--runway-navy)]">Loading your travel desk...</div>;
  }

  return authUser ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <div className="App grain">
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route element={<RequireAuth><Layout /></RequireAuth>}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plan" element={<PlanTrip />} />
              <Route path="/trips" element={<MyTrips />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/trip/:id/build" element={<ItineraryBuilder />} />
              <Route path="/trip/:id" element={<ItineraryView />} />
              <Route path="/trip/:id/budget" element={<BudgetPage />} />
              <Route path="/share/:id" element={<SharedTrip />} />
              <Route path="/profile" element={<Profile />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-right" richColors />
      </TripProvider>
    </div>
  );
}

export default App;
