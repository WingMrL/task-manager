import React from 'react';

import { Tag, Tooltip } from 'antd';
import './Labels.less';
import _ from 'underscore';

class Labels extends React.Component {

    removeRepetitive = (arr) => {
        let newArr = [];
        arr.forEach((value) => {
            let flag = false;
            newArr.forEach((val) => {
                if(_.isEqual(val, value)) {
                    flag = true;
                }
            });
            if(!flag) {
                newArr.push(value);
            }
        });
        return newArr;
    }

    render() {
        let { labels } = this.props;
        let labelArr = this.removeRepetitive(labels);
        let labelList = labelArr.map((value) => {
            return  <Tag
                        key={value._id}
                        >
                        {value.labelName}
                    </Tag>
        });
        return (
            <div className={`icon-label-container`}>
                <Tooltip 
                    placement="bottomLeft" 
                    title={
                        <div>
                            {labelList}
                        </div>
                    }
                    overlayClassName={`custom-ant-overlay-hint-label`}
                    >
                    {labelList}
                </Tooltip>
            </div>
        );
    }
}

export default Labels;