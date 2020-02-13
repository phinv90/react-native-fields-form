import {filter, findIndex, isArray} from 'lodash'

export function isSelectBox(attributes) {
    return Boolean(attributes.isSelectBox)
}

export function isCheckBox(attributes) {
    return Boolean(attributes.isCheckBox)
}

export function isRadio(attributes) {
    return Boolean(attributes.isRadio)
}

export function isShowHidePassword(attributes) {
    return Boolean(attributes.isShowHidePassword)
}

export function isMultiSelect(attributes) {
    return Boolean(attributes.isMultipleSelect)
}

export function isShowHideConfirmPassword(attributes) {
    return Boolean(attributes.isShowHideConfirmPassword)
}

export function getMultiselect(selected = [], items = [], uniqueKey = "id") {
    const nextSelected = selected.map(sel => {
        if (!sel)
            return null
        let idx = findIndex(items, {[uniqueKey]: sel[uniqueKey]})
        if (idx !== -1)
            return sel[uniqueKey]
        return null
    })
    return filter(nextSelected, s => s)
}

export function getSelectedItemsExt(selected = [], items = [], uniqueKey = "id") {
    const SelectExt = selected.map(sel => {
        if (!sel)
            return null
        let idx = findIndex(items, {[uniqueKey]: sel})
        if (idx !== -1)
            return items[idx]
        return null
    })
    return filter(SelectExt, s => s)
}

export function getSelectedItemExt(selected = '', items = [], uniqueKey = "id") {
    if (!selected)
        return null
    let idx = findIndex(items, {[uniqueKey]: selected})
    if (idx !== -1)
        return items[idx]
    return null
}

export function validateSelectItems(items, uniqueKey = "id") {
    if (!isArray(items))
        return []
    const nextItems = items.map(item => {
        if (item && item[uniqueKey])
            return item
        return null
    })
    return filter(nextItems, s => s)
}
