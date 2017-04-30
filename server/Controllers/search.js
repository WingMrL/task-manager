let mongoose = require('mongoose');

let Icon = mongoose.model('Icon');
let Label = mongoose.model('Label');
let Group = mongoose.model('Group');
let serier = require('async/series');
let config = require('../../config/config');

exports.suggestion = function(req, res) {
    let searchName = req.body.searchName;
    if(searchName == '') {
        res.json({
            code: -1,
            data: []
        });
    } else {
        let reg = new RegExp(`^${searchName}`, 'i');
        serier({
            groups: function(callback) {
                Group.find({ groupName: reg }
                    , { groupName: 1 })
                    .exec()
                    .then(function(result) {
                        result = result.map(function(value) {
                            return {
                                text: value.groupName,
                                _id: value._id
                            };
                        });
                        callback(null, result);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            labels: function(callback) {
                Label.find({ labelName: reg }
                    , { labelName: 1 })
                    .exec()
                    .then(function(result) {
                        result = result.map(function(value) {
                            return {
                                text: value.labelName,
                                _id: value._id
                            };
                        });
                        callback(null, result);
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            },
            icons: function(callback) {
                Icon.find({ fileName: reg }
                    , { fileName: 1 })
                    .exec()
                    .then(function(result) {
                        
                        result = result.map(function(value) {
                            return {
                                text: value.fileName.replace(/-timestamp\d+/, '').replace(config.fileSuffixReg, ''),
                                _id: value._id
                            };
                        });
                        callback(null, result);
                        
                    })
                    .catch(function(err) {
                        console.log(err);
                    });
            }
        }, function(err, result) {
            result = result.groups.concat(result.labels, result.icons);
            // console.log(result);
            let resultNameArr = result.map(function(v) {
                return v.text;
            });
            let uniqueNameArr = [];
            let repetitiveIndexes = [];
            resultNameArr.forEach(function(v, i) {
                if(uniqueNameArr.indexOf(v) > -1) {
                    repetitiveIndexes.push(i);
                } else {
                    uniqueNameArr.push(v);
                }
            });
            repetitiveIndexes.reverse();
            repetitiveIndexes.forEach(function(v) {
                result.splice(v, 1);
            });
            res.json({
                code: 0,
                data: result,
            });
        });
    }
};

exports.search = function(req, res) {
    let { searchName, currentPage, numbersInPage } = req.body;
    let reg = new RegExp(`${searchName}`, 'i');
    serier({
        group: function(callback) {
            Group.find({ groupName: searchName }
                    , { groupName: 1 })
                .exec()
                .then(function(result) {
                    if(result.length > 0) {
                        Group.findOne({ _id: result[0]._id })
                            .populate({
                                path: 'icons',
                                options: {
                                    sort: {
                                        'meta.updateAt': -1
                                    }
                                },
                                populate: {
                                    path: 'labels',
                                    select: 'labelName',
                                    model: 'Label'
                                }})
                            .exec()
                            .then(function(result) {
                                callback(null, result);
                            })
                            .catch(function(err) {
                                console.log(err);
                            })
                    } else {
                        callback(null, {});
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        label: function(callback) {
            Label.find({ labelName: searchName }
                    , { labelName: 1 })
                .exec()
                .then(function(result) {
                    if(result.length > 0) {
                        Label.findOne({ _id: result[0]._id })
                            .populate({
                                path: 'icons',
                                options: {
                                    sort: {
                                        'meta.updateAt': -1
                                    }
                                },
                                populate: {
                                    path: 'labels',
                                    select: 'labelName',
                                    model: 'Label'
                                }})
                            .exec()
                            .then(function(result) {
                                callback(null, result);
                            })
                            .catch(function(err) {
                                console.log(err);
                            })
                    } else {
                        callback(null, {});
                    }
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
        icons: function(callback) {
            Icon.find({ fileName: reg })
                .populate({
                    path: 'labels',
                    options: {
                        sort: {
                            'meta.updateAt': -1
                        }
                    }})
                .exec()
                .then(function(result) {
                    callback(null, result);
                })
                .catch(function(err) {
                    console.log(err);
                });
        },
    }, function(err, result) {
        let icons = [];
        let group = {};
        let iconsInGroup;
        if(result.group.groupName) {
            icons = icons.concat(result.group.icons);
            iconsInGroup = result.group.icons.slice(0, 9).map(function(value) {
                return {
                    _id: value._id,
                    iconUrl: value.iconUrl
                }
            });
            group = {
                _id: result.group._id,
                groupName: result.group.groupName,
                groupEngName: result.group.groupEngName,
                groupIconUrl: result.group.groupIconUrl,
                icons: iconsInGroup,
                meta: result.group.meta
            };
        }
        if(result.label.labelName) {
            icons = icons.concat(result.label.icons);
        }

        
        icons = icons.concat(result.icons);

        // console.log(icons);
        let iconsIdArr = icons.map(function(v) {
            return v._id;
        });
        let iconsIdArrTemp = [];
        let indexArr = [];
        iconsIdArr.forEach(function(v, i) {
            if(iconsIdArrTemp.indexOf(v) > -1) {
                indexArr.push(i);
            } else {
                iconsIdArrTemp.push(v);
            }
        });
        indexArr.reverse();
        indexArr.forEach(function(v) {
            icons.splice(v, 1);
        });
        let totalIcons = icons.length;
        let totalPages = Math.ceil(totalIcons / numbersInPage);
        if(totalPages == 0) {
            totalPages ++;
        }
        let startIndex = (currentPage - 1) * numbersInPage;
        let endIndex = startIndex + numbersInPage;
        icons = icons.slice(startIndex, endIndex);
        res.json({
            code: 0,
            result: {
                group,
                icons,
            },
            totalPages,
            totalIcons
        });
    });
}