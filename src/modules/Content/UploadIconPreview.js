import React from 'react';

import './UploadIconPreview.less';

class UploadIconPreview extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mouseEnter: false,
        };

    }

    handleCheck = (e) => {
        this.props.setSelectedIndex(this.props.index);
    }

    handleMouseToggle = (e) => {
        this.setState((prevState) => {
            return {
                mouseEnter: !prevState.mouseEnter
            }
        });
    }

    deleteLinkOnClick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        console.log('删除....',this.props.index);
        this.props.onDelete(this.props.index);
    }

    render() {
        let style = {
            backgroundImage: `url(${this.props.base64Data})`,
            border: this.props.index == this.props.selectIndex ? "1px solid #0d9be4" : "0"
        };
        if(this.props.width > 100 || this.props.height > 100) {
            style.backgroundSize = "contain";
        }
        return (
            <li className={`custom-upload-icon-container`}>
                <div className={`icon-container`} 
                    style={style} 
                    onClick={this.handleCheck}
                    onMouseOver={this.handleMouseToggle}
                    onMouseOut={this.handleMouseToggle}
                    >
                    <a className={`delete-link`} onClick={this.deleteLinkOnClick}>
                        <span className={`icon-delete`}></span>
                    </a>
                </div>
            </li>
        );
    }
}

export default UploadIconPreview;