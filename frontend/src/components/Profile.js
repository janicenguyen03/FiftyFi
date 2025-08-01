import { Info } from "lucide-react";
import Spinner from "./Spinner";
import { useEffect, useState } from "react";

function Profile({ user, playlistFollowers }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (playlistFollowers) {setLoading(false)}
    }, [playlistFollowers]);

    if (!user) return null;

    return (
        <div className="profile">
        <div className="flex flex-col">
            <h2 className="text-xl font-bold pb-3 pt-2">{user.name}</h2>
            {loading ? (<Spinner size="4" />) : (
            <div className="flex items-center text-gray-400 text-md cursor-pointer relative group">
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
            className="w-20 h-20 rounded-full object-cover ml-4"
        />
        </div>
    );
    }

    export default Profile;
