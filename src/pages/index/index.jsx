import Taro, { useState, useEffect } from '@tarojs/taro'
import {
  View,
  Input,
  Button,
  Image,
  Text,
  Swiper,
  SwiperItem
} from '@tarojs/components'
import './index.scss'
import { AtMessage, AtSwitch, AtModal } from 'taro-ui'
export default function Index() {
  const [count, setCount] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [change, setIsChange] = useState(false)
  const [temperature, setTemperature] = useState('')
  const [time, setTime] = useState('')
  const [info, setInfo] = useState('')
  const [id, setId] = useState('')
  const [isopenDel, setIsopenDel] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [bgImg, setBgimg] = useState(
    'https://7778-wx-wyf-6fk61-1300668350.tcb.qcloud.la/lu.png?sign=eac81ec4337e18316c5b8e9ca54a5d8b&t=1582788741'
  )
  // let tmpId = 'rIZMrwqlycel-jtQfhHFZfgkHY2SqnHw1RYhNUheolw'
  // useEffect(() => {

  // },[])
  // // 获取壁纸
  // const getImg = async () => {
  //   const data = await Taro.cloud.callFunction({
  //     name:'getBgImg',
  //     data:{
  //       num:Math.random()*100
  //     }
  //   })
  // }
  // 删除数据
  const handleDel = async () => {
    try {
      await Taro.getStorage({ key: 'userInfo' })
    } catch (error) {
      Taro.atMessage({
        type: 'error',
        message: '您还没有登录'
      })
      setIsopenDel(false)
      return
    }
    if (id === '') {
      return
    }
    Taro.atMessage({
      type: 'info',
      message: '正在删除数据,请稍后'
    })
    try {
      const { result } = await Taro.cloud.callFunction({
        name: 'delProduct',
        data: {
          id: id
        }
      })
      console.log(result)
      if (result.result === false) {
        Taro.atMessage({
          type: 'error',
          message: '您没有删除权限'
        })
        setIsopenDel(false)
      }
      if (result.stats.removed === 1) {
        Taro.atMessage({
          type: 'success',
          message: '删除成功'
        })
        setId('')
        setIsopenDel(false)
      } else {
        Taro.atMessage({
          type: 'warning',
          message: '数据库中没有此产品数据'
        })
        setId('')
        setIsopenDel(false)
      }
    } catch (error) {}
  }
  const handleImgClick = () => {
    Taro.previewImage({
      urls: [
        bgImg,
        'cloud://wx-wyf-6fk61.7778-wx-wyf-6fk61-1300668350/dc4067af97491eff8ab6561fdcdfe21.png',
        'cloud://wx-wyf-6fk61.7778-wx-wyf-6fk61-1300668350/e4c05af9184f8c56677fbfc480d7b0f.png'
      ]
    })
  }
  const handleSubmit = async () => {
    // Taro.requestSubscribeMessage({
    //   tmplIds: [tmpId],
    //   success(res) {
    //     console.log(res)
    //     if (res[tmpId] === 'accept') {
    //       console.log('用户接受订阅')
    //       Taro.cloud.callFunction({
    //         name: 'sendMeassage',
    //         data: {
    //           templateId: tmpId
    //         }
    //       })
    //     } else {
    //       Taro.atMessage({
    //         type: 'info',
    //         message: '您将不会收到订阅消息'
    //       })
    //     }
    //   }
    // })
    try {
      if (count === '') {
        Taro.atMessage({
          type: 'warning',
          message: '输入不可为空哦'
        })
        return
      }
      // 获取服务器数据
      setInfo('')
      setTemperature('')
      setIsLoading(true)

      const { result } = await Taro.cloud.callFunction({
        name: 'products',
        data: { count }
      })
      console.log('查找到数据:', result.res)
      const { temperature, updateAt, info } = result.res
      setTime(updateAt)
      setTemperature(temperature)
      setInfo(info || '')
      setIsLoading(false)
    } catch (error) {
      Taro.atMessage({
        type: 'error',
        message: '没有此产品数据'
      })
      setIsLoading(false)
      setInfo('')
      setTemperature('')

      console.log('错误信息:', error)
    }
  }
  const handelUpdataBtn = () => {
    if (count === '' || temperature === '') {
      Taro.atMessage({
        type: 'warning',
        message: '请先查询要修改的产品数据'
      })
      return
    }
    Taro.reLaunch({
      url: `/pages/add/index?id=${count}`
    })
  }
  const handleChange = value => {
    setIsChange(value)
  }
  return (
    <View>
      <Swiper
        className="test-h"
        indicatorColor="#999"
        indicatorActiveColor="#333"
        vertical={false}
        circular
        indicatorDots
        autoplay
        interval={10000}
      >
        <SwiperItem>
          <View className="header">
            <Image
              onClick={handleImgClick}
              className="bgImg"
              src={bgImg}
            ></Image>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className="header">
            <Image
              onClick={handleImgClick}
              className="bgImg"
              src={
                'cloud://wx-wyf-6fk61.7778-wx-wyf-6fk61-1300668350/dc4067af97491eff8ab6561fdcdfe21.png'
              }
            ></Image>
          </View>
        </SwiperItem>
        <SwiperItem>
          <View className="header">
            <Image
              onClick={handleImgClick}
              className="bgImg"
              src={
                'cloud://wx-wyf-6fk61.7778-wx-wyf-6fk61-1300668350/e4c05af9184f8c56677fbfc480d7b0f.png'
              }
            ></Image>
          </View>
        </SwiperItem>
      </Swiper>
      <AtModal
        isOpened={isopenDel}
        title="提示"
        cancelText="取消"
        confirmText="删除"
        onClose={() => {
          setIsopenDel(false)
        }}
        onCancel={() => {
          setIsopenDel(false)
        }}
        onConfirm={handleDel}
        content="要删除这条数据吗"
      />
      <View className="index">
        <AtMessage />
        <View className="inputBox">
          <Input
            value={count}
            onInput={e => setCount(e.target.value)}
            className="input"
            placeholder="输入编号"
          ></Input>
          <Button
            className="button"
            loading={isLoading}
            type="primary"
            onClick={handleSubmit}
          >
            查询
          </Button>
        </View>
        <View className="datas">
          <View className="datasItem">
            编号: <Text className="info"> {count}</Text>
          </View>
          <View className="datasItem">
            温度: <Text className="info"> {temperature}</Text>{' '}
            <Text className="tmp">℃</Text>
          </View>
          <View className="datasItem">
            备注: <Text className="info"> {info} </Text>
          </View>
          <AtSwitch
            title="显示数据最后的修改时间"
            checked={change}
            onChange={handleChange}
            border={false}
          />
          {change ? (
            <View className="datasItem">
              最后一次更新于: {time.substr(0, 10)} 日
            </View>
          ) : (
            ''
          )}
        </View>

        <Button type="warn" onClick={handelUpdataBtn}>
          修改此产品参数
        </Button>
        <View className="deleteBox">
          <Input
            value={id}
            onInput={e => {
              setId(e.target.value)
            }}
            placeholder="输入要删除的id"
            className="deleteInput"
          ></Input>
          <Button
            disabled={isAdmin}
            type="warn"
            className="deleteBtn"
            onClick={() => {
              setIsopenDel(true)
            }}
          >
            删除
          </Button>
        </View>
      </View>
    </View>
  )
}
Index.config = {
  navigationBarTitleText: '首页'
}
