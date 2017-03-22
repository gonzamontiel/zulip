var typing_data = (function () {
var exports = {};

var typist_dct = new Dict();

function to_int(s) {
    return parseInt(s, 10);
}

function sorted(user_ids) {
    // This mapping makes sure we are using ints, and
    // it also makes sure we don't mutate the list.
    var id_list = _.map(user_ids, to_int);
    id_list.sort(function (a, b) {
        return a - b;
    });
    id_list = _.uniq(id_list, true);

    return id_list;
}

function get_key(group) {
    var ids = sorted(group);
    return ids.join(',');
}

exports.add_typist = function (group, typist) {
    var key = get_key(group);
    var current = typist_dct.get(key) || [];
    typist = to_int(typist);
    if (!_.contains(current, typist)) {
        current.push(typist);
    }
    typist_dct.set(key, sorted(current));
};

exports.remove_typist = function (group, typist) {
    var key = get_key(group);
    var current = typist_dct.get(key) || [];

    typist = to_int(typist);
    if (!_.contains(current, typist)) {
        return false;
    }

    current = _.reject(current, function (user_id) {
        return to_int(user_id) === to_int(typist);
    });

    typist_dct.set(key, current);
    return true;
};

exports.get_group_typists = function (group) {
    var key = get_key(group);
    return typist_dct.get(key) || [];
};

exports.get_all_typists = function () {
    var typists = _.flatten(typist_dct.values(), true);
    typists = sorted(typists);
    typists = _.uniq(typists, true);
    return typists;
};

return exports;
}());

if (typeof module !== 'undefined') {
    module.exports = typing_data;
}