import {TextInput , HelperText   } from 'react-native-paper'
import {View} from 'react-native'
import React, {useEffect} from 'react'
import isFunction from 'lodash/isFunction'
import { Dropdown } from 'react-native-material-dropdown'
import { CheckBox } from 'react-native-elements'
import {isCheckBox, isRadio, isSelectBox} from "./helpers";
function renderFields(fields, methods) {
    const { getValues } = methods
    const value = getValues()
    return Object.keys(fields).map(f => {
        const attributes = fields[f]
        if(isSelectBox(attributes)) return SelectBox({name: f, attributes, methods,value})
        if(isCheckBox(attributes)) return CheckBoxFied({name: f, attributes, methods})
        if(isRadio(attributes)) return RadioFields({name: f, attributes, methods})
        return DefaultTextView({name: f, attributes, methods,value})
    })
}

function DefaultTextView({name, attributes, methods,value}) {
    const {register, setValue, errors } = methods

    return (
        <View  key={name}>
            <TextInput
                mode={'outlined'}
                ref={register({name})}
                error={errors[name]}
                dense={true}
                {...attributes}
                onChangeText={(text) => {
                    setValue(name, text)
                    if (isFunction(attributes.onChangeText)){
                        attributes.onChangeText(text)
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

function SelectBox({name, attributes, methods,value}) {
    const {register, setValue, errors } = methods
    const { values } = attributes
    const data = values.map(val=> ({value:`${val}`}))

    const handleChange = value => {
        setValue(name,value)
        if (isFunction(attributes.onChangeText)){
            attributes.onChangeText(value)
        }
    }


    return (
        <View  key={name}>
            <Dropdown
                value={value[name]}
                itemCount={12}
                {...attributes}
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
function CheckBoxFied({name, attributes, methods}){
    const { setValue, register } = methods
    const { checked } = attributes
    useEffect(()=>{
        setValue(name,attributes.checked)
    },[checked])
    // setValue(name,attributes.checked)
    return(
        <CheckBox {...attributes}
                checked={checked}
                  key={name}
                  ref={register({name})}
                  onPress={()=>{
                      setValue(!checked)
                      if(isFunction(attributes.onPress))
                          attributes.onPress(!checked)
                  }}
        />
    )
}
function RadioFields({name, attributes, methods}) {
    const { values , selected, onChange,value } = attributes
    const { setValue , register}= methods
    useEffect(()=>{
        setValue(name,value)
    },[value])
    return(
        <View key={name}>
            {values.map(val=>{
                return(
                    <CheckBox
                        center
                        title={val}
                        ref={register({name})}
                        checkedIcon='dot-circle-o'
                        uncheckedIcon='circle-o'
                        checked={value === val}
                        onPress={()=>{
                            setValue(name,val)
                            if(isFunction(onChange))
                                onChange(val)
                        }}
                        key={val}
                    />
                )
            })}
        </View>

    )
}

export default renderFields
