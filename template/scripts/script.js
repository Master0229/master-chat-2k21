const socket = io();

var name = ''
var room = ''
var joined = false

document.addEventListener("keydown", (e) => {
    if (e.keyCode === 13) {  //checks whether the pressed key is "Enter"
        sendmessage()
    }
});

socket.on('message', message => {
    console.log(message)
    if (!joined) {
        joined = true
        document.getElementById('logincontainer').hidden = true
        document.getElementById('chatcontainer').hidden = false
    }
    document.getElementById('message_box').hidden = false
    var div1 = document.createElement('div')
    var div2 = document.createElement('div')
    var div3 = document.createElement('div')
    var p = document.createElement('p')
    var span = document.createElement('span')
    var mtext = document.createElement('span')
    var strong = document.createElement('strong')
    var br = document.createElement('br')
    console.log(message.user, $('#name').val())
    if (message.user == "admin") {
        div1.className = "chat_bot_msg"
        div2.className = "received_msg justify-content-center d-flex"
        div3.className = "admin_dmsg"
        p.innerHTML = message.text + " | " + new Date().getHours() + ':' + new Date().getMinutes()
        div3.appendChild(p)
        div2.appendChild(div3)
        div1.appendChild(div2)
        document.getElementById('messagelist').append(div1)
    } else if (message.user != $('#name').val().toLowerCase()) {
        strong.className = "text-warning"
        strong.innerHTML = message.user
        div1.className = "received_msg"
        div2.className = "received_withd_msg"
        p.className = 'word-wrap'
        mtext.innerHTML = message.text
        span.className = 'time_date float-right'
        span.innerHTML = gettime() + ' | ' + getDate()
        p.appendChild(strong)
        p.appendChild(br)
        p.appendChild(mtext)
        p.appendChild(span)
        div2.appendChild(p)
        div1.appendChild(div2)
        document.getElementById('messagelist').append(div1)
        // document.getElementById('messagelist').append(br)
    }
    scrolltobottom()
});
function scrolltobottom() {
    console.log("Scrolling bottom")
    document.getElementById('message_box').scrollTop = document.getElementById('message_box').scrollHeight
}
socket.on('image', image => {
    // console.log(image)
    var div1 = document.createElement('div')
    var div2 = document.createElement('div')
    var p = document.createElement('p')
    var span = document.createElement('span')
    var img = document.createElement('img')
    var strong = document.createElement('strong')
    var br = document.createElement('br')
    if (image.user != $('#name').val().toLowerCase()) {
        strong.className = "text-warning"
        strong.innerHTML = image.user
        div1.className = "received_msg"
        div2.className = "received_withd_msg"
        p.className = 'word-wrap'
        img.innerHTML = message.text
        span.className = 'time_date float-right'
        span.innerHTML = gettime() + ' | ' + getDate()
        img.src = image.imageurl
        p.appendChild(strong)
        p.appendChild(br)
        p.appendChild(img)
        p.appendChild(br)
        p.appendChild(span)
        div2.appendChild(p)
        div1.appendChild(div2)
        document.getElementById('messagelist').append(div1)
        console.log(recieveimgsize(image.imageurl))
        let intervalid = window.setInterval(function () {
            scrolltobottom()
            window.clearInterval(intervalid)
        }, 100);
    }
})
function recieveimgsize(imageUrl) {
    var blob = null;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', imageUrl, true);
    xhr.responseType = 'blob';
    xhr.onload = function () {
        blob = xhr.response;
        console.log(blob, blob.size);
        console.log(bytesToSize(blob.size / 2))
    }
    xhr.send();
}
function setname(value) {
    name = value
}
function setroom(value) {
    room = value
}
function join() {
    console.log($('#name').val(), $('#room').val(), $('#message').val())
    socket.emit('join', { name: $('#name').val(), room: $('#room').val() }, (error) => {
        if (error) {
            alert(error);
        }
    });
}
function keyevent(e) {
    console.log(e)
}
function sendmessage() {
    if ($('#message').val().trimStart())
        socket.emit('sendMessage', $('#message').val(), () => {
            var div1 = document.createElement('div')
            var div2 = document.createElement('div')
            var div3 = document.createElement('div')
            var p = document.createElement('p')
            var span = document.createElement('span')
            div1.className = "outgoing_msg"
            div2.className = "sent_msg"
            p.className = 'word-wrap'
            p.innerHTML = $('#message').val()
            span.className = 'time_date float-right'
            span.innerHTML = gettime() + ' | ' + getDate()
            p.appendChild(span)
            div2.appendChild(p)
            div1.appendChild(div2)
            document.getElementById('messagelist').append(div1)
            $('#message').val('')
            $('#message').focus()
            scrolltobottom()
        });
    else
        $('#message').val('')
}
function gettime() {
    var time = ''
    time = new Date().getHours() + ':' + new Date().getMinutes()
    return time
}
function getDate() {
    var month_list = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Sep", "Oct", "Nov", "Dec"]
    var date = ''
    let [month, dat, year] = new Date().toLocaleDateString("en-US").split("/")
    date = month_list[month - 1] + ' ' + dat
    return date
}

//////////EMOJI PICKER///////////
const emojiTrigger = new FgEmojiPicker({
    trigger: ['emoji'],
    position: ['top', 'right'],
    preFetch: true,
    emit(obj, triggerElement) {
        $('#message').val($('#message').val() + obj.emoji)
    }
});
function bytesToSize(bytes) {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    if (bytes == 0) return '0 Byte';
    var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
    return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
}
////////IMAGE PICKER///////
function loadFile(event) {
    // console.log(URL.createObjectURL(event.target.files[0]));
    // console.log(event.target.files[0]);
    var reader = new FileReader();
    reader.onload = function (evt) {
        console.log(event.target.files[0].size)
        console.log("Sent Img Size :", bytesToSize(event.target.files[0].size))
        socket.emit('sendimage', evt.target.result, () => {
            var div1 = document.createElement('div')
            var div2 = document.createElement('div')
            var img = document.createElement('img')
            var p = document.createElement('p')
            var span = document.createElement('span')
            var br = document.createElement('br')
            div1.className = "outgoing_msg"
            div2.className = "sent_msg"
            p.className = 'word-wrap'
            img.src = URL.createObjectURL(event.target.files[0])
            // p.innerHTML = $('#message').val()
            p.appendChild(img)
            p.appendChild(br)
            span.className = 'time_date float-right'
            span.innerHTML = gettime() + ' | ' + getDate()
            p.appendChild(span)
            div2.appendChild(p)
            div1.appendChild(div2)
            document.getElementById('messagelist').append(div1)
            $('#message').val('')
            $('#message').focus()
            let intervalid = window.setInterval(function () {
                scrolltobottom()
                window.clearInterval(intervalid)
            }, 100);
        });
    };
    reader.readAsDataURL(event.target.files[0]);
};