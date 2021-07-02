<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition :name="loading ? '' : 'loadingAnimation'">
      <span v-if="loading" style="display: flex; justify-content: center">
        <div
          class="
            loading_symbol
            animate-spin
            mt-5
            border-t-6 border-green-500
            rounded-full
          "
          style="width: 4.5rem; height: 4.5rem"
        ></div>
        Fetching Tasks...</span>
      <ul v-else class="flex-col mt-9 mx-auto">
        <transition-group name="loadingAnimation">
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
              v-show="todo.editing"
              :id="todo.id"
              v-model="updatedTask"
              type="text"
              :class="[
                'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              :name="todo.title"
              placeholder="Edit The Task"
            />
          </label>
          <div class="">
            <button
              v-show="todo.editing"
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
        </transition-group>
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
      updatedTask: '',
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
      this.loading = true
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }

      await this.$axios
        .get('todo/', { headers })
        .then(({ data }) => {
          this.loading = false
          this.todos = []
          if (data.length) {
            for (let particualar_task of data) {
              particualar_task.editing = false
              this.todos.push(particualar_task)
            }
          }
          else {
            this.$toast.info('No tasks currently. You can add tasks by typing a task and clicking on add task button')
          }
        })
        .catch(() => {
          this.$toast.error('Oops! Something went wrong')
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
      if (!this.updatedTask) {
        this.$toast.info('Please enter the updated task first')
        return
      }

      this.$toast.info('Upadating task...')

      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }
      const data = {
        title: this.updatedTask,
      }
      
      this.$axios
        .patch(`todo/${_id}/`, data, { headers })
        .then(() => {
          this.todos[_index].title = this.updatedTask
          this.editTask(_index)
          this.prev = -1
          this.updatedTask = ''
          this.$toast.success('Task updated successfully')
        })
        .catch(() => {
          this.$toast.error('Oops! Something went wrong')
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
      if(this.prev !== -1 && this.prev !== index) {
        this.todos[this.prev].editing = !this.todos[index].editing
      }
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
      this.$toast.info('Deleting task...')
      const headers = {
        Authorization: 'Token ' + this.$store.getters.token,
      }

      this.$axios
        .delete(`todo/${_id}/`, { headers })
        .then(() => {
          this.todos.splice(_index, 1)
          this.$toast.success('Task deleted successfully')
        })
        .catch(() => {
          this.$toast.error('Something went wrong')
        })
    },
  },
})
</script>

<style>
.loadingAnimation-enter-active,
.loadingAnimation-leave-active {
  transition: all 1s ease;
}
.loadingAnimation-enter-from,
.loadingAnimation-leave-to {
  opacity: 0;
  transform: translateX(35vw);
}
</style>
