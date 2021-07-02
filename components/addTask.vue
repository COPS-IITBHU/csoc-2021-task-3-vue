
<template>
<main>
  <aside class="mx-auto flex justify-between mt-24 px-4">
    <label for="add task" class="flex-1">
      <input
        id="addTask"
        
        type="text"
        name="add task"
        class="
          todo-add-task-input
          px-4
          py-2
          placeholder-blueGray-300
          text-blueGray-600
          bg-white
          rounded
          text-sm
          border border-blueGray-300
          outline-none
          focus:outline-none focus:ring
          w-full
        "
        v-model="taskTitle"
        placeholder="Enter Task"
      />
    </label>
    <button
      type="button"
      :class="['todo-add-task bg-transparent hover:bg-green-500 text-green-700 text-sm hover:text-white px-3  py-2 border border-green-500 hover:border-transparent rounded']"
      @click="addTask"
    >
      Add Task
    </button>
  </aside>
   <div class="mx-auto flex justify-center mt-10 px-4">
    <span class="inline-block justify-between bg-blue-600 py-1 mb-5 px-9 text-sm text-white font-bold rounded-full ">Available Tasks</span>
  </div>
 </main>
</template>

<script>
import { defineComponent, useContext, reactive, toRefs } from '@nuxtjs/composition-api'
import axios from 'axios'
export default defineComponent({

  emits: ['newTask'],
  setup(props,context) {
    const state = reactive({
      taskTitle: '',
    })
  

const { $axios, store, $toast } = useContext()
    function addTask() {
     
      if(state.taskTitle === ''){
          $toast.error('Empty field is not accepted')
      }
      else{
      const data = {
        title: state.taskTitle
      }
      const headers = {
        Authorization: 'Token ' + store.getters.token,
      }
     $axios
     .post('todo/create/', data, { headers })
      
     
      .then(function({data}) {
        context.emit('newTask')
          state.taskTitle = ''
           
      }).catch(function(error){
        $toast.error('Something went wrong')
      })

      
    $toast.success('Task has been added')

  
    }

    } 
 return {
      addTask,
      ...toRefs(state),
      
      
    }

 
  
  },
})
</script>
