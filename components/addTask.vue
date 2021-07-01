<template>
  <main>
    <aside class="mx-auto flex justify-between mt-24 px-4">
      <label for="add task" class="flex-1">
        <input
          type="text"
          name="add task"
          v-model="addtitle"
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
            focus:outline-none
            focus:ring
            w-full
          "
          placeholder="Enter Task"
        />
      </label>
      <button
        id="addbtn"
        type="button"
        class="
          todo-add-task
          bg-green-500
          hover:bg-green-400
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
    <div class="mx-auto flex justify-center mt-10 px-4">
      <span
        class=" inline-block justify-between bg-blue-600 py-1 mb-5 px-9 text-sm text-white font-bold rounded-full"
        >Available Tasks</span
      >
    </div>
  </main>
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
      addtitle: '',
    })
    const { $axios, store, $toast } = useContext()

    function addTask() {
      /**
       * @todo Complete this function.
       * @todo 1. Send the request to add the task to the backend server.
       * @todo 2. Add the task in the dom.
       * @hint use emit to make a event that parent can observe
       */

      // console.log(state.addtitle);
      if (!state.addtitle) {
        return
      }
      const headers = {
        Authorization: 'Token ' + store.getters.token,
      }
      const data = {
        title: state.addtitle,
      }
      $axios
        .post('todo/create/', data, { headers })

        .then(function () {
          context.emit('newTask'),
            (state.addtitle = ''),
            $toast.success('Task Added Successfully')
        })
        .catch(function (err) {
          $toast.error('Something went wrong, try again')
        })
    }
    return {
      addTask,
      ...toRefs(state),
    }
  },
})
</script>

