import React from 'react';
import './CommonHeaderContent.less';
import TeamDropdown from './TeamDropdown';
import UserDropdown from './UserDropdown';
import NavMenu from './NavMenu';
import { connect } from 'react-redux';
import { setCurrentProject } from '../../../actions/currentProjectActions';
import { setCurrentTeam } from '../../../actions/currentTeamActions';
import { setCurrentTasks } from '../../../actions/currentTasksActions';
import axios from 'axios';
import config from '../../../../config/config';

class CommonHeaderContent extends React.Component {

    componentWillMount() {
        this.getTeam(this.props.teamId);
        this.getProject(this.props.projectId);
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

    getProject = (projectId) => {
        const url = `${config.serverHost}/api/project/getProject`;
        const { history, dispatch } = this.props;
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
            if(projectId) {
                const data = {
                    params: {
                        projectId,
                        token
                    }
                };
                axios.get(url, data)
                    .then((result) => {
                        if(result.data.code === 0) {
                            let { project } = result.data;
                            dispatch(setCurrentProject(project));
                            dispatch(setCurrentTasks(project.tasks));
                        } else if(result.data.code === -98) {
                            history.push(`/user/sign_in`);
                        } else if(result.data.code === -4) {
                            console.log(`${result.data.msg}: ${result.data.code}`)
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            }
        }
    }


    changeTeam = (teamId) => {
        this.getTeam(teamId);
    }

    render() {
        const { history, selectedKeys } = this.props;
        return (
            <div className={`common-header-content-container`}>
                <TeamDropdown 
                    history={history}
                    changeTeam={this.changeTeam}
                    />
                <NavMenu 
                    selectedKeys={selectedKeys}
                    />
                <UserDropdown />
            </div>
        );
    }
}

CommonHeaderContent = connect()(CommonHeaderContent);

export default CommonHeaderContent;