<script setup lang="ts">
import { Joueur } from "@/models/joueur.model";
import { io } from "socket.io-client";
import { ref, reactive, watch } from "vue";
import { useRouter } from "vue-router";

const process = import.meta.env;
const router = useRouter();
var user = ref("");
const username = ref("");
const room = ref("");
const userID = ref("");
const usersInRoom: Joueur[] = reactive([]);
const socket = io(process.VITE_SERVER);
const fontSelected = ref(getCookie("font") || "dejavu");
const dejavu = ref(false);
const unifont = ref(false);

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

socket.on("game-starting", () => {
  router.push("/plateau");
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
  console.log(users);
  usersInRoom.length = 0;
  users.forEach((user: any) => {
    usersInRoom.push(
      new Joueur(user.id, user.pseudo, user.roomId, user.victoires, false)
    );
  });
  console.log(usersInRoom.length);
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
  socket.emit("new-game", usersInRoom, room.value);
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
</script>

<template>
  <div id="infos-lobby">
    <div>#ROOM ID: {{ room }}</div>
    <select v-model="fontSelected" id="font-selector-lobby">
      <option value="dejavu">Classique</option>
      <option value="unifont">Pixel</option>
    </select>
  </div>
  <div id="menus-lobby">
    <div id="main-lobby">
      <div>Liste des joueurs en attente:</div>
      <p v-for="user in usersInRoom">{{ user.getPseudo() }}</p>
      <button @click="startGame()">Creer une partie</button>
    </div>
  </div>
</template>

<style>
#infos-lobby {
  margin: 8px;
  position: absolute;
  text-align: left;
}

#font-selector-lobby {
  margin-top: 8px;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 15px;
}

#main-lobby {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50%;
  min-width: 70%;
  max-width: 80%;
  margin: auto;
}

#main-lobby > * {
  font-size: large;
  border-radius: 5px;
  box-sizing: border-box;
  margin: auto;
  width: 100%;
  height: 50px;
}

#menus-lobby {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: inherit;
}
</style>
