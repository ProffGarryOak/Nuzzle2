import { FaRegComment, FaComment } from "react-icons/fa";
import { BiRepost } from "react-icons/bi";
import { FaRegHeart, FaHeart } from "react-icons/fa";
import { FaRegBookmark } from "react-icons/fa6";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import { formatPostDate } from "../../utils/date";

const Post = ({ post }) => {
  const [comment, setComment] = useState("");
  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();
  const postOwner = post.user;
  const isLiked = post.likes.includes(authUser._id);
  const isMyPost = authUser._id === post.user._id;
  const formattedDate = formatPostDate(post.createdAt);

  const { mutate: deletePost, isPending: isDeleting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/${post._id}`, {
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
      toast.success("Post deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const { mutate: likePost, isPending: isLiking } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/like/${post._id}`, {
          method: "POST",
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: (updatedLikes) => {
      queryClient.setQueryData(["posts"], (oldData) => {
        return oldData.map((p) => {
          if (p._id === post._id) return { ...p, likes: updatedLikes };
          return p;
        });
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: commentPost, isPending: isCommenting } = useMutation({
    mutationFn: async () => {
      try {
        const res = await fetch(`/api/posts/comment/${post._id}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text: comment }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Something went wrong");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      toast.success("Comment posted successfully");
      setComment("");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDeletePost = () => deletePost();
  const handlePostComment = (e) => {
    e.preventDefault();
    if (!isCommenting) commentPost();
  };
  const handleLikePost = () => {
    if (!isLiking) likePost();
  };

  return (
    <div className="flex gap-2 items-start bg-[#eeeeee] p-4 m-4 border-0 rounded-xl border-[#9B7EBD]">
      <div className="avatar">
        <Link to={`/profile/${postOwner.username}`} className="w-8 rounded-full overflow-hidden">
          <img
            src={postOwner.profileImg || "/avatar-placeholder.png"}
            className="w-20 h-20 object-cover rounded"
            alt="Profile"
          />
        </Link>
      </div>

      <div className="flex flex-col flex-1">
        <div className="flex gap-2 items-center text-[#3B1E54]">
          <Link to={`/profile/${postOwner.username}`} className="font-bold">
            {postOwner.fullName}
          </Link>
          <span className="text-gray-700 flex gap-1 text-sm">
            <Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
            <span>·</span>
            <span>{formattedDate}</span>
          </span>
          {isMyPost && (
            <span className="flex justify-end flex-1">
              {!isDeleting && (
                <FaTrash
                  className="cursor-pointer hover:text-[#8d3082]"
                  onClick={handleDeletePost}
                />
              )}
              {isDeleting && <LoadingSpinner size="sm" />}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 mt-5 overflow-hidden text-black mr-9">
          <span>{post.text}</span>
          {post.img && (
            <img
              src={post.img}
              className="h-80 object-contain rounded-lg mt-2 bg-gray-300"
              alt="Post content"
            />
          )}
        </div>

        <div className="flex justify-between mt-3">
          <div className="flex gap-4 items-center  justify-between">
            {/* Like Button */}
            <div className="flex gap-1 items-center group cursor-pointer" onClick={handleLikePost}>
              {isLiking && <LoadingSpinner size="sm" />}
              {!isLiked && !isLiking && (
                <FaRegHeart className="w-5 h-5 cursor-pointer text-slate-500 group-hover:text-[#3B1E54]" />
              )}
              {isLiked && !isLiking && (
                <FaHeart className="w-5 h-5 cursor-pointer text-[#3B1E54] fill-[#3B1E54]" />
              )}
              <span
                className={`text-sm group-hover:text-[#3B1E54] ${
                  isLiked ? "text-[#3B1E54]" : "text-slate-500"
                }`}
              >
                {post.likes.length}
              </span>
            </div>

            {/* Comment Button */}
            <div
              className="flex gap-1 items-center group cursor-pointer"
              onClick={() => document.getElementById(`comments_modal${post._id}`).showModal()}
            >
              <FaRegComment className="w-5 h-5 text-slate-500 group-hover:text-[#3B1E54]" />
              <span className="text-sm text-slate-500 group-hover:text-[#3B1E54]">
                {post.comments.length}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Comments Modal */}
      <dialog id={`comments_modal${post._id}`} className="modal">
        <div className="modal-box bg-[#eeeeee] border-2 border-[#9B7EBD] rounded-lg">
          <h3 className="font-bold text-lg text-[#3B1E54] mb-4">COMMENTS</h3>
          <div className="flex flex-col gap-3 max-h-60 overflow-auto">
            {post.comments.length === 0 ? (
              <p className="text-sm text-slate-500">No comments yet 🤔 Be the first one 😉</p>
            ) : (
              post.comments.map((comment) => (
                <div key={comment._id} className="flex gap-2 items-start p-3 bg-white rounded-lg">
                  <div className="avatar">
                    <div className="w-8 rounded-full">
                      <img
                        src={comment.user.profileImg || "/avatar-placeholder.png"}
                        alt="Commenter profile"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <div className="flex items-center gap-1">
                      <span className="font-bold text-[#3B1E54]">{comment.user.fullName}</span>
                      <span className="text-gray-700 text-sm">@{comment.user.username}</span>
                    </div>
                    <div className="text-sm text-gray-800">{comment.text}</div>
                  </div>
                </div>
              ))
            )}
          </div>
          <form
            className="flex gap-2 items-center mt-4 border-t border-[#9B7EBD] pt-4"
            onSubmit={handlePostComment}
          >
            <textarea
              className="textarea w-full p-2 rounded border border-[#9B7EBD] focus:outline-none bg-white text-black"
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
            <button
              className="btn btn-sm text-white bg-[#3B1E54] hover:bg-[#3B1E54]/90 border-none rounded-full px-4"
              disabled={isCommenting}
            >
              {isCommenting ? <LoadingSpinner size="md" /> : "Post"}
            </button>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
};

export default Post;