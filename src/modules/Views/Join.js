import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import TeamHeaderContent from '../Components/Header/TeamHeaderContent';
import JoinContent from '../Components/Content/JoinContent';
import Footer from '../Components/Footer/Footer';

// import { addUser } from '../../actions/userActions';
import { connect } from 'react-redux';

class Join extends React.Component {

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
                    <JoinContent history={history}/>
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

// Join = connect()(Join);

export default Join;