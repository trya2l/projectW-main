<script setup lang="ts">
import type { Carte } from "@/models/carte.model";
import { Joueur } from "@/models/joueur.model";
import Deck from "@/components/Deck.vue";

const props = defineProps({
  joueur: {
    type: Joueur,
    required: true,
  },
  deck: {
    type: Array<Carte>,
    required: true
  },
});
</script>

<template>
  <div id="joueur">
    {{ joueur.getPseudo() }}
    <br>
    <Deck :cartes="deck" :small="true" />
  </div>
</template>

<style>
#joueur {
  border: 1px solid black;
}
</style>
