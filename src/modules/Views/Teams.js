import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import TeamHeaderContent from '../Components/Header/TeamHeaderContent';
import TeamsContent from '../Components/Content/TeamsContent';
import Footer from '../Components/Footer/Footer';

import { addUser } from '../../actions/userActions';
import { connect } from 'react-redux';

/**
 * @description 团队管理与创建页面
 * 
 * @class Teams
 * @extends {React.Component}
 */
class Teams extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {
        
    }

    render() {
        const { history } = this.props;
        return (
            <LayoutMain>
                <HeaderContainer>
                    <TeamHeaderContent history={history}/>
                </HeaderContainer>
                <ContentContainer>
                    <TeamsContent history={history}/>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

// Teams = connect()(Teams);

export default Teams;