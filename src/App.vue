<template>
  <div id="app">
    <h1>My Todo App</h1>
    <div class="wrap">
      <input type="text" class="input" v-model="newTodo" @keyup.enter="addTodo">
      <label for="check">
        <input type="checkbox" id="check" v-model="allTodo">Check All
      </label>
    </div>
    <ul class="list" v-if="list.length">
      <li v-for="(todo, index) in filterList" 
        :key="todo.id" 
        :class="{editing: todo == editingTodo}"
      >
        <input type="checkbox" v-model="todo.completed">
        <label class="text" :class="{'active':todo.completed}" @dblclick="editTodo(todo)">
          {{todo.title}}
        </label> 
        <button @click="removeTodo(todo)" class="del">Del</button>
        <input type="text" class="edit" 
          v-model="todo.title"
          @blur="doneEdit(todo)"
          @keyup.esc="cancelEdit(todo)"
          @keyup.enter="doneEdit(todo)"
          v-focus="todo == editingTodo"
        >
      </li>
    </ul>
    <p v-else>What do you want to do next?</p>
    <ul class="btns">
      <li><a href="/#/all" >All</a></li>
      <li><a href="/#/active">Active</a></li>
      <li><a href="/#/completed">Completed</a></li>
    </ul>
  </div>
</template>

<script>

import todoStorage from './storage.js'
export default {
  name: 'app',
  data () {
    return {
      newTodo: '',
      list: todoStorage.get(),
      editingTodo: null, //正在编辑标识
      editCache: ''
    }
  },
  methods: {
    addTodo(){
      var trimmedValue = this.newTodo && this.newTodo.trim()
      if(!trimmedValue){
        return
      }
      this.list.push({ title: trimmedValue, completed: false })
      this.newTodo = ''
    },
    removeTodo(todo){ 
      this.list.splice(this.list.indexOf(todo), 1)
    },
    editTodo(todo){
      this.editingTodo = todo
      this.editCache = todo.title
    },
    doneEdit(todo){ //enter/blur完成编辑
      if(!this.editingTodo){ //1. enter 完成编辑时 触发 blur 导致两次删除 => arr.splice(-1, 1)
        return               //2. esc 时也会触发 blur
      }
      this.editingTodo = null
      todo.title = todo.title.trim()
      if(!todo.title) {
        this.removeTodo(todo)
      }
    },
    cancelEdit(todo){ //esc取消编辑
      this.editingTodo = null
      todo.title = this.editCache
    }
  },
  computed: {
    allTodo: {
      get(){
        return !this.list.some(function(elem, index) {
          return elem.completed == false
        })
      },
      set(bool){
        this.list.map(function(elem, index) {
          return elem.completed = bool
        })
      }
    },
    filterList(){
      return this.$parent.filters[this.$parent.hash](this.list)
    }
  },
  directives: {
    focus(el, binding){
      if(binding.value){
        el.focus()
      }
    }
  },
  watch: {
    list: {
      handler(list){
        todoStorage.set(list)
      },
      deep: true
    }
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  padding: 8px 0;
}
a {
  color: #42b983;
}
input,
button {
  outline: none;
}

#app {
  position: absolute;
  width: 300px;
  left: 50%;
  text-align: center;
  color: #2c3e50;
  transform: translate3d(-50%, 0, 0);
  user-select: none;
}
li button {
  display: none;
  float: right;
  margin-right: 10px;
}
li.editing .text {
  display: none;
}
li.editing .edit {
  display: inline-block;
}
li:hover .del {
  display: block;
}
.list li:hover {
  background-color: #eee;
}
.active {
  text-decoration: line-through;
  color: #838b75;
}
.edit {
  display: none;
}
.btns li {
  display: inline-block;
  margin: 0 10px;
}
.input {
  width: 300px;
  height: 35px;
  padding: 5px 10px;
  margin: 20px 0;
  border: 1px solid #ccc;
  border-radius: 3px;
  box-shadow: 0 0 3px 1px #eee;
}
.list {
  text-align: left;
}
.text {
  cursor: pointer;
}
</style>
