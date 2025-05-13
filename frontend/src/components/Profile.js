function Profile({user, playlistFollowers}) {
  return (
      <div className="bg-neutral-900 rounded-2xl p-5 mt-2 flex 
      justify-between bg-opacity-80 max-w-md shadow-lg shadow-green-900/50
      border-b border-green-300/80">
        <div className="flex flex-col">
          <h2 className="text-xl font-bold pb-3 pt-2">{user.name}</h2>
          <p className="text-gray-400 text-md">
            {playlistFollowers} Playlist Save
            {playlistFollowers > 1 ? " Counts" : " Count"}
          </p>
        </div>
        <img
          src={user.profilePicture}
          alt="User profile picture"
          className="w-20 h-20 rounded-full object-cover ml-4"
        />
      </div>
  );
}

export default Profile;
