
import { useEffect, useRef, useState } from "react";
import { Camera, User } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useAuth } from "../context/Authcontext";

function ProfileHeader() {
  const inputRef = useRef(null);
  const { user } = useAuth();

  const [picture, setPicture] = useState("");
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  // Load the saved picture from Supabase.
  useEffect(() => {
    let active = true;

    async function loadPicture() {
      if (!user) {
        setPicture("");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("avatar_url")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error("Could not load profile picture:", error.message);
        return;
      }

      if (active) {
        setPicture(data?.avatar_url || "");
      }
    }

    loadPicture();

    return () => {
      active = false;
    };
  }, [user]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setMessage("");

    if (!user) {
      setMessage("Please log in first.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setMessage("Please select an image.");
      e.target.value = "";
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setMessage("Image must be less than 2MB.");
      e.target.value = "";
      return;
    }

    setUploading(true);

    try {
      // Each user has their own folder.
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const filePath = `${user.id}/${Date.now()}-${safeName}`;

      // Upload the image to Supabase Storage.
      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file, {
          contentType: file.type,
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Get the public image URL.
      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath);

      const avatarUrl = urlData.publicUrl;

      // Save the URL to the user's profile.
      const { data: profile, error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: avatarUrl })
        .eq("id", user.id)
        .select("id")
        .maybeSingle();

      if (updateError) throw updateError;

      // Create a profile if one doesn't exist yet.
      if (!profile) {
        const { error: insertError } = await supabase
          .from("profiles")
          .insert({
            id: user.id,
            avatar_url: avatarUrl,
            full_name:
              user.user_metadata?.full_name || user.email || "User",
          });

        if (insertError) throw insertError;
      }

      setPicture(avatarUrl);
      setMessage("Profile picture saved successfully!");
    } catch (error) {
      console.error("Profile picture upload failed:", error.message);
      setMessage(error.message || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex items-center justify-between p-4 rounded-2xl shadow-sm">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="relative w-14 h-14 rounded-full bg-green-100 flex items-center justify-center overflow-hidden disabled:opacity-60"
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

        {uploading && (
          <p className="text-sm text-gray-500">Uploading...</p>
        )}
      </div>

      {message && (
        <p className="text-xs max-w-40 break-words text-gray-600">
          {message}
        </p>
      )}
    </div>
  );
}

export default ProfileHeader;
