<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks(1)" />
    <transition>
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
              :class="[
                'appearance-none border rounded w-100 py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              :name="todo.title"
              placeholder="Edit The Task"
              v-model="editTitle"
              v-if="todo.editing"
            />
          </label>
          <div class="">
            <button
              class="
                ml-20
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
              v-if="todo.editing"
            >
              Done
            </button>
          </div>
          <div :class="['todo-task text-gray-600']" v-if="!todo.editing">
            {{ todo.title }}
          </div>
          <span class="">
            <button
              style="margin-right: 5px"
              type="button"
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
              v-if="!todo.editing"
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
                hover:bg-red-500
                hover:text-white
                border border-red-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              @click="deleteTask(index, todo.id)"
              v-if="!todo.editing"
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
import auth from '../middleware/auth'
import addTask from '~/components/addTask.vue'
export default defineComponent({
  components: { addTask },
  middleware: auth,
  data() {
    return {
      todos: [],
      loading: true,
      editTitle: '',
    }
  },
  mounted() {
    this.getTasks(0)
    this.name()
  },
  methods: {
    async getTasks(i) {
      this.$axios({
          headers: { Authorization: 'Token ' + this.$store.getters.token },
          url: 'https://todo-app-csoc.herokuapp.com/todo/',
          method: 'get',
        })
        .then((response) => {
          this.todos=[]
          response.data.forEach((value)=>{
          value.editing=false
          this.todos.push(value)
          })
          if(i){this.$toast.success("Task Added!..")}
          else{this.$toast.success("All tasks loded!..")}
          this.loading=false
        })
        .catch((err) => {
          this.$toast.error('Unable to load Tasks! Please reload...')
        })
    },
    name(){
      this.$axios({
          headers: { Authorization: 'Token ' + this.$store.getters.token },
          url: 'https://todo-app-csoc.herokuapp.com/auth/profile/',
          method: 'get',
        })
        .then((response) => {
          this.$store.commit('setName', response.data.name)
        })
        .catch((err) => {
        })
    },

    updateTask(_index, _id) {
      this.$axios({
          headers: { Authorization: 'Token ' + this.$store.getters.token },
          url: `https://todo-app-csoc.herokuapp.com/todo/${_id}/`,
          method: 'patch',
          data: {
            title: this.editTitle,
          },
        })
        .then(() => {
          this.todos[_index].title=this.editTitle
          this.editTitle=''
          this.$toast.success('Task Updated')
          this.todos[_index].editing = !this.todos[_index].editing
        })
        .catch((err) => {
          this.$toast.error('Unable to update the task!..')
        })
    },

    editTask(index) {
      this.todos[index].editing = !this.todos[index].editing
    },

    deleteTask(_index, _id) {
      this.$toast.info('Please wait...')
      this.$axios({
          headers: { Authorization: 'Token ' + this.$store.getters.token },
          url: `https://todo-app-csoc.herokuapp.com/todo/${_id}/`,
          method: 'delete',
        })
        .then(() => {
          this.todos.splice(_index,1)
          this.$toast.success('Task deleted!')
        })
        .catch((err) => {
          this.$toast.error('Unable to delete the task!..')
        })
    },
  },
})
</script>