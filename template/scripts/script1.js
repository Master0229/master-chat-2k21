function makeid(length) {
    var result = '';
    var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}
var hash = makeid(10)
var clienthash = ''
var socket = io();
socket.emit('join', name, hash);


socket.on('users', function (users) {
    console.log(users)
    updateinbox(users)
});
socket.on('new_message', function (msg) {
    document.getElementById("message_box").innerHTML +=
        `<div class="incoming_msg">
            <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                    alt="sunil"> </div>
            <div class="received_msg">
                <div class="received_withd_msg">
                    <p>${msg.message}</p>
                    <span class="time_date"> ${gettime(msg.time)} | ${getDate(msg.time)}</span>
                </div>
            </div>
        </div>`

})

function setclienthash(id) {
    console.log(id)
    clienthash = id
    getmessages()
    var elements = document.getElementsByClassName("chat_list")
    for (let i = 0; i < elements.length; i++) {
        if (elements.item(i).id == clienthash)
            elements.item(i).classList.add('active_chat')
        else
            elements.item(i).classList.remove('active_chat')
    }
}

function sendmessage() {
    var mobject = { from: hash, to: clienthash, message: $('#message').val(), time: new Date().getTime() }
    socket.emit('new_message', mobject)
    document.getElementById("message_box").innerHTML +=
        `<div class="outgoing_msg">
            <div class="sent_msg">
                <p>${mobject.message}</p>
                <span class="time_date"> ${gettime(mobject.time)} | ${getDate(mobject.time)}</span>
            </div>
        </div>`

}

function updateinbox(users) {
    var innerhtml = ''
    users.forEach(user => {
        console.log(user.hash, hash, user.name)
        if (user.hash != hash) {
            innerhtml += `
                <div id="${user.hash}" onclick="setclienthash(this.id)" class="chat_list">
                    <div class="chat_people">
                        <div class="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                alt="sunil"> </div>
                        <div class="chat_ib">
                            <h5>${user.name} <span class="chat_date">Dec 25</span></h5>
                            <p>Test, which is a new approach to have all solutions
                                astrology under one roof.</p>
                        </div>
                    </div>
                </div>`
        }
        document.getElementById("inbox").innerHTML = innerhtml
    });
}

function getmessages() {
    fetch(`http://192.168.1.2:3000/getmessages?clientid=${hash}`)
        .then(data => data.json())
        .then(res => {
            console.log(res)
            var msg_html = ''
            var messages = res
            var clientmessages = res.filter(x => x.from == clienthash || x.to == clienthash)
            clientmessages.forEach(msgob => {
                console.log(msgob.from, hash)
                if (msgob.from == hash) {
                    msg_html +=
                        `<div class="outgoing_msg">
                            <div class="sent_msg">
                                <p>${msgob.message}</p>
                                <span class="time_date"> ${gettime(msgob.time)} | ${getDate(msgob.time)}</span>
                            </div>
                        </div>`
                } else {
                    msg_html +=
                        `<div class="incoming_msg">
                            <div class="incoming_msg_img"> <img src="https://ptetutorials.com/images/user-profile.png"
                                    alt="sunil"> </div>
                            <div class="received_msg">
                                <div class="received_withd_msg">
                                    <p>${msgob.message}</p>
                                    <span class="time_date"> ${gettime(msgob.time)} | ${getDate(msgob.time)}</span>
                                </div>
                            </div>
                        </div>`
                }
            })
            document.getElementById("message_box").innerHTML = msg_html
        })
}
function gettime(timestamp) {
    var time = ''
    time = new Date(timestamp).getHours() + ':' + new Date(timestamp).getMinutes()
    return time
}
function getDate(timestamp) {
    var month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Sep", "Oct", "Nov", "Dec"]
    var date = ''
    let [month, dat, year]    = new Date(timestamp).toLocaleDateString("en-US").split("/")
    date = month_list[month - 1] + ' ' + dat
    return date
}