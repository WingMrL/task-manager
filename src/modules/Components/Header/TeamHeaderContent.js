import React from 'react';
import './TeamHeaderContent.less';

import TMLogo from './TMLogo';
import UserName from './UserName';

class TeamHeaderContent extends React.Component {

    render() {
        return (
            <div className={`team-header-content-container`}>
                <TMLogo />
                <UserName />
            </div>
        );
    }
}

export default TeamHeaderContent;