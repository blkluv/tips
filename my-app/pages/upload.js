import { useState, useRef } from "react";
import { BiCloud, BiMusic, BiPlus } from "react-icons/bi";
import Layout from "../components/Layout";

function Upload() {
  // Creating state for the input field
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [thumbnail, setThumbnail] = useState("");
  const [video, setVideo] = useState("");

  //  Creating a ref for thumbnail and video
  const thumbnailRef = useRef();
  const videoRef = useRef();

  const addPost = () => {
    // Add logic to handle the post creation here
  };

  return (
    <Layout title="Upload">
      <div className="w-full h-screen bg-[#1a1c1f] flex flex-row">
        <header className="flex-shrink-0">
          {/* Header content */}
          <nav className="flex items-center h-16 px-6 bg-black text-white">
            <div className="flex items-center gap-4">
              <BiCloud size={24} />
              <h1 className="text-xl">LUV NFT</h1>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <BiMusic size={24} />
              <BiPlus size={24} />
            </div>
          </nav>
        </header>
        <main className="flex-1 flex flex-col items-center gap-5">
          {/* Content of the Upload page */}
          <div>
            <label className="text-[#9CA3AF] mt-10">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write Something..."
              className="w-[100%] text-white h-32 placeholder:text-gray-600 rounded-md mt-2 p-2 border bg-[#1a1c1f] border-[#444752] focus:outline-none"
            />
          </div>
          <div>
            <label className="text-[#9CA3AF] mt-10">Image</label>

            <div
              onClick={() => {
                thumbnailRef.current.click();
              }}
              className="border-2 w-64 border-gray-600 border-dashed rounded-md mt-2 p-2 h-36 items-center justify-center flex"
            >
              {thumbnail ? (
                <img
                  onClick={() => {
                    thumbnailRef.current.click();
                  }}
                  src={URL.createObjectURL(thumbnail)}
                  alt="thumbnail"
                  className="h-full rounded-md"
                />
              ) : (
                <BiPlus size={40} color="gray" />
              )}
            </div>
          </div>

          <button
            className="items-center bg-gradient-to-r from-pink-500 to-purple-400 rounded-full font-medium p-2 shadow-lg m-4 w-24"
            onClick={addPost}
          >
            <span role="img" aria-label="Sparkles">
              ✨
            </span>
          </button>
        </main>
      </div>
    </Layout>
  );
}

export default Upload;
