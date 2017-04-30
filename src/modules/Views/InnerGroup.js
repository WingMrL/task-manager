import React from 'react';
import { connect } from 'react-redux';

import LayoutMain from '../Layout/LayoutMain';
import HeaderContainer from '../Layout/HeaderContainer';
import ContentContainer from '../Layout/ContentContainer';
import FooterContainer from '../Layout/FooterContainer';

import Logo from '../Header/Logo';
import SearchBar from '../Header/SearchBar';
import UploadBtn from '../Header/UploadBtn';
import GroupMenu from '../Menu/Menu';
import GroupLogo from '../Menu/GroupLogo';
import MenuBtnsContainer from '../Menu/MenuBtnsContainer';
import MoreMenu from '../Menu/MoreMenu';
import DownloadBtn from '../Menu/DownloadBtn';
import Split from '../Menu/Split';
import SelectAll from '../Menu/SelectAll';
import InnerGroupIcon from '../Content/InnerGroupIcon';
import axios from 'axios';
import config from '../../../config/config';
import { addAllIconsToIcons, removeAllIconsFromIcons} from '../../actions/icons';
import { addIconToSelectedIcons, removeAllIconsFromSelectedIcons } from '../../actions/selectedIcons';
import IconPagination from '../Content/IconPagination';

class InnerGroup extends React.Component {

    constructor(props) {
        super(props);
        this.iconId; //记录从 搜索结果页 的 打开目标位置 转过来的iconId
        this.highlightIconId;
        this.state = {
            group: {},
            currentPage: 1,
            numbersInPage: 32, //每页有多少条
            totalPages: 1, //总页数
            totalIcons: 0, //总icon数
        };
    }

    componentWillMount() {
        this.setTargetIconId();
        this.willReflashPage();
    }

    setTargetIconId = () => {
        let self = this;
        window.location.search.slice(1).split('&').forEach((value) => {
            if(value.indexOf('iconId=') == 0) {
                self.iconId = value.replace(/iconId=/, '');
            }
        });
    }

    highlightTargetIcon = () => {
        let self = this;
        if(this.highlightIconId !== undefined) {
            let icon;
            this.props.icons.forEach((v) => {
                if(v._id === self.highlightIconId) {
                    icon = Object.assign({}, v);
                }
            });
            if(icon) {
                this.props.dispatch(addIconToSelectedIcons(icon));
            }
        }
    }

    willReflashPage = () => {
        let { currentPage, numbersInPage } = this.state;
        this.reflashPage(currentPage, numbersInPage);
    }

    reflashPage = (currentPage, numbersInPage) => {
        let self = this;
        let url = `${config.serverHost}/api/getGroup`;
        let data = {
            params: {
                _id: this.props.match.params.groupid,
                currentPage,
                numbersInPage,
                iconId: this.iconId
            }
        };
        axios.get(url, data)
            .then((res) => {
                if(res.status == 200 && res.data.code == 0) {
                    self.setState({
                        group: {
                            _id: res.data.group._id,
                            meta: res.data.group.meta,
                            groupName: res.data.group.groupName,
                            groupIconUrl: res.data.group.groupIconUrl,
                            groupEngName: res.data.group.groupEngName
                        },
                        totalPages: res.data.totalPages,
                        totalIcons: res.data.totalIcons
                    })
                    if(res.data.jumpToPage) {
                        self.highlightIconId = self.iconId;
                        self.iconId = undefined;
                        self.handlePageOnChange(res.data.jumpToPage, self.state.numbersInPage);
                    } else {
                        self.props.dispatch(addAllIconsToIcons(res.data.group.icons));
                        self.highlightTargetIcon();
                    }
                    
                }
            }).catch((res) => {
                console.log(res);
            });
    }

    componentWillUnmount() {
        this.props.dispatch(removeAllIconsFromIcons());
    }

    handlePageOnChange = (page, pageSize) => {
        this.props.dispatch(removeAllIconsFromSelectedIcons());
        this.reflashPage(page, pageSize);
        this.setState({
            currentPage: page
        });
    }

    render() {
        let { group, currentPage, totalPages, numbersInPage, totalIcons } = this.state;
        return (
            <LayoutMain>
                <HeaderContainer >
                    <Logo/>
                    <SearchBar/>
                    <UploadBtn 
                        groupId={this.props.match.params.groupid}
                        reflashPage={this.willReflashPage}
                        />
                </HeaderContainer>
                <ContentContainer >
                    <GroupMenu>
                        <GroupLogo
                            groupName={group.groupName}
                            groupIconUrl={group.groupIconUrl}
                            />
                        <MenuBtnsContainer>
                            <SelectAll />
                            <Split />
                            <DownloadBtn />
                            <MoreMenu reflashPage={this.willReflashPage}/>
                        </MenuBtnsContainer>
                    </GroupMenu>
                    <InnerGroupIcon></InnerGroupIcon>
                    <IconPagination 
                        size="small"
                        currentPage={currentPage}
                        totalPages={totalPages}
                        numbersInPage={numbersInPage}
                        totalIcons={totalIcons}
                        onChange={this.handlePageOnChange}
                        />
                </ContentContainer>
                <FooterContainer>
                </FooterContainer>
            </LayoutMain>
        );
    }
}

const mapStateToProps = (state, ownPropr) => {
    return {
        icons: state.icons
    };
}

InnerGroup = connect(mapStateToProps)(InnerGroup);

export default InnerGroup;