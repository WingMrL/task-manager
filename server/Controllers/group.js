let mongoose = require('mongoose');

let Group = mongoose.model('Group');

exports.addGroup = function(req, res) {
    let _group = req.body;
    let group = new Group(_group);

    group.save(function(err, group) {
        if(err) {
            console.log(err);
        }

        res.json({
            code: 0,
            status: 'ok'
        });
    })
};

exports.getGroups = function(req, res) {
    let options = {
        limit: 9,
        sort: {
            'meta.updateAt': -1
        }
    }
    Group.find({})
        .populate('icons', ['iconUrl'], {}, options)
        .exec(function(err, groups) {
            if(err) {
                console.log(err);
            }

            res.json({
                code: 0,
                status: 'ok',
                groups: groups
            });
        });
}

exports.getGroup = function(req, res) {
    let { currentPage, numbersInPage, _id, iconId } = req.query;
    let options = {
        sort: {
            'meta.updateAt': -1
        }
    }
    if(_id) {
        Group.findOne({_id: _id})
            .populate({
                path: 'icons',
                select: 'fileName iconUrl width height labels',
                model: 'Icon',
                options: options,
                populate: {
                    path: 'labels',
                    select: 'labelName',
                    model: 'Label'
                }
            })
            .exec(function(err, group) {
                if(err) {
                    console.log(err);
                }

                let jumpToPage;
                if(iconId) {
                    let indexOfIdInIcons = -1;
                    group.icons.forEach(function(v, i) {
                        if(v._id == iconId) {
                            indexOfIdInIcons = i;
                        }
                    });
                    indexOfIdInIcons ++; //第一张图和索引是0
                    jumpToPage = Math.ceil(indexOfIdInIcons / numbersInPage);
                }
                
                let totalIcons = group.icons.length;
                let totalPages = Math.ceil(totalIcons / numbersInPage);
                if(totalPages == 0) {
                    totalPages ++;
                }
                let startIndex = (currentPage - 1) * numbersInPage;
                let endIndex = startIndex + numbersInPage;
                group.icons = group.icons.slice(startIndex, endIndex);
                res.json({
                    code: 0,
                    status: 'ok',
                    group: group,
                    totalPages,
                    totalIcons,
                    jumpToPage
                });
            });
    } else {
        res.json({
            code: -1,
            status: 'params error',
            group: {}
        });
    }
}