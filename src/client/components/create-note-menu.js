import React from "react"
import { validateNoteMessage, validateNoteName } from "../../shared/constants";
import "./create-note-menu.scss"

export default class CreateNoteMenu extends React.PureComponent {
    static singleton;

    static open = (coordinates) => {
        if (CreateNoteMenu.singleton == null) return

        CreateNoteMenu.singleton.setState({
            isOpen: true,
        })
        CreateNoteMenu.singleton.newNoteCoordinates = coordinates
    }

    componentDidMount() {
        CreateNoteMenu.singleton = this
    }

    state = {
        isOpen: false,
        nameInput: "",
        messageInput: "",
    }
    newNoteCoordinates = { x: 0, y: 0 }

    closeMenu = () => {
        this.setState({
            isOpen: false,
            nameInput: "",
            messageInput: "",
        })
    }

    handleNameChange = e => {
        this.setState({ nameInput: validateNoteName(e.target.value) })
    }

    handleMessageChange = e => {
        this.setState({ messageInput: validateNoteMessage(e.target.value) })
    }

    handleCreateNote = () => {
        if(this.state.messageInput.replace(/ /, "") == ""){
            alert("must input message")
            return
        }

        this.props.socket.emit("createNote", {
            position: this.newNoteCoordinates,
            name: this.state.nameInput,
            message: this.state.messageInput
        })

        this.closeMenu()
    }

    render() {
        if (!this.state.isOpen) return null

        return (
            <div className="create-note-container">
                <div className="background-cover" onClick={this.closeMenu}></div>
                <div className="menu">
                    <input autoFocus placeholder="name" onChange={this.handleNameChange} value={this.state.nameInput} />
                    <textarea placeholder="message" onChange={this.handleMessageChange} value={this.state.messageInput}></textarea>
                    <button onClick={this.handleCreateNote}>create</button>
                    <button onClick={this.closeMenu}>cancel</button>
                </div>
            </div>
        )
    }
}