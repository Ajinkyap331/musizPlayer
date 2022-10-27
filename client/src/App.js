import React, { useEffect, useState } from "react";
import { Route, Routes, useNavigate } from "react-router-dom";
import { Home, Login, Dashboard, MusicPlayer } from "./components";
import { app } from "./config/firebase.config";
import { getAuth } from "firebase/auth";

import { AnimatePresence, motion } from "framer-motion";
import { getAllSongs, validateUser } from "./api";
import { useStateValue } from "./context/StateProvider";
import { actionType } from "./context/reducer";

const App = () => {
  const firebaseAuth = getAuth(app);
  const navigate = useNavigate();

  const [{ user, allSongs, songIndex, isSongPlaying }, dispatch] =
    useStateValue();

  const [auth, setAuth] = useState(
    false || window.localStorage.getItem("auth") === true
  );

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
    firebaseAuth.onAuthStateChanged((e) => {
      if (e) {
        e.getIdToken().then((token) => {
          // console.log(token);
          validateUser(token).then((data) => {
            dispatch({
              type: actionType.SET_USER,
              user: data,
            });
          });
        });
      } else {
        setAuth(false);
        window.localStorage.setItem("auth", "false");
        dispatch({ type: actionType.SET_USER, user: null });
        navigate("/login");
      }
    });
  }, []);

  return (
    <AnimatePresence exitBeforeEnter>
      <div className="h-auto min-w-[680px] bg-secondary flex justify-center items-center">
        <Routes>
          <Route path="/login" element={<Login setAuth={setAuth} />} />
          <Route path="/*" element={<Home />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
        {isSongPlaying && user && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className={`fixed min-w-[700px] inset-x-0 bottom-0 bg-cardOverlay drop-shadow-2xl flex items-center justify-center`}
          >
            <MusicPlayer />
          </motion.div>
        )}
      </div>
    </AnimatePresence>
  );
};

export default App;
