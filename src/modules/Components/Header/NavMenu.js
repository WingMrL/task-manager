import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';


class NavMenu extends React.Component {

    render() {

        const { currentTeam, selectedKeys } = this.props;
        let teamId = '';
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        return (
            <Menu
                mode="horizontal"
                className={`nav-main-menu`}
                selectedKeys={selectedKeys}
                >
                <Menu.Item key={`projects`}>
                    <Icon type="folder-open" />
                    <Link to={`/teams/${teamId}/projects`}>项目</Link>
                </Menu.Item>
                <Menu.Item key={`teams`}>
                    <Icon type="team" />
                    <Link to={`/teams/${teamId}/members`}>团队</Link>
                </Menu.Item>
            </Menu>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    const { currentTeam } = state;
    return {
        currentTeam,
        ...ownProps
    };
};

NavMenu = connect(mapStateToProps)(NavMenu);

export default NavMenu;

