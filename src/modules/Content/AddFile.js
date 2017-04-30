import React from 'react';

import axios from 'axios';

import './AddFile.less';
import { Upload, message } from 'antd';
import config from '../../../config/config';

import defaultRequest from '../../utils/request';

class AddFile extends React.Component {

    constructor(props) {
        super(props);
    }



    handleBeforeUpload = (file, fileList) => {
        let self = this;
        this.props.beforeUpload(file, fileList);

        return new Promise((resolve, rejected) => {
            let timer = setInterval(() => {
                if(self.props.uploadFlag) {
                    resolve();
                    clearInterval(timer);
                    timer = null;
                }
            }, 500);
        });
    };

    handleChange = (info) => {
        if (info.file.status === 'done') {
            message.success(`${info.file.name} 上传成功！`);
            this.props.removeUploadSuccessFile(info.file.uid, info.file.status);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} 上传失败！`);
            this.props.removeUploadSuccessFile(info.file.uid, info.file.status);
        }
        
    }

    handleCustomRequest = (obj) => {
        let self = this;
        this.props.fileList.forEach((value) => {
            if(value.uid == obj.file.uid) {
                let file = obj.file;
                obj.data = {
                    filename: file.filename,
                    width: file.width,
                    height: file.height,
                    labels: [...file.labels],
                    size: file.size,
                    type: file.type,
                    uid: file.uid,
                    groupId: self.props.groupId
                }
                // debugger;
                defaultRequest(obj);
            }
        })
    }

    render() {
        // console.log(this.props.groupId);
        return (
            <Upload
                showUploadList={false}
                name="icon"
                action={`${config.serverHost}/api/uploadIcon`}
                className={`custom-file-upload-container`}
                onChange={this.handleChange}
                beforeUpload={this.handleBeforeUpload}
                multiple
                customRequest={this.handleCustomRequest}
                accept={`.png, .jpg, .svg, .jpeg`}
                >
                <li className={`upload`}>
                </li>
            </Upload>
        );
    }
}

export default AddFile;