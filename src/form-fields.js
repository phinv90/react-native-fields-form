import {HelperText, TextInput} from 'react-native-paper'
import {StyleSheet, View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {CheckBox} from 'react-native-elements'
import {
    getMultiselect,
    getSelectedItemExt,
    getSelectedItemsExt,
    isCheckBox,
    isMultiSelect,
    isRadio,
    isSelectBox,
    validateSelectItems
} from "./helpers";
import MultiSelect from 'react-native-multiple-select'
import isArray from 'lodash/isArray'
import isFunction from 'lodash/isFunction'
import isObject from 'lodash/isObject'
import RNPickerSelect from 'react-native-picker-select';

function renderFields(fields, methods) {
    const {getValues} = methods
    const value = getValues()
    return Object.keys(fields).map(f => {
        const attributes = fields[f]
        if (isSelectBox(attributes)) return SelectBox({name: f, attributes, methods, value})
        if (isCheckBox(attributes)) return CheckBoxFields({name: f, attributes, methods, value})
        if (isRadio(attributes)) return RadioFields({name: f, attributes, methods, value})
        if (isMultiSelect(attributes)) return MultipleSelect({name: f, attributes, methods, value})
        return DefaultTextView({name: f, attributes, methods, value})
    })
}

function DefaultTextView({name, attributes, methods, value}) {
    const {register, setValue, errors} = methods

    return (
        <View key={name}>
            <TextInput
                mode={'outlined'}
                dense={true}
                ref={register({name})}
                {...attributes}
                error={errors[name]}
                onChangeText={(text) => {
                    setValue(name, text)
                    if (isFunction(attributes.onChangeValue)) {
                        attributes.onChangeValue(text)
                    }
                }}
                defaultValue={value[name]}
            />

            <HelperText
                type="error"
                visible={errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </HelperText>

        </View>
    )
}

function SelectBox({name, attributes, methods,}) {
    const {register, setValue, errors} = methods
    const {values = [], displayKey = 'label', valueKey = 'value', value, label} = attributes

    const formatedValues = values.map(v => {
        return {
            ...v,
            "label": v[displayKey],
            value: v[valueKey]
        }
    })
    return (
        <View key={name}>
            <TextInput
                style={styles.input}
                mode="outlined"
                ref={register({name})}
                label={value ? label : ''}
                value={(value && isObject(value)) ? value[valueKey] : value}
                render={props => <RNPickerSelect
                    {...props}
                    placeholder={{
                        label: label,
                        value: null,
                        color: 'red',
                    }}
                    style={{
                        ...pickerSelectStyles,
                    }}
                    onValueChange={(value) => {
                        const nextValue = getSelectedItemExt(value, formatedValues, valueKey)
                        setValue(name, nextValue)
                        if (attributes.onChangeValue && isFunction(attributes.onChangeValue)) {
                            attributes.onChangeValue(nextValue)
                        }
                    }}
                    items={formatedValues}
                />
                }
            />

            <HelperText
                type="error"
                visible={errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </HelperText>

        </View>
    )
}

function CheckBoxFields({name, attributes, methods, value}) {
    const {setValue, register, errors} = methods
    const [checked, setChecked] = useState(Boolean(value[name]))

    return (
        <View key={name}>
            <CheckBox
                ref={register({name})}
                {...attributes}
                checked={checked}

                onPress={() => {
                    setValue(name, !checked)
                    setChecked(!checked)
                    if (isFunction(attributes.onChangeValue)) {
                        attributes.onChangeValue(!checked)
                    }
                }}
            />

            <HelperText
                type="error"
                visible={errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </HelperText>

        </View>
    )
}


function RadioFields({name, attributes, methods, value}) {
    const {values, flexDirection} = attributes
    const {setValue, register, errors} = methods
    const [selected, setSelected] = useState(value[name])

    return (
        <View key={name}
              style={{
                  flexDirection: flexDirection || 'column'
              }}
        >
            {values.map(val => {
                return (
                    <View key={val}
                          style={{flex: 1}}
                    >
                        <CheckBox
                            center
                            title={val}
                            ref={register({name})}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            containerStyle={{
                                backgroundColor: 'transparent',
                                borderColor: 'transparent'
                            }}
                            {...attributes}
                            checked={selected === val}
                            onPress={() => {
                                setValue(name, val)
                                setSelected(val)
                                if (isFunction(attributes.onChangeValue)) {
                                    attributes.onChangeValue(val)
                                }
                            }}
                        />
                    </View>
                )
            })}

            <HelperText
                type="error"
                visible={errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </HelperText>

        </View>
    )
}

function MultipleSelect({name, attributes, methods, value}) {
    const {values, uniqueKey} = attributes
    const {register, setValue, errors} = methods
    const items = validateSelectItems(values, uniqueKey)
    const [selected, setSelected] = useState(isArray(value[name]) ? getMultiselect(value[name], items, uniqueKey) : [])
    const ref = React.useRef(register({name}))

    useEffect(() => {
        setValue(name, getSelectedItemsExt(selected, items, uniqueKey))
    }, [])
    return (
        <View key={name}>
            <MultiSelect
                hideTags
                uniqueKey="id"
                selectText="Pick Items"
                searchInputPlaceholderText="Search Items..."
                onChangeInput={(text) => console.log(text)}
                tagRemoveIconColor="#CCC"
                tagBorderColor="#CCC"
                tagTextColor="#CCC"
                selectedItemTextColor="#4349CC"
                selectedItemIconColor="#5FCC4D"
                itemTextColor="#000"
                displayKey="value"
                searchInputStyle={{color: '#CCC'}}
                submitButtonColor="#CCC"
                submitButtonText=" Select "
                ref={ref}
                {...attributes}
                items={items}
                selectedItems={selected}
                onSelectedItemsChange={selectedItems => {
                    setSelected(selectedItems)
                    const nextValue = getSelectedItemsExt(selectedItems, items, uniqueKey)
                    setValue(name, nextValue)
                    if (isFunction(attributes.onChangeValue)) {
                        attributes.onChangeValue(nextValue)
                    }
                }}
            />
            <View>
                {ref.current ? ref.current.getSelectedItemsExt(selected) : null}
            </View>

            <HelperText
                type="error"
                visible={errors[name]}
            >
                {errors[name] ? errors[name].message : ''}
            </HelperText>

        </View>
    )
}

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 16,
        paddingVertical: 12,
        paddingHorizontal: 10,
        // borderWidth: 1,
        // borderColor: 'gray',
        // borderRadius: 4,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
        height: 55
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        // borderWidth: 0.5,
        // borderColor: 'purple',
        // borderRadius: 8,
        color: 'black',
        paddingRight: 30, // to ensure the text is never behind the icon
    },
});
const styles = StyleSheet.create({
    input: {
        marginTop: 5,
        marginBottom: 5,
        flexGrow: 1,
    },
    container: {
        flex: 1
    },
});
export default renderFields
