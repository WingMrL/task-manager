import React from 'react';
import './CommonHeaderContent.less';
import TeamDropdown from './TeamDropdown';

class CommonHeaderContent extends React.Component {

    render() {
        const { history, changeTeam } = this.props;
        return (
            <div className={`common-header-content-container`}>
                <TeamDropdown 
                    history={history}
                    changeTeam={changeTeam}
                    />
            </div>
        );
    }
}

export default CommonHeaderContent;