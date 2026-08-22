import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { TripProvider } from "@/context/TripContext";
import Layout from "@/components/Layout";
import Home from "@/pages/Home";
import Dashboard from "@/pages/Dashboard";
import CreateTrip from "@/pages/CreateTrip";
import MyTrips from "@/pages/MyTrips";
import Explore from "@/pages/Explore";
import ItineraryBuilder from "@/pages/ItineraryBuilder";
import ItineraryView from "@/pages/ItineraryView";
import BudgetPage from "@/pages/BudgetPage";
import SharedTrip from "@/pages/SharedTrip";
import Profile from "@/pages/Profile";

function App() {
  return (
    <div className="App grain">
      <TripProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/plan" element={<CreateTrip />} />
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
