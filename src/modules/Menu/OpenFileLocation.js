import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';
import { Link } from'react-router-dom';

import '../../assets/style.less';
import styles from './OpenFileLocation.less';

class OpenFileLocation extends React.Component {
    render() {
        let { disabled, selectedIcons } = this.props;
        let groupId = '';
        let iconId = '';
        let linkClass = '';
        if(!disabled) {
            groupId = selectedIcons[0].icon.group;
            iconId = selectedIcons[0].id;
            linkClass = 'location-link';
        }
        // console.log(selectedIcons);
        return (
            <Button 
                style={{
                    "fontSize": "14px",
                    "height": "18px",
                    "lineHeight": "18px",
                    "padding": "0",
                    "fontWeight": "400",
                    "boxSizing": "border-box",
                    "border": "0",
                    "marginRight": "28px",
                    "backgroundColor": "transparent",
                }} 
                className={`open-target-btn`}
                disabled={ disabled }
                >
                <span className={`icon-location icon`}></span>
                <Link 
                    to={`/innergroup/${groupId}?iconId=${iconId}`} 
                    disabled={ disabled }
                    className={`${linkClass}`}
                    >
                    打开文件位置
                </Link>
            </Button>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedIcons: state.selectedIcons,
        disabled: state.selectedIcons.length == 1 ? false : true,
    }
}

OpenFileLocation =  connect(mapStateToProps)(OpenFileLocation);

export default OpenFileLocation;