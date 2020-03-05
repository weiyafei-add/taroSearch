import Taro from '@tarojs/taro'

// 获取商品数据
async function getProduct(id) {
  const { res } = await Taro.cloud.callFunction({
    name: 'getProductById',
    data: {
      id
    }
  })
  console.log(res)
}

export { getProduct }
