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
        if (isCheckBox(attributes)) return CheckBoxFied({name: f, attributes, methods, value})
        if (isRadio(attributes)) return RadioFields({name: f, attributes, methods, value})
        if (isMultiSelect(attributes)) return MultipeSelect({name: f, attributes, methods, value})
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
                {...attributes}
                ref={register({name})}
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
                itemCount={12}
                {...attributes}
                value={value[name]}
                data={data}
                ref={React.createRef(register({name}))}
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

function CheckBoxFied({name, attributes, methods, value}) {
    const {setValue, register, errors} = methods
    const [checked, setChecked] = useState(Boolean(value[name]))

    return (
        <View key={name}>
            <CheckBox {...attributes}
                      checked={checked}
                      ref={register({name})}
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
    const {values} = attributes
    const {setValue, register, errors} = methods
    const [selected, setSelected] = useState(value[name])

    return (
        <View key={name}
              style={{
                  // flex:'row',
                  justifyContent: "center"
              }}
        >
            {values.map(val => {
                return (
                    <View key={val}
                          style={{
                              flex: 'wrap'
                          }}
                    >
                        <CheckBox
                            center
                            title={val}
                            ref={register({name})}
                            checkedIcon='dot-circle-o'
                            uncheckedIcon='circle-o'
                            {...attributes}
                            checked={selected === val}
                            onPress={() => {
                                setValue(name, val)
                                setSelected(val)
                            }}
                            containerStyle={{width: 100}}
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

function MultipeSelect({name, attributes, methods, value}) {
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
                {...attributes}
                ref={ref}
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
