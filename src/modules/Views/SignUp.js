import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import Footer from '../Components/Footer';
import SignUpContent from '../Components/SignUpContent';

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
                    <SignUpContent />
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Index;