import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";
import ProfileHeaderSkeleton from "../../components/skeletons/ProfileHeaderSkeleton";
import EditProfileModal from "./EditProfileModal";
import { POSTS } from "../../utils/db/dummy";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCalendarOutline } from "react-icons/io5";
import { FaLink } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { useQuery } from "@tanstack/react-query";
import { formatMemberSinceDate } from "../../utils/date";
import useFollow from "../../hooks/useFollow";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";
import { FaHeartBroken } from 'react-icons/fa';
const ProfilePage = () => {
  const [coverImg, setCoverImg] = useState(null);
  const [profileImg, setProfileImg] = useState(null);
  const [feedType, setFeedType] = useState("posts");
  const coverImgRef = useRef(null);
  const profileImgRef = useRef(null);
  const { username } = useParams();
  const { follow, isPending } = useFollow();
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const {
    data: user,
    isLoading,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile"],
    queryFn: async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { isUpdatingProfile, updateProfile } = useUpdateUserProfile();
  const isMyProfile = authUser._id === user?._id;
  const memberSinceDate = formatMemberSinceDate(user?.createdAt);
  const amIFollowing = authUser?.following.includes(user?._id);

  const handleImgChange = (e, state) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        state === "coverImg" && setCoverImg(reader.result);
        state === "profileImg" && setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    refetch();
  }, [username, refetch]);

  return (
    <div className='flex-[4_4_0] min-h-screen'>
      {/* HEADER */}
      {(isLoading || isRefetching) && <ProfileHeaderSkeleton />}
      {!isLoading && !isRefetching && !user && (
        <div className="flex flex-col items-center justify-center h-screen">
		<FaHeartBroken className="text-6xl text-[#3B1E54] mb-4" />
		<p className="text-center text-3xl text-[#3B1E54]">User not found</p>
	  </div>
      )}
      
      <div className='flex flex-col gap-5'>
        {!isLoading && !isRefetching && user && (
          <>
            {/* PROFILE HEADER */}
            <div className='flex gap-4 px-6 py-4 items-center border-0 border-[#9B7EBD]'>
              <Link to='/' className='hover:text-[#3B1E54]'>
                <FaArrowLeft className='w-5 h-5 text-[#3B1E54]' />
              </Link>
              <div className='flex flex-col'>
                <p className='font-bold text-2xl text-[#3B1E54]'>{user?.fullName}</p>
              </div>
            </div>
			<div className='bg-[#eeeeee] pb-10 rounded-xl mx-10'>
            {/* COVER IMAGE */}
            <div className='relative group/cover'>
              <img
                src={coverImg || user?.coverImg || "/cover.png"}
                className='h-60 w-full object-cover rounded-t-xl'
                alt='cover image'
              />
              {isMyProfile && (
                <div
                  className='absolute top-4 right-4 rounded-full p-2 bg-[#3B1E54] bg-opacity-80 cursor-pointer opacity-0 group-hover/cover:opacity-100 transition duration-200'
                  onClick={() => coverImgRef.current.click()}
                >
                  <MdEdit className='w-6 h-6 text-white' />
                </div>
              )}

              <input
                type='file'
                hidden
                accept='image/*'
                ref={coverImgRef}
                onChange={(e) => handleImgChange(e, "coverImg")}
              />
              <input
                type='file'
                hidden
                accept='image/*'
                ref={profileImgRef}
                onChange={(e) => handleImgChange(e, "profileImg")}
              />

              {/* PROFILE IMAGE */}
              <div className='avatar absolute -bottom-16 left-6'>
                <div className='w-32 h-32 rounded-full relative group/avatar border-4 border-[#eeeeee]'>
                  <img 
                    src={profileImg || user?.profileImg || "/avatar-placeholder.png"} 
                    className="w-full h-full object-cover"
                  />
                  {isMyProfile && (
                    <div className='absolute bottom-2 right-2 p-2 bg-[#3B1E54] rounded-full group-hover/avatar:opacity-100 opacity-0 cursor-pointer'>
                      <MdEdit
                        className='w-5 h-5 text-white'
                        onClick={() => profileImgRef.current.click()}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className='flex justify-end px-6 mt-8'>
              {isMyProfile && <EditProfileModal authUser={authUser} />}
              {!isMyProfile && (
                <button
                  className={`btn rounded-full px-6 ${amIFollowing ? 'bg-[#3B1E54]/20 text-[#3B1E54]' : 'bg-[#3B1E54] text-white'}`}
                  onClick={() => follow(user?._id)}
                >
                  {isPending ? "Loading..." : amIFollowing ? "Following" : "Follow"}
                </button>
              )}
              {(coverImg || profileImg) && (
                <button
                  className='btn bg-[#3B1E54] text-white rounded-full px-6 ml-3 hover:bg-[#3B1E54]/90'
                  onClick={async () => {
                    await updateProfile({ coverImg, profileImg });
                    setProfileImg(null);
                    setCoverImg(null);
                  }}
                >
                  {isUpdatingProfile ? "Updating..." : "Update"}
                </button>
              )}
            </div>

            {/* USER INFO */}
            <div className='flex flex-col gap-4 mt-16 px-6'>
              <div className='flex flex-col'>
                <span className='font-bold text-xl text-[#3B1E54]'>{user?.fullName}</span>
                <span className='text-sm text-[#3B1E54]/70'>@{user?.username}</span>
                <span className='text-[#3B1E54] mt-2'>{user?.bio}</span>
              </div>

              <div className='flex gap-4 flex-wrap'>
                {user?.link && (
                  <div className='flex gap-2 items-center'>
                    <FaLink className='w-4 h-4 text-[#3B1E54]' />
                    <a
                      href={user?.link}
                      target='_blank'
                      rel='noreferrer'
                      className='text-sm text-[#3B1E54] hover:underline'
                    >
                      {user?.link}
                    </a>
                  </div>
                )}
                <div className='flex gap-2 items-center'>
                  <IoCalendarOutline className='w-5 h-5 text-[#3B1E54]' />
                  <span className='text-sm text-[#3B1E54]'>{memberSinceDate}</span>
                </div>
              </div>

              <div className='flex gap-4'>
                <div className='flex gap-1 items-center'>
                  <span className='font-bold text-[#3B1E54]'>{user?.following.length}</span>
                  <span className='text-[#3B1E54]/70'>Following</span>
                </div>
                <div className='flex gap-1 items-center'>
                  <span className='font-bold text-[#3B1E54]'>{user?.followers.length}</span>
                  <span className='text-[#3B1E54]/70'>Followers</span>
                </div>
              </div>
            </div>
			</div>



            {/* FEED SELECTOR */}
            <div className="flex w-full bg-[#b782e4] rounded-full mt-6 py-2 px-2">
  <button
    className={`flex justify-center flex-1 p-3 m-1 transition duration-300 cursor-pointer rounded-full text-lg ${
      feedType === "posts"
        ? "bg-[#3B1E54] text-white"
        : "hover:bg-[#3B1E54]/0 text-[#3B1E54]"
    }`}
    onClick={() => setFeedType("posts")}
  >
    Posts
  </button>
  <button
    className={`flex justify-center flex-1 p-3 m-1 transition duration-300 cursor-pointer rounded-full text-lg ${
      feedType === "likes"
        ? "bg-[#3B1E54] text-white"
        : "hover:bg-[#3B1E54]/0 text-[#3B1E54]"
    }`}
    onClick={() => setFeedType("likes")}
  >
    Likes
  </button>
</div>
          </>
        )}

        {/* POSTS */}
        <Posts feedType={feedType} username={username} userId={user?._id} />
      </div>
    </div>
  );
};

export default ProfilePage;