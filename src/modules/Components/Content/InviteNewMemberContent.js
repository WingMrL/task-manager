import React from 'react';

import { Input } from 'antd';
// const CheckboxGroup = Checkbox.Group;

import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './InviteNewMemberContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import { setCurrentTeam } from '../../../actions/currentTeamActions';
// import '../../../assets/style.less';



class InviteNewMemberContent extends React.Component {

    handleResetInviteLink = (e) => {
        e.preventDefault();
        const { currentTeam, history } = this.props;
        let teamId;
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        if(teamId) {
            const token = localStorage.getItem('token');
            axios.post(`${config.serverHost}/api/team/refreshJoinId`, {
                token,
                teamId,
            }).then((result) => {
                let { data } = result;
                if(data.code == 0) {
                    this.getTeam(currentTeam._id);
                } else if(data.code == -98) {
                    history.push(`/user/sign_in`);
                } else if(data.code == -1 || data.code == -4) {
                    console.log(`${data.msg}: ${data.code}`);
                }
            })
        }
    }

    getTeam = (teamId) => {
        const url = `${config.serverHost}/api/team/getTeam`;
        const { history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            if(teamId) {
                const data = {
                    params: {
                        teamId,
                        token
                    }
                };
                axios.get(url, data)
                    .then((result) => {
                        if(result.data.code === 0) {
                            let { team } = result.data;
                            dispatch(setCurrentTeam(team));
                        } else if(result.data.code === -98) {
                            history.push(`/user/sign_in`);
                        } else if(result.data.code === -1) {
                            console.log(`${result.data.msg}: ${result.data.code}`)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
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