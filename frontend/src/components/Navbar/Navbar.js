import React, { Component } from "react";
import {Link} from 'react-router-dom';
import { NavItems } from "./NavItems";
import "./Navbar.css"

/**
 * Renders the navbar and all its components
 */
class Navbar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showLogo: false
        }
        this.handleScroll = this.handleScroll.bind(this);
        this.updateLocation = this.updateLocation.bind(this);
    }

    /**
     * Add the scroll event handler
     */
    componentDidMount() {
        window.addEventListener("scroll", this.handleScroll)
    }

    /**
     * Remove the scroll event handler
     */
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }

    /**
     * When the user scrolls down, make the deep breathe logo appear beside mainstem
     * @param e the event
     */
    handleScroll(e) {
        if(window.scrollY >= 80) {
            this.setState({
                showLogo: true
            });
        }
        else {
            this.setState({
                showLogo: false
            });
        }
    }

    checklocation(){
        let locus = window.location.pathname
        if(locus === '/'){
            return true
        }
        return false
    }

    updateLocation() {
        this.setState({ location: this.checklocation() });
    }

    forceUpdateHandler(){
        this.forceUpdate();
    }

    render() {
        let locus = this.checklocation()
        return (
            <header className="header" style={{ display: "flex", justifyContent: "center", alignItems: "center"}} >
                <nav className={locus ? 'navbar' : 'navbar2'}>
                    <ul className="nav-menu">
                        {NavItems.map((item, index) => {
                            return (
                                <li key={index}>
                                    <Link onClick={this.updateLocation} className={item.clssName} to = {item.url}>
                                        {item.title}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>
            </header>
        );
    }
}

export default Navbar