import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    username: "",
    email: "",
    bio: "",
    link: "",
    newPassword: "",
    currentPassword: "",
  });

  const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (authUser) {
      setFormData({
        fullName: authUser.fullName,
        username: authUser.username,
        email: authUser.email,
        bio: authUser.bio,
        link: authUser.link,
        newPassword: "",
        currentPassword: "",
      });
    }
  }, [authUser]);

  return (
    <>
      <button
        className='btn bg-[#3B1E54] text-white rounded-full px-6 hover:bg-[#3B1E54]/90'
        onClick={() => document.getElementById("edit_profile_modal").showModal()}
      >
        Edit profile
      </button>
      
      <dialog id='edit_profile_modal' className='modal'>
        <div className='modal-box bg-[#eeeeee] border-4 border-[#9B7EBD] rounded-xl p-6 w-full max-w-2xl'>
          <h3 className='font-bold text-2xl text-[#3B1E54] mb-6'>Update Profile</h3>
          <form
            className='flex flex-col gap-4'
            onSubmit={(e) => {
              e.preventDefault();
              updateProfile(formData);
            }}
          >
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Full Name */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>Full Name</label>
                <input
                  type='text'
                  placeholder='Full Name'
                  className='input bg-white text-black border-2 border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.fullName}
                  name='fullName'
                  onChange={handleInputChange}
                />
              </div>

              {/* Username */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>Username</label>
                <input
                  type='text'
                  placeholder='Username'
                  className='input bg-white border-2 text-black border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.username}
                  name='username'
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>Email</label>
                <input
                  type='email'
                  placeholder='Email'
                  className='input bg-white border-2 text-black border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.email}
                  name='email'
                  onChange={handleInputChange}
                />
              </div>

              {/* Link */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>Website Link</label>
                <input
                  type='text'
                  placeholder='https://example.com'
                  className='input bg-white border-2  text-black border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.link}
                  name='link'
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Bio (full width) */}
            <div className='flex flex-col gap-2'>
              <label className='text-[#3B1E54] font-medium'>Bio</label>
              <textarea
                placeholder='Tell us about yourself...'
                className='textarea bg-white border-2 text-black border-[#9B7EBD] rounded-lg p-3 h-24 focus:outline-none focus:border-[#3B1E54]'
                value={formData.bio}
                name='bio'
                onChange={handleInputChange}
              />
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
              {/* Current Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>Current Password</label>
                <input
                  type='password'
                  placeholder='Current Password'
                  className='input bg-white border-2  text-black border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.currentPassword}
                  name='currentPassword'
                  onChange={handleInputChange}
                />
              </div>

              {/* New Password */}
              <div className='flex flex-col gap-2'>
                <label className='text-[#3B1E54] font-medium'>New Password</label>
                <input
                  type='password'
                  placeholder='New Password'
                  className='input bg-white border-2  text-black border-[#9B7EBD] rounded-lg p-3 focus:outline-none focus:border-[#3B1E54]'
                  value={formData.newPassword}
                  name='newPassword'
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className='flex justify-end gap-3 mt-4'>
              <button 
                type='button'
                onClick={() => document.getElementById('edit_profile_modal').close()}
                className='btn bg-[#eeeeee] text-[#3B1E54] border-2 border-[#3B1E54] rounded-lg px-6 hover:bg-[#3B1E54]/10'
              >
                Cancel
              </button>
              <button 
                type='submit'
                className='btn bg-[#3B1E54] text-white rounded-lg px-6 hover:bg-[#3B1E54]/90'
                disabled={isUpdatingProfile}
              >
                {isUpdatingProfile ? (
                  <span className='flex items-center gap-2'>
                    <span className='loading loading-spinner loading-sm'></span>
                    Updating...
                  </span>
                ) : 'Update'}
              </button>
            </div>
          </form>
        </div>
        <form method='dialog' className='modal-backdrop'>
          <button className='outline-none'>close</button>
        </form>
      </dialog>
    </>
  );
};

export default EditProfileModal;