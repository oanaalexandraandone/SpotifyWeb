    const clientId = '';
    const clientSecret = '';
    const TOKEN =  'https://accounts.spotify.com/api/token';
    const GENRES = `https://api.spotify.com/v1/browse/categories`;
    const GENRESBYID = `https://api.spotify.com/v1/browse/categories/{{genreId}}/playlists?limit={{limit}}`;
    const PLAYLISTS = 'https://api.spotify.com/v1/me/playlists';
    const AUTHORIZE = "https://accounts.spotify.com/authorize";
    var redirect_uri = "http://127.0.0.1:5500/index.html";
    const authURL = "https://accounts.spotify.com/authorize?client_id="+clientId+"&response_type=code&redirect_uri=http://127.0.0.1:5500/index.html&show_dialog=true&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private"; 
    var access_token= null;
    var refresh_token = null;
    var flagCalled= false;
    const DOMElements = {
        selectGenre: '#select_genre',
        selectPlaylist: '#select_playlist',
        selectUserPlaylist: '#select_userplaylist',
        buttonSubmit: '#btn_submit',
        buttonAuth:'#btn_auth',
        divSongDetail: '#song-detail',
        hfToken: '#hidden_token',
        divSonglist: '.song-list',
        divUserSongList: '.usersong-list',
        hfAuth: '#hidden_authURL',
    }


    const getCurrentUser = async (token) => {
        const result = await fetch("https://api.spotify.com/v1/me", {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }
  //AUTH PART
    {
 function onPageLoad(){
     showFields();
            if ( window.location.search.length > 0 ){
                handleRedirect();
            }
            else{
                access_token = localStorage.getItem("access_token");
                if ( access_token == null ){
                }
                else {
                    APPController.init();
                    APPController.loadUserInfo();
                }
            }
        }
    
function showFields(){
    console.log(flagCalled);
    if(flagCalled){
    document.getElementById("divselUserPlaylist").style.display = "block";
    }
}

        
function getCode(){
    let code = null;
    const queryString = window.location.search;
    if ( queryString.length > 0 ){
        const urlParams = new URLSearchParams(queryString);
        code = urlParams.get('code')
    }
    console.log("code:", code);
    return code;
}

function handleRedirect(){
    let code = getCode();
    fetchAccessToken(code);
    flagCalled=true;
    window.history.pushState("", "", redirect_uri); 
}


function fetchAccessToken(code ){
    let body = "grant_type=authorization_code";
    body += "&code=" + code; 
    body += "&redirect_uri=" + encodeURI(redirect_uri);
    body += "&client_id=" + clientId;
    body += "&client_secret=" + clientSecret;
    console.log("in fetch access token");
    callAuthorizationApi(body);
}


function refreshAccessToken(){
    refresh_token = localStorage.getItem("refresh_token");
    let body = "grant_type=refresh_token";
    body += "&refresh_token=" + refresh_token;
    body += "&client_id=" + clientId;
    callAuthorizationApi(body);
}

function callAuthorizationApi(body){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", TOKEN, true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.setRequestHeader('Authorization', 'Basic ' + btoa(clientId + ":" + clientSecret));
    xhr.send(body);
    xhr.onload = handleAuthorizationResponse;
}

function handleAuthorizationResponse(){
    if ( this.status == 200 ){
        var data = JSON.parse(this.responseText);
        console.log(data);
        var data = JSON.parse(this.responseText);
        if ( data.access_token != undefined ){
            access_token = data.access_token;
            localStorage.setItem("access_token", access_token);
        }
        if ( data.refresh_token  != undefined ){
            refresh_token = data.refresh_token;
            localStorage.setItem("refresh_token", refresh_token);
        }
        onPageLoad();
    }
    else {
        alert(this.responseText);
    }
}


function requestAuthorization(){
let url = AUTHORIZE;
url += "?client_id=" + clientId;
url += "&response_type=code";
url += "&redirect_uri=" + encodeURI(redirect_uri);
url += "&show_dialog=true";
url += "&scope=user-read-private user-read-email user-modify-playback-state user-read-playback-position user-library-read streaming user-read-playback-state user-read-recently-played playlist-read-private";
window.location.href = url;}
}

 


const APIController = (function() {
    
    const _getGenres = async (token) => {

        const result = await fetch(GENRES, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.categories.items;
    }

    const _getPlaylistByGenre = async (token, genreId) => {

        const limit = 15;
        txt = GENRESBYID.replace("{{genreId}}", genreId);
        txt=txt.replace("{{limit}}", limit);
        const result = await fetch(txt, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });

        const data = await result.json();
        return data.playlists.items;
    }

    const _getTracks = async (token, tracksEndPoint) => {
        const limit = 15;
        const result = await fetch(`${tracksEndPoint}?limit=${limit}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data.items;
    }

    const _getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: 'GET',
            headers: { 'Authorization' : 'Bearer ' + token}
        });
        const data = await result.json();
        return data;
    }

    const _getUserPlaylists = async (token) =>{
        const result = await fetch (PLAYLISTS, {
            method: 'GET', 
            headers: { 'Authorization': 'Bearer ' + token}
        }); 
        const data = await result.json();
        return data.items;
    }

    

    return {
        getGenres(token) {
            return _getGenres(token);
        },
        getPlaylistByGenre(token, genreId) {
            return _getPlaylistByGenre(token, genreId);
        },
        getTracks(token, tracksEndPoint) {
            return _getTracks(token, tracksEndPoint);
        },
        getTrack(token, trackEndPoint) {
            return _getTrack(token, trackEndPoint);
        }, 
        getUserPlaylists(token){
            return _getUserPlaylists(token);
        }
    }
})();



const UIController = (function() {
  
    return {
        inputField() {
            return {
                genre: document.querySelector(DOMElements.selectGenre),
                playlist: document.querySelector(DOMElements.selectPlaylist),
                userplaylist: document.querySelector(DOMElements.selectUserPlaylist),
                tracks: document.querySelector(DOMElements.divSonglist),
                submit: document.querySelector(DOMElements.buttonSubmit),
                authorize: document.querySelector(DOMElements.buttonAuth),
                songDetail: document.querySelector(DOMElements.divSongDetail)
            }
        },

        createGenre(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectGenre).insertAdjacentHTML('beforeend', html);
        }, 

        createPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectPlaylist).insertAdjacentHTML('beforeend', html);
        },
        createUserPlaylist(text, value) {
            const html = `<option value="${value}">${text}</option>`;
            document.querySelector(DOMElements.selectUserPlaylist).insertAdjacentHTML('beforeend', html);
        },

        createTrack(id, name) {
            const html = `<a href="#" class="list-group-item list-group-item-action list-group-item-light" id="${id}">${name}</a>`;
            document.querySelector(DOMElements.divSonglist).insertAdjacentHTML('beforeend', html);
        },

        createTrackDetail(img, title, artist) {

            const detailDiv = document.querySelector(DOMElements.divSongDetail);
            // any time user clicks a new song, we need to clear out the song detail div
            detailDiv.innerHTML = '';

            const html = 
            `
            <div class="row col-sm-12 px-0">
                <img src="${img}" alt="">        
            </div>
            <div class="row col-sm-12 px-0">
                <label for="Genre" class="form-label col-sm-12">${title}:</label>
            </div>
            <div class="row col-sm-12 px-0">
                <label for="artist" class="form-label col-sm-12">By ${artist}:</label>
            </div> 
            `;

            detailDiv.insertAdjacentHTML('beforeend', html)
        },

        resetTrackDetail() {
            this.inputField().songDetail.innerHTML = '';
        },

        resetTracks() {
            this.inputField().tracks.innerHTML = '';
            this.resetTrackDetail();
        },

        resetPlaylist() {
            this.inputField().playlist.innerHTML = '';
            this.resetTracks();
        },
        
        storeToken(value) {
            document.querySelector(DOMElements.hfToken).value = value;
        },

        getStoredToken() {
            return {
                token: document.querySelector(DOMElements.hfToken).value
            }
        },
    }

})();

const APPController = (function(UICtrl, APICtrl) {

    const DOMInputs = UICtrl.inputField();
  
    const loadGenres = async () => {
        const genres = await APICtrl.getGenres(access_token);
        genres.forEach(element => UICtrl.createGenre(element.name, element.id));
    }

    const loadUserPlaylist= async() => {
        if(access_token!=null){
            const userPlaylist = await APICtrl.getUserPlaylists(access_token);
            userPlaylist.forEach(element => UICtrl.createUserPlaylist(element.name, element.id));
            
        }else{
            console.log("access token not valid");
        }
    }

    DOMInputs.genre.addEventListener('change', async () => {
        UICtrl.resetPlaylist();
        //const token = UICtrl.getStoredToken().token;        
        const genreSelect = UICtrl.inputField().genre;       
        const genreId = genreSelect.options[genreSelect.selectedIndex].value;             
        const playlist = await APICtrl.getPlaylistByGenre(access_token, genreId);       
        playlist.forEach(p => UICtrl.createPlaylist(p.name, p.tracks.href));
    });
     

    DOMInputs.submit.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTracks();
        //if playist selected, else userplaylist 
        const playlistSelect = UICtrl.inputField().playlist;
        const tracksEndPoint = playlistSelect.options[playlistSelect.selectedIndex].value;
        const tracks = await APICtrl.getTracks(access_token, tracksEndPoint);
        tracks.forEach(el => UICtrl.createTrack(el.track.href, el.track.name))
        
    });

    DOMInputs.tracks.addEventListener('click', async (e) => {
        e.preventDefault();
        UICtrl.resetTrackDetail();
        const trackEndpoint = e.target.id;
        const track = await APICtrl.getTrack(access_token, trackEndpoint);
        UICtrl.createTrackDetail(track.album.images[2].url, track.name, track.artists[0].name);
    });    

    
    return {
        init() {
            console.log('App is starting'); 
            loadGenres();
        }, 
        loadUserInfo(){
            loadUserPlaylist();
        }
    }

})(UIController, APIController);

APPController.init();
