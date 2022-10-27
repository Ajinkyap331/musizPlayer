import { motion } from "framer-motion";
import React, { useState } from "react";
import { RiPlayListFill } from "react-icons/ri";
import { useStateValue } from "../context/StateProvider";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { useEffect } from "react";
import { getAllSongs } from "../api";
import { actionType } from "../context/reducer";
import { TbArrowsDiagonalMinimize2 } from "react-icons/tb";

const MusicPlayer = () => {
  const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();
  const [minimize, setMinimize] = useState(null);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const nextTrack = () => {
    if (songIndex >= allSongs.length - 1) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: songIndex + 1,
      });
    }
  };
  const previousTrack = () => {
    if (songIndex === 0) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: 0,
      });
    } else {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: songIndex - 1,
      });
    }
  };

  return (
    <React.Fragment>
      {minimize === true && isSongPlaying && (
        <img
          alt=""
          src={allSongs[songIndex]?.imageURL}
          className="absolute bottom-10 right-10 h-30 w-40 object-cover rounded-md"
          onClick={() => setMinimize(false)}
        />
      )}
      {isSongPlaying && (
        <div
          className={`${
            minimize
              ? "absolute bottom-10 right-10 h-1 w-1 invisible "
              : "w-full flex items-center gap-3"
          }`}
        >
          <div className={`w-full items-center gap-3 p-4 flex relative`}>
            <img
              alt=""
              src={allSongs[songIndex]?.imageURL}
              className="w-40 h-20 object-cover rounded-md"
            />
            <div className="flex items-start flex-col">
              <p className="text-xl text-headingColor font-semibold">
                {`${
                  allSongs[songIndex]?.name.length > 20
                    ? `${allSongs[songIndex]?.name.slice(0, 20)}...`
                    : allSongs[songIndex]?.name
                }`}
                {/* {`${allSongs[songIndex]?.name}`} */}
                {"  "}
                <span className="text-base">
                  ({allSongs[songIndex]?.album})
                </span>
              </p>
              <p className="text-textColor">
                {allSongs[songIndex]?.artist}{" "}
                <span className="taxt-sm text-textColor font-semibold">
                  ({allSongs[songIndex]?.category})
                </span>
              </p>
              <motion.i
                whileTap={{ scale: 0.8 }}
                onClick={() => setIsPlaylist(!isPlaylist)}
              >
                <RiPlayListFill className="text-textColor hover:text-headingColor " />
              </motion.i>
            </div>
            <div className="flex-1">
              <AudioPlayer
                src={allSongs[songIndex]?.songURL}
                onPlay={() => console.log("is Playing")}
                autoPlay={true}
                showSkipControls={true}
                onClickNext={nextTrack}
                onClickPrevious={previousTrack}
              />
            </div>
            {isPlaylist && <PlayListCard />}
            <motion.i
              whileTap={{ scale: 0.8 }}
              onClick={() => setMinimize(true)}
            >
              <TbArrowsDiagonalMinimize2 className="h-10 w-10" />
            </motion.i>
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export const PlayListCard = () => {
  const [{ allSongs, songIndex, isSongPlaying }, dispatch] = useStateValue();
  useEffect(() => {
    if (!allSongs) {
      getAllSongs().then((data) => {
        console.log(data.songs);
        dispatch({
          type: actionType.SET_ALL_SONGS,
          allSongs: data.songs,
        });
      });
    }
  }, []);

  const setCurrentPlaySong = (si) => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== si) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: si,
      });
    }
  };

  //   console.log(allSongs.length);

  return (
    <div className="absolute left-4 bottom-24 gap-2 py-2 w-350 max-w-[350px] h-510 max-h-[510px] flex flex-col overflow-y-scroll scrollbar-thin rounded-md shadow-md bg-gray-300 z-50">
      {allSongs.length > 0 ? (
        allSongs.map((music, index) => {
          return (
            <motion.div
              initial={{ opacity: 0, translateX: -50 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="group w-full hover:bg-card flex gap-3 items-center cursor-pointer bg-transparent"
              onClick={() => setCurrentPlaySong(index)}
              key={index}
            >
              {/* <IoMusicalNote className="text-textColor group-hover:text-headingColor text-2xl cursor-pointer" /> */}
              <div className={`items-center gap-2 p-2 cursor-pointer`}>
                <img
                  src={music.imageURL}
                  alt="img"
                  className="w-20 h-10 object-cover rounded-full"
                />
              </div>
              <div className="flex items-start flex-col">
                <p className="text-md text-headingColor font-semibold">
                  {`${
                    music?.name.length > 15
                      ? music?.name.slice(0, 15)
                      : music?.name
                  }`}
                  {"... "}
                  <span className="text-base">({music?.album})</span>
                </p>
                <p className="text-textColor">
                  {music?.artist}{" "}
                  <span className="text-sm text-textColor font-semibold">
                    ({music?.category})
                  </span>
                </p>
              </div>
            </motion.div>
          );
        })
      ) : (
        <></>
      )}
    </div>
  );
};

export default MusicPlayer;
