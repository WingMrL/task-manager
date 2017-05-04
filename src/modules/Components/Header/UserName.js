import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logOut } from '../../../actions/hasSignInActions';
import { removeUser } from '../../../actions/userActions';
import { removeCurrentTeam } from '../../../actions/currentTeamActions';

class UserName extends React.Component {

    handleClick = (e) => {
        // e.preventDefault();
        let { dispatch } = this.props;
        dispatch(logOut());
        dispatch(removeUser());
        dispatch(removeCurrentTeam());
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }

    render() {
        const { user } = this.props;
        let userName = '';
        if(user) {
            userName = user.userName;
        }
        return (
            <div className={`user-container`}>
                <span>Hi, </span>
                <span className={`username`}>{userName}</span>
                <Link to={`/`} className={`log-out`} onClick={this.handleClick}>退出</Link>
            </div>
            
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user } = state;
    return {
        user
    };
}

UserName = connect(mapStateToProps)(UserName);

export default UserName;