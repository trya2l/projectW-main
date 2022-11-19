<script lang="ts">
import { Joueur } from "@/models/joueur.model.ts.old";

export default {
  props: {
    msg: String,
    joueur: Joueur,
  },
}
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
      <span style="background-color: black">
        <span style="color: black">🂡</span><span style="color: red">🂱</span>
        <span style="color: red">🃁</span><span style="color: black">🃑</span>
      </span>
    </h3>
  </div>
</template>

<style scoped>
h1 {
  font-weight: 500;
  font-size: 2.6rem;
  top: -10px;
}

h3 {
  font-size: 1.2rem;
}

.greetings h1,
.greetings h3 {
  text-align: center;
}

@media (min-width: 1024px) {
  .greetings h1,
  .greetings h3 {
    text-align: left;
  }
}
</style>
