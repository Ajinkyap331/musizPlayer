import React, { useEffect, useState } from "react";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";
import { motion } from "framer-motion";
import { BiCloudUpload } from "react-icons/bi";
import { MdDelete } from "react-icons/md";
import { storage } from "../config/firebase.config";
import { useStateValue } from "../context/StateProvider";
import FilterButtons from "./FilterButtons";
import {
  getAllAlbums,
  getAllArtists,
  getAllSongs,
  saveNewAlbum,
  saveNewArtist,
  saveNewSong,
} from "../api";
import { actionType } from "../context/reducer";
import { filterByLanguage, filters } from "../utils/supportfunctions";
// import AlertSuccess from "./AlertSuccess";
// import AlertError from "./AlertError";

const DashBoardNewSong = () => {
  const [songName, setSongName] = useState("");
  const [songImageCover, setSongImageCover] = useState(null);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [
    {
      allArtists,
      allAlbums,
      allSongs,
      languageFilter,
      artistFilter,
      albumFilter,
      filterTerm,
    },
    dispatch,
  ] = useStateValue();

  const [songAudioCover, setSongAudioCover] = useState(null);
  const [audioUploadingProgress, setAudioUploadingProgress] = useState(0);
  const [isAudioLoading, setIsAudioLoading] = useState(false);

  useEffect(() => {
    if (!allArtists) {
      getAllArtists().then((data) => {
        dispatch({ type: actionType.SET_ALL_ARTISTS, allArtists: data.artist });
      });
    }
    if (!allAlbums) {
      getAllAlbums().then((data) => {
        dispatch({ type: actionType.SET_ALL_ALBUMS, allAlbums: data.album });
      });
    }
  }, []);

  const deleteFileObject = (url, isImage) => {
    if (isImage) {
      setIsImageLoading(true);
      setIsAudioLoading(true);
    }
    const deleteRef = ref(storage, url);
    deleteObject(deleteRef).then(() => {
      setSongImageCover(null);
      setSongAudioCover(null);
      setIsImageLoading(false);
      setIsAudioLoading(false);
    });
  };

  const saveSong = () => {
    if (!songAudioCover || !songImageCover) {
      // throw the alert
    } else {
      setIsAudioLoading(true);
      setIsImageLoading(true);
      const data = {
        name: songName,
        imageURL: songImageCover,
        songURL: songAudioCover,
        album: albumFilter,
        artist: artistFilter,
        language: languageFilter,
        category: filterTerm,
      };
      saveNewSong(data).then((res) => {
        getAllSongs().then((songs) =>
          dispatch({
            type: actionType.SET_ALL_SONGS,
            allSongs: songs.songs,
          })
        );
      });
      setSongName(null);
      setIsAudioLoading(false);
      setIsImageLoading(false);
      setSongAudioCover(null);
      setSongImageCover(null);
      dispatch({
        type: actionType.SET_ALL_ARTISTS,
        artistFilter: null,
      });
      dispatch({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: null,
      });
      dispatch({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: null,
      });
      dispatch({
        type: actionType.SET_FILTER_TERM,
        filterTerm: null,
      });
    }
  };

  return (
    <div className="flex bg-white  flex-col items-center justify-center p-4 border border-black gap-4 rounded-md">
      <input
        type="text"
        placeholder="Type your song name..."
        className="w-full p-3 rounded-md text-base font-semibold text-textColor outline-none shadow-sm border border-black bg-white"
        value={songName}
        onChange={(e) => setSongName(e.target.value)}
      />
      <div className="flex w-full justify-between flex-wrap items-center gap-4">
        <FilterButtons filterData={allArtists} flag={"Artist"} />
        <FilterButtons filterData={allAlbums} flag={"Albums"} />
        <FilterButtons filterData={filterByLanguage} flag={"Language"} />
        <FilterButtons filterData={filters} flag={"Category"} />
      </div>
      <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-black bg-gray-100 cursor-pointer">
        {isImageLoading && <FileLoader progress={imageUploadProgress} />}
        {!isImageLoading && (
          <>
            {!songImageCover ? (
              <FileUploader
                updateState={setSongImageCover}
                setProgress={setImageUploadProgress}
                isLoading={setIsImageLoading}
                isImage={true}
              />
            ) : (
              <div className="relative w-full h-full overflow-hidden rounded-md">
                <img
                  src={songImageCover}
                  className="w-full h-full object-cover"
                  alt=""
                />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out "
                  onClick={() => deleteFileObject(songImageCover, true)}
                >
                  <MdDelete className="text-white " />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      {/*Audio File Uploading*/}
      <div className="bg-card backdrop-blur-md w-full h-300 rounded-md border-2 border-dotted border-black bg-gray-100 cursor-pointer">
        {isAudioLoading && <FileLoader progress={audioUploadingProgress} />}
        {!isAudioLoading && (
          <>
            {!songAudioCover ? (
              <FileUploader
                updateState={setSongAudioCover}
                setProgress={setAudioUploadingProgress}
                isLoading={setIsAudioLoading}
                isImage={false}
              />
            ) : (
              <div className="relative w-full h-full flex items-center justify-center overflow-hidden rounded-md">
                <audio src={songAudioCover} controls />
                <button
                  type="button"
                  className="absolute bottom-3 right-3 p-3 rounded-full bg-red-500 text-xl cursor-pointer outline-none border-none hover:shadow-md duration-200 transition-all ease-in-out "
                  onClick={() => deleteFileObject(songAudioCover, false)}
                >
                  <MdDelete className="text-white " />
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <div className="flex items-center justify-center w-35 p-4">
        {isImageLoading || isAudioLoading ? (
          <DisabledButton />
        ) : (
          <motion.button
            whileTap={{ scale: 0.75 }}
            className="px-8 py-2 w-full rounded-md text-white  bg-blue-600  hover:bg-blue-400"
            onClick={saveSong}
          >
            Save
          </motion.button>
        )}
      </div>
    </div>
  );
};

export const DisabledButton = () => {
  return (
    <button
      disabled
      type="button"
      class="text-white bg-blue-400 hover:bg-blue-200 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 dark:bg-blue-400 dark:hover:bg-blue-200 dark:focus:ring-blue-800 inline-flex items-center"
    >
      <svg
        role="status"
        class="inline mr-3 w-4 h-4 text-white animate-spin"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="#E5E7EB"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentColor"
        />
      </svg>
      Loading...
    </button>
  );
};

export const FileLoader = ({ progress }) => {
  const chdiv = {
    height: "100%",
    width: `${progress}%`,
    backgroundColor: "#7DF9FF",
    borderRadius: 5,
    textAlign: "right",
  };
  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      {/* <p className="text-xl font-semibold text-textColor">
        {Math.round(progress) > 0 && <>{`${Math.round(progress)}%`}</>}
      </p> */}

      <div className="flex justify-center items-center h-20 bg-gray-100">
        <div className="grid gap-2">
          <div className="flex items-center justify-center space-x-2 animate-pulse">
            <div className="w-8 h-8 bg-red-500 rounded-full"></div>
            <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
            <div className="w-8 h-8 bg-green-500 rounded-full"></div>
          </div>
        </div>
      </div>
      <div className="w-300 h-7 bg-gray-300 border-5 rounded-md m-5">
        <div style={chdiv}>
          <span className="text-xl font-semibold text-black p-2">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </div>
  );
};

export const FileUploader = ({
  updateState,
  setProgress,
  isLoading,
  isImage,
}) => {
  const uploadFile = (e) => {
    isLoading(true);
    const uploadedFile = e.target.files[0];
    // console.log(uploadedFile);
    const storageRef = ref(
      storage,
      `${isImage ? "Images" : "Audio"}/${Date.now()}-${uploadedFile.name}`
    );
    const uploadTask = uploadBytesResumable(storageRef, uploadedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
      },
      (error) => {
        console.log(error);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          updateState(downloadURL);
          isLoading(false);
        });
      }
    );
  };
  return (
    <label>
      <div className="flex flex-col items-center justify-center h-full">
        <div className="flex flex-col justify-center items-center cursor-pointer">
          <p className="font-bold text-2xl">
            <BiCloudUpload />
          </p>
          <p className="text-lg">
            Click to Upload {isImage ? "an Song Image" : "an audio"}
          </p>
        </div>
      </div>
      <input
        type="file"
        name="upload-file"
        accept={`${isImage ? "image/*" : "audio/*"}`}
        className={"w-0 h-0"}
        onChange={uploadFile}
      />
    </label>
  );
};

export default DashBoardNewSong;
