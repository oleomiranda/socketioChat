const express = require("express")
const app = express()
const server = app.listen(8081, console.log("RODANDO..."))
const io = require("socket.io")(server)
const handlebars = require("express-handlebars")

app.set("view engine", "handlebars")
app.engine("handlebars", handlebars({defaultLayout:false}))

app.use(express.static("public"))


oldMessages = []

io.on("connect", socket => {
    socket.emit("oldMessages", oldMessages)
    //QUANDO O USUARIO ENTRA ENVIA AS MENSAGENS ANTIGAS 
    
    socket.on("message", msg => {
        oldMessages.push(msg)
        //ENVIA CADA NOVA MENSAGEM PARA O ARRAY DE MENSAGENS ANTIGAS 
        socket.broadcast.emit("messageReceived", msg)
    
    })
})

app.get("/", (req, res) => {
    res.render("chat")
})