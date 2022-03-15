function check_radio(item) {
    item.getElementsByTagName("input")[0].checked = "checked"
}

window.onload = () => {
    if (typeof(document.querySelector(".logout")) != "undefined" && window.screen.width > 800) {
        var parent_height = document.querySelector(".logout").parentNode.clientHeight
        var btn_h = document.querySelector(".logout").clientHeight

        document.querySelector(".logout").style.marginTop = String((parent_height - btn_h) / 2) + "px"
    }

    if (typeof(document.querySelector(".each_btn")) != "undefined") {
        document.querySelectorAll(".each_btn").forEach((elem, i) => {
            if (elem.children[0] != null && typeof(elem.children[0]) != "undefined") {
                var parent_height = elem.parentNode.clientHeight
                var btn_h = elem.children[0].clientHeight

                elem.children[0].style.marginTop = String((parent_height - btn_h) / 2) + "px"
            }
        })
    }
}

function copyToClipboard(code) {
    var copytext = document.createElement('input')
    copytext.value = code
    document.body.appendChild(copytext)
    copytext.select()
    document.execCommand('copy')
    document.body.removeChild(copytext)
}

function edit_admin_info(id, elem) {
    var info = JSON.stringify({
        login: elem.parentNode.parentNode.querySelector("input[name='login']").value,
        pass: elem.parentNode.parentNode.querySelector("input[name='pass']").value,
        id: id
    })

    let req = new XMLHttpRequest();

    req.open("POST", "/edit_admin_info", true);   
    req.setRequestHeader("Content-Type", "application/json");
    req.addEventListener("load", function (e) {

    });
    req.send(info);
}

function accept_ask(ask_id, block_id) {
    if (String(document.querySelector("input[name='answer']:checked").value).length > 0) {
        var info = JSON.stringify({
            answer: document.querySelector("input[name='answer']:checked").value,
            ask_id: ask_id,
            block_id: block_id
        })
    
        let req = new XMLHttpRequest();
    
        req.open("POST", "/accept_ask", true);   
        req.setRequestHeader("Content-Type", "application/json");
        req.addEventListener("load", function (e) {
            window.location.reload()
        });
        req.send(info);
    }
}

function search_user() {  
    var search_name = String(document.querySelector("#search_field").value).trim()

    if (search_name.length > 0) {
        window.location.href = `/employer_cabinet/${search_name}`
    } else {
        window.location.href = `/employer_cabinet`
    }
}