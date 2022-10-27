import React, { useEffect } from "react";
import { getAllAlbums } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import SongCard from "./SongCard";

const DashboardAlbums = () => {
  const [{ allAlbums }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ALBUMS,
          allAlbums: data.album,
        });
      });
    }
  }, []);
  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      <div className="relative w-full my-4 p-4 py-16 border border-white rounded-md">
        <div>
          {/*The Count */}
          <div className="absolute top-4 left-4">
            <p className="text-xl font-bold">
              <span className="text-sm font-semibold text-textColor">
                Count:{" "}
              </span>
              {allAlbums?.length}
            </p>
          </div>
        </div>

        <AlbumContainer data={allAlbums} />
      </div>
    </div>
  );
};
export const AlbumContainer = ({ data }) => {
  console.log(data);
  return (
    <div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
      {data &&
        data.map((song, i) => (
          <SongCard key={song._id} data={song} index={i} type="album" />
        ))}
    </div>
  );
};
export default DashboardAlbums;
