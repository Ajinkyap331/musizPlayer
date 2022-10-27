import React from "react";
import { app } from "../config/firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FcGoogle } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import { Loogo } from "../assets/img";
import { useEffect } from "react";
import { useStateValue } from "../context/StateProvider";
import { validateUser } from "../api";
import { actionType } from "../context/reducer";
import { LoginBg } from "../assets/video";

const Login = ({ setAuth }) => {
  const provider = new GoogleAuthProvider();
  const firebaseAuth = getAuth();
  const navigate = useNavigate();

  const [{ user }, dispatch] = useStateValue();

  const loginWithGoogle = async () => {
    await signInWithPopup(firebaseAuth, provider).then((userCred) => {
      if (userCred) {
        setAuth(true);
        window.localStorage.setItem("auth", "true");

        firebaseAuth.onAuthStateChanged((userAuth) => {
          if (userCred) {
            navigate("/", { replace: true });
            userCred.getIdToken().then((token) => {
              validateUser(token).then((data) => {
                dispatch({
                  type: actionType.SET_USER,
                  user: data,
                });
              });
            });
          } else {
            setAuth(false);
            dispatch({
              type: actionType.SET_USER,
              user: null,
            });
            navigate("/login");
          }
        });
      }
    });
  };

  useEffect(() => {
    if (window.localStorage.getItem("auth") === "true") {
      navigate("/", { replace: true });
    }
  }, []);

  return (
    <div className="relative w-screen h-screen ">
      <video
        src={LoginBg}
        type="video/mp4"
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      ></video>
      <div className="absolute inset-0 bg-darkOverlay flex items-center justify-center p-4 border border-black border-spacing-3">
        <div className="w-full h-275 md:w-375 p-4 gap-4 bg-white shadow-2xl rounded-md backdrop-blur-md flex flex-col items-center justify-center">
          <div className="gap-2 flex items-center">
            <img src={Loogo} alt="Logo" className="w-16" />
            <p className="gap-4 text-lg">Login into One-Music</p>
          </div>
          <hr />
          <div
            className="flex items-center justify-center gap-4 px-4 py-2 rounded-md bg-gray-300 cursor-pointer hover:bg-gray-400 hover:shadow-md duration-500 ease-in-out transition-all border border-blue-500"
            onClick={loginWithGoogle}
          >
            <FcGoogle className="text-xl" />
            Sign in with Google
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
