<template>
  <main class="max-w-lg mx-auto px-8">
    <add-task @newTask="getTasks" />
    <transition>
      <span v-if="loading">Fetching Tasks....</span>
      <ul v-else class="flex-col mt-3 mx-auto">
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
            justify-between justify-self-start
            items-center
            mb-2
          "
        >
          <label :for="todo.id">
            <input
              :id="todo.id"
              type="text"
              v-if="todo.editing"
              :class="[
                ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              v-model="newTitle"
              :name="todo.title"
              placeholder="Edit The Task"
            />
          </label>
          <div class="">
            <button
              v-if="todo.editing"
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
              @click="updateTask(index, todo.id)"
            >
              Done
            </button>
          </div>
          <div :class="['todo-task text-gray-600 ']" v-if="!todo.editing">
            {{ todo.title }}
          </div>
          <span class="">
            <button
              style="margin-right: 5px"
              type="button"
              v-if="!todo.editing"
              class="
                bg-transparent
                hover:bg-yellow-500
                hover:text-white
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
                v-if="!todo.editing"
                width="18px"
                height="20px"
                alt="Edit"
              />
            </button>
            <button
              type="button"
              v-if="!todo.editing"
              class="
                bg-transparent
                hover:bg-red-500
                hover:text-white
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
                v-if="!todo.editing"
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
  components: { addTask },
  middleware: ['auth'],
  data() {
    return {
      hello: 'hello world!',
      todos: [],
      loading: false,
      newTitle: '',
      prev: -1,
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
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
      this.$axios
        .get('todo/', { headers })
        .then(({ data }) => {
          this.todos = []
          if (data) {
            for (let element of data) {
              element.editing = false
              this.todos.push(element)
            }
          }
        })
        .catch((e) => {
          this.$toast.error(e)
        })
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
      if (!this.newTitle) return
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
      const data = {
        title: this.newTitle,
      }
      this.$axios.put(`/todo/${_id}/`, data, { headers }).then(() => {
        this.todos[_index].editing = !this.todos[_index].editing
        this.todos[_index].title = this.newTitle
        this.newTitle = ''
        this.prev = -1
      })
    },
    /**
     * toggle visibility of input and buttons for a single todo
     * @argument {number} index - index of element to toggle
     * @todo add in bindings in dom so that 'hideme' class is dynamic or use conditional rendering
     * @hint read about class bindings in vue
     */
    editTask(index) {
      this.$toast.info('Press Done to Save the Update before Proceeding!')
      this.newTitle = ''
      if (this.prev !== -1) {
        this.todos[this.prev].editing = !this.todos[this.prev].editing
      }
      this.todos[index].editing = !this.todos[index].editing
      this.prev = index
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
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
      this.$axios
        .delete(`/todo/${_id}/`, { headers })
        .then(() => {
          this.todos.splice(_index, 1)
          this.$toast.success('Task Deleted')
        })
        .catch((e) => {
          this.$toast.error(e)
        })
    },
  },
})
</script>
