import React from 'react';
import './PlayList.css';
import { TrackList } from '../TrackList/TrackList';

export class PlayList extends React.Component {
	constructor(props) {
		super(props);
		this.handleNameChange = this.handleNameChange.bind(this);
	}
	handleNameChange(e){
		let name = e.target.value;
		this.props.onNameChange(name);
	}
	render() {
		return (
			<div className="Playlist">
				<input onChange={this.handleNameChange} defaultValue={"New Playlist"} />
				{/* Add a TrackList component */}
				<TrackList 
				tracks={this.props.playlistTracks}
				onRemove={this.props.onRemove}
				isRemoval={true} />
				<button onClick={this.props.onSave} className="Playlist-save">SAVE TO SPOTIFY</button>
			</div>
		);
	}
}

