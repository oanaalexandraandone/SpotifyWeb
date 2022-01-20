import { useEffect, useState } from "react";
import { Link } from "react-router-dom";


const AuthorizeAccess = (props) => {
    const clientId = props.clientId; const clientSecret = props.clientSecret; const redirect_uri = props.redirectUri;
    const AUTHORIZE = "https://accounts.spotify.com/authorize";
    const TOKEN = 'https://accounts.spotify.com/api/token';

    const [url, setUrl] = useState(AUTHORIZE);
    useEffect(() => {
        handleRedirect();
    }, [url])
    function requestAuthorization() {
        let url = AUTHORIZE;
        url += "?client_id=" + clientId;
        url += "&response_type=code";
        url += "&redirect_uri=" + encodeURI(redirect_uri);
        url += "&show_dialog=true";
        url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
        window.location.href = url;
        setUrl(AUTHORIZE);
    }

    function handleRedirect() {
        if (window.location.search.length > 0) {
            let code = getCode();
            fetchAccessToken(code);
            window.history.pushState("", "", redirect_uri);
        }
    }

    function getCode() {
        let code = null;
        const queryString = window.location.search;
        if (queryString.length > 0) {
            const urlParams = new URLSearchParams(queryString);
            code = urlParams.get('code')
        }
        return code;
    }

    function fetchAccessToken(code) {
        let body = "grant_type=authorization_code";
        body += "&code=" + code;
        body += "&redirect_uri=" + encodeURI(redirect_uri);
        body += "&client_id=" + clientId;
        body += "&client_secret=" + clientSecret;
        console.log("in fetch access token");
        callAuthorizationApi(body);
    }

    function callAuthorizationApi(body) {
        let xhr = new XMLHttpRequest();
        xhr.open("POST", TOKEN, true);
        xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
        xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
        xhr.send(body);
        xhr.onload = handleAuthorizationResponse;
    }

    function handleAuthorizationResponse() {
        if (this.status == 200) {
            let data = JSON.parse(this.responseText);
            console.log(data);

            if (data.access_token != undefined) {
                let access_token = data.access_token;
                localStorage.setItem("access_token", access_token);
            }
            if (data.refresh_token != undefined) {
                let refresh_token = data.refresh_token;
                localStorage.setItem("refresh_token", refresh_token);
            }
        }
    }
    return (
        <nav className="navbar navbar-light bg-light justify-content-between">
            <span className="navbar-brand">Authorize first to use site</span>
            <Link to="/">Home</Link>
            <Link to="/user-playlist">User Playlist</Link>
            <button type="button" id="btn_auth" className="btn btn-success" onClick={ requestAuthorization } value="Request Auth">Authorize Access</button>
        </nav>
    );
}

export default AuthorizeAccess;



