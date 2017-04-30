import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';

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
                </ContentContainer>
                <FooterContainer>
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Index;