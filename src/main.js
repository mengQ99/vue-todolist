import Vue from 'vue'
import App from './App.vue'

window.addEventListener('hashchange', function(){
  var hash = window.location.hash.replace(/#\/?/, '')
  if(filters[hash]){
    vm.hash = hash
  }else{
  	window.location.hash = ''
  	vm.hash = 'all'
  }
})

var filters = {
  all(list){
    return list
  },
  active(list){
    return list.filter(function(elem) {
      return !elem.completed
    })
  },
  completed(list){
    return list.filter(function(elem) {
      return elem.completed
    })
  }
}

var vm = new Vue({
  el: '#app',
  data: {
  	filters: filters,
  	hash: 'all'
  },
  render: h => h(App)
})
