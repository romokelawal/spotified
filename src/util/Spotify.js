let accessToken;
const clientID = process.env.REACT_APP_CLIENT_ID;
const redirectURI = process.env.REACT_APP_REDIRECT_URI;

export const Spotify = {
	getAccessToken() {
		if (accessToken) {
			return accessToken;
		}

		// check for accessToken and expiration
		const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
		const expirationMatch = window.location.href.match(/expires_in=([^&]*)/);

		if (accessTokenMatch && expirationMatch) {
			accessToken = accessTokenMatch[1];
			const expiration = Number(expirationMatch[1]);

			// clear accesstoken after
			window.setTimeout(() => accessToken = '', expiration * 1000);
			window.history.pushState('Access Token', null, '/');
			return accessToken;
		} else {
			const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
			window.location = accessUrl;
		}
	},

	search(term) {
		const accessToken = Spotify.getAccessToken();
		return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`, {
			headers: {
				Authorization: `Bearer ${accessToken}`
			}
		})
			.then((response) => {
				return response.json();
			})
			.then((jsonResponse) => {
				if (!jsonResponse.tracks) {
					return [];
				}
				return jsonResponse.tracks.items.map((track) => ({
					id: track.id,
					name: track.name,
					artist: track.artists[0].name,
					album: track.album.name,
					uri: track.uri
				}));
			});
	},

	savePlayList(name, trackURIs) {
		if (!name || !trackURIs.length) {
			return;
		}
		let accessToken = Spotify.getAccessToken();
		let headers = {
			Authorization: `Bearer ${accessToken}`
		};
		let userID;

		return fetch('https://api.spotify.com/v1/me', { headers: headers })
			.then((response) => response.json())
			.then((jsonResponse) => {
				userID = jsonResponse.id;
				return fetch(`https://api.spotify.com/v1/users/${userID}/playlists`, {
					headers: headers,
					method: 'POST',
					body: JSON.stringify({ name: name })
				})
					.then((response) => response.json())
					.then((jsonResponse) => {
						const playListID = jsonResponse.id;
						return fetch(`https://api.spotify.com/v1/users/${userID}/playlists/${playListID}/tracks`, {
							headers: headers,
							method: 'POST',
							body: JSON.stringify({ uris: trackURIs })
						});
					});
			});
	}
};
