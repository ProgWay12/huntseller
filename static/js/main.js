function check_radio(item) {
    item.getElementsByTagName("input")[0].checked = "checked"
}

window.onload = () => {
    if (typeof(document.querySelector(".logout")) != "undefined") {
        var parent_height = document.querySelector(".logout").parentNode.clientHeight
        var btn_h = document.querySelector(".logout").clientHeight

        document.querySelector(".logout").style.marginTop = String((parent_height - btn_h) / 2) + "px"
    }

    if (typeof(document.querySelector(".each_btn")) != "undefined") {
        document.querySelectorAll(".each_btn").forEach((elem, i) => {
            var parent_height = elem.parentNode.clientHeight
            var btn_h = elem.children[0].clientHeight

            elem.children[0].style.marginTop = String((parent_height - btn_h) / 2) + "px"
        })
    }
}