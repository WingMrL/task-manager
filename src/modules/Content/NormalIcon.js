import React from 'react';
import { connect } from 'react-redux';

import { Checkbox, Tooltip } from 'antd';

import './NormalIcon.less';
import bg from '../../assets/images/menu/Logo_en5.png';
import Labels from './Labels';
import config from '../../../config/config';
import { addIconToSelectedIcons, removeIconFromSelectedIcons } from '../../actions/selectedIcons';

class NormalIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mouseEnter: false,
        };
    }

    handleCheck = (e) => {
        if(this.props.checked) {
            this.props.dispatch(removeIconFromSelectedIcons(this.props.icon._id));
        } else {
            this.props.dispatch(addIconToSelectedIcons(this.props.icon));
        }
    }

    handleMouseToggle = (e) => {
        this.setState((prevState) => {
            return {
                mouseEnter: !prevState.mouseEnter
            }
        });
    }

    downloadLinkOnClick = (e) => {
        // e.preventDefault();
        e.stopPropagation();
    }

    render() {
        let { height, width, iconUrl, labels, fileName } = this.props.icon;
        let { checked } = this.props;
        fileName = fileName.replace(/-timestamp\d+/, '');
        let iconName = fileName.replace(config.fileSuffixReg, '');
        let shortName = iconName;
        if(shortName.length > 7) {
            shortName = shortName.slice(0, 7) + '...';
        }
        const checkedClass = checked ? 'custom-ant-checkbox-checked' : '';
        let iconContainerStyle = {
            backgroundImage: `url(${config.serverHost}/${iconUrl})`,
            border: checked ? "1px solid #0d9be4" : "0",
        };
        if(width > 120 || height > 120) {
            iconContainerStyle.backgroundSize = "contain";
        }
        return (
            <li className={`custom-normal-icon-container`}>
                <div className={`icon-container`} 
                    style={iconContainerStyle} 
                    onClick={this.handleCheck}
                    onMouseOver={this.handleMouseToggle}
                    onMouseOut={this.handleMouseToggle}
                    >
                    <Checkbox 
                        className={`custom-ant-checkbox ${checkedClass}`}
                        checked={checked}
                        style={{
                            display: (checked || this.state.mouseEnter) ? "block" : "none"
                        }}
                        />
                    <a 
                        className={`download-link`} 
                        onClick={this.downloadLinkOnClick}
                        style={{
                            display: this.state.mouseEnter ? "block" : "none"
                        }}
                        download={fileName}
                        href={`${config.serverHost}/${iconUrl}`}
                        >
                        <span className={`icon-download`}></span>
                    </a>
                </div>
                <div className={`icon-title`}>
                    <Tooltip 
                        title={iconName}
                        placement="bottomLeft"
                        overlayClassName={`custom-ant-overlay-hint-name`}
                        >
                        {shortName}
                    </Tooltip>
                </div>
                <Labels labels={labels}/>
            </li>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    let checked = false;
    let { selectedIcons } = state;
    selectedIcons.forEach((value) => {
        if(value.id == ownProps.icon._id) {
            checked = true;
        }
    });
    return {
        checked
    };
}

NormalIcon = connect(mapStateToProps)(NormalIcon);

export default NormalIcon;