import { useState } from "react";
import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
  const [feedType, setFeedType] = useState("forYou");

  return (
    <div className="flex-[4_4_0] bg-[#D4BEE4] rounded-lg p-4">
      {/* CREATE POST INPUT - now properly positioned at top */}
      <CreatePost />

      {/* Feed selector tabs */}
      <div className="bg-[#D4BEE4] rounded-full my-8  ">
        <div className="flex w-full bg-[#b782e4] rounded-full">
          <button
            className={`flex justify-center flex-1 p-3 m-3 transition duration-300 cursor-pointer rounded-full text-xl ${
              feedType === "forYou"
                ? "bg-[#3B1E54] text-white"
                : "hover:bg-[#fff]/0 text-gray-900"
            }`}
            onClick={() => setFeedType("forYou")}
          >
            For you
          </button>
          <button
            className={`flex justify-center flex-1 p-3 m-3 transition duration-300 cursor-pointer rounded-full text-xl ${
              feedType === "following"
                ? "bg-[#3B1E54] text-white"
                : "hover:bg-[#fff]/0 text-gray-900"
            }`}
            onClick={() => setFeedType("following")}
          >
            Following
          </button>
        </div>

        
        
      </div>
	  {/* POSTS */}
        
	  <Posts feedType={feedType} />
    </div>
  );
};

export default HomePage;