<script setup lang="ts">
import { io } from "socket.io-client";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const process = import.meta.env;
var user = ref("");
const username = ref("");
const room = ref("");
const userID = ref("");
const router = useRouter();
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

socket.on("get-user", function (u) {
  if (!(u == null)) {
    user.value = u.pseudo;
    userID.value = u.id;
  } else {
    username.value = prompt("Enter username")!;
    socket.emit("new-user", username.value);
  }
});

if (!getCookie("session-cookie")) {
  username.value = prompt("Enter username")!;
  socket.emit("new-user", username.value);
} else {
  socket.emit("find-user", getCookie("session-cookie"));
}

function createRoom() {
  socket.emit("new-room", getCookie("session-cookie"));
  router.push("/lobby");
}

function joinRoom(room: string) {
  socket.emit("join-room", getCookie("session-cookie"), room);
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
  <div id="infos-menu">
    <div>#ID: {{ userID }}</div>
    <select v-model="fontSelected" id="font-selector-menu">
      <option value="dejavu">Classique</option>
      <option value="unifont">Pixel</option>
    </select>
  </div>
  <div id="menus-menu">
    <div id="main-menu">
      <div id="user-menu">{{ user }}</div>
      <button @click="createRoom()">Creer une partie</button>
      <input v-model="room" type="text" />

      <button v-if="room" @click="joinRoom(room)">Rejoindre une partie</button>
      <button v-else disabled>Rejoindre une partie</button>
    </div>
  </div>
</template>

<style>
#infos-menu {
  margin: 8px;
  position: absolute;
  text-align: left;
}

#font-selector-menu {
  margin-top: 8px;
  background-color: transparent;
  border: 1px solid black;
  border-radius: 5px;
  font-size: 15px;
}

#user-menu {
  border: 0 !important;
}

#main-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  height: 50%;
  min-width: 70%;
  max-width: 80%;
  margin: auto;
}

#main-menu * {
  font-size: large;
  border-radius: 5px;
  box-sizing: border-box;
  margin: auto;
  width: 100%;
  height: 50px;
}

#menus-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  height: inherit;
}

.dejavu {
  font-family: "DejaVuSans", "UnifontGlyph", "Unifont", "Courier New", monospace, Arial,
    Tahoma, Verdana, sans-serif;
}

.unifont {
  font-family: "UnifontGlyph", "Unifont", "Courier New", monospace, Arial, Tahoma, Verdana,
    sans-serif;
}
</style>
