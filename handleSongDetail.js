import { useState } from "react";

const HandleSongDetail = (e, access_token) => {
    const [songDetail, setSongDetail] = useState(null);
    const getTrack = async (token, trackEndPoint) => {
        const result = await fetch(`${trackEndPoint}`, {
            method: "GET",
            headers: { Authorization: "Bearer " + token },
        });
        const data = await result.json();
        return data;
    };

    const songDetailGetter = async (e, access_token) => {
        const trackEndpoint = "https://api.spotify.com/v1/tracks/" + e.target.id;
        const track = await getTrack(access_token, trackEndpoint);
        setSongDetail(track);
    };
    songDetailGetter(e, access_token)
}

export default HandleSongDetail;