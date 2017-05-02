import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import Footer from '../Components/Footer/Footer';

import { setCurrentTeam } from '../../actions/currentTeamActions';
import { connect } from 'react-redux';

import CommonHeaderContent  from '../Components/Header/CommonHeaderContent';

class Projects extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        this.getTeam();
    }

    getTeam = (teamId) => {
        const url = `${config.serverHost}/api/team/getTeam`;
        const { history, dispatch } = this.props;
        if(teamId === undefined) {
            teamId = this.props.match.params.teamId;
        }
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        if(token === null || userId === null) {
            history.push(`/user/sign_in`);
        } else {
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


    changeTeam = (teamId) => {
        this.getTeam(teamId);
    }

    render() {
        const { history } = this.props;
        // console.log(history);
        return (
            <LayoutMain>
                <HeaderContainer>
                    <CommonHeaderContent 
                        history={history}
                        changeTeam={this.changeTeam}
                        />
                </HeaderContainer>
                <ContentContainer>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

Projects = connect()(Projects);

export default Projects;