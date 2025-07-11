import { useState, useEffect } from "react";
import { ExternalLink } from "lucide-react";
import Spinner from "./Spinner";

function PlayTrack({ track }) {
  // const audioRef = useRef(null);
  const [loading, setLoading] = useState(true);
  // const [isPlaying, setIsPlaying] = useState(false);

  // function togglePlay() {
  //   const audio = audioRef.current;
  //   if (!audio) return;
    
  //   if (audio.paused) {
  //     audio.play();
  //     setIsPlaying(true);
  //   } else {
  //     audio.pause();
  //     setIsPlaying(false);
  //   }

  //   audio.onended = () => {
  //     setIsPlaying(false);
  //   };
  // }

  useEffect(() => {
    if (track) {
      setLoading(false);
    }
  }, [track]);

  return (
    <div className="home-card play-track-card">
      {loading ? (<Spinner size="4"/>) : (
        <div className="general">
          <img src={track.image} alt={track.name}/>
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <h2>{track.name}</h2>
              <div className="relative group">
                <a href={track.spotifyUrl} target="_blank" rel="noopener noreferrer">
                  <ExternalLink size={16} className="external-link" />
                </a>
                <div className="tooltip bottom-full">Open in Spotify</div>
              </div>
            </div>
            <p className="text-neutral-400 lg:text-lg">{track.artists}</p>

            {/* Preview Url for further implementation */}
            {/* {track.previewUrl && (
            <div>
              <button onClick={togglePlay}
                className="bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 shadow-md hover:scale-105 transition-transform w-fit"
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                <span>{isPlaying ? "Pause" : "Play Preview"}</span>
              </button>

              <audio ref={audioRef} src={track.previewUrl} preload="none" />
            </div>
          )} */}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlayTrack;
