import React from "react"
import { validateNoteMessage, validateNoteName } from "../../shared/constants";
import "./welcome-popup.scss"

export default class WelcomePopup extends React.PureComponent {
    state = {
        isOpen: true,
    }

    closeMenu = () => {
        this.setState({
            isOpen: false,
        })
    }

    render() {
        if (!this.state.isOpen) return null

        return (
            <div className="welcome-popup">
                <div className="background-cover" onClick={this.closeMenu}></div>
                <div className="menu">
                    <header>Welcome to StickyNotesWall!</header>
                    <p>Here, you can write whatever you want, where-ever you want!</p>
                    <p>Drag your mouse across the wall to move around!</p>
                    <p>Click on the wall to create a new note!</p>
                    <p>This project is <a href="https://www.github.com/ZeroByter/stickynoteswall" target="_blank">open-sourced on GitHub!</a> Feel free to look around and contribute as you wish!</p>
                    <p><i>Write nice things, and have fun! (click anywhere to close this popup)</i></p>
                </div>
            </div>
        )
    }
}