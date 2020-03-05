import Taro, { useState, useDidShow } from '@tarojs/taro'
import { View, Form, Input, Text, Button, Image } from '@tarojs/components'
import './index.scss'
import { AtMessage } from 'taro-ui'
export default function Index() {
  const [id, setID] = useState('')
  const [tmp, setTmp] = useState('')
  const [btnText, setBtnText] = useState('保存 / 修改')
  const [isSave, setIsSave] = useState(false)
  const [option, setIsOption] = useState('添加数据')
  const [isAdmin, setIsAdmin] = useState(false)
  const [info, setInfo] = useState('')
  useDidShow(() => {
    const { options } = Taro.getCurrentPages()[0]
    if (Object.keys(options).length !== 0) {
      const { id } = options
      setID(id)
      setIsOption(
        '修改数据,不填写备注则系统会记录上次备注,如填写备注,系统会覆盖上次备注'
      )
    }
    console.log('添加页面显式了', options)
  })
  const onSubmit = async () => {
    try {
      await Taro.getStorage({ key: 'userInfo' })
    } catch (error) {
      Taro.atMessage({
        type: 'error',
        message: '您还没有登录'
      })
      return
    }

    if (id === '' || tmp === '') {
      Taro.atMessage({
        type: 'info',
        message: '请填写完整信息'
      })
      return
    }
    // 经过表单验证
    setBtnText('正在保存数据,请稍后')
    setIsSave(true)
    // 向服务器发生请求
    const productData = {
      id,
      tmp,
      info
    }
    const { result } = await Taro.cloud.callFunction({
      name: 'createProduct',
      data: {
        productData
      }
    })
    console.log('数据为:', result)
    // 鉴权代码
    if (result.result === false) {
      Taro.atMessage({
        type: 'error',
        message: '您没有修改与删除权限'
      })
      setIsSave(false)
      setBtnText('保存 / 修改')
      return
    }
    try {
      if (result.errMsg === 'collection.update:ok') {
        Taro.atMessage({
          type: 'success',
          message: '数据更新成功'
        })
        setBtnText('保存')
        setID('')
        setTmp('')
        setInfo('')
        setIsSave(false)
        setIsOption('添加数据')
        return
      }
      if (result.length === 1) {
        Taro.atMessage({
          type: 'error',
          message: '数据已经存在,请勿重复添加'
        })
        setBtnText('保存')
        setIsSave(false)

        return
      }
      if (result.errMsg === 'collection.add:ok') {
        Taro.atMessage({
          type: 'success',
          message: '添加成功'
        })
        setBtnText('保存/修改')
        setIsSave(false)
        setID('')
        setTmp('')
        setInfo('')
        return
      }
    } catch (error) {}
    // 继续添加
    console.log('没有数据，继续添加')
  }

  return (
    <View>
      <Image
        className="addImg"
        src={
          'cloud://wx-wyf-6fk61.7778-wx-wyf-6fk61-1300668350/af75737b0a43837d3d0eb75f59c2330.png'
        }
      ></Image>
      <View className="formIndex">
        <AtMessage />

        <View className="ToastMessage">数据无价,请谨慎操作</View>
        <Form onSubmit={onSubmit}>
          <View className="inputBox">
            <Text>编号：</Text>
            <Input
              value={id}
              onInput={e => setID(e.target.value)}
              className="input"
              placeholderStyle="color:#f65"
              placeholder="这里输入产品id"
            ></Input>
          </View>

          <View className="inputBox">
            <Text>温度：</Text>
            <Input
              value={tmp}
              onInput={e => setTmp(e.target.value)}
              className="input"
              type="number"
              placeholderStyle="color:#f65"
              placeholder="输入温度"
            ></Input>
          </View>
          <View className="inputBox">
            <Text>确认：</Text>
            <Input
              disabled={true}
              value={tmp}
              className="input"
              placeholderStyle="color:#f65"
              placeholder="此处无需填写"
            ></Input>
          </View>

          <View className="inputBox">
            <Text>备注：</Text>
            <Input
              value={info}
              onInput={e => setInfo(e.target.value)}
              className="input"
              placeholderStyle="color:#f65"
              placeholder="填写产品备注"
            ></Input>
          </View>

          <Button
            loading={isSave}
            disabled={isAdmin}
            type="primary"
            formType="submit"
          >
            {btnText}
          </Button>
        </Form>
        <View className="option">
          您将要进行的操作是:<Text className="optionText">{option}</Text>
        </View>
      </View>
    </View>
  )
}
