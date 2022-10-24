import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import { motion } from "framer-motion";
import { useStateValue } from "../context/StateProvider";
import { actionType } from "../context/reducer";

const FilterButtons = ({ filterData, flag, data, songAudioCover }) => {
  const [filterName, setFilterName] = useState(null);
  const [filterMenu, setFilterMenu] = useState(false);
  const [onceRender, setOnceRender] = useState(false);
  const [{ languageFilter, artistFilter, albumFilter, filterTerm }, dispatch] =
    useStateValue();

  if (songAudioCover && data && !onceRender) {
    setOnceRender(true);
    setFilterMenu(false);
    console.log(data, flag);
    if (data !== "" && data) {
      setFilterName(data);
    }

    if (flag === "Artist") {
      dispatch({
        type: actionType.SET_ARTIST_FILTER,
        artistFilter: data,
      });
    }
    if (flag === "Albums") {
      dispatch({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: data,
      });
    }
    if (flag === "Language") {
      dispatch({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: data,
      });
    }
    if (flag === "Category") {
      dispatch({
        type: actionType.SET_FILTER_TERM,
        filterTerm: data,
      });
    }
  }

  const updateFilterButton = (name) => {
    setFilterMenu(false);
    setFilterName(name);

    if (flag === "Artist") {
      dispatch({
        type: actionType.SET_ARTIST_FILTER,
        artistFilter: name,
      });
    }
    if (flag === "Albums") {
      dispatch({
        type: actionType.SET_ALBUM_FILTER,
        albumFilter: name,
      });
    }
    if (flag === "Language") {
      dispatch({
        type: actionType.SET_LANGUAGE_FILTER,
        languageFilter: name,
      });
    }
    if (flag === "Category") {
      dispatch({
        type: actionType.SET_FILTER_TERM,
        filterTerm: name,
      });
    }
  };

  return (
    <div className="bg-white border border-black rounded-md px-4 py-1 relative cursor-pointer hover:border-gray-400">
      <p
        className="text-base tracking-wide text-black flex items-center gap-2"
        onClick={() => setFilterMenu(!filterMenu)}
      >
        {!filterName && flag}
        {filterName && (
          <>
            {filterName.length > 15
              ? `${filterName.name.slice(0, 14)}...`
              : filterName}
          </>
        )}
        <IoChevronDown
          className={`text-base text-black duration-150 transition-all ease-in-out ${
            filterMenu ? "rotate-180" : "rotate-0"
          }`}
        />
      </p>
      {filterData && filterMenu && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="bg-white w-48 z-50 backdrop-blur-sm max-h-44 overflow-y-scroll scrollbar-thin scrollbar-track-gray-100 scrollbar-thumb-gray-400 py-2 flex flex-col rounded-md shadow-md absolute top-8 left-4"
        >
          {filterData?.map((data) => (
            <div
              key={data.name}
              className="flex items-center gap-2 px-4 py-1 hover:bg-gray-300"
              onClick={() => updateFilterButton(data.name)}
            >
              {(flag === "Artist" || flag === "Albums") && (
                <img
                  alt="Img"
                  src={data.imageURL}
                  className="w-8 min-w-[32px] h-8 rounded-full object-cover"
                />
              )}
              <p className="w-full">
                {data.length > 15 ? `${data.name.slice(0, 15)}...` : data.name}
              </p>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FilterButtons;
