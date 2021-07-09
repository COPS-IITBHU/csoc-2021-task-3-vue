<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition>
      <span v-if="loading">Fetching Tasks....</span>
      <ul v-else class="flex-col mt-9 mx-auto text-blueGray-600 bg-white rounded text-sm border border-blueGray-300 outline-none focus:outline-none focus:ring w-full">
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
              :class="[
                ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              v-model="todo.title"
              :name="todo.title"
              placeholder="Edit the task"
              v-show="todo.editing"
            />
          </label>
          <div class="">
            <button
              class="text-gray-700 text-sm py-2 px-3 border border-gray-500 hover:border-transparent rounded todo-update-task bg-white-400 hover:bg-blue-400 "
              type="button"
              v-show="todo.editing"
              @click="updateTask(index, todo.id)"
            >
              Done
            </button>
          </div>
          <div
            :class="['todo-task text-gray-600 text-left']"
            id="output"
            v-show="!todo.editing"
          >
            {{ todo.title }}
          </div>
          <span class="">
            <button
              style="margin-right: 5px"
              type="button"
              v-show="!todo.editing"
              class="hover:bg-yellow-300 hover:text-white border border-yellow-500 hover:border-transparent rounded px-2 py-2"
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
              v-show="!todo.editing"
              class="hover:bg-red-400 hover:text-white border border-red-500 hover:border-transparent rounded px-2 py-2"
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

export default defineComponent({
  middleware: ['auth'],

  components: { addTask },
  data() {
    return {
      hello: 'hello world!',
      todos: [],
      loading: false,
    }
  },
  mounted() {
    this.getTasks()
  },
  methods: {
    async getTasks() {
      this.loading = true
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }

      this.$axios
        .get('todo/', { headers })
        .then(({ data }) => {
          this.loading = false
          this.todos = []
          if (data) {
            for (let element of data) {
              element.editing = false
              this.todos.push(element)
            }
          }
        })
        .catch(function (err) {
          this.$toast.error('Something went wrong')
        })

      /***
       * @todo Fetch the tasks created by the user and display them.
       * @todo also the function to display a single new task added
       * @hints use store and set loading true
       * @caution you have to assign new value to todos for it to update
       */
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
      if (!this.todos[_index].title) {
        return
      }
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
      const data = {
        title: this.todos[_index].title,
      }

      this.$axios
        .patch(`/todo/${_id}/`, data, { headers })
        .then((res) => {
          this.todos[_index].editing = !this.todos[_index].editing
        })
        .catch(function (err) {
          this.$toast.error('Something went wrong')
        })
    },

    /**
     * toggle visibility of input and buttons for a single todo
     * @argument {number} index - index of element to toggle
     * @todo add in bindings in dom so that 'hideme' class is dynamic or use conditional rendering
     * @hint read about class bindings in vue
     */
    editTask(index) {
      this.todos[index].editing = !this.todos[index].editing
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
      // const headers = {
      //   Authorization: 'Token ' + this.$store.getters.token,
      // }
       this.$axios({
        url: "todo/"+_id+"/",
        headers: {
           Authorization: 'Token ' + this.$store.getters.token,
        },
        method: "delete",
    }).then(() => {
       this.todos=this.todos.filter((todo) => todo.id !== _id)
        // this.todos.splice(_index, 1)
        this.$toast.success('Task Delete Successfully')
      }).catch(function (err) {
          this.$toast.error('Something went wrong')
        })
    },
  },
})
</script>



