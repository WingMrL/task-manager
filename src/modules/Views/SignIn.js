import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import axios from 'axios';
import config from '../../../config/config';
import Footer from '../Components/Footer/Footer';
import SignInContent from '../Components/Content/SignInContent';

/**
 * @description 登陆页
 * 
 * @class SignIn
 * @extends {React.Component}
 */
class SignIn extends React.Component {

    constructor(props) {
        super(props);
    }

    componentWillMount() {

    }

    render() {
        const { history, location } = this.props;
        return (
            <LayoutMain>
                <HeaderContainer>
                </HeaderContainer>
                <ContentContainer>
                    <SignInContent 
                        history={history}
                        location={location}
                        />
                </ContentContainer>
                <FooterContainer>
                    <Footer />
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default SignIn;