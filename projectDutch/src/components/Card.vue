<script setup lang="ts">
const props = defineProps({
  imageURL: String,
  couleur: String,
  //joueur: Joueur;
});
</script>

<template>
  <span style="cursor: pointer">{{ imageURL }}</span>
</template>

<style>
.red {
  color: red;
}
.small {
  font-size: 50px;
}
.medium {
  font-size: 100px;
}
.large {
  font-size: 150px;
}
</style>
