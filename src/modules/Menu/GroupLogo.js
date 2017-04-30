import React from 'react';

import './GroupLogo.less';
import config from '../../../config/config';

class GroupLogo extends React.Component {
    render() {
        let {groupName, groupIconUrl} = this.props
        return (
            <div className={`logo-container`}>
                {groupIconUrl && <img src={`${config.serverHost}/${groupIconUrl}`} className={`logo-img`}/>}
                <span className={`name-span`}>{groupName}</span>
            </div>
        );
    }
}

export default GroupLogo;