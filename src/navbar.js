import React from 'react';

class NavBar extends React.Component {
    render() {
        return (
            <nav className="navbar navbar-custom">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <a className="navbar-brand" href="#">Smash</a>
                    </div>
                    <ul className="nav navbar-nav">
                        <li className="active"><a href="/">Home</a></li>
                        <li><a href="agenda">New Agenda</a></li>
                    </ul>
                </div>
            </nav>
        )
    }
}

export default NavBar;