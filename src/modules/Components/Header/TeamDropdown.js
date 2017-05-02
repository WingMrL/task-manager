import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Dropdown, Menu, Button, Icon } from 'antd';
const MenuItemGroup = Menu.ItemGroup;

import { removeCurrentTeam } from '../../../actions/currentTeamActions';


class TeamDropdown extends React.Component {

    // handleDropdownOnSelect = (item, key, selectedKeys) => {
    //     // console.log(item, key, selectedKeys);
    // }

    render() {
        const { history, currentTeam, user, changeTeam } = this.props;
        let teamName = '';
        let teamId = '';
        if(currentTeam) {
            teamName = currentTeam.teamName;
            teamId = currentTeam._id;
        }

        let isSuperManager = false;
        if(user && currentTeam) {
            isSuperManager = user._id === currentTeam.superManager;
        }

        let teamMenus;
        if(user) {
            teamMenus = user.teams.map((v) => {
                return (
                    <Menu.Item key={v._id}>
                        <Link to={`/teams/${v._id}/projects`} onClick={() => changeTeam(v._id)}>{v.teamName}</Link>
                    </Menu.Item>
                );
            });
        }
        const menu = (
            <Menu onSelect={this.handleDropdownOnSelect} className={`dropdown-menu-team`}>
                {
                    isSuperManager &&
                    <Menu.Item key={`team-account`}>
                        <Link to={`/teams/${teamId}/settings`}>团队账户</Link>
                    </Menu.Item>
                }
                
                <Menu.Item key={`invite-member`}>
                    <Link to={`/teams/${teamId}/invite`}>邀请成员</Link>
                </Menu.Item>
                <Menu.Divider className={`team-change-divider`}/>
                <MenuItemGroup title="团队切换">
                    {teamMenus}
                </MenuItemGroup>
                <Menu.Divider/>
                <Menu.Item key={`team-manager`}>
                    <Link to={`/teams`} className={`team-manager-and-add`}>创建/管理团队</Link>
                </Menu.Item>
            </Menu>
        );
            
        return (
            <Dropdown 
                overlay={menu}
                trigger={['click']}
                >
                <a
                    className={`dropdown-text-team`}
                    >
                    {teamName}
                    <Icon type="caret-down"/>
                </a>
            </Dropdown>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam } = state;
    return {
        currentTeam,
        user,
        ...ownProps
    };
};

TeamDropdown = connect(mapStateToProps)(TeamDropdown);

export default TeamDropdown;

