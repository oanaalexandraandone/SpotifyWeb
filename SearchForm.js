import { useEffect, useState } from "react";

const SearchForm = (props) => {
  const [genres, setGenres] = useState([]);

  const [genresPlaylist, setPlaylistGenres] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [songDetail, setSongDetail] = useState(null);

  const getGenres = async (token) => {
    const result = await fetch(props.GENRES, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await result.json();
    return data.categories.items;
  };

  const loadGenres = async () => {
    const data = await getGenres(props.access_token);
    setGenres(data);
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const getPlaylistByGenre = async (token, genreId) => {
    const limit = 15;
    let txt = props.GENRESBYID.replace("{{genreId}}", genreId);
    txt = txt.replace("{{limit}}", limit);
    const result = await fetch(txt, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });

    const data = await result.json();
    return data.playlists.items;
  };
  const loadPlaylistByGenre = async () => {
    const genreSelect = document.getElementById("select_genre");
    const genreId = genreSelect.options[genreSelect.selectedIndex].value;
    const playlist = await getPlaylistByGenre(props.access_token, genreId);
    setPlaylistGenres(playlist);
  };

  const getTracks = async (token, tracksEndPoint) => {
    const limit = 15;
    const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
      method: "GET",
      headers: { Authorization: "Bearer " + token },
    });
    const data = await result.json();
    return data.items;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const playlistSelect = document.getElementById("select_playlist");
    const tracksEndPoint =
      playlistSelect.options[playlistSelect.selectedIndex].value;
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
      <div className="search-form">
        <form onSubmit={handleSubmit}>
          <input type="hidden" id="hidden_token" />
          <input type="hidden" id="hidden_authURL" />
          <div className="col-sm-6 form-group row mt-4 px-0" id="divselGenre">
            <label htmlFor="Genre" className="form-label col-sm-2">
              Genre:
            </label>
            <select
              name=""
              id="select_genre"
              onChange={loadPlaylistByGenre}
              className="form-control form-control-sm col-sm-10"
            >
              <option>Select...</option>
              {
                <>
                  {genres.map((genre) => (
                    <option value={genre.id} key={genre.id}>
                      {genre.name}
                    </option>
                  ))}
                </>
              }
            </select>
          </div>
          <div className="col-sm-6 form-group row px-0" id="divselPlaylist">
            <label htmlFor="Genre" className="form-label col-sm-2">
              Playlists:
            </label>
            <select
              name=""
              id="select_playlist"
              className="form-control form-control-sm col-sm-10"
            >
              <option>Select...</option>
              {
                <>
                  {genresPlaylist.map((playlist) => (
                    <option
                      value={playlist.tracks.href}
                      key={playlist.tracks.href}
                    >
                      {playlist.name}
                    </option>
                  ))}
                </>
              }
            </select>
          </div>

          <div className="col-sm-6 row form-group px-0" id="divselSearchButton">
            <button
              type="submit"
              id="btn_submit"
              className="btn btn-success col-sm-12"
            >
              Search
            </button>
          </div>
        </form>
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
      </div>
    </>
  );
};

export default SearchForm;
