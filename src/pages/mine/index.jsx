import Taro, { useState, useEffect } from '@tarojs/taro'
import { View, Button, Image, Input } from '@tarojs/components'
import './index.scss'
import DedaultAvatar from '../../images/mineSelected.png'
import { AtModal, AtMessage } from 'taro-ui'
export default function Index() {
  Taro.cloud.init()

  const [isLoading, setIsLoading] = useState(false)
  const [nickName, setNickName] = useState('游客')
  const [avatar, setAvatar] = useState(DedaultAvatar)
  const [showQuitBtn, setShowQuitBtn] = useState(false)
  const [isopen, setIsOpen] = useState(false)

  useEffect(async () => {
    // 进入页面先检查本地存储
    try {
      const { data } = await Taro.getStorage({ key: 'userInfo' })
      const { nickName, avatar } = data
      setAvatar(avatar)
      setNickName(nickName)
      setShowQuitBtn(true)
    } catch (error) {
      console.log('本地存储没有信息', error)
    }
  }, [])

  async function getUserInfo(e) {
    console.log(e)
    setIsLoading(true)
    const userInfo = {
      avatar: e.detail.userInfo.avatarUrl,
      nickName: e.detail.userInfo.nickName
    }

    try {
      const user = await Taro.cloud.callFunction({
        name: 'login',
        data: {
          userInfo
        }
      })
      const { result } = user
      setAvatar(result.user.avatar)
      setNickName(result.user.nickName)

      await Taro.setStorage({ key: 'userInfo', data: result.user })

      setIsLoading(false)
      setShowQuitBtn(true)
    } catch (error) {
      console.log('登录错误，', error)
    }
  }
  const handleConfirm = async () => {
    try {
      await Taro.removeStorage({
        key: 'userInfo',
        success: function(res) {
          console.log(res)
          if (res.errMsg === 'removeStorage:ok') {
            setAvatar(DedaultAvatar)
            setNickName('游客')
            setShowQuitBtn(false)
            setIsOpen(false)
          }
        }
      })
    } catch (error) {}
  }

  return (
    <View className="mine">
      <View className="mengceng"></View>
      <AtMessage />
      <AtModal
        isOpened={isopen}
        title="提示"
        cancelText="取消"
        confirmText="确定"
        onClose={() => {
          setIsOpen(false)
        }}
        onCancel={() => {
          setIsOpen(false)
        }}
        onConfirm={handleConfirm}
        content="确定要退出吗 "
      />

      {/* <Image className="welcome" src={welcome}></Image> */}
      <View className="userInfo">
        <View className="avatar">
          <Image src={avatar}></Image>
        </View>
        <View className="placelogin">{nickName}</View>

        {showQuitBtn ? (
          <Button
            className="mineBtn"
            type="default"
            onClick={() => setIsOpen(true)}
          >
            退出登录
          </Button>
        ) : (
          <Button
            loading={isLoading}
            type="primary"
            openType="getUserInfo"
            onGetUserInfo={getUserInfo}
            className="mineBtn"
          >
            微信登录
          </Button>
        )}
      </View>
    </View>
  )
}
