import React from 'react';

// import { Input, Checkbox, Button, message } from 'antd';
// const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './MembersContent.less';
// import axios from 'axios';
import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class MembersContent extends React.Component {

    genMember = (member, level) => {
        let memberIdentity = '';
        if(level === 'super-manager') {
            memberIdentity = '超级管理员';
        } else if(level === 'manager') {
            memberIdentity = '管理员';
        } else {
            memberIdentity = '成员';
        }
        return (
            <div className={`member`} key={member._id}>
                <div className={`member-info`}>
                    <img 
                        src={`${config.serverHost}/${member.headImgUrl}`} 
                        alt={`头像`}
                        className={`head-img`}/>
                    <span className={`member-name`}>{member.userName}</span>
                    <span className={`member-identity ${level}`}>
                        {memberIdentity}
                    </span>
                </div>
                <div className={`member-email`}>
                    {member.eMail}
                </div>
            </div>
        );
    }

    render() {
        const { user, currentTeam } = this.props;
        let userId = '';
        let teamId = '';
        let teamName = '';
        let membersList = [];
        if(currentTeam) {
            teamId = currentTeam._id;
            teamName = currentTeam.teamName;
            membersList.push(this.genMember(currentTeam.superManager, 'super-manager'));
            currentTeam.managers.forEach((v) => {
                membersList.push(this.genMember(v, 'manager'));
            });
            currentTeam.normalMembers.forEach((v) => {
                membersList.push(this.genMember(v, 'normal-member'));
            });
        }
        return (
            <div className={`members-content-container`}>
                <div className={`members-tools`}>
                    <h3 className={`team-name`}>{teamName}</h3>
                    <Link to={`/teams/${teamId}/invite/new`} className={`invite-new-member`}>邀请新成员</Link>
                </div>
                {membersList}
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user, currentTeam } = state;
    return {
        user,
        currentTeam,
        ...ownProps,
    };
};

MembersContent = connect(mapStateToProps)(MembersContent);

export default MembersContent;