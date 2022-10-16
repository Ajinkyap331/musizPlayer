import React from "react";
import { useEffect } from "react";
import { getAllUsers } from "../api";
import { useStateValue } from "../context/StateProvider";

export const DashboardCard = ({ icon, name, count }) => {
  return (
    <div className="p-4 w-40 gap-3 h-auto rounded-lg shadow-md bg-orange-400 ">
      {icon}
      <p className="text-xl text-textColor">{name}</p>
      <p className="text-xl text-textColor">{count}</p>
    </div>
  );
};

const DashboardHome = () => {
  const [{ allUsers, allSongs, allArtist, allAlbums }, dispatch] =
    useStateValue();

  useEffect(() => {
    if (!allUsers) {
      getAllUsers().then((data) => {
        console.log(data);
      });
    }
  }, []);
  return (
    <div className="w-full p-6 flex items-center justify-evenly flex-wrap">
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
      <DashboardCard />
    </div>
  );
};

export default DashboardHome;
