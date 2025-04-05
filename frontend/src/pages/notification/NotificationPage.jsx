import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";
import { FaArrowLeft } from "react-icons/fa6";
const NotificationPage = () => {
  const queryClient = useQueryClient();
  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
  });

  const { mutate: deleteNotifications } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("http://localhost:5000/", {
          method: "DELETE",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Notifications deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return (
    <div className="flex-[4_4_0] min-h-screen bg-[#D4BEE4] p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
      <div className='flex gap-4 px-6 py-4 items-center border-0 border-[#9B7EBD]'>
              <Link to='/' className='hover:text-[#3B1E54]'>
                <FaArrowLeft className='w-5 h-5 text-[#3B1E54]' />
              </Link>
              <div className='flex flex-col'>
                <p className='font-bold text-2xl text-[#3B1E54]'>Notifications</p>
              </div>
            </div>
        <div className="dropdown">
          {/* <div 
            tabIndex={0} 
            role="button" 
            className="btn bg-[#3B1E54] text-white rounded-full p-2 hover:bg-[#3B1E54]/90"
          >
            <IoSettingsOutline className="w-5 h-5" />
          </div> */}
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-[#eeeeee] border-2 border-[#3B1E54] rounded-lg w-52"
          >
            <li>
              <a 
                onClick={deleteNotifications}
                className="text-[#3B1E54] font-semibold hover:bg-[#3B1E54]/10"
              >
                Delete all notifications
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main Card */}
      <div className="bg-[#eeeeee] rounded-xl border-0 border-[#9B7EBD] p-2 max-w-3xl my-10 mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size="lg" />
          </div>
        )}

        {/* Empty State */}
        {notifications?.length === 0 && (
          <div className="text-center p-8 font-bold text-[#3B1E54] text-lg">
            No notifications yet 🤔
          </div>
        )}

        {/* Notifications List */}
        {notifications?.map((notification, index) => (
          <div key={notification._id}>
            <div className="flex items-center justify-between p-4 hover:bg-[#eeeeee]/80">
              <div className="flex items-center gap-4">
                <div className="avatar">
                  <div className="w-12 rounded-full border-2 border-[#9B7EBD]">
                    <img 
                      src={notification.from.profileImg || "/avatar-placeholder.png"} 
                      alt="Profile"
                    />
                  </div>
                </div>
                <div>
                  <Link 
                    to={`/profile/${notification.from.username}`}
                    className="font-bold text-[#3B1E54] hover:underline"
                  >
                    @{notification.from.username}
                  </Link>
                  <p className="text-black">
                    {notification.type === "follow" 
                      ? "started following you" 
                      : "liked your post"}
                  </p>
                </div>
              </div>
              
              <div className="p-2">
                {notification.type === "follow" ? (
                  <FaUser className="w-5 h-5 text-[#3B1E54]" />
                ) : (
                  <FaHeart className="w-5 h-5 text-[#3B1E54]" />
                )}
              </div>
            </div>
            
            {/* Horizontal line except after last notification */}
            {index !== notifications.length - 1 && (
              <div className="border-t-2 border-[#9B7EBD] mx-4"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationPage;