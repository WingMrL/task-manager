import React from 'react';
import { connect } from 'react-redux';

import { Button } from 'antd';

import '../../assets/style.less';
import styles from './DownloadBtn.css';
import config from '../../../config/config';

class DownloadBtn extends React.Component {

    handleDownload = () => {
        let aTag = document.createElement('a');
        this.props.selectedIcons.forEach((value) => {
            console.log(value);
            let icon = value.icon;
            let fileName = icon.fileName.replace(/-timestamp\d+/, '');
            let url = `${config.serverHost}/${icon.iconUrl}`;
            aTag.href = url
            aTag.download = fileName;
            aTag.click();
            console.log('开始下载....');
        });
    }

    render() {
        let { disabled } = this.props;
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
                    "marginRight": "16px",
                    "backgroundColor": "transparent",
                }} 
                className={styles["btn"]}
                onClick={this.handleDownload}
                disabled={disabled}
                >
                <span className={"icon-download " + styles["icon"]}></span>
                <span>下载 </span>
            </Button>
        );
    }
}


const mapStateToProps = (state, ownProps) => {
    return {
        selectedIcons: state.selectedIcons,
        disabled: state.selectedIcons.length == 0
    }
};

DownloadBtn = connect(mapStateToProps)(DownloadBtn);

export default DownloadBtn;