import React from 'react';
import './App.css';
import { SearchResults } from '../SearchResults/SearchResults';
import { PlayList } from '../PlayList/PlayList';
import { SearchBar } from '../SearchBar/SearchBar';
import { Spotify } from '../../util/Spotify';

class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			searchResults: [],
			playlistName: 'HipHop',
			playlistTracks: [],
			loading: ''
		};
		this.addTrack = this.addTrack.bind(this);
		this.removeTrack = this.removeTrack.bind(this);
		this.updatePlaylistName = this.updatePlaylistName.bind(this);
		this.savePlaylist = this.savePlaylist.bind(this);
		this.search = this.search.bind(this);
	}

	search(term) {
		this.setState({ loading: true });
		Spotify.search(term).then((searchResults) => {
			this.setState({
				loading: false,
				isSearch: true,
				searchResults: searchResults
			});
		});
	}

	savePlaylist() {
		let trackURIs = this.state.playlistTracks.map((track) => track.uri);
		Spotify.savePlayList(this.state.playlistName, trackURIs).then(() => {
			this.setState({
				playlistName: 'New Playlist',
				playlistTracks: []
			});
		});
	}

	addTrack(track) {
		let tracks = this.state.playlistTracks;
		if (tracks.find((savedTrack) => savedTrack.id === track.id)) {
			return;
		} else {
			tracks.push(track);
			this.setState({
				playlistTracks: tracks
			});
		}
	}

	updatePlaylistName(name) {
		this.setState({ playlistName: name });
	}

	removeTrack(track) {
		let tracks = this.state.playlistTracks;
		let newTracks = tracks.filter((clickedTrack) => clickedTrack.id !== track.id);
		this.setState({ playlistTracks: newTracks });
	}

	render() {
		
		return (
			<div>
				<h1>
					Spotified
				</h1>
				<div className="App">
					{/* SearchBar component */}
					<SearchBar onSearch={this.search} />
					<div className="App-playlist">
						{/* SearchResults component */}
						<SearchResults
							loading={this.state.loading}
							searchResults={this.state.searchResults}
							onAdd={this.addTrack}
						/>
						{/* Playlist component */}
						<PlayList
							playlistName={this.state.playlistName}
							playlistTracks={this.state.playlistTracks}
							onRemove={this.removeTrack}
							onNameChange={this.updatePlaylistName}
							onSave={this.savePlaylist}
						/>
						{/* Add a TrackList component */}
					</div>
				</div>
			</div>
		);
	}
}

export default App;
