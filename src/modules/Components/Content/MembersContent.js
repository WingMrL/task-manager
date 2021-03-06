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
                <Link className={`member-info`} to={`/members/${member._id}`}>
                    <img 
                        src={`${config.serverHost}/${member.headImgUrl}`} 
                        alt={`头像`}
                        className={`head-img`}/>
                    <span className={`member-name`}>{member.userName}</span>
                    <span className={`member-identity ${level}`}>
                        {memberIdentity}
                    </span>
                </Link>
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
        let joinAppliesNum = 0;
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
            joinAppliesNum = currentTeam.applies.length;
        }
        return (
            <div className={`members-content-container`}>
                {
                    joinAppliesNum > 0 &&
                    <Link 
                        to={`/teams/${teamId}/join/approval`} 
                        className={`apply-join-tip`}>
                        有{joinAppliesNum}条未审核的加入申请
                    </Link>
                }
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