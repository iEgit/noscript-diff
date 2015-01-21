;(function() {
    // returns true if the objects are different
    //        false if the same
    function _diff (oldObj, newObj, path, acc) {

        // by default we think objects are the same
        var different = false;

        // no diff if the same
        if (oldObj === newObj) {
            return false;
        }

        // if we're dealing with array
        if (Array.isArray(oldObj)) {

            if (!Array.isArray(newObj)) {
                acc.push(path);
                return true;
            }

            var i = Math.max(oldObj.length, newObj.length);

            while(i-- !== 0) {
                // if members of arrays are different
                different = _diff(oldObj[i], newObj[i], path + '[' + i + ']', acc) || different;
            }

            if (different) {
                acc.push(path);
            }

            return different;
        }

        // dealing with object
        if (typeof oldObj === 'object') {

            // if newObj is array
            if (Array.isArray(newObj)) {
                acc.push(path);
                return true;
            }

            // null
            if (!oldObj || !newObj) {
                // if both of 'em are null - they are equal
                // otherwise they are different
                different = !(!oldObj && !newObj);
                acc.push(path);

                return different;
            }

            // iterate over props of old object
            for (var prop in oldObj) {

                // skipping prototype props
                if (!oldObj.hasOwnProperty(prop)) {
                    continue;
                }

                // if new object doesn't have current prop - they are different
                if (!(prop in newObj)) {
                    different = true;
                    acc.push(path + '.' + prop);
                    continue;
                }

                // diving into the current prop
                different = _diff(oldObj[prop], newObj[prop], path + '.' + prop, acc) || different;
            }

            // iterating over props of new object to find new props
            for (prop in newObj) {

                if (!newObj.hasOwnProperty(prop)) {
                    continue;
                }

                if (!(prop in oldObj)) {
                    different = true;
                    acc.push(path + '.' + prop);
                }
            }

            // comparing string representation of objects
            if (typeof oldObj.toString === 'function') {
                if (typeof newObj.toString === 'function') {
                    different = _diff(oldObj.toString(), newObj.toString(), 'toString', acc) || different;
                } else {
                    different = true;
                }
            }

            if (different) {
                acc.push(path);
            }

            return different;
        }

        // dealing with functions
        if (typeof oldObj === 'function') {
            if (typeof newObj === 'function') {
                different = oldObj.toString() !== newObj.toString();
            } else {
                different = true;
            }

            if (different) {
                acc.push(path);
            }

            return different;
        }


        //not equal primitives
        acc.push(path);
        return true;
    }

    // returns array of paths to changes
    function diff(a, b, options) {
        var arr = [];
        options = options || {};

        _diff(a, b, '', arr);

        if (!options.full) {// filter out array details
            arr = arr.filter(function(e){return e.indexOf('[') < 0;});
        }

        return arr;
    }


    ns.Model.prototype.setDataDiff = function (data, options) {
        // compute diff
        var _diff = diff(this.getData(), data);

        // iterate over generated diff paths
        for (var i = _diff.length, propValue; i-- !=0;) {
            propValue = _diff[i];
            if (propValue === '') continue;
            this.set(propValue, no.jpath(propValue, data));
        }

        // cleaning up the model
        for (var prop in this.data) {
            // skipping prototype props
            if (!this.data.hasOwnProperty(prop)) {
                continue;
            }
            // if new data doesn't have an old property - remove it from model
            if (!(prop in data)) {
                delete this.data[prop];
            }
        }
    }

    if (module && module.exports) {
        module.exports = diff;
    }

})();
