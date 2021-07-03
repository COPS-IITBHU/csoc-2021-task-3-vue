<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition name="slide-fade">
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
            font-semibold
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
          <div :class="['todo-task text-gray-600']" id="dneBtn" v-if="!todo.editing">
            {{ todo.title }}
          </div>
          <span class="">
            <button
              style="margin-right: 5px"
              type="button"
              class="
                bg-transparent
                hover:bg-blue-500 hover:text-white
                border border-blue-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              id="edtBtn"
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
import { defineComponent, useContext } from '@nuxtjs/composition-api'
import addTask from '~/components/addTask.vue'

export default defineComponent({
  middleware:'auth',
  components: { addTask },
  data() {
    return {
      hello: 'hello world!',
      todos: [
      ],
      loading: false,
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    async getTasks() {
      /***
       * @todo Fetch the tasks created by the user and display them.
       * @todo also the function to display a single new task added
       * @hints use store and set loading true
       * @caution you have to assign new value to todos for it to update
       */
      this.loading = true;
      let token = this.$store.getters.token;
      //console.log(token)
      this.todos = [];
      let gtTodos = [];
      const tsk=
      await this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/',
        method: 'get',
      })
      tsk.data.forEach(function(task){
        task.editing = false;
          gtTodos.push(task);
      })
      this.todos = gtTodos
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
      let a = this;
      console.log("update");
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
            a.$toast.success("Task Updated Sucessfully");
        }).catch(function(err) {
            a.$toast.error("something went wrong");
        })
      } else {
        this.$toast.error("Enter the updated title");
        this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/' +_id +'/',
        method: 'get',
      }).then(function({data, status}) {
        a.todos[_index].title = data.title;
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
      console.log("edit");
      this.todos[index].editing = !this.todos[index].editing;
    },
    /**
     * Function to delete a single todo
     * @argument {number} _index - index of element to update in todos array
     * @argument {number} _id - id of todo obtained from API
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    deleteTask(_index, _id) {let token = this.$store.getters.token;
      let a = this;
      this.$axios({
        headers: {
            Authorization: 'Token ' + token,
        },
        url: 'https://todo-app-csoc.herokuapp.com/' + 'todo/' +_id +'/',
        method: 'delete',
      }).then(function({data, status}) {
        a.todos = a.todos.filter(item => item.id !== _id)
        a.$toast.success("Task Deleted Sucessfully");
    }).catch(function(err) {
      console.log(err);
      a.$toast.error("something went wrong");
    })
    },
  },
})
</script>
<style>
.slide-fade-enter-active {
  transition: all .3s ease;
}
.slide-fade-leave-active {
  transition: all .8s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
{
  transform: translateX(0px);
  opacity: 0;
}
</style>
