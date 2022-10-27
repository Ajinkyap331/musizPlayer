import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoTrash } from "react-icons/io5";
import {
  deleteAlbumById,
  deleteArtistById,
  deleteSongById,
  getAllAlbums,
  getAllArtists,
  getAllSongs,
} from "../api";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";
import { deleteObject, ref } from "firebase/storage";
import { storage } from "../config/firebase.config";

const SongCard = ({ data, index, type }) => {
  // console.log(type);
  const [isDelete, setIsDelete] = useState(false);
  const [
    { alertType, allSongs, allAlbums, allArtists, songIndex, isSongPlaying },
    dispatch,
  ] = useStateValue();

  const deleteData = (data) => {
    // console.log(type);
    console.log(data);
    // Song
    if (type === "song") {
      const deleteRef = ref(storage, data.imageURL);

      deleteObject(deleteRef).then(() => {});
      deleteSongById(data._id).then((res) => {
        if (res.data) {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "success",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
            getAllSongs().then((data) => {
              dispatch({
                type: actionType.SET_ALL_SONGS,
                allSongs: data.songs,
              });
            });
          });
        } else {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "danger",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
          });
        }
      });
    }
    // Album
    if (type === "album") {
      const deleteRef = ref(storage, data.imageURL);
      deleteObject(deleteRef).then(() => {});
      deleteAlbumById(data._id).then((res) => {
        if (res.data) {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "success",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
            getAllAlbums().then((data) => {
              dispatch({
                type: actionType.SET_ALL_ALBUMS,
                allAlbums: data.album,
              });
            });
          });
        } else {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "danger",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
          });
        }
      });
    }
    // Artist
    if (type === "artist") {
      const deleteRef = ref(storage, data.imageURL);
      deleteObject(deleteRef).then(() => {});
      console.log(data);
      deleteArtistById(data._id).then((res) => {
        if (res.data) {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "success",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
            getAllArtists().then((data) => {
              dispatch({
                type: actionType.SET_ALL_ARTISTS,
                allArtists: data.artist,
              });
            });
          });
        } else {
          dispatch({
            type: actionType.set_ALERT_TYPE,
            alertType: "danger",
          });
          setTimeout(() => {
            dispatch(
              {
                type: actionType.set_ALERT_TYPE,
                alertType: null,
              },
              3000
            );
          });
        }
      });
    }
  };
  const addToContext = () => {
    if (!isSongPlaying) {
      dispatch({
        type: actionType.SET_SONG_PLAYING,
        isSongPlaying: true,
      });
    }

    if (songIndex !== index) {
      dispatch({
        type: actionType.SET_SONG_INDEX,
        songIndex: index,
      });
    }
  };
  // console.log(data.data.artist);
  return (
    <motion.div
      className="relative w-40 min-w-210 px-2 py-4 cursor-pointer hover:bg-card bg-gray-100 shadow-md rounded-lg flex flex-col items-center"
      onClick={type === "song" && addToContext}
    >
      <div className="2-40 min-w-[160px] h-40 min-h-[160px] rounded-lg drop-shadow-lg relative overflow-hidden">
        <motion.img
          whileHover={{ scale: 1.05 }}
          src={data.imageURL}
          className="w-full h-full rounded-lg object-cover"
        />
      </div>
      <p className="text-base text-center text-headingColor font-semibold my-2">
        {data.name.length > 20 ? `${data.name.slice(0, 20)}..` : data.name}
        {data.artist && (
          <span className=" text-sm text-center text-gray-400 flex items-center justify-between my-1">
            {data.artist.length > 10
              ? `${data.artist.slice(0, 10)}..`
              : data.artist}
          </span>
        )}
      </p>

      <div className="w-full absolute bottom-2 right-2 flex items-center justify-between px-4">
        <motion.i
          whileTap={{ scale: 0.75 }}
          className="text-base text-red-400 drop-shadow-md hover:text-red-600"
          onClick={() => setIsDelete(true)}
        >
          <IoTrash />
        </motion.i>
      </div>
      {isDelete && (
        <motion.div
          className="absolute inset-0 backdrop-blur-md bg-cardOverlay flex items-center flex-col justify-center px-4 py-2 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-lg text-headingColor font-semibold text-center">
            Are you sure do you want to delete it?
          </p>
          <div className="flex items-center gap-4">
            <motion.button
              className="px-3 py-2 text-sm uppercase text-white bg-green-700 rounded-md cursor-pointer"
              whileTap={{ scale: 0.75 }}
              onClick={() => deleteData(data)}
            >
              Yes
            </motion.button>
            <motion.button
              className="px-3 py-2 text-sm uppercase text-white bg-red-700 rounded-md cursor-pointer"
              whileTap={{ scale: 0.75 }}
              onClick={() => {
                setIsDelete(false);
              }}
            >
              No
            </motion.button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default SongCard;
