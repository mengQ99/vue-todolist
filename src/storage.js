var KEY = 'todo-app'
export default {
  get(){
  	var list = JSON.parse(localStorage.getItem(KEY) || '[]')
  	list.forEach((elem, index) => {
  		elem.id = index
  	})
  	this.len = list.length
  	return list
  },
  set(list){
  	localStorage.setItem(KEY, JSON.stringify(list))
  }
} 