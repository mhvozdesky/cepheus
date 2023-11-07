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

export const get_search_string = (search_fields) => {
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

export const get_filter_string = (filterChoice) => {
    let result = [];

    for (const [key, value] of Object.entries(filterChoice)) {
        if (typeof value === "string") {
            result.push(`${key}=${value}`);
        } else if (typeof value === "object" && value.hasOwnProperty("value")) {
        for (const [subKey, subValue] of Object.entries(value.value)) {
            result.push(`${key}_${subKey}=${subValue}`);
        }
        }
    }

    return result.join("&");
}

export const get_blanck_customer = () => {
    const data = {
        email: '',
        first_name: '',
        last_name: "",
        middle_name: "",
        phone_number: "",
        date_of_birth: "",
        gender: ""
    }

    return data
}