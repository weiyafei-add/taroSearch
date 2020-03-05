import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'

import './app.scss'

// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {
  componentDidMount() {}

  componentDidShow() {}

  componentDidHide() {}

  componentDidCatchError() {}

  config = {
    pages: ['pages/index/index', 'pages/add/index', 'pages/mine/index'],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#f65',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle: 'custom'
    },
    tabBar: {
      list: [
        {
          pagePath: 'pages/index/index',
          text: '首页',
          iconPath: './images/home.png',
          selectedIconPath: './images/homeSelected.png'
        },
        {
          pagePath: 'pages/add/index',
          text: '添加',
          iconPath: './images/add.png',
          selectedIconPath: './images/addSelect.png'
        },
        {
          pagePath: 'pages/mine/index',
          text: '我的',
          iconPath: './images/mine.png',
          selectedIconPath: './images/mineSelected.png'
        }
      ]
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return <Index />
  }
}

Taro.render(<App />, document.getElementById('app'))
