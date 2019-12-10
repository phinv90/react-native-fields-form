import {HelperText, TextInput} from 'react-native-paper'
import {View} from 'react-native'
import React, {useEffect, useState} from 'react'
import {Dropdown} from 'react-native-material-dropdown'
import {CheckBox} from 'react-native-elements'
import {
    getMultiselect,
    getSelectedItemsExt,
    isCheckBox,
    isMultiSelect,
    isRadio,
    isSelectBox,
    validateSelectItems
} from "./helpers";
import MultiSelect from 'react-native-multiple-select'
import isArray from 'lodash/isArray'

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

function SelectBox({name, attributes, methods, value}) {
    const {register, setValue, errors} = methods
    const {values} = attributes
    const data = values.map(val => ({value: `${val}`}))

    const handleChange = value => {
        setValue(name, value, true)
    }

    return (
        <View key={name}>
            <Dropdown
                // itemCount={12}
                ref={React.createRef(register({name}))}
                {...attributes}
                value={value[name]}
                data={data}
                onChangeText={handleChange}
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
                    setValue(name, getSelectedItemsExt(selectedItems, items, uniqueKey))
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

export default renderFields
