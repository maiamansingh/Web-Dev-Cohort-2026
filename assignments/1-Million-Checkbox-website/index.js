// start a sevrer
//listen for updates on server
//global level emit for initial state propagation
// look for updates from socket and either add or delete in set
//finaally emit the broadcast
//dissconnect the client

import { Server } from "socket.io";

const io = new Server(3000, {
    cors: {
        origin: "*",
    }
})
console.log("Server is running on port 3000")
const checkedBox = new Set()
io.on("connection",(socket)=> {
    console.log("client connected:", socket.id)
    socket.emit("initial-state", Array.from(checkedBox))
    socket.on("update", ({ id, state})=> {
         const alreadyChecked = checkedBox.has(id);
         if(state && !alreadyChecked){
            checkedBox.add(id)
            io.emit("update", { id, state})
          } 
         else if(!state && alreadyChecked) {
            checkedBox.delete(id)
            io.emit("update", { id, state})
         }
         
    })
    socket.on("disconnect",()=> {
        console.log("Client disconected:", socket.id)
    })
})
