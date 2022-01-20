import SearchForm from './SearchForm';
import UserPlaylist from './UserPlaylist';
import AuthorizeAccess from './AuthorizeAccess';
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthorizeOrNot from './AuthorizeOrNot';


function App() {

  const clientId = '4af48ef99f2241709f14de5726745034';
  const clientSecret = '73cd78e409cf44b186c1ac3a827e9335';
  const redirect_uri = "http://localhost:3000";
  const GENRES = `https://api.spotify.com/v1/browse/categories`;
  const GENRESBYID = `https://api.spotify.com/v1/browse/categories/{{genreId}}/playlists?limit={{limit}}`;
  const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists';
  const accessToken = localStorage.access_token;


  return (
    <Router>
      <div className="App">
            <AuthorizeAccess clientId={clientId} clientSecret={clientSecret} redirectUri={redirect_uri} />
            <AuthorizeOrNot access_token={accessToken} />
        <Switch path="/">
          <Route exact path="/">
            <SearchForm access_token={accessToken} GENRESBYID={GENRESBYID} GENRES={GENRES} />
          </Route>
          <Route path="/user-playlist">
            <UserPlaylist access_token={accessToken} PLAYLISTS={PLAYLISTS} />
          </Route>
        </Switch>
      </div>

    </Router>
  );
}

export default App;
