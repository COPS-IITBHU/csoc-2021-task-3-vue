<template>
  <aside class="mx-auto flex justify-between mt-24 px-4">
    <label for="add task" class="flex-1">
      <input
        v-model="newTodo"
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
        placeholder="Enter Task"
      />
    </label>
    <button
      type="button"
      class="
        todo-add-task
        bg-transparent
        hover:bg-green-500
        text-green-700 text-sm
        hover:text-white
        px-3
        py-2
        border border-green-500
        hover:border-transparent
        rounded
      "
      @click="addTask"
    >
      Add Task
    </button>
  </aside>
</template>

<script>
import {
  defineComponent,
  reactive,
  toRefs,
  useContext,
} from '@nuxtjs/composition-api'

export default defineComponent({
  emits: ['newTask'],
  setup(props, context) {
    const state = reactive({
      newTodo: '',
    })

    const { $axios, store, $toast } = useContext()

    function addTask() {
      if (!state.newTodo) {
        $toast.info('Please type a task first')
        return
      }

      $toast.info('Adding new task...')

      const headers = {
        Authorization: 'Token ' + store.getters.token,
      }
      const data = {
        title: state.newTodo,
      }

      $axios
        .post('todo/create/', data, { headers })
        .then(function() {
          context.emit('newTask'),
          state.newTodo = '',
          $toast.success('New task added successfully')
        })
        .catch(() => {
          $toast.error('Oops! Something went wrong. Try again later')
        })
    }

    return {
      ...toRefs(state),
      addTask,
    }
  },
})
</script>
