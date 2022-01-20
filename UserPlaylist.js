import { useEffect, useState } from "react";

const UserPlaylist = (props) => {
  const [userPlaylist, setUserPlaylist] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [songDetail, setSongDetail] = useState(null);

  const getUserPlaylists = async (token) => {
    const result = await fetch(props.PLAYLISTS, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await result.json();
    return data.items;
  };

  const loadUserPlaylist = async () => {
    const userPlaylist = await getUserPlaylists(props.access_token);
    setUserPlaylist(userPlaylist);
  };
  useEffect(() => {
    loadUserPlaylist();
  }, []);

  const getTracks = async (token, tracksEndPoint) => {
    const limit = 15;
    const result = await fetch(
      `https://api.spotify.com/v1/playlists/${tracksEndPoint}/tracks?limit=${limit}`,
      {
        method: "GET",
        headers: { Authorization: "Bearer " + token },
      }
    );
    const data = await result.json();
    return data.items;
  };

  const handleChange = async (e) => {
    e.preventDefault();
    const playlistSelect = document.getElementById("select_userplaylist");
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
    console.log(tracksEndPoint);
    const tracks = await getTracks(props.access_token, tracksEndPoint);
    setTracks(tracks);
  };

  const getTrack = async (token, trackEndPoint) => {
    const result = await fetch(`${trackEndPoint}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await result.json();
    return data;
  };

  const handleSongDetail = async (e) => {
    const trackEndpoint = "https://api.spotify.com/v1/tracks/" + e.target.id;
    const track = await getTrack(props.access_token, trackEndpoint);
    setSongDetail(track);
  };

  return (
    <>
      <div className="col-sm-6 form-group row px-0" id="divselUserPlaylist">
        <label htmlFor="UserPlaylist" className="form-label col-sm-2">
          User's Playlists:
        </label>
        <select
          onChange={handleChange}
          name=""
          id="select_userplaylist"
          className="form-control form-control-sm col-sm-10"
        >
          <option>Select...</option>
          {
            <>
              {userPlaylist.map((playlist) => (
                <option value={playlist.id} key={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </>
          }
        </select>
      </div>
      <div className="row">
        <div className="col-sm-6 px-0">
          <div className="list-group song-list" onClick={handleSongDetail}>
            {
              <>
                {tracks.map((track) => (
                  <a
                    href="#"
                    key={track.track.id}
                    className="list-group-item list-group-item-action list-group-item-light"
                    id={track.track.id}
                  >
                    {track.track.name}
                  </a>
                ))}
              </>
            }
          </div>
        </div>
        <div className="offset-md-1 col-sm-4" id="song-detail">
          {songDetail && (
            <>
              <div className="row col-sm-12 px-0">
                <img src={songDetail.album.images[2].url} alt="" />
              </div>
              <div className="row col-sm-12 px-0">
                <label htmlFor="Genre" className="form-label col-sm-12">
                  {songDetail.name}
                </label>
              </div>
              <div className="row col-sm-12 px-0">
                <label htmlFor="artist" className="form-label col-sm-12">
                  By {songDetail.artists[0].name}:
                </label>
              </div>
            </>
          )}
        </div>
      </div>{" "}
    </>
  );
};

export default UserPlaylist;
