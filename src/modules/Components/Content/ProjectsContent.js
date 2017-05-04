import React from 'react';

// import {  } from 'antd';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import './ProjectsContent.less';
import axios from 'axios';
import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class ProjectsContent extends React.Component {

    render() {
        const { user, currentTeam } = this.props;
        let userId = '';
        let teamId = '';
        if(user) {
            userId = user._id;
        }
        if(currentTeam) {
            teamId = currentTeam._id;
        }
        return (
            
            <div className={`projects-content-container`}>
                <div className={`projects-tools`}>
                    <Link to={`/teams/${teamId}/projects/new`} className={`new-project`}>新建项目</Link>
                </div>
                <div className={`projects`}>
                </div>
                <div className={`projects-footer`}>
                </div>
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

ProjectsContent = connect(mapStateToProps)(ProjectsContent);

export default ProjectsContent;