<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition name="fade">
      <span v-if="loading">Fetching Tasks....</span>
      <ul v-else class="flex-col mt-9 mx-auto">
        <li
          v-for="(todo, index) in todos"
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
              v-if="todo.editing"
              v-model="todo.title"
              :class="[
                'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              :name="todo.title"
              placeholder="Edit The Task"
            />
          </label>
          <div class="">
            <button
              class="
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
              id="doneBtn"
              v-if="todo.editing"
              @click="updateTask(index, todo.id)"
            >
              Done
            </button>
          </div>
          <div :class="['todo-task text-gray-600']" id="title" v-if="!todo.editing">
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
              id="editBtn"
              v-if="!todo.editing"
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
              id="deleteBtn"
              v-if="!todo.editing"
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

//// USERNAME : blackFlames
//// PASSWORD : amaterasu

import { defineComponent, useContext } from '@nuxtjs/composition-api'
import addTask from '~/components/addTask.vue'

export default defineComponent({
  components: { addTask },
  middleware: 'auth',
  data() {
    return {
      hello: 'hello world!',
      todos: [
        // {
        //   title: 'Henlo',
        //   id: 1,
        //   editing: false,
        // },
        // {
        //   title: 'Frens',
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
    async getTasks() {
      this.loading = true;
      /***
       * @todo Fetch the tasks created by the user and display them.
       * @todo also the function to display a single new task added
       * @hints use store and set loading true
       * @caution you have to assign new value to todos for it to update
       */
      let token = this.$store.getters.token;
      //console.log(token)
      this.todos = [];
      let getTodos = [];
      await this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/',
        method: 'get',
      }).then(function({data, status}) { 
        //console.log(data)
        data.forEach(function(task){
          task.editing = false;
          getTodos.push(task);
        })
      })
      this.todos = getTodos

      //console.log(this.todos)
      this.loading = false

    },
    /**
     * Function to update a single todo
     * @argument {number} _index - index of element to update in todos array
     * @argument {number} _id - id of todo obtained from API
     * @todo Complete this function.
     * @todo 1. Send the request to update the task to the backend server.
     * @todo 2. Update the task in the dom.
     */
    updateTask(_index, _id) {

      let newTitle = this.todos[_index].title;
      let token = this.$store.getters.token;
      //console.log(newTitle);
      let all = this;

      if(newTitle!= '') {
          this.$axios({
            url: 'https://todo-app-csoc.herokuapp.com/' + "todo/" + _id + "/",
            headers: {
                Authorization: "Token " + token,
            },
            method: "patch",
            data: {
                id: _id,
                title: newTitle,
            }
        }).then(function({data, status}) {
            all.$toast.success("done");
            //console.log("success")
        }).catch(function(err) {
            all.$toast.error("something went wrong");
            //console.log(err)
        })
      } else {
        this.$toast.error("empty field");
        this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/' +_id +'/',
        method: 'get',
      }).then(function({data, status}) { 
        //console.log(data)
        all.todos[_index].title = data.title;
      })
      }

      this.todos[_index].editing = !this.todos[_index].editing;
    },
    /**
     * toggle visibility of input and buttons for a single todo
     * @argument {number} index - index of element to toggle
     * @todo add in bindings in dom so that 'hideme' class is dynamic or use conditional rendering
     * @hint read about class bindings in vue
     */
    editTask(index) {
      this.todos[index].editing = !this.todos[index].editing;
      //console.log(this.todos[index].editing);
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
      let token = this.$store.getters.token;
      let all = this;
      this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/' +_id +'/',
        method: 'delete',
      }).then(function({data, status}) {
        all.todos.pop(all.todos[_id]);
        all.$toast.success("done");
    }).catch(function(err) {
      //console.log(err);
      all.$toast.error("something went wrong");
    })
    },
  },
})
</script>

<style>
.fade-enter-active, .fade-leave-active {
  transition: font-size 2s;
}
.fade-enter, .fade-leave-to  {
  font-size: 0px;
}

</style>

