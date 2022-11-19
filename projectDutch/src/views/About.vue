<script setup lang="ts">
import { watch, reactive, ref } from "vue";
import { Carte, Couleur, Valeur } from "@/models/carte.model";
import Board from "../components/Board.vue";
import { Joueur } from "@/models/joueur.model";
import http from "@/http-common";
import axios from "axios";
import { io } from "socket.io-client";
import { useRouter } from "vue-router";

const process = import.meta.env;
const router = useRouter();
var user = ref("");
const username = ref("");
const room = ref("");
const usersInRoom: Joueur[] = reactive([]);
const socket = io(process.VITE_SERVER);

socket.on("cookie", function (cookie) {
  document.cookie = cookie;
  user.value = username.value;
});

socket.on("get-user", function (u) {
  if (!(u == null)) {
    user.value = u.pseudo;
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
  console.log("Room");
  console.log(users);
  usersInRoom.length = 0;
  users.forEach((user: any) => {
    //    usersInRoom.push(new Joueur(user.id, user.pseudo, user.roomId, user.victoires));
    usersInRoom.push(user);
  });
  console.log(usersInRoom);
  fetchdata();
});

if (!getCookie("session-cookie")) {
  username.value = prompt("Enter username")!;
  socket.emit("new-user", username.value);
} else {
  socket.emit("find-user", getCookie("session-cookie"));
}

function test() {
  console.log("test");
  socket.emit("hello-room", room.value);
}

function startGame() {
  socket.emit("new-game", usersInRoom);
  router.push("/lobby");
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

watch(usersInRoom, () => {});
const pioches: Carte[] = reactive([]);
const joueurs: Joueur[] = reactive([]);

function fetchdata() {
  axios
    .post(process.VITE_SERVER + "/api/room/createRoom", {
      roomId: 1,
      joueurs: usersInRoom,
      roomName: "DUTCH",
    })
    .then(function (response) {
      console.log("Response");
      console.log(response.data);
      var pioche = response.data.partie.pioche;
      for (var index in pioche) {
        var carte = pioche[index];
        pioches.push(new Carte(carte.valeur, carte.point, carte.url, carte.couleur));
      }
      var joueursJSON = response.data.partie.joueurs;
      joueurs.length = 0;
      joueursJSON.forEach((joueur: any) => {
        const cartesJoueur: Carte[] = [];
        joueur.cartes.forEach((carte: any) => {
          cartesJoueur.push(
            new Carte(carte.valeur, carte.point, carte.url, carte.couleur)
          );
        });
        joueurs.push(
          new Joueur(
            joueur.id,
            joueur.pseudo,
            joueur.roomId,
            joueur.victoires,
            cartesJoueur
          )
        );
      }); /*
      for (var index in joueursJSON) {
        var joueurJSON = joueursJSON[index];
        joueurs.push(
          new Joueur(
            joueurJSON.id,
            joueurJSON.pseudo,
            joueurJSON.roomId,
            joueurJSON.victoires,
            joueurJSON.cartes
          )
        );
      }*/
    });
}

//watch(pioches, fetchdata);

const defausse = new Carte(Valeur.SIX, 6, "🃖", Couleur.TREFLE);
</script>

<template>
  <Board :joueurs="joueurs" :cartes="pioches" :defausse="defausse" />
</template>
