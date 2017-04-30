import React from 'react';

import './FileNotFound.less';

class FileNotFound extends React.Component {
    render() {
        return (
            <div className={`file-not-found-container`}>
                <div className={`file-not-found-svg`}></div>
                <span className={`file-not-found-text`}>抱歉，未找到匹配的文件~</span>
            </div>
        );
    }
}

export default FileNotFound;