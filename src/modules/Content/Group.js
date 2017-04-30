import React from 'react';
import { Link } from 'react-router-dom';

import './Group.less';
import config from '../../../config/config';

class Group extends React.Component {
    render() {
        let { _id, groupName, style, groupIconUrl, icons} = this.props;
        let iconsList;
        if(icons) {
            iconsList = icons.map((value, index) => {
                return <li  key={value._id}
                            className={`li`}
                            style={{
                                backgroundImage: `url(${config.serverHost}/${value.iconUrl})`
                            }}
                            ></li>
            });
        }
        return (
            <Link to={`/innergroup/${_id}`} className={`group-container-inner`} style={style}>
                <div className={`icon-container`}>
                    <ul className={`ul`}>
                        {iconsList}
                    </ul>
                </div>
                <div className={`group-name-div`}>{groupName}</div>
            </Link>
        );
    }
}

export default Group;