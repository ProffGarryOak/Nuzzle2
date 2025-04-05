const ProfileHeaderSkeleton = () => {
	return (
	  <div className='flex flex-col gap-2 w-full my-2 p-4 bg-[#b782e4]/10 rounded-lg'>
		<div className='flex gap-2 items-center'>
		  <div className='flex flex-1 gap-1'>
			<div className='flex flex-col gap-1 w-full'>
			  <div className='bg-[#3B1E54]/30 animate-pulse h-4 w-12 rounded-full'></div>
			  <div className='bg-[#3B1E54]/30 animate-pulse h-4 w-16 rounded-full'></div>
			  <div className='bg-[#3B1E54]/20 animate-pulse h-40 w-full relative rounded-t-lg'>
				<div className='bg-[#3B1E54]/30 animate-pulse h-20 w-20 rounded-full border-4 border-[#b782e4] absolute -bottom-10 left-3'></div>
			  </div>
			  <div className='bg-[#9B7EBD]/40 animate-pulse h-6 mt-4 w-24 ml-auto rounded-full'></div>
			  <div className='bg-[#3B1E54]/20 animate-pulse h-4 w-14 rounded-full mt-4'></div>
			  <div className='bg-[#3B1E54]/20 animate-pulse h-4 w-20 rounded-full'></div>
			  <div className='bg-[#3B1E54]/20 animate-pulse h-4 w-2/3 rounded-full'></div>
			</div>
		  </div>
		</div>
	  </div>
	);
  };
  export default ProfileHeaderSkeleton;