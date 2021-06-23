<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition>
      <span v-if="loading">Fetching Tasks....</span>
      <ul v-else class="flex-col mt-9 mx-auto" id="taskList">
        <li
          v-for="(todo, index) in todos"
          :id="'todo' + todo.id"
          :key="todo.id"
          class="
            border
            flex
            border-gray-500
            rounded
            px-2
            py-2
            justify-between
            items-center
            mb-2
          "
        >
          <label :for="todo.id">
            <input
              :id="todo.id"
              type="text"
              :class="[
                'hideme appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              :name="todo.title"
              placeholder="Edit The Task"
            />
          </label>
          <div class="">
            <button
              class="
                hideme
                bg-transparent
                hover:bg-gray-500
                text-gray-700 text-sm
                hover:text-white
                py-2
                px-3
                border border-gray-500
                hover:border-transparent
                rounded
                todo-update-task
              "
              type="button"
              @click="updateTask(index, todo.id)"
            >
              Done
            </button>
          </div>
          <div :class="['todo-task text-gray-600']">
            {{ todo.title }}
          </div>
          <span class="">
            <button
              style="margin-right: 5px"
              type="button"
              class="
                bg-transparent
                hover:bg-yellow-500 hover:text-white
                border border-yellow-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              @click="editTask(index)"
            >
              <img
                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px"
                height="20px"
                alt="Edit"
              />
            </button>
            <button
              type="button"
              class="
                bg-transparent
                hover:bg-red-500 hover:text-white
                border border-red-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              @click="deleteTask(index, todo.id)"
            >
              <img
                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px"
                height="22px"
                alt="Delete"
              />
            </button>
          </span>
        </li>
      </ul>
    </transition>
  </main>
</template>

<script lang>
import { defineComponent } from '@nuxtjs/composition-api'
import addTask from '~/components/addTask.vue'
import axios from 'axios'

export default defineComponent({
  middleware: 'auth',
  components: { addTask },
  data() {
    return {
      hello: 'hello world!',
      todos: [
        // {
        //   title: 'amaterasu',
        //   id: 1,
        //   editing: false,
        // },
        // {
        //   title: 'tsukiyomi',
        //   id: 2,
        //   editing: false,
        // },
      ],
      loading: false,
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {

    addNewTask(){
      let latest;
      axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/',
        method: 'get',
      }).then(function({data, status}) { 
       latest = data[data.length - 1]
       console.log(latest)
      })
      console.log(this.todos)
      this.todos.push(latest)

    },


    async getTasks() {
      console.log("clicked")
      /***
       * @todo Fetch the tasks created by the user and display them.
       * @todo also the function to display a single new task added
       * @hints use store and set loading true
       * @caution you have to assign new value to todos for it to update
       */
      this.loading = true;
      let myTodos = []
      this.todos = []
        
        const getting = await axios({
        headers: {
            Authorization: 'Token ' + localStorage.getItem('token'),
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/',
        method: 'get',
      }).then(function({data, status}) { 
        if(data.length){
          data.forEach(function(task){
        //    console.log(task);
            myTodos.push(task)
          })
        }  
      })

    myTodos.forEach(element => {
      this.todos.push(element)
    });
  this.loading = false;
   // console.log(this.todos)
    },





    /**
     * Function to update a single todo
     * @argument {number} _index - index of element to update in todos array
     * @argument {number} _id - id of todo obtained from API
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    updateTask(_index, _id) {},
    /**
     * toggle visibility of input and buttons for a single todo
     * @argument {number} index - index of element to toggle
     * @todo add in bindings in dom so that 'hideme' class is dynamic or use conditional rendering
     * @hint read about class bindings in vue
     */
    editTask(index) {
      this.todos[index].editing = !this.todos[index].editing;
      console.log("edit");
    },
    /**
     * Function to delete a single todo
     * @argument {number} _index - index of element to update in todos array
     * @argument {number} _id - id of todo obtained from API
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    deleteTask(_index, _id) {
          axios({
        url: 'https://todo-app-csoc.herokuapp.com/' + "todo/"+_id+"/",
        headers: {
            Authorization: "Token " + localStorage.getItem("token"),
        },
        method: "delete",

    }).then(function({data, status}) {
       console.log("deleted")
       let toBeDel = id("todo" + _id);
       toBeDel.parentNode.removeChild(toBeDel);
    }).catch(function(err) {
      //displayErrorToast("something went wrong");
      console.log(err)
    })

    },
  },
})

function id(params) {
  return document.getElementById(params);
}

</script>

<style scoped>
  body{
    background-color: rgb(66,66,66);
    color: aliceblue;
  }
</style>