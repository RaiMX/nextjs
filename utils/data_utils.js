/*
 * Copyright (c) 2021. RaiMX
 * Written with love by ralimbayev@gmail.com
 */

/**
 * Get unique values of property from array of objects
 * @param data
 * @param value_col
 * @param make_obj - create label/value object
 * @returns {array[]|{label: unknown, value: unknown}[]}
 */
export const getUnique = (data, value_col, make_obj = false) => {
    if (data) {
        const values = data.map(row => {
            return row[value_col];
        });

        let values_unique = [...new Set(values)];

        values_unique = values_unique.filter(x => x != null)

        if (make_obj) {
            return values_unique.map(value => {
                return {
                    label: value,
                    value: value,
                }
            });
        }

        return values_unique;
    }
};

/**
 * Filter array of objects
 * https://gist.github.com/jherax/f11d669ba286f21b7a2dcff69621eb72
 * @param array
 * @param filters object
 *      key - name of the column (property)
 *      value - array or function that returns boolean
 * @returns {*}
 */
export const multiFilterArray = (array, filters) => {
    if (!array) {
        return array;
    }

    const filterKeys = Object.keys(filters);

    return array.filter(item => {
        // validates all filter criteria

        return filterKeys.every(id => {
            let code = id.split(':')[0];
            let key = id.split(':')[1];

            // ignores non-function predicates
            if (typeof filters[id] === 'function') {
                if (item[key] !== undefined) {
                    return filters[id](item[key]);
                }
                return true;
            } else if (!filters[id].length) {
                //nothing selected, return everything
                return true;
            } else if (typeof filters[id] === 'string') {
                // ignore single string filters
                return true;
            } else {
                if (item[key] !== undefined) {
                    return filters[id].find(filter => filter === item[key]);
                }
                return true;
            }
        });
    });
};


/**
 * Sort array of objects by multiple properties
 * Sorting in place!
 * '-' in prop name indicates descending order
 * Usage:
 *      array_name.sort(multiSortArray('prop1', 'prop2', '-prop3'))
 * https://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value
 * @returns {function(*=, *=): number}
 */
export function multiSortArray() {
    function dynamicSort(property) {
        let sortOrder = 1;
        if (property[0] === "-") {
            sortOrder = -1;
            property = property.substr(1);
        }

        if (property === 'dependencies') {
            return function (a, b) {
                /* next line works with strings and numbers,
                 * and you may want to customize it to your needs
                 */
                let result;
                if (b.dependencies.indexOf(a.id)) {
                    result = 1;
                } else if (a.dependencies.indexOf(b.id)) {
                    result = -1;
                } else {
                    result = 0;
                }
                return result * sortOrder;
            }
        } else {
            return function (a, b) {
                /* next line works with strings and numbers,
                 * and you may want to customize it to your needs
                 */
                let result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
                return result * sortOrder;
            }
        }
    }

    /*
     * save the arguments object as it will be overwritten
     * note that arguments object is an array-like object
     * consisting of the names of the properties to sort by
     */
    let props = arguments;
    return function (obj1, obj2) {
        let i = 0, result = 0, numberOfProperties = props.length;
        /* try getting a different result from 0 (equal)
         * as long as we have extra properties to compare
         */
        while (result === 0 && i < numberOfProperties) {
            result = dynamicSort(props[i])(obj1, obj2);
            i++;
        }
        return result;
    }
}

/**
 * Make unique array of objects from array of objects by property
 * https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
 * @param prop
 * @returns {function(*): unknown[]}
 *
 * USAGE:
 *      const uniqueById = uniqByProp_map("id");
 *      const unifiedArray = uniqueById(arrayWithDuplicates);
 */
export const uniqueByProp = prop => arr =>
    Array.from(
        arr
            .reduce(
                (acc, item) => (
                    item && item[prop] && acc.set(item[prop], item),
                        acc
                ), // using map (preserves ordering)
                new Map()
            )
            .values()
    );


export const roundNumber = (value, decimals = 3) => {
    return Math.round((value + Number.EPSILON) * (10 ** decimals)) / (10 ** decimals);
}


/**
 * Format number
 * @example
 * from 123456.789 to string 123,456.789
 * @param {number} value
 * @param {string} separator Separator of thousands (default <space> )
 * @returns {string}
 */
export const formatNumber = (value, decimals = 0, separator = ' ') => {
    value = roundNumber(value, decimals);

    let value_t = (value + '').split('.');
    let whole_part = value_t[0].replace(/(\d{1,3})(?=(?:\d{3})+(?!\d))/g, '$1' + separator);

    let dec_part = '';
    if (value_t[1] !== undefined) {
        dec_part = '.' + value_t[1];
    }

    return whole_part + dec_part;
};

/**
 * Make tree from ORDERED!!! array of parent child objects in form of:
 * @example
 * [
 *  {code: '1', parent_code: null, ...props},
 *  {code: '2', parent_code: '1', ...props},
 *  {code: '3', parent_code: '1', ...props},
 * ]
 * @param {array} array Flat array
 * @returns {object}
 * @param {string} code_prop Identifying property name
 * @param {string} parent_prop Parent property name
 */
export const makeTreeFromOrdered = (array, code_prop = 'code', parent_prop = 'parent_code') => {
    let map = {};
    for (let i = 0; i < array.length; i++) {
        let obj = {...array[i]};
        obj.children = [];
        obj.value = obj[code_prop];

        map[obj[code_prop]] = obj;

        let parent = obj[parent_prop] || '-';
        if (!map[parent]) {
            map[parent] = {
                children: []
            };
        }
        map[parent].children.push(obj);
    }
    return map['-'].children;
}

