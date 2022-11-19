<script setup lang="ts">
import { Carte, Couleur, Valeur } from "@/models/carte.model";
import Card from "@/components/Card.vue";
import { ref, reactive, watch, watchEffect } from "vue";
import axios from "axios";
import { getCookie, getUser } from "@/router/functions";
import { Joueur } from "@/models/joueur.model";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";

const statut = ref("");
const fontSelected = ref(getCookie("font") || "dejavu");
const dejavu = ref(false);
const unifont = ref(false);
const process = import.meta.env;
var user = ref("");
const userId = ref("");
const username = ref("");
const room = ref("");

const usersInRoom: Joueur[] = reactive([]);
const socket = io(process.VITE_SERVER);

if (fontSelected.value == "dejavu") {
  dejavu.value = true;
  unifont.value = false;
} else {
  dejavu.value = false;
  unifont.value = true;
}
document.body.style.fontFamily = fontSelected.value;

socket.on("cookie", function (cookie) {
  document.cookie = cookie;
  user.value = username.value;
});

socket.on("get-user", function (u) {
  if (!(u == null)) {
    user.value = u.pseudo;
    userId.value = u.id;
    room.value = u.roomId;
    socket.emit("room-users", room.value);
  } else {
    console.log("get-user");
    console.log(u);
    username.value = prompt("Enter username")!;
    socket.emit("new-user", username.value);
  }
});

socket.on("get-room", () => {
  console.log("room created");
});

socket.on("to-room", (users) => {
  usersInRoom.length = 0;
  users.forEach((user: any) => {
    //    usersInRoom.push(new Joueur(user.id, user.pseudo, user.roomId, user.victoires));
    usersInRoom.push(user);
  });
  fetchdata();
});

socket.on("update", () => {
  fetchdata();
});

if (!getCookie("session-cookie")) {
  username.value = prompt("Enter username")!;
  socket.emit("new-user", username.value);
} else {
  socket.emit("find-user", getCookie("session-cookie"));
}

