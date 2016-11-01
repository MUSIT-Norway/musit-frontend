export const sortObject = (obj: any, key: string, inputKeyType: string = '', sortAscending: bool = true, keyChild: string): any => {
    function valueLowerCase(v) {
        try {
            return v && v !== '' && typeof v === 'string' ? v.toLowerCase() : v
        } catch (err) {
            throw err
        }
    }

    function compare(a, b) {
        try {
            if (keyChild) {
                a = a[key][keyChild] ? a[key][keyChild] : ''
                b = b[key][keyChild] ? b[key][keyChild] : ''
            } else {
                a = a[key] ? a[key] : ''
                b = b[key] ? b[key] : ''
            }

            let type = typeof a === 'string' || typeof b === 'string' ? 'string' : 'number'
            type = inputKeyType ? inputKeyType : type

            let result
            if (type === 'string') {
                if (sortAscending) {
                    result = valueLowerCase(a) > valueLowerCase(b)
                } else {
                    result = valueLowerCase(b) > valueLowerCase(a)
                }}
            else result = sortAscending ? a - b : b - a

            return result;
        } catch (err) {
            throw err
        }
    }

    return obj && JSON.stringify(obj) !== '{}' ? [].slice.call(obj).sort(compare) : {}

}

