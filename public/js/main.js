var chatForm = document.getElementById("chat-form")
var username = document.getElementById("username")
var chatMessages = document.getElementById("chat-messages")
var socket = io()
var interval = ''

function messageAlert(name){
    if(document.visibilityState == "hidden"){
        //SÓ MOSTRA O ALERTA SE O USUARIO ESTIVER EM OUTRA ABA 
        interval = setInterval(() => {
            if(document.title == "Chat"){
                document.title = `MENSAGEM DE ${name}`
            }else{
                document.title = "Chat"
            }
        }, 1200);
    }else{
        return
    }
}

function formatMessages(msg){
    var chat = document.getElementById("chat-messages")
    var div = document.createElement("div")
    var sanitizeHTML = function (str) {
	return str.replace(/[^\w. ]/gi, function (c) {
		return '&#' + c.charCodeAt(0) + ';';
	});
};
    div.innerHTML = `<p><strong>${sanitizeHTML(msg.username)}</strong>: ${sanitizeHTML(msg.text)}</p>`
    chat.appendChild(div)
    //MOSTRA A MENSAGEM NA TELA DENTRO DA DIV DE MENSAGENS 
    chatMessages.scrollTop = chatMessages.scrollHeight
    //FAZ A PAGINA DAR SCROLL PARA BAIXO AUTOMATICAMENTE 
}


window.addEventListener("focus", () => {
    clearInterval(interval)
    document.title = "Chat"
    //PARA O ALERTA DE MENSAGEM QUANDO O USUARIO ABRE A PAGINA 
})


chatForm.addEventListener("submit", event => {
    event.preventDefault()
    
    var message = {
        username: username.value,
        text: event.target.elements.msg.value
    }

    formatMessages(message)
    //MOSTRA A MENSAGEM PARA O PROPRIO USUARIO 
    socket.emit("message", message)
    //MANDA O OBJECT DE MENSAGENS PARA O BACKEND
    event.target.elements.msg.value = "" 
    // LIMPA O INPUT
    event.target.elements.msg.focus() 
    //MANTEM O FOCO NO INPUT PARA O USUARIO PODER ESCREVER OUTRA MSG EM SEGUIDA 
    
})

socket.on("oldMessages", oldmessages => {
    oldmessages.map(msg => {
        formatMessages(msg)
    })
    //MOSTRA AS MENSAGENS QUE FORAM ENVIADAS ANTES DO USUARIO ENTRAR 
})

socket.on("messageReceived", async message => {
    formatMessages(message)
    //MOSTRA A MENSAGEM RECEBIDA
    await clearInterval(interval)
    messageAlert(message.username)
    //MOSTRA APENAS ALERTA DA ULTIMA MENSAGEM QUE FOI RECEBIDA 
    //SEM O clearInterval A CADA MENSAGEM OS ALERTAS ACUMULARIAM 
})