function getCookie(cname: string) {
  let name = cname + "=";
  let ca = document.cookie.split(";");
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

watch(fontSelected, () => {
  console.log("font");
  let cookie = "font=" + fontSelected.value + "; Max-Age=" + 24 * 60 * 60 * 1000;
  document.cookie = cookie;
  if (fontSelected.value == "dejavu") {
    dejavu.value = true;
    unifont.value = false;
  } else {
    dejavu.value = false;
    unifont.value = true;
  }
  document.body.style.fontFamily = fontSelected.value;
});

watch(usersInRoom, () => {});
const pioches: Carte[] = reactive([]);
const talon: Carte[] = reactive([]);
const joueurs: Joueur[] = reactive([]);
const joueurLocal: any = reactive({});

socket.on("fin-partie", (user) => {
  alert("La partie est terminée. " + user + " a gagné");
});

function displayData(response: any) {
  console.log("Response");
  //console.log(response.data)
  var statut = response.data.partie.statut;
  console.log(user.value);
  if (statut == 2) {
    //    alert("PARTIE TERMINÉE");
    //socket puis alerte
    socket.emit("fin-partie", room.value, user.value);
  }
  var pioche = response.data.partie.pioche;
  var talonJSON = response.data.partie.talon;
  talon.splice(0);
  talonJSON.forEach((carte: any) => {
    talon.push(new Carte(carte.valeur, carte.point, carte.url, carte.couleur));
  });
  pioches.splice(0);
  for (var index in pioche) {
    var carte = pioche[index];
    pioches.push(new Carte(carte.valeur, carte.point, carte.url, carte.couleur));
  }
  var joueursJSON = response.data.partie.joueurs;
  joueurs.splice(0);
  joueursJSON.forEach((joueur: any) => {
    const cartesJoueur: Carte[] = [];
    joueur.cartes.forEach((carte: any) => {
      cartesJoueur.push(new Carte(carte.valeur, carte.point, carte.url, carte.couleur));
    });
    joueurs.push(
      new Joueur(
        joueur.id,
        joueur.pseudo,
        joueur.roomId,
        joueur.victoires,
        joueur.tour,
        cartesJoueur
      )
    );
  });
  const tmpJoueurs = joueurs.filter((joueur) => joueur.id != userId.value)!;
  joueurLocal.joueur = joueurs.find((joueur) => joueur.id == userId.value)!;
  joueurs.splice(0);
  tmpJoueurs.forEach((joueur) => {
    joueurs.push(joueur);
  });
  console.log(joueurLocal);
  console.log(joueurs);
}

async function fetchdata() {
  axios
    .post(process.VITE_SERVER + "/api/room/createRoom", {
      roomId: room.value,
      joueurs: usersInRoom,
      roomName: "DUTCH",
    })
    .then(function (response) {
      displayData(response);
    });
}

async function piocher(id: string) {
  axios
    .post(process.VITE_SERVER + "/api/room/piocher", {
      roomId: room.value,
      userId: id,
    })
    .then(function (response) {
      displayData(response);
      socket.emit("alert-update", room.value);
    });
}

async function jouer(id: string, index: number) {
  axios
    .post(process.VITE_SERVER + "/api/room/jouerCarte", {
      roomId: room.value,
      userId: id,
      indexCarte: index,
    })
    .then(function (response) {
      console.log(response.data.partie.joueurs);
      displayData(response);
      socket.emit("alert-update", room.value);
    });
}
</script>

<template>
  <div class="board" :class="{ unifont: unifont, dejavu: dejavu }">
    <div>
      <div id="infos-plateau">
        <div>#ID: {{ room }}</div>
        <select v-model="fontSelected" id="font-selector">
          <option value="dejavu">Classique</option>
          <option value="unifont">Pixel</option>
        </select>
      </div>
      <div class="joueurs">
        <div v-for="joueur in joueurs" class="player-card">
          <div :class="{ tour: joueur.tour }">{{ joueur.getPseudo() }}</div>
          <br />
          <div class="top_deck">
            <Card
              v-for="carte in joueur.cartes"
              :key="joueur.cartes.indexOf(carte)"
              image-u-r-l="🂠"
              :class="{ small: true }"
            />
          </div>
        </div>
      </div>
    </div>
    <div>
      <Card
        @click="piocher(joueurLocal.joueur.id)"
        image-u-r-l="🂠"
        :class="{ medium: true }"
      />
      <Card
        :image-u-r-l="talon[0].getUrl()"
        :class="{ red: talon[0].isRed(), medium: true }"
      />
    </div>
    <div class="local-player-card">
      <div
        :class="{ tour: joueurLocal.joueur.tour, small: true }"
        style="margin-bottom: 10px"
      >
        {{ joueurLocal.joueur.getPseudo() }}
      </div>
      <div class="deck">
        <Card
          @click="jouer(joueurLocal.joueur.id, joueurLocal.joueur.cartes.indexOf(carte))"
          v-for="carte in joueurLocal.joueur.cartes"
          :key="joueurLocal.joueur.cartes.indexOf(carte)"
          :image-u-r-l="carte.getUrl()"
          :class="{ medium: true, red: carte.isRed() }"
        />
      </div>
    </div>
  </div>
</template>

<style>
/*
#room {
  padding: 8px;
  position: absolute;
  white-space: nowrap;
  overflow: scroll;
  max-width: 90%;
}*/

#infos-plateau {
  padding: 8px;
}

#infos-plateau * {
  margin: 5px;
}

#font-selector {
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 15px;
}

.dejavu {
  font-family: "DejaVuSans", "UnifontGlyph", "Unifont", "Courier New", monospace, Arial,
    Tahoma, Verdana, sans-serif;
}

.unifont {
  font-family: "UnifontGlyph", "Unifont", "Courier New", monospace, Arial, Tahoma, Verdana,
    sans-serif;
}

.board {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: inherit;
}

.joueurs {
  padding-top: 32px;
  display: flex;
  overflow: scroll;
}

.joueurs * {
  flex: 1 0 auto;
  overflow: scroll;
}

.top_deck {
  /*display: flex;
  flex-wrap: nowrap;
  overflow: scroll;*/
  white-space: nowrap;
}

.local-playerCard {
  /*  border: 3px solid black;*/
  border-radius: 15px;
  margin: 5px;
}

.player-card {
  border: 3px solid black;
  border-radius: 10px;
  margin: 5px;
  padding: 5px;
  overflow: scroll;
}

.deck {
  padding: 10px;
  display: flex;
  flex-wrap: nowrap;
  overflow: scroll;
}

.top_deck *,
.deck * {
  flex: 1;
}

.tour {
  color: yellow;
}

.red {
  color: rgba(218, 17, 17, 0.76);
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
