<script setup lang="ts">
import { Carte, Valeur } from "@/models/carte.model";
import type { Joueur } from "@/models/joueur.model";
import Deck from "@/components/Deck.vue";
import Card from "./Card.vue";
import PlayerCard from "./PlayerCard.vue";

const props = defineProps({
  defausse : {
    type: Carte,
    required: true
  },
  cartes: {
    type : Array<Carte>,
    required: true
  },
  joueurs: {
    type: Array<Joueur>
  }
});
</script>

<template>
  <div class="board">
    <span id="room">#ID: </span>
    <div class="joueurs">
      <PlayerCard v-for="joueur in joueurs" :joueur="joueur" :deck="joueur.getCartes()" />
    </div>
    <div>
      <Card msg="🂠" :class="{ medium: true }" />
      <Card :msg="defausse.getUrl()" :class="{ red: true, medium: true }" />
    </div>
    <Deck :cartes="cartes" :medium="true" />
  </div>
</template>

<style>
/*
#room {
  padding: 8px;
  position: absolute;
}
*/
.board {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
}
.joueurs {
  padding-top: 32px;
  display: flex;
  justify-content: space-around;
}

.joueurs * {
  flex: 1;
}
</style>
