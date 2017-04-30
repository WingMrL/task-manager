import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Logo from '../Header/Logo';
import SearchBar from '../Header/SearchBar';
import Group from '../Content/Group';

import { Button } from 'antd';
import axios from 'axios';

import config from '../../../config/config';

class Index extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            groups: []
        }
        // this.handleClick = this.handleClick.bind(this);
    }

    
    componentWillMount() {
        let self = this;
        axios.get(`${config.serverHost}/api/getGroups`)
            .then((res) => {
                if(res.status == 200 && res.data.code == 0) {
                    self.setState({
                        groups: res.data.groups
                    })
                }
            }).catch((res) => {

            });
    }
    

    // handleClick(e) {
    //     console.log(12341234);
    //     axios.post('http://localhost:3000/api/addGroup', {
    //         groupName: "希沃OS公用版",
    //         groupIconUrl: "http://localhost:3000/assets/images/group-logo-希沃OS公用版.png"
    //     }).then(function(res) {
    //         console.log(res);
    //     }).catch(function(res) {
    //         console.warn(res);
    //     });
    // }

    render() {
        const groupList = this.state.groups.map((value) => {
            return <Group 
                key={value._id}
                groupName={value.groupName}
                groupEngName={value.groupEngName}
                _id={value._id}
                groupIconUrl={value.groupIconUrl}
                icons={value.icons}
                />
        })
        return (
            <LayoutMain>
                <HeaderContainer>
                    <Logo/>
                    <SearchBar/>
                </HeaderContainer>
                <ContentContainer>
                    {groupList}
                    {/*<Button 
                        onClick={this.handleClick}
                        > 初始化Group数据库 </Button>*/}
                </ContentContainer>
                <FooterContainer>
                </FooterContainer>
            </LayoutMain>
        );
    }
}

export default Index;