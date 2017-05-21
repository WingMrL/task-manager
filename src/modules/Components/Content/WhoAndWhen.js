import React from 'react';

import { Card, Select, DatePicker, message, Tooltip } from 'antd';
const Option = Select.Option;
// import { Link } from 'react-router-dom';
// import { connect } from 'react-redux';
import moment from 'moment';
import './WhoAndWhen.less';
// import axios from 'axios';
// import config from '../../../../config/config';
// import { addUser } from '../../../actions/userActions';
// import '../../../assets/style.less';



class WhoAndWhen extends React.Component {

    state = {
        currentWho: '',
        currentWhen: null,
        isChange: false, // 自打开面板以后，是否有操作，如改变指派或者截止时间
    }

    handleWhoAndWhenOnClick = () => {
        const { who, when, whoAndWhenSettingVisible, members, taskId, clickable, project } = this.props;

        if(clickable != undefined && clickable == false) {
            return;
        }

        const { currentWhen, currentWho,  } = this.state;
        const willVisible = !whoAndWhenSettingVisible;

        // debugger;
        
        if(willVisible) { // 初始化currentWhot和currentWhen
            this.setState({
                currentWho: who == '未指派' ? '' : who,
                currentWhen: when == '没有截止日期' ? null : moment(when),
                isChange: false,
            });
            // debugger;
        } else if(!this.state.isChange) { // 没有改变，不做任务操作
            // return;
            // debugger;
        } else {

            let membersName = members.map(v => v.userName);
            let settingWho = membersName.indexOf(currentWho) > -1 ? currentWho : '未指派'; //是否能在members中找到对应的名字
            let settingWhen = currentWhen == null ? '没有截止日期' : currentWhen.format('YYYY-MM-DD');

            if(settingWho == '未指派' && settingWhen != '没有截止日期') {
                message.warning(`选择日期之前，请先指派!`, 3);
                return;
            }
            // debugger;
            // 设置 指派 和 截止时间
            this.props.handleSettingWhoAndWhen(settingWho, settingWhen, taskId, project);
        }

        // 显示或者隐藏 面板
        this.props.handleWhoAndWhenOnClick(this.props.taskId);
    }

    handleSelectOnChange = (value) => {
        this.setState({
            currentWho: value,
            isChange: true,
        });
    }

    handleDataOnChange = (date, dateString) => {
        this.setState({
            currentWhen: date,
            isChange: true,
        });
    }

    render() {

        let { who, when, members, whoAndWhenSettingVisible, style, clickable} = this.props;
        let { currentWhen, currentWho } = this.state;

        // let currentWhenMoment = currentWhen ;
        const memberOptions = members.map((v) => {
            return <Option value={v.userName} key={v._id}>{v.userName}</Option>
        });

        const boxStyle = {
            display: whoAndWhenSettingVisible ? "flex" : "none"
        }

        if(!style) {
            style = {};
        }
        if(clickable != undefined && clickable == false) {
            style.cursor = "default";
        }

        return (
            <div className={`custom-who-and-when-container`} style={style} >
                <div 
                    className={`who-and-when`}
                    onClick={this.handleWhoAndWhenOnClick}
                    >
                    <Tooltip
                        title={who}
                        >
                        <span className={`who`}>{who.length > 5 ? `${who.slice(0, 5)}...` : who}</span>
                    </Tooltip>
                    <span> · </span>
                    <span className={`when`}>{when}</span>
                </div>
                <div className={`who-and-when-setting`} style={boxStyle}>
                    <span className={`text`}>将任务指派给</span>
                    <Select 
                        onChange={this.handleSelectOnChange}
                        mode={`combobox`}
                        value={currentWho}
                        >
                        { memberOptions }
                    </Select>
                    <span className={`text`}>任务截止日期</span>
                    <DatePicker 
                        onChange={this.handleDataOnChange}
                        value={currentWhen}/>
                </div>
            </div>
        );
    }
}

export default WhoAndWhen;

