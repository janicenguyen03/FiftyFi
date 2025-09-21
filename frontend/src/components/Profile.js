import { Info } from "lucide-react";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";

function Profile({ user, playlistFollowers }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (playlistFollowers) {
      setLoading(false);
    }
  }, [playlistFollowers]);

  if (!user) return null;

  return (
    <div className="profile">
      <div className="flex flex-col">
        <h2 className="md:text-xl text-lg font-bold md:pb-3 md:pt-2 pb-1">
          {user.name}
        </h2>
        {loading ? (
          <Spinner size="4" />
        ) : (
          <div className="flex items-center text-gray-400 md:text-md text-sm cursor-pointer relative group">
            <p>
              {playlistFollowers} Playlist Save
              {playlistFollowers > 1 ? "s" : ""}
            </p>
            <div className="relative group ml-2">
              <Info className="w-4 h-4 text-gray-400" />
            </div>
            <div className="tooltip top-full">
              Total number of times your playlists <br />
              have been saved by other Spotify users.
            </div>
          </div>
        )}
      </div>
      <img
        src={user.profilePicture}
        alt="User profile"
        className="md:w-20 md:h-20 w-12 h-12 rounded-full object-cover ml-4"
      />
    </div>
  );
}

export default Profile;
