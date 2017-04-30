import React from 'react';

import { Checkbox } from 'antd';

import './SelectAll.less';
import { connect } from 'react-redux';
import { addAllIconsToSelectedIcons, removeAllIconsFromSelectedIcons } from '../../actions/selectedIcons';

class SelectAll extends React.Component {

    constructor(props) {
        super(props);
    }
    
    handleCheckboxChecked = (e) => {
        if(e.target.checked) {
            this.props.dispatch(addAllIconsToSelectedIcons(this.props.icons));
        } else {
            this.props.dispatch(removeAllIconsFromSelectedIcons(this.props.icons));
        }
    }

    componentWillUnmount() {
        this.props.dispatch(removeAllIconsFromSelectedIcons(this.props.icons));
    }

    render() {
        const { checked } = this.props;
        const checkTitle = checked ? '取消选择' : '全选';
        return (
            <div className={`select-all-checkbox-container`}>
                {checkTitle}
                <Checkbox 
                    onChange={this.handleCheckboxChecked} 
                    className={`s-a-checkbox select-all-checkbox`}
                    checked={checked}
                    />
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => ({
    checked: state.selectedIcons.length > 0,
    icons: state.icons
});

SelectAll = connect(mapStateToProps)(SelectAll);

export default SelectAll;
