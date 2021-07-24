<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
    <transition>
      <ul class="flex-col mt-9 mx-auto">
        <li v-if="loading" class="border flex border-gray-500 rounded px-2 py-2 justify-between items-center mb-2">Fetching Tasks....</li>
        <li v-if="todos.length==0 && !loading" class="border flex border-gray-500 rounded px-2 py-2 justify-between items-center mb-2">No Todos To Show</li>
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
              v-model="msg[index]"
              :class="[
                'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input'
              ]"
              :name="todo.title"
              v-show="todos[index].editing"
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
              v-show="todos[index].editing"
              type="button" 
              @click="updateTask(index, todo.id)"
            >
              Done
            </button>
          </div>
          <div :class="['todo-task text-gray-600']" v-show="todos[index].editing!=true">
            {{ todo.title }}
          </div>
          <span class="" v-show="todos[index].editing!=true">
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
              v-show="todos[index].editing!=true"
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
                hover:bg-red-500
                hover:text-white
                border border-red-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              v-show="todos[index].editing!=true"
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
  middleware: 'auth',
  components: { addTask },
  data() {
    return {
      msg: [],
      todos: [],
      loading: false,
    }
  },
  mounted() {
    this.loading = true
    this.getTasks()
    this.$toast.info('Loading Your Todos...')
  },
  methods: {
    async getTasks() {
      /***
       * @todo Fetch the tasks created by the user and display them.
       * @todo also the function to display a single new task added
       * @hints use store and set loading true
       * @caution you have to assign new value to todos for it to update
       */
      let token = this.$store.getters.token
      this.$axios({
        headers: { Authorization: 'Token ' + token },
        url: 'todo/',
        method: 'get',
      }).then((res) => {
          this.todos = res.data;
          this.loading = false;
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
      let upTodo = this.msg[_index];
      if(upTodo ==='' || upTodo === this.todos[_index].title){
        this.editTask(_index);
        return 
      }
      this.$toast.info('Updating Todo');
      this.$axios({
        headers: {Authorization: 'Token ' + this.$store.getters.token ,},
        url: 'todo/' + (_id) + '/',
        method: 'patch',
        data: {
          title: upTodo
        }
      })
        .then(() =>{
          this.$toast.success('Todo Updated!')
          this.todos[_index].title = upTodo;
          this.editTask(_index);
        })
    },
    /**
     * toggle visibility of input and buttons for a single todo
     * @argument {number} index - index of element to toggle
     * @todo add in bindings in dom so that 'hideme' class is dynamic or use conditional rendering
     * @hint read about class bindings in vue
     */
    editTask(index) {
      let a = this.todos[index];
      this.msg[index] = a.title;
      a.editing = !a.editing
      this.todos.splice(index,1,a);
    },
    /**
     * Function to delete a single todo
     * @argument {number} _index - index of element to update in todos array
     * @argument {number} _id - id of todo obtained from API
     * @todo Complete this function.
     * @todo 1. Send the request to delete the task to the backend server.
     * @todo 2. Remove the task from the dom.
     */
    async deleteTask(_index, _id) {
      let token = this.$store.getters.token
      this.$toast.info('Wait..Deleting Todo...');
      const res = await this.$axios({
        headers: { Authorization: 'Token ' + token },
        url: `todo/${_id}/`,
        method: 'delete',
      })
      let a = this.todos.splice(_index,1); 
      this.$toast.success('Todo Deleted.')
    },
  },
})
</script>

<style>
  /* .list-enter-active,
  .list-leave-active {
    transition: all 1s ease;
  }
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  } */
</style>
