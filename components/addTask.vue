<template>
  <aside class="mx-auto flex justify-between mt-24 px-4">
    <label for="add task" class="flex-1">
      <input
        type="text"
        name="add task"
        v-model.trim="newTodo"
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  emits: ['newTask'],
  data() {
    return {
      newTodo: '',
    }
  },
  methods: {
    async addTask() {
      /**
       * @todo Complete this function.
       * @todo 1. Send the request to add the task to the backend server.
       * @todo 2. Add the task in the dom.
       * @hint use emit to make a event that parent can observe
       */
      let newtodo = this.newTodo
      if(newtodo==''){this.$toast.error('Cannot Add empty Todo');return}
      this.$toast.info('Wait.. Adding Todo..')
      this.newTodo = ''
      const res = await this.$axios({
        headers: {
          Authorization: 'Token ' + this.$store.getters.token,
        },
        method: 'post',
        url: 'todo/create/',
        data: {
          title: newtodo,
        },
      })
      this.$emit('newTask')
      this.$toast.success('Todo Added Successfully');
      // .catch((err) => displayErrorToast('Cannot Add Todo'))
    },
  },
})
</script>
