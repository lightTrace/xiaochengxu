// pages/douban/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     boards:[{key:'in_theaters'},{key:'comming-soon'},{key:'top2'}]
  },
  retrieveData() {
    let app = getApp()

    var promises = this.data.boards.map(function (board) {
      return app.request(`https://api.douban.com/v2/movie/${board.key}?start=0&count=10`)
        .then(function (d) {
          if (!d) return board
          board.title = d.title
          board.movies = d.subjects
          return board
        }).catch(err => console.log(err))
    })

    return app.promise.all(promises).then(boards => {
      console.log(boards)
      if (!boards || !boards.length) return
      this.setData({ boards: boards, loading: false })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */

  onLoad(options) {
    console.log(100)
    wx.getStorage({
      key: 'has_shown_splash',
      success: res => {
        this.retrieveData()
      },
      fail: err => {
        wx.redirectTo({
          url: '/pages/douban/splash',
        })
      }
    })
  }
})