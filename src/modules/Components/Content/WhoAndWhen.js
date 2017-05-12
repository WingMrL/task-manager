import React from 'react';

import { Card, Select, DatePicker } from 'antd';
const Option = Select.Option;
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import './WhoAndWhen.less';
// import axios from 'axios';
// import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class WhoAndWhen extends React.Component {

    handleWhoAndWhenOnClick = () => {
        this.props.handleWhoAndWhenOnClick(this.props.taskId);
    }

    handleSelectOnChange = (value) => {
        this.props.handleSelectOnChange(value, this.props.taskId);
    }

    handleDataOnChange = (date, dateString) => {
        this.props.handleDataOnChange(date, dateString, this.props.taskId);
    }

    render() {

        const { who, when, members, whoAndWhenSettingVisible, style} = this.props;
        const memberOptions = members.map((v) => {
            return <Option value={v.userName} key={v._id}>{v.userName}</Option>
        });
        const boxStyle = {
            display: whoAndWhenSettingVisible ? "flex" : "none"
        }
        return (
            <div className={`custom-who-and-when-container`} style={style}>
                <div 
                    className={`who-and-when`}
                    onClick={this.handleWhoAndWhenOnClick}
                    >
                    <span className={`who`}>{who}</span>
                    <span> · </span>
                    <span className={`when`}>{when}</span>
                </div>
                <div className={`who-and-when-setting`} style={boxStyle}>
                    <span className={`text`}>将任务指派给</span>
                    <Select 
                        onChange={this.handleSelectOnChange}
                        mode={`combobox`}
                        >
                        { memberOptions }
                    </Select>
                    <span className={`text`}>任务截止日期</span>
                    <DatePicker onChange={this.handleDataOnChange}/>
                </div>
            </div>
        );
    }
}

export default WhoAndWhen;

