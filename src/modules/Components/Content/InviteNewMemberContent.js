import React from 'react';

import { Input } from 'antd';
// const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './InviteNewMemberContent.less';
// import axios from 'axios';
import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class InviteNewMemberContent extends React.Component {

    handleResetInviteLink = (e) => {
        e.preventDefault();
        console.log('此功能还没有实现');
    }

    render() {
        const { currentTeam } = this.props;
        let inviteLink = '';
        if(currentTeam) {
            inviteLink = `${config.serverHost}/join?t=${currentTeam.joinId}`
        }
        return (
            <div className={`invite-new-member-content-container`}>
                <h3 className={`title`}>添加新成员</h3>
                <h3 className={`link-method`}>通过公开链接，快速邀请</h3>
                <p className={`description`}>将下面的公共邀请链接通过QQ或微信发送给需要邀请的人</p>
                <Input value={inviteLink} className={`input-link`} readOnly={true}/>
                <p className={`notice`}>
                    注意：任何看到邀请链接的人，都可以申请加入团队。如果你想让邀请链接失效，请
                    <Link 
                        to={`/`}
                        onClick={this.handleResetInviteLink}
                        >
                        重新生成邀请链接
                    </Link>
                </p>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { currentTeam } = state;
    return {
        currentTeam,
        ...ownProps,
    };
};

InviteNewMemberContent = connect(mapStateToProps)(InviteNewMemberContent);

export default InviteNewMemberContent;