import React from 'react';
import { Link } from 'react-router-dom';

class TMLogo extends React.Component {

    render() {
        return (
            <Link to={`/`} className={`tm-logo`}>
            </Link>
        );
    }
}

export default TMLogo;