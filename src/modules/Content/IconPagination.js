import React from 'react';

import './IconPagination.less';
import { Pagination } from 'antd';

class IconPagination extends React.Component {

    constructor(props) {
        super(props);
    }

    showTotalPages = (total, range) => {
        return `共${this.props.totalPages}页`;
    }

    onChange = (page, pageSize) => {
        this.props.onChange(page, pageSize);
    }

    render() {
        let { totalPages, size, numbersInPage, currentPage, totalIcons } = this.props;
        return (
            <div className={`icon-pagination-container`}>
                <Pagination 
                    size={size}
                    pageSize={numbersInPage}
                    current={currentPage}
                    total={totalIcons}
                    onChange={this.onChange}
                    />
                <span className={`total-pages`}>{`共${totalPages}页`}</span>
            </div>
        );
    }
}

export default IconPagination;