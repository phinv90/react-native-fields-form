import {HelperText, TextInput} from 'react-native-paper'
import {View} from 'react-native'
import React, {useState} from 'react'
import {Dropdown} from 'react-native-material-dropdown'
import {CheckBox} from 'react-native-elements'
import {isCheckBox, isRadio, isSelectBox} from "./helpers";

function renderFields(fields, methods) {
    const {getValues} = methods
    const value = getValues()
    return Object.keys(fields).map(f => {
        const attributes = fields[f]
        if (isSelectBox(attributes)) return SelectBox({name: f, attributes, methods, value})
        if (isCheckBox(attributes)) return CheckBoxFied({name: f, attributes, methods, value})
        if (isRadio(attributes)) return RadioFields({name: f, attributes, methods, value})
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
        <View key={name}>
            {values.map(val => {
                return (
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
                        key={val}
                    />
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

export default renderFields
