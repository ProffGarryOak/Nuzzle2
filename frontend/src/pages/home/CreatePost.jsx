import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmile } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const CreatePost = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const imgRef = useRef(null);
  const textareaRef = useRef(null);
  const [showEmojis, setShowEmojis] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });
  const queryClient = useQueryClient();

  const toggleEmojis = () => {
    setShowEmojis(!showEmojis);
  };

  const addEmoji = (emoji) => {
    const cursorPosition = textareaRef.current.selectionStart;
    const newText = 
      text.substring(0, cursorPosition) + 
      emoji.native + 
      text.substring(cursorPosition);
    setText(newText);
    setShowEmojis(false);
    // Focus back on textarea after adding emoji
    setTimeout(() => {
      textareaRef.current.focus();
      textareaRef.current.selectionStart = cursorPosition + emoji.native.length;
      textareaRef.current.selectionEnd = cursorPosition + emoji.native.length;
    }, 0);
  };

  const {
    mutate: createPost,
    isPending,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ text, img }) => {
      try {
        const res = await fetch("/api/posts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ text, img }),
        });
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    onSuccess: () => {
      setText("");
      setImg(null);
      toast.success("Post created successfully");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createPost({ text, img });
  };

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex p-4 items-start gap-4 rounded-lg border-2 border-[#9B7EBD] bg-[#fff] m-5 relative">
      <div className="avatar">
        <div className="w-8 rounded-full">
          <img src={authUser?.profileImg || "/avatar-placeholder.png"} alt="Profile" />
        </div>
      </div>
      <form
        className="flex flex-col gap-2 w-full bg-transparent"
        onSubmit={handleSubmit}
      >
        <textarea
          ref={textareaRef}
          className="textarea w-full p-0 text-lg resize-none border-none focus:outline-none bg-transparent text-black placeholder-gray-700"
          placeholder="What is happening?!"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {img && (
          <div className="relative w-72 mx-auto">
            <IoCloseSharp
              className="absolute top-0 right-0 text-white bg-[#3B1E54] rounded-full w-5 h-5 cursor-pointer hover:bg-[#9B7EBD]"
              onClick={() => {
                setImg(null);
                imgRef.current.value = null;
              }}
            />
            <img
              src={img}
              className="w-full mx-auto h-72 object-contain rounded"
              alt="Post preview"
            />
          </div>
        )}

        <div className="flex justify-between border-t pt-5 border-t-[#9B7EBD]">
          <div className="flex gap-3 items-center relative">
            <CiImageOn
              className="text-[#3B1E54] w-8 h-8 cursor-pointer hover:text-[#3b1e54]/80"
              onClick={() => imgRef.current.click()}
            />
            <BsEmojiSmile
              className="text-[#3B1E54] w-7 h-7 cursor-pointer hover:text-[#3b1e54]/80"
              onClick={toggleEmojis}
            />
            
            {showEmojis && (
              <div className="absolute top-10 left-0 z-10">
                <Picker
                  data={data}
                  onEmojiSelect={addEmoji}
                  theme="light"
                  previewPosition="none"
                  searchPosition="none"
                  skinTonePosition="none"
                />
              </div>
            )}
          </div>
          <input
            type="file"
            accept="image/*"
            hidden
            ref={imgRef}
            onChange={handleImgChange}
          />
          <button 
            className="btn rounded-full btn-sm text-white px-2 bg-[#3B1E54] hover:bg-[#3b1e54]/80 border-none"
            disabled={isPending || (!text.trim() && !img)}
          >
            <p className="mx-7 text-lg">{isPending ? "Posting..." : "Post"}</p>
          </button>
        </div>
        {isError && <div className="text-red-500">{error.message}</div>}
      </form>
    </div>
  );
};

export default CreatePost;