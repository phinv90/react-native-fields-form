# react-native-fields-form

>

[![NPM](https://img.shields.io/npm/v/react-native-fields-form.svg)](https://www.npmjs.com/package/react-native-fields-form) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)
![Ví dụ](https://firebasestorage.googleapis.com/v0/b/saga-dd0c2.appspot.com/o/images%2FA%CC%89nh%20chu%CC%A3p%20Ma%CC%80n%20hi%CC%80nh%202019-12-07%20lu%CC%81c%208.40.19%20CH.png?alt=media&token=249d8fca-565a-43c0-b862-2bb6bd2fc19b "Ví dụ")

## Install

```bash
npm install --save react-native-fields-form
or
yarn add react-native-fields-form
```

## Usage
```js
import {renderFields} from 'react-native-fields-form'
renderFields(settings, methods)
```

> #### settings: {fieldName: attributes}:
>> fieldName (string): Tên của trường.
>
>> attributes (object): thuộc tính của trường (extends tất cả thuộc tính của react-native-paper ) 
>
> #### methods:
> các methods của useForm // xem ví dụ bên dưới

```jsx
export default function App() {
    const [data, setData] = useState(null)

    const validator = yup.object().shape({
        name: yup.string()
            .required("bắt buộc nhập ")
            .min(6, "tối thiểu 6 ký tự"),
        diachi: yup
            .string()
            .required(),
        // phone: yup.number()
            // .required()
            // .min(9),
        male: yup.string()
            .required(),
        sothich:yup
            .array()
            .required()

    })
    const dataProps = {
        email:"phi@classfunc.com",
        name:"phi nguyen",
        // diachi:"HCM",
        vietnam:true,
        // male:"nam",
        sothich:[{id:"1",value:'code'}]
    }


    const medthods = useForm({
        validationSchema: validator,
        defaultValues:dataProps

    })



    const fields = {
        "name": {label: " Họ và Tên ",
             onchangeValue : value =>console.log(value) // trigger khi thay đổi value
        },
        "phone":{label:" Số ĐT",},
        "diachi":{ label: " Địa Chỉ " ,values:["Hà Nội" , "HCM", "Thanh Hoa","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1",] , isSelectBox:true ,
        },
        "vietnam":{isCheckBox:true, title : " người việt " ,
        },
        "male":{isRadio: true, values:['nam', "nữ"],
               flexDirection : 'row' // default : column
        },
        sothich:{isMultipleSelect:true,
            selectText: "So thich" , // default : "Pick Items"
            values:[{id:"1", value:'code'},{id:"2",value:'xem phim'},{id:"3",value:'doc sach'}],
            displayKey:"value" , // default : value
            uniqueKey:"id" // default : id
        }
    }

    const onSubmit = data => {
        console.log(data)
        setData(data)
    }

    return (
        <View style={styles.container}>

            <ScrollView>
                {renderFields(fields, medthods)}
                <Button onPress={medthods.handleSubmit(onSubmit)} title={'submit'}/>
            </ScrollView>
            <View>
                <Text>
                    {data ? JSON.stringify(data, null, 2) : null}
          </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        margin: 70
    },
});

```
# API

+ isSelectBox (bool): `render box lựa chọn các giá trị của trường values`
+ isCheckBox (bool): `render check box`
+ isRaido (bool) : `render radio group các giá trị của trường values`
+ isMultipleSelect : `render box lựa chọn các giá trị trong trường values với nhiều lựa chon`

## Xem thêm react-hook-form tại https://github.com/react-hook-form/react-hook-form
## License

MIT