/**
 * Make tree from UNORDERED array of parent child objects
 * @param array
 * @param code_prop
 * @param parent_prop
 * @param children_prop
 * @returns {[]}
 */
export const makeTree = (array, code_prop = 'code', parent_prop = 'parent_code', children_prop = 'children') => {
    const hashTable = Object.create(null);
    array.forEach(aData => hashTable[aData[code_prop]] = {...aData, [children_prop]: []});
    const dataTree = [];
    array.forEach(aData => {
        if (aData[parent_prop] && hashTable[aData[parent_prop]]) {
            hashTable[aData[parent_prop]][children_prop].push(hashTable[aData[code_prop]])
        } else {
            dataTree.push(hashTable[aData[code_prop]])
        }
    });
    return dataTree;
};


/**
 * Group array of objects by properties
 * ATTENTION!!! Bad performance if 50k objects or larger
 * @todo Improve performance for large number of objects
 * @example
 result_array = groupByArray(arr,
 (x, o) => x.prop1 === o.prop1 && x.prop2 === o.prop2,
 ['SUMM']);

 * @returns {array} Array of grouped objects
 * @param {array} arr Array of objects
 * @param {function(*, *): boolean} compare_func Function that compares objects to group by properties
 * @param {string[]} sum_props Properties that will be summed
 */
export const groupByArray = (arr, compare_func, sum_props) => {
    return arr.reduce(function (r, o) {
        let obj_index = r.findIndex(x => compare_func(x, o));
        if (obj_index === -1) {
            r.push(o);
        } else {
            sum_props.map(prop => {
                r[obj_index][prop] += o[prop];
            });
        }
        return r;
    }, []);
}

export const prepOked = (oked_raw) => {
    const dat = oked_raw.map(row => {
        row.value = row.OKED_CODE;

        if (row.OKEDL5 !== null) {
            row.label = row.OKEDL5;
            row.parent_label = row.OKEDL4;
            row.level = 5;
        } else if (row.OKEDL4 !== null) {
            row.label = row.OKEDL4;
            row.parent_label = row.OKEDL3;
            row.level = 4;
        } else if (row.OKEDL3 !== null) {
            row.label = row.OKEDL3;
            row.parent_label = row.OKEDL2;
            row.level = 3;
        } else if (row.OKEDL2 !== null) {
            row.label = row.OKEDL2;
            row.parent_label = null;
            row.level = 2;
        }

        return row;
    });

    return dat.map(row => {
        if (row.parent_label !== null) {
            let parent = dat.find(x => x.label === row.parent_label);
            if (parent) {
                row.PARENT_OKED = parent.OKED_CODE;
            } else {
                row.PARENT_OKED = null;
            }
        } else {
            row.PARENT_OKED = null;
        }

        return row;
    });
};


/**
 *    Search object by object property in tree of objects
 * @param element {array | object}
 * @param search_value {string}
 * @param search_prop {string}
 * @param children_prop {string}
 * @returns {null|object}
 */
export const searchTree = (element, search_value, search_prop, children_prop = 'children') => {
    if (Array.isArray(element)) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element.length; i++) {
            result = searchTree(element[i], search_value, search_prop, children_prop);
        }
        return result;
    } else if (element && element[search_prop] === search_value) {
        return element;
    } else if (element[children_prop] != null) {
        let i;
        let result = null;
        for (i = 0; result == null && i < element[children_prop].length; i++) {
            result = searchTree(element[children_prop][i], search_value, search_prop, children_prop);
        }
        return result;
    }

    return null;
}

export const splitStringNewlines = (string, by, newline = '\n') => {
    let text = '';
    let words = string.split(' ');
    let words_per_line = Math.ceil(words.length / by);
    let counter = 0;
    words.map((word, i) => {
        counter++;
        if (counter === words_per_line) {
            text += ' ' + word + newline;
            counter = 0;
        } else {
            text += ' ' + word
        }
    })

    return text;
};

export const wordWrap = (s, w) => s.replace(
    /(?![^\n]{1,32}$)([^\n]{1,32})\s/g, '$1\n'
);

export const wordWrap2 = (s, w) => s.replace(
    new RegExp(`(?![^\\n]{1,${w}}$)([^\\n]{1,${w}})\\s`, 'g'), '$1\n'
);

export const camelToSnakeCase = s => s.replace(/\.?([A-Z]+)/g, function (x, y) {
    return "_" + y.toLowerCase()
}).replace(/^_/, "");

export const prepLookup = (arr, key_prop = 'code', name_prop = 'name') => {
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];
        if (typeof name_prop === 'function') {
            obj[item[key_prop]] = name_prop(item);
        } else {
            obj[item[key_prop]] = item[name_prop];
        }
    }

    return obj;
}

/**
 * Get full path to ID as array of IDs
 * @param items {array} Array of objects
 * @param id {string | integer} Identifier to get path to
 * @param id_prop {string} Identifier property
 * @param children_prop {string} Children property
 * @param path_prop {string} Return array of this property
 * @returns {*|[*]|*[]}
 */
export const getPath = ({items, id, id_prop = 'id', children_prop = 'children', path_prop = 'id'}) => {
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item[id_prop] !== id) {
            if (item[children_prop]) {
                const path = getPath({items: item[children_prop], id, id_prop, children_prop, path_prop});
                if (path) {
                    path.unshift(item[path_prop]);
                    return path;
                }
            }
        } else {
            return [item[path_prop]];
        }
    }
}
