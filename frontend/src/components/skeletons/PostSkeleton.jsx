const PostSkeleton = () => {
	return (
	  <div className='flex flex-col gap-4 w-full p-4 bg-[#b782e4]/20 rounded-lg border border-[#9B7EBD]'>
		{/* User info skeleton */}
		<div className='flex gap-4 items-center'>
		  <div className='bg-[#3B1E54]/30 animate-pulse w-10 h-10 rounded-full shrink-0'></div>
		  <div className='flex flex-col gap-2'>
			<div className='bg-[#3B1E54]/30 animate-pulse h-2 w-12 rounded-full'></div>
			<div className='bg-[#3B1E54]/30 animate-pulse h-2 w-24 rounded-full'></div>
		  </div>
		</div>
		
		{/* Post content skeleton */}
		<div className='bg-[#3B1E54]/30 animate-pulse h-40 w-full rounded-lg'></div>
		
		{/* Action buttons skeleton */}
		<div className='flex justify-between mt-2'>
		  <div className='bg-[#3B1E54]/30 animate-pulse h-6 w-6 rounded-full'></div>
		  <div className='bg-[#3B1E54]/30 animate-pulse h-6 w-6 rounded-full'></div>
		  <div className='bg-[#3B1E54]/30 animate-pulse h-6 w-6 rounded-full'></div>
		</div>
	  </div>
	);
  };
  
  export default PostSkeleton;