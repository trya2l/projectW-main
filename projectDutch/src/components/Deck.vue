<script setup lang="ts">
import type { Carte } from "@/models/carte.model";
import Card from "@/components/Card.vue";
import { ref, reactive } from "vue";
import axios from "axios";
import { getCookie, getUser } from "@/router/functions"
import type { Joueur } from "@/models/joueur.model";

const process = import.meta.env
const montrer = ref(false)
const infosJoueur: Joueur = getUser();

const props = defineProps({
  cartes: {
    type : Array<Carte>,
    required : true
  },
  small: {
    type: Boolean,
    required: false
  },
  medium: {
    type: Boolean,
    required: false
  },
  large: {
    type: Boolean,
    required: false
  }
});

const cartesArr = reactive(props.cartes);

function retourner(index:number) {
  axios
    .post(process.VITE_SERVER + "/api/room/tournerCarte", {
      roomId: infosJoueur.getRoomId(),
      userId: infosJoueur.getId(),
      indexCarte: index,
    })
    .then(function (response) {

    });
}
</script>

<template>
  <div id="deck">
    <Card
      @click="retourner(cartesArr.indexOf(carte))"
      v-for="carte in cartesArr"
      :key="cartesArr.indexOf(carte)"
      :msg="carte.getUrl()"
      :class="{ small: small, medium: medium, large: large }"
    />
  </div>
</template>

<style>
#deck {
  display: flex;
  flex-wrap: nowrap;
  overflow: scroll;
}

#deck * {
  flex: 1;
}
</style>
