import React from 'react';
import CreateNoteMenu from '../components/create-note-menu';
import StickyNote from '../components/sticky-note';
import WelcomePopup from '../components/welcome-popup';
import './app.scss';

export default class App extends React.Component {
	static singleton

	static setTempCreationNote = note => {
		if (note == null) {
			App.singleton.setState({
				tempCreationNote: null
			})

			return
		}

		App.singleton.setState({
			tempCreationNote: <StickyNote key={"temp"} note={note} />
		})
	}

	state = {
		viewNotesX: 0,
		viewNotesY: 0,
		notes: {},
		tempCreationNote: null,
	}
	mouseDownPosition = { x: 0, y: 0 }
	mouseDownNotesPosition = { x: 0, y: 0 }
	isMouseDown = false

	componentDidMount() {
		App.singleton = this

		this.props.socket.on("allNotes", notes => {
			this.setState({ notes })
		})

		this.props.socket.on("newNote", (newNoteId, newNote) => {
			this.setState(oldState => {
				oldState.notes[newNoteId] = newNote

				return { notes: oldState.notes }
			})
		})
	}

	handleMouseDown = e => {
		if (!e.target.classList.contains("notes-master-container")) return

		this.isMouseDown = true
		this.mouseDownPosition = { x: e.pageX, y: e.pageY }
		this.mouseDownNotesPosition = { x: this.state.viewNotesX, y: this.state.viewNotesY }
	}
	handleTouchStart = e => {
		let touch = e.touches[0]

		this.isMouseDown = true
		this.mouseDownPosition = { x: touch.pageX, y: touch.pageY }
		this.mouseDownNotesPosition = { x: this.state.viewNotesX, y: this.state.viewNotesY }

		return false
	}

	handleMouseMove = e => {
		if (!this.isMouseDown) return

		let mousePosition = { x: e.pageX, y: e.pageY }

		this.setState({
			viewNotesX: this.mouseDownNotesPosition.x + (mousePosition.x - this.mouseDownPosition.x),
			viewNotesY: this.mouseDownNotesPosition.y + (mousePosition.y - this.mouseDownPosition.y)
		})
	}
	handleTouchMove = e => {
		let touch = e.touches[0]

		if (!this.isMouseDown) return

		let mousePosition = { x: touch.pageX, y: touch.pageY }

		this.setState({
			viewNotesX: this.mouseDownNotesPosition.x + (mousePosition.x - this.mouseDownPosition.x),
			viewNotesY: this.mouseDownNotesPosition.y + (mousePosition.y - this.mouseDownPosition.y)
		})

		return false
	}

	handleMouseUp = e => {
		if (!e.target.classList.contains("notes-master-container")) return

		this.isMouseDown = false
		let mouseUpPosition = { x: e.pageX, y: e.pageY }

		if (this.mouseDownPosition.x == mouseUpPosition.x && this.mouseDownPosition.y == mouseUpPosition.y) {
			CreateNoteMenu.open({ x: e.pageX - this.state.viewNotesX, y: e.pageY - this.state.viewNotesY })
		}
	}

	handleMouseLeave = e => {
		this.isMouseDown = false
	}

	render() {
		let displayNotes = Object.entries(this.state.notes).map(entry => {
			let id = entry[0]
			let note = entry[1]

			return <StickyNote key={id} note={note} />
		})

		return (
			<div className="main-page">
				<WelcomePopup />
				<div
					className="notes-master-container"
					onMouseDown={this.handleMouseDown}
					onMouseMove={this.handleMouseMove}
					onMouseUp={this.handleMouseUp}
					onMouseLeave={this.handleMouseLeave}
					onTouchStart={this.handleTouchStart}
					onTouchMove={this.handleTouchMove}
				>
					<div className="notes-container" style={{ left: this.state.viewNotesX, top: this.state.viewNotesY }}>
						{this.state.tempCreationNote}
						{displayNotes}
					</div>
				</div>
				<CreateNoteMenu socket={this.props.socket} />
			</div>
		);
	}
}
