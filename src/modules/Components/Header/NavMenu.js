import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { Menu, Icon } from 'antd';


class NavMenu extends React.Component {

    render() {
            
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

// const mapStateToProps = (state, ownProps) => {
//     const { user, currentTeam } = state;
//     return {
//         currentTeam,
//         user,
//         ...ownProps
//     };
// };

NavMenu = connect()(NavMenu);

export default NavMenu;

