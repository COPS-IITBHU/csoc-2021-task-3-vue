<template>
  <aside class="mx-auto flex justify-between mt-24 px-4">
    <label for="add task" class="flex-1">
      <input
        type="text"
        name="add task"
        v-model="newTaskTitle"
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
import { defineComponent } from '@nuxtjs/composition-api'

export default defineComponent({
  emits: ['newTask'],
  data(){
    return{
      newTaskTitle: '',
    }
  },
  methods: {
    addTask() {
      const data={
        title: this.newTaskTitle,
      }
      const headers={
        Authorization: 'Token ' + this.$store.getters.token
      }
      this.$axios.post('todo/create/',data,{headers})
        .then((response) => {
          this.$emit('newTask')
        })
        .catch((err) => {
          this.$toast("Unable to add task!..")
        })
    },
  },
})
</script>
