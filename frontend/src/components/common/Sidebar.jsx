import XSvg from "../svgs/X";
import { MdHomeFilled } from "react-icons/md";
import { IoNotifications, IoMenu, IoClose } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useState } from "react";

const Sidebar = () => {
  const queryClient = useQueryClient();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch("/api/auth/logout", {
          method: "POST",
        });
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
    onError: () => {
      toast.error("Logout failed");
    },
  });
  
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  return (
    <>
      {/* Mobile menu button */}
      <div className="md:hidden fixed top-4 left-4 z-[1001]">
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white p-3 rounded-full bg-[#3B1E54] hover:bg-[#4d2a6e] transition-all"
        >
          {isMobileMenuOpen ? <IoClose size={28} /> : <IoMenu size={28} />}
        </button>
      </div>

      {/* Sidebar */}
      <div className={`fixed h-screen max-h-[100vh] ${isMobileMenuOpen ? 'left-0' : '-left-full'} md:left-0 transition-all duration-300 z-40`}>
        <div className="h-full w-28 md:w-32 bg-[#3B1E54] rounded-r-3xl flex flex-col items-center py-6 overflow-y-auto">
          {/* Logo - fixed visibility */}
          <div className="mb-12">
            <Link to='/' className="block">
              <XSvg className="w-12 h-12 rounded-full fill-white hover:scale-105 transition-transform" />
            </Link>
          </div>
          
          {/* Navigation icons */}
          <ul className="flex flex-col items-center gap-0 flex-1">
            <li>
              <Link
                to='/'
                className="p-4 rounded-full hover:bg-stone-900 transition-all duration-300 flex items-center justify-center"
                title="Home"
              >
                <MdHomeFilled className="w-8 h-8 min-w-[32px]" style={{ color: '#fff' }} />
              </Link>
            </li>
            <li>
              <Link
                to='/notifications'
                className="p-4 rounded-full hover:bg-stone-900 transition-all duration-300 flex items-center justify-center"
                title="Notifications"
              >
                <IoNotifications className="w-8 h-8 min-w-[32px]" style={{ color: '#fff' }}  />
              </Link>
            </li>
            <li>
              <Link
                to={`/profile/${authUser?.username}`}
                className="p-4 rounded-full hover:bg-stone-900 transition-all duration-300 flex items-center justify-center"
                title="Profile"
              >
                <FaUser className="w-7 h-7 min-w-[28px]" style={{ color: '#fff' }}  />
              </Link>
            </li>
          </ul>
          
          {/* Profile and logout */}
          {authUser && (
            <div className="flex flex-col items-center gap-2 mt-auto">
              <Link
                to={`/profile/${authUser.username}`}
                className="p-1 rounded-full hover:bg-[#181818] transition-all duration-300"
                title="Profile"
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-transparent hover:border-white">
                  <img 
                    src={authUser?.profileImg || "/avatar-placeholder.png"} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </Link>
              
              <button
                onClick={logout}
                className="p-4 rounded-full hover:bg-[#181818] transition-all duration-300"
                title="Logout"
              >
                <BiLogOut className="w-7 h-7" />
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Sidebar;