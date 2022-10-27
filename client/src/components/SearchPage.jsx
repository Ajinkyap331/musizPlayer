import React, { useState, useEffect } from "react";
import { AiOutlineClear } from "react-icons/ai";
import { getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import { useStateValue } from "../context/StateProvider";
import { BiSearchAlt } from "react-icons/bi";
import SongCardMain from "./SongCardMain";
import { SongContainerMain } from "./StartPage";

const SearchPage = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [song, setSong] = useState([]);

  const [{ allSongs }, dispatch] = useStateValue();

  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        // console.log(data.songs);
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
  }, []);

  const SearchSong = (event) => {
    event.preventDefault();
    allSongs.map((data, i) => {
      console.log(songFilter, data.name);
      if (
        songFilter.toLowerCase() ===
        data.name.toLowerCase().substring(0, songFilter.length)
      ) {
        console.log(songFilter, data.name);
        data.index = i;

        setSong((song) => [...song, data]);
      }
      return null;
    });
  };

  return (
    <form
      className="w-full p-4 flex items-center justify-center flex-col"
      onSubmit={SearchSong}
    >
      <div className="w-full flex justify-center items-center gap-20">
        {songFilter && (
          <i onClick={() => setSongFilter("")}>
            <AiOutlineClear className="text-3xl text-textColor cursor-pointer" />
          </i>
        )}
        <input
          type="text"
          className={`w-300 px-4 py-2 border ${
            isFocus ? "border-gray-500 shadow-md" : "border-gray-300"
          } rounded-md bg-white outline-none duration-150 transition-all ease-in-out text-base text-textColor font-semibold`}
          placeholder="Search Here..."
          value={songFilter}
          onChange={(e) => {
            setSongFilter(e.target.value);
            setSong([]);
          }}
          onBlur={() => {
            setIsFocus(false);
          }}
          onFocus={() => setIsFocus(true)}
        />
        <i onClick={SearchSong}>
          <BiSearchAlt className="text-3xl text-textColor cursor-pointer" />
        </i>
      </div>
      {!songFilter && (
        <div className="relative w-full my-4 p-4 py-16 border border-black rounded-md">
          <SongContainerMain data={allSongs} />
        </div>
      )}
      {songFilter && (
        <div className="relative w-full my-4 p-4 py-16 border border-black rounded-md">
          {console.log(song)}
          <SongContainerMai data={song} />
        </div>
      )}
    </form>
  );
};

export const SongContainerMai = ({ data }) => {
  return (
    <div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
      {data &&
        data.map((song) => {
          if (song)
            return (
              <SongCardMain key={song?._id} data={song} index={song.index} />
            );
          return null;
        })}
    </div>
  );
};

export default SearchPage;
