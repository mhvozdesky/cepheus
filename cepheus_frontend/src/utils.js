const convertToBase64 = (value) => {
    let json = JSON.stringify(value)
    let encoder = new TextEncoder()
    let bytes = encoder.encode(json)
    let base64String = btoa(String.fromCharCode(...bytes))
    return encodeURIComponent(base64String)
}

const get_string_value = (searchItem) => {
    let valueList = searchItem.values;
    let valueListClear = valueList.filter((item) => item !== '')

    if (valueListClear.length === 0) {
        return ''
    }

    let valueBase64 = convertToBase64(valueListClear)

    return `${searchItem.field}=${valueBase64}`

}

export const get_filter_string = (search_fields) => {
    let string_list = []

    for (let i=0; i < search_fields.length; i++) {
        let searchItem = search_fields[i]
        let stringValue = get_string_value(searchItem)
        if (stringValue !== '') {
            string_list.push(stringValue)
        }
    }

    return string_list.join('&')
}