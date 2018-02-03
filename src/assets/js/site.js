let main = document.getElementById("main");
let offsetTop = main.offsetTop;

/**
 * 滚动监听
 */
main.onscroll = function () {
    let header = document.getElementById('header');
    let headerMain = document.getElementById("header_main");
    let headerChange = document.getElementById("header_change");

    if (main.scrollTop > offsetTop) {
        header.style.height = "50px";
        headerMain.style.display = "none";
        headerChange.style.display = "block";
        setTimeout(function() {
            headerChange.style.opacity = 1;
            headerChange.style.visibility = "visible";
        },50);
    } else {
        header.removeAttribute('style');
        headerMain.removeAttribute('style');
        headerChange.removeAttribute('style');
    }
}

/**
 * 返回顶部
 */
let timer = null;
let goTop = document.getElementById('change_title');

goTop.onclick = function () {
    cancelAnimationFrame(timer);
    timer = requestAnimationFrame(function fn() {

        if (main.scrollTop > 0) {
            main.scrollTop = main.scrollTop - 50;
            timer = requestAnimationFrame(fn);
        } else {
            cancelAnimationFrame(timer);
        }
    });
}