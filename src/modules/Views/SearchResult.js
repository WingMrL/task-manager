import React from 'react';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Logo from '../Header/Logo';
import SearchBar from '../Header/SearchBar';
import GroupMenu from '../Menu/Menu';
import ResultTitle from '../Menu/ResultTitle';
import MenuBtnsContainer from '../Menu/MenuBtnsContainer';
import MoreMenu from '../Menu/MoreMenu';
import DownloadBtn from '../Menu/DownloadBtn';
import OpenFileLocation from '../Menu/OpenFileLocation';
import Split from '../Menu/Split';
import SelectAll from '../Menu/SelectAll';
import InnerGroupIcon from '../Content/InnerGroupIcon';
import Group from '../Content/Group';
import FileNotFound from '../Content/FileNotFound';
import config from '../../../config/config';
import axios from 'axios';
import { connect } from 'react-redux';
import { addAllIconsToIcons, removeAllIconsFromIcons } from '../../actions/icons';
import { removeAllIconsFromSelectedIcons } from '../../actions/selectedIcons';
import IconPagination from '../Content/IconPagination';

class SearchResult extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileNotFound: false,
            searchName: '',
            searchResult: {},
            currentPage: 1,
            numbersInPage: 32, //每页有多少条
            totalPages: 1, //总页数
            totalIcons: 0, //总icon数
        };
    }

    componentWillMount() {
        this.handleSearchOnClick();
    }

    componentWillUpdate(nextProps, nextState) {
        // console.log('..........componentWillUpdate', this.state.searchName, nextState.searchName);
        if(this.state.searchName !== nextState.searchName) {
            this.onReflashPage(nextState.searchName);
        }
    }


    requestSearchResult = (searchName, currentPage, numbersInPage) => {
        let self = this;
        let data = {
            searchName,
            currentPage,
            numbersInPage,
        }
        axios.post(`${config.serverHost}/api/search`, data)
            .then(function(result) {
                if(result.data.code == 0) {
                    // console.log(result);
                    self.setState({
                        searchResult: result.data.result,
                        fileNotFound: false,
                        totalPages: result.data.totalPages,
                        totalIcons: result.data.totalIcons,
                    });
                    if(result.data.result.icons.length == 0) {
                        self.setState({
                            fileNotFound: true
                        });
                    } else {
                        self.props.dispatch(addAllIconsToIcons(result.data.result.icons));
                    }
                }
            })
            .catch(function(err) {
                console.log(err);
            });
    }

    handleSearchOnClick = (value) => {
        let searchName = '';
        if(value) {
            searchName = value;
        } else {
            window.location.search.slice(1).split('&').forEach((value) => {
                if(value.indexOf('search=') == 0) {
                    searchName = value.replace(/search=/, '');
                    searchName = decodeURI(searchName);
                }
            });
            
            this.onReflashPage(searchName);
        }
        // console.log(searchName);
        this.setState({
            searchName
        });
    }

    handlePageOnChange = (page, pageSize) => {
        let { searchName } = this.state;
        this.props.dispatch(removeAllIconsFromSelectedIcons());
        this.requestSearchResult(searchName, page, pageSize);
        this.setState({
            currentPage: page
        });
    }

    onReflashPage = (name) => {
        let { searchName, currentPage, numbersInPage } = this.state;
        if(name) {
            searchName = name;
        }
        this.requestSearchResult(searchName, currentPage, numbersInPage);
    }

    render() {
        let { searchName, currentPage, totalPages, numbersInPage, totalIcons } = this.state;
        // console.log(currentPage, totalPages, numbersInPage, totalIcons);
        let groupObj = this.state.searchResult.group;
        let group;
        if(groupObj && groupObj.groupName) {
            group = <Group 
                        style={{
                            marginTop: 20
                        }}
                        groupName={groupObj.groupName}
                        groupEngName={groupObj.groupEngName}
                        _id={groupObj._id}
                        groupIconUrl={groupObj.groupIconUrl}
                        icons={groupObj.icons}
                        />;
        }
        
        return (
            <LayoutMain>
                <HeaderContainer >
                    <Logo/>
                    <SearchBar onSearch={this.handleSearchOnClick}/>
                </HeaderContainer>
                <ContentContainer >
                    { this.state.fileNotFound ?
                    <FileNotFound /> :
                    <div>
                        <GroupMenu>
                            <ResultTitle searchName={searchName}/>
                            <MenuBtnsContainer>
                                <SelectAll />
                                <Split />
                                <OpenFileLocation />
                                <DownloadBtn />
                                <MoreMenu reflashPage={this.onReflashPage}/>
                            </MenuBtnsContainer>
                        </GroupMenu>
                        <div className={`group-container`}>
                            {group}
                        </div>
                        <InnerGroupIcon></InnerGroupIcon>
                        <IconPagination 
                            size="small"
                            currentPage={currentPage}
                            totalPages={totalPages}
                            numbersInPage={numbersInPage}
                            totalIcons={totalIcons}
                            onChange={this.handlePageOnChange}
                            />
                    </div>}
                </ContentContainer>
                <FooterContainer>
                </FooterContainer>
            </LayoutMain>
        );
    }
}

SearchResult = connect()(SearchResult);

export default SearchResult;