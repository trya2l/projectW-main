import { Joueur } from "@/models/joueur.model";
import { io } from "socket.io-client";


const process = import.meta.env
const socket = io(process.VITE_SERVER);

function getUser(): any {
    socket.emit("find-user", getCookie("session-cookie"));
    socket.on("get-user", function (u) {
        if (!(u == null)) {
            return new Joueur(u.id, u.pseudo, u.roomId, u.victoires, u.cartes);
        }
    });
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

export { getCookie, getUser };
