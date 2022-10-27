import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { IoAdd, IoPause, IoPlay, IoTrash } from "react-icons/io5";
import { AiOutlineClear } from "react-icons/ai";
import { useStateValue } from "../context/StateProvider";
import { getAllAlbums, getAllArtists, getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import SongCardMain from "./SongCardMain";
import { motion } from "framer-motion";

const StartPage = () => {
  const [songFilter, setSongFilter] = useState("");
  const [isFocus, setIsFocus] = useState(false);
  const [{ allSongs, allArtists, allAlbums }, dispatch] = useStateValue();

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

  useEffect(() => {
    if (!allArtists) {
      getAllArtists().then((data) => {
        dispatch({
          type: actionType.SET_ALL_ARTISTS,
          allArtists: data.artist,
        });
      });
    }
  }, []);

  if (!allAlbums) {
    getAllAlbums().then((data) => {
      dispatch({
        type: actionType.SET_ALL_ALBUMS,
        allAlbums: data.album,
      });
    });
  }

  return (
    <div className="w-full p-4 flex items-center justify-center flex-col">
      {/*Main Container Song */}
      <div className="relative w-full my-4 p-4 py-16 border border-black rounded-md">
        <div>
          <div className="absolute top-4 left-6">
            <p className="text-xl font-bold">
              <span className="text-lg  text-textColor">
                Songs you would like...
              </span>
            </p>
          </div>
        </div>

        <SongContainerMain data={allSongs} />
      </div>
      {/*Main Container Artist */}
      {allArtists &&
        allSongs &&
        allArtists.map((data, index) => {
          return (
            <div className="relative w-full my-4 p-4 py-16 border border-black rounded-md shadow-md flex flex-col items-center">
              <section className="absolute top-4 left-6">
                <motion.img
                  whileHover={{ scale: 1.05 }}
                  src={data.imageURL}
                  className="w-20 h-20 rounded-full object-cover"
                />

                <p className="text-xl text-center font-bold my-2">
                  <span className="text-lg  text-textColor">
                    {data.name}'s Songs
                  </span>
                </p>
              </section>

              <SongContainerMain
                data={allSongs.map((song) =>
                  data.name === song.artist ? song : null
                )}
              />
            </div>
          );
        })}
      {allAlbums &&
        allSongs &&
        allAlbums.map((data, index) => {
          return (
            <div className="relative w-full my-4 p-4 py-16 border border-black rounded-md">
              <div>
                <section className="absolute top-4 left-6">
                  <motion.img
                    whileHover={{ scale: 1.05 }}
                    src={data.imageURL}
                    className="w-20 h-20 rounded-full object-cover"
                  />

                  <p className="text-xl text-center font-bold my-2">
                    <span className="text-lg  text-textColor">
                      {data.name}'s Album
                    </span>
                  </p>
                </section>
              </div>

              <SongContainerMain
                data={allSongs.map((song) =>
                  data.name === song.album ? song : null
                )}
              />
            </div>
          );
        })}
    </div>
  );
};

export const SongContainerMain = ({ data }) => {
  return (
    <div className="w-full flex flex-wrap gap-3 items-center justify-evenly">
      {data &&
        data.map((song, i) => {
          if (song)
            return <SongCardMain key={song?._id} data={song} index={i} />;
          return null;
        })}
    </div>
  );
};

export default StartPage;
