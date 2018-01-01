// pages/douban/search.js
Page({
  data: {
    searchInputFocus: true,
    searchWords: "",
    wordsList: [],
    size: 20,
    page: 1,
    movies: [],
    requestInternal: -1,
  },
  onTapSearchBtn() {
    console.log("words", this.data.searchWords)
    if (this.data.searchWords != "") {
      this.retrieve()
    }
    this.setData({
      searchInputFocus: false,
      searchWords: "",
      wordsList: []
    });
  },
  retrieve() {
    let app = getApp()
    let start = (this.data.page - 1) * this.data.size
    wx.showLoading({ title: '加载中' })

    return app.request(`https://api.douban.com/v2/movie/search?q=${this.data.searchWords}&start=${start}&count=${this.data.size}`)
      .then(res => {
        console.log("res", res)
        if (res.subjects.length) {
          let movies = this.data.movies.concat(res.subjects)
          let total = Math.floor(res.total / this.data.size)
          this.setData({ movies: movies, total: total, page: this.data.page, wordsList: [] })
          wx.setNavigationBarTitle({ title: res.title })
        }
      }).catch(err => {
        console.error(err)
      }).finally(() => {
        wx.hideLoading()
      })
  },
  showSearchInput() {
    this.setData({
      searchInputFocus: true
    });
  },
  // 清空输入框内容
  clearSearchInput() {
    this.setData({
      searchWords: ""
    });
  },
  // 当在搜索框键入内容
  onSearchInputType(e) {
    let app = getApp()
    let words = e.detail.value
    this.setData({
      searchWords: words
    });
    clearTimeout(this.data.requestInternal)
    this.data.requestInternal = setTimeout(() => {
      app.request(`https://api.douban.com/v2/movie/search?q=${words}&start=0&count=6`).then(d => {
        console.log(d)
        if (d.subjects.length) {
          this.setData({
            wordsList: d.subjects
          });
        }
      })
    }, 2000)
  }
})