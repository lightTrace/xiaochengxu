// pages/douban/splash.js
Page({
  data: {
    subjects: [],
  },
  onLoad(options) {
    console.log("...")
    let app = getApp()
    app.request("https://api.douban.com/v2/movie/coming_soon?start=0&count=3").then(
      data => {
        console.log("..11.", data)
        this.setData({ subjects: data.subjects })
      }
    )
  }
})
wx.setStorage({
  key: 'has_shown_splash',
  data: 'true',
})