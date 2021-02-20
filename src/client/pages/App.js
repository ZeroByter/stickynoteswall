import React from 'react';
import CreateNoteMenu from '../components/create-note-menu';
import StickyNote from '../components/sticky-note';
import './app.scss';

export default class App extends React.Component {
	state = {
		viewNotesX: 0,
		viewNotesY: 0,
		notes: {}
	}
	mouseDownPosition = { x: 0, y: 0 }
	mouseDownNotesPosition = { x: 0, y: 0 }
	isMouseDown = false

	componentDidMount() {
		this.props.socket.on("allNotes", notes => {
			this.setState({ notes })
		})
	}

	handleMouseDown = e => {
		if (!e.target.classList.contains("notes-master-container")) return

		this.isMouseDown = true
		this.mouseDownPosition = { x: e.pageX, y: e.pageY }
		this.mouseDownNotesPosition = { x: this.state.viewNotesX, y: this.state.viewNotesY }
	}

	handleMouseMove = e => {
		if (!this.isMouseDown) return

		let mousePosition = { x: e.pageX, y: e.pageY }

		this.setState({
			viewNotesX: this.mouseDownNotesPosition.x + (mousePosition.x - this.mouseDownPosition.x),
			viewNotesY: this.mouseDownNotesPosition.y + (mousePosition.y - this.mouseDownPosition.y)
		})
	}

	handleMouseUp = e => {
		if (!e.target.classList.contains("notes-master-container")) return

		this.isMouseDown = false
		let mouseUpPosition = { x: e.pageX, y: e.pageY }

		if (this.mouseDownPosition.x == mouseUpPosition.x && this.mouseDownPosition.y == mouseUpPosition.y) {
			CreateNoteMenu.open({ x: e.pageX - this.state.viewNotesX, y: e.pageY - this.state.viewNotesY })
		}
	}

	render() {
		let displayNotes = Object.entries(this.state.notes).map(entry => {
			let id = entry[0]
			let note = entry[1]

			return <StickyNote key={id} note={note} />
		})

		return (
			<div className="main-page">
				<div className="notes-master-container" onMouseDown={this.handleMouseDown} onMouseMove={this.handleMouseMove} onMouseUp={this.handleMouseUp}>
					<div className="notes-container" style={{ left: this.state.viewNotesX, top: this.state.viewNotesY }}>
						{displayNotes}
					</div>
				</div>
				<CreateNoteMenu socket={this.props.socket} />
			</div>
		);
	}
}
