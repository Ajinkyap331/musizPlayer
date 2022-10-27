import React from "react";
import { Header } from "./";
import { Route, Routes } from "react-router-dom";
import DashboardSongs from "./DashboardSongs";
import StartPage from "./StartPage.jsx";
import PremiumPage from "./PremiumPage";
import ContactUs from "./ContactUs";
import SearchPage from "./SearchPage";

const Home = () => {
  return (
    <div className="w-full h-auto flex flex-col items-center justify-center bg-primary">
      <Header />

      <div className="my-4 w-full p-4">
        <Routes>
          <Route path="/" element={<StartPage />} />
          <Route path="/home" element={<StartPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/premium" element={<PremiumPage />} />
          <Route path="/contact" element={<ContactUs />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
