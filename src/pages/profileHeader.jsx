import { useRef, useState } from "react";
import { Camera, User } from "lucide-react";

function ProfileHeader() {
  const inputRef = useRef(null);

  const [picture, setPicture] = useState(
    () => localStorage.getItem("profilePic") || ""
  );


  const handleUpload = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image.");
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert("Image must be less than 2MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem("profilePic", reader.result);
        setPicture(reader.result);
      } catch {
        alert("Unable to save the image. Try a smaller picture.");
      }
    };

    reader.readAsDataURL(file);
    e.target.value = "";
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="relative w-14 h-14 rounded-full bg-green-100 flex items-center justify-center overflow-hidden"
          aria-label="Change profile picture"
        >
          {picture ? (
            <img
              src={picture}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          ) : (
            <User size={30} className="text-green-700" />
          )}

          <span className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-1">
            <Camera size={12} />
          </span>
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleUpload}
          className="hidden"
        />

       
      </div>

      
    </div>
  );
}

export default ProfileHeader;