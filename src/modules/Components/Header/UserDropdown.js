import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';
const MenuItemGroup = Menu.ItemGroup;
import config from '../../../../config/config';

import { removeCurrentTeam } from '../../../actions/currentTeamActions';
import { logOut } from '../../../actions/hasSignInActions';
import { removeUser } from '../../../actions/userActions';


class UserDropdown extends React.Component {

    handleDropdownOnSelect = (item, key, selectedKeys) => {
        if(item.key === 'log-out') {
            let { dispatch } = this.props;
            dispatch(logOut());
            dispatch(removeUser());
            dispatch(removeCurrentTeam());
            localStorage.removeItem('token');
            localStorage.removeItem('userId');
        }
    }

    render() {
        const { user } = this.props;
        let userId = '';
        let headImgUrl = '';
        if(user) {
            userId = user._id;
            headImgUrl = user.headImgUrl;
        }
        const menu = (
            <Menu onSelect={this.handleDropdownOnSelect} className={`dropdown-menu-user`}>
                <Menu.Item key={`user-setting`}>
                    <Link to={`/members/${userId}/setting`}>个人设置</Link>
                </Menu.Item>
                <Menu.Divider/>
                <Menu.Item key={`log-out`}>
                    <Link to={`/`} className={`log-out`}>退出</Link>
                </Menu.Item>
            </Menu>
        );
            
        return (
            <Dropdown 
                overlay={menu}
                trigger={['click']}
                placement="bottomRight"
                >
                <a
                    className={`dropdown-user`}
                    >
                    <img src={`${config.serverHost}/${headImgUrl}`} className={`head-img`}/>
                    <Icon type="caret-down"/>
                </a>
            </Dropdown>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    const { user } = state;
    return {
        user,
        ...ownProps
    };
};

UserDropdown = connect(mapStateToProps)(UserDropdown);

export default UserDropdown;

