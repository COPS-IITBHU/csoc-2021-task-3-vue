<template>
  <main class="bg-grey-lighter">
    <header>
      <navbar />
    </header>
    <Nuxt />
  </main>
</template>

<script lang="ts">
import { defineComponent } from '@nuxtjs/composition-api'
import Navbar from '@/components/navbar.vue'

export default defineComponent({
  components: {
    Navbar,
  },
})
</script>

<style>
.hideme {
  display: none !important;
}

.todo-edit-task-input,
.todo-add-task-input {
  border-top-right-radius: 0;
  border-bottom-right-radius: 0;
  max-width: 400px;
}

.todo-update-task,
.todo-add-task {
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
}

.todo-task {
  max-width: 260px;
}

</style>
