<template>
  <main class="max-w-lg mx-auto px-6">
    <add-task @newTask="getTasks" />
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
                ' appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring todo-edit-task-input',
              ]"
              v-if="todo.editing"
              v-model="newTitle"
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
              v-if="todo.editing"
              type="button"
              @click="updateTask(index, todo.id)"
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
                hover:bg-yellow-500 hover:text-white
                border border-yellow-500
                hover:border-transparent
                rounded
                px-2
                py-2
              "
              v-if="!todo.editing"
              @click="editTask(index)"
            >
              <img
                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486663/CSOC/edit.png"
                width="18px"
                height="20px"
                v-if="!todo.editing"
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
              v-if="!todo.editing"
              @click="deleteTask(index, todo.id)"
            >
              <img
                src="https://res.cloudinary.com/nishantwrp/image/upload/v1587486661/CSOC/delete.svg"
                width="18px"
                height="22px"
                v-if="!todo.editing"
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
import { defineComponent,useContext,$toast } from '@nuxtjs/composition-api'
import addTask from '~/components/addTask.vue'

export default defineComponent({
  middleware: ['auth'],
  components: { addTask },
  data() {
    return {
      hello: 'hello world!',
      todos: [],
      loading: false,
      newTitle:'',
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
        Authorization: "Token " +  this.$store.getters.token,
      }
      this.$axios.get('todo/', { headers })
          .then(({data})=>{
            this.todos=[];
            for(let element of data){
              element.editing=false;
              this.todos.push(element);
              
            }
            console.log(this.todos);
          })
          .catch((e)=>{
            console.log(e)
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
      if(!this.newTitle) return;
      const headers = {
        Authorization: "Token " +  this.$store.getters.token,
      }
      const data={
        title: this.newTitle
      }
      console.log(data)
      this.$axios.put(`/todo/${_id}/`,data,{headers})
      .then(()=>{
         this.todos[_index].editing = !this.todos[_index].editing;
         this.todos[_index].title=this.newTitle;
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
      const headers = {
        Authorization: "Token " +  this.$store.getters.token,
      }
      this.$axios.delete(`/todo/${_id}/`,{headers})
      .then(()=>{
        this.todos.splice(_index,1);
        this.$toast.success('Task Deleted')
      }).catch((e)=>{
        console.log(e)
      })
    },
  },
})
</script>
