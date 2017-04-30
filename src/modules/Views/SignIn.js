import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import Footer from '../Components/Footer';
import SignInContent from '../Components/SignInContent';

class Index extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    render() {
        return (
            <LayoutMain>
                <HeaderContainer>
                </HeaderContainer>
                <ContentContainer>
                    <SignInContent />
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Index;