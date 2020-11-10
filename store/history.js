const axios = require('axios')


export const state = () => ({
  loadedPosts: [],
  marks: 0
})

export const mutations = {
  SET_HISTORY_DATA(state, posts) {
    state.loadedPosts.push(posts)
  },
  CLEAR_HISTORY_DATA(state) {
    state.loadedPosts = []
  },

  SET_FAV_DATA(state, data) {
    state.marks = data
  },

  ADD_HISTORY_DATA(state, post) {
    state.loadedPosts = [post].concat(state.loadedPosts)
    if (state.loadedPosts.length > 50) {
      state.loadedPosts = state.loadedPosts.splice(state.loadedPosts.length - 1, 1)
    }
  },

  SAVE_HISTORY_DATA(state) {
    localStorage.setItem('recent_views', JSON.stringify(state.loadedPosts))
  }
}

export const actions = {

  LOAD_HISTORY(vuexContext) {
    if (this.$auth.loggedIn) {
      axios.get('https://app.ixil.cc/api/bloom/strat/user/get/history?email=' + this.$auth.user.email.trim(), {
        headers: {
          Authorization: this.$auth.getToken('auth0') //the token is a variable which holds the token
        }

      })
        .then(async function(response) {
          vuexContext.commit('CLEAR_HISTORY_DATA')
          for (const x of response.data) {
            await axios.get('https://app.ixil.cc/prox/color?image=' + x.thumb)
              .then(rspe => {
                vuexContext.commit('SET_HISTORY_DATA', {
                  id: x.id,
                  name: x.name,
                  thumb: x.thumb,
                  source: x.source,
                  color: rspe.data
                })

              }).catch(async function() {
                vuexContext.commit('SET_HISTORY_DATA', {
                  id: x.id,
                  name: x.name,
                  thumb: x.thumb,
                  source: x.source,
                  color: ['#fc1c64', '#f87a75', '#760624', '#974c4c', '#bc796e', '#5c3c34']
                })
              })
          }

        }).catch(function(error) {
        console.log(error)
      })
    }
  },

  ADD_HISTORY(vuexContext, post) {
    if (this.$auth.loggedIn) {
      axios.get(`https://app.ixil.cc/api/bloom/strat/user/get/fav?id=${post.id}&email=${this.$auth.user.email.trim()}`, {
        headers: {
          Authorization: this.$auth.getToken('auth0') //the token is a variable which holds the token
        }
      })
        .then(function(response) {
          vuexContext.commit('SET_FAV_DATA', response.data.rating)
        })

      axios.get(`https://app.ixil.cc/api/bloom/strat/user/add?id=${post.id}&history=true&platform=${post.source}&email=${this.$auth.user.email.trim()}`, {
        headers: {
          Authorization: this.$auth.getToken('auth0') //the token is a variable which holds the token
        }

      })
        .then(function(response) {
          vuexContext.dispatch('LOAD_HISTORY')
        })
    }
  },

  GET_FAV(vuexContext, post) {
    console.log('nnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn')

  },

  ADD_FAV(vuexContext, post) {
    if (this.$auth.loggedIn) {
      axios.get(`https://app.ixil.cc/api/bloom/strat/user/add?id=${post.id}&marks=${post.marks}&platform=${post.source}&picture=${this.$auth.user.picture}&email=${this.$auth.user.email.trim()}`, {
        headers: {
          Authorization: this.$auth.getToken('auth0') //the token is a variable which holds the token
        }

      })
        .then(function(response) {
        })
    }
  }
}

export const getters = {
  GET_HISTORY_DATA(state) {
    return state.loadedPosts
  },

  GET_FAV_DATA(state) {
    return state.marks
  }
}
