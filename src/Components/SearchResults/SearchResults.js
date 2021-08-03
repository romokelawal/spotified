import React from 'react';
import './SearchResults.css';
import { TrackList } from '../TrackList/TrackList';
import { Loader } from '../../Loader/Loader';

export class SearchResults extends React.Component {

	render() {
		return (
			<div className="SearchResults">
				<h2>Results</h2>
				{/* TrackList component */}
				{this.props.loading ? (
					<div className="spinner"><Loader /></div>
				) : (
					<TrackList tracks={this.props.searchResults} onAdd={this.props.onAdd} isRemoval={false} />
				)}
			</div>
		);
	}
}
