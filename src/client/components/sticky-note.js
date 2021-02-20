import React from "react"
import "./sticky-note.scss"

export default class StickyNote extends React.PureComponent {
    render() {
        return (
            <div className="sticky-note-container" style={{ left: this.props.note.position.x, top: this.props.note.position.y }}>
                <div className="written-by">{this.props.note.name}</div>
                <div className="message">{this.props.note.message}</div>
                <div className="date">{new Date(this.props.note.created).toLocaleString()}</div>
            </div>
        )
    }
}