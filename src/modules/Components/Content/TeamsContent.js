import React from 'react';

import { Card, Icon, Modal, Input } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './TeamsContent.less';
import axios from 'axios';
import config from '../../../../config/config';
import { addUser } from '../../../actions/userActions';
import '../../../assets/style.less';



/**
 * @description 团队创建与管理
 * 
 * @class TeamsContent
 * @extends {React.Component}
 */
class TeamsContent extends React.Component {

    state = {
        newTeamModalVisible: false,
        valueOfTeamName: '',
    }
    
    componentWillMount() {
        const { user, history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            const data = {
                params: {
                    token,
                    userId
                }
            };
            axios.get(`${config.serverHost}/api/user/getUser`, data)
                .then((result) => {
                    if(result.data.code === 0) {
                        dispatch(addUser(result.data.user));
                    } else if(result.data.code === -98) {
                        history.push(`/user/sign_in`);
                    } else if(result.data.code === -1) {
                        console.log('请求参数错误!');
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }

    handleNewTeamClick = (e) => {
        e.preventDefault();
        this.setState({
            newTeamModalVisible: true,
            valueOfTeamName: ''
        });
    }
    
    newTeamModalOnOk = (e) => {
        if(this.state.valueOfTeamName === '') {
            message.error(`团队名字不能为空！`, 3);
            return;
        }

        const { user, history } = this.props;
        const token = localStorage.getItem('token');

        let url = `${config.serverHost}/api/team/newTeam`;
        let data = {
            token,
            teamName: this.state.valueOfTeamName,
            userId: user._id,
        };
        axios.post(url, data)
            .then((result) => {
                this.setState({
                    newTeamModalVisible: false,
                });
                history.push(`teams/${result.data.team._id}/projects`);
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // handleTeamOnClick = (e) => {
    //     e.preventDefault();
    //     console.log(e);
    // }

    newTeamModalOnCancel = (e) => {
        this.setState({
            newTeamModalVisible: false,
        });
    }

    handleValueOfTeamNameOnChange = (e) => {
        this.setState({
            valueOfTeamName: e.target.value,
        });
    }

    render() {
        const { user } = this.props;
        const { newTeamModalVisible, valueOfTeamName } = this.state;
        let teams;
        let applyingTeams;
        if(user && user.teams) {
            teams = user.teams.map((v) => {
                return (
                    <Card key={v._id}>
                        <Link 
                            to={`teams/${v._id}/projects`} 
                            className={`link-team`}
                            >
                                {v.teamName}
                                <span className={`icon-enter-rocket`}></span>
                        </Link>
                    </Card>
                );
            });
        }
        if(user && user.applies) {
            applyingTeams = user.applies.map((v) => {
                return (
                    <div key={v._id} className={`applying-team`}>
                        <Link 
                            to={`teams/${v._id}/projects`} 
                            className={`link-team`}
                            disabled={true}
                            >
                                <span className={`team-name`}>{v.applyingTeam.teamName}</span>
                                <span className={`hint`}>
                                    <Icon type="lock"/>
                                    已申请加入，等待审核
                                </span>
                        </Link>
                    </div>
                );
            });
        }
        
        return (
            
            <div className={`teams-content-container`}>
                {applyingTeams}
                {teams}
                <Card>
                    <Link to={`/`} className={`link-new-team`} onClick={this.handleNewTeamClick}>
                        <Icon type={`plus`}/>
                        <span className={`text`}>新的团队</span>
                    </Link>
                </Card>
                <Modal 
                    title='新的队团名称'
                    visible={newTeamModalVisible}
                    onOk={this.newTeamModalOnOk}
                    onCancel={this.newTeamModalOnCancel}
                    okText='创建团队'
                    wrapClassName={`new-team-modal-container`}
                    >
                    <Input 
                        size="large"
                        placeholder="例如：Apple Watch设计团队"
                        value={valueOfTeamName}
                        onChange={this.handleValueOfTeamNameOnChange}
                        
                        />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const { user } = state;
    return {
        user,
        ...ownProps,
    };
};

TeamsContent = connect(mapStateToProps)(TeamsContent);

export default TeamsContent;