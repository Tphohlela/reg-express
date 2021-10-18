document.addEventListener('DOMContentLoaded', function () {
    let successMsgElem = document.querySelector('.msg');

    if (successMsgElem.innerHTML !== '') {
        setTimeout(function () {
            successMsgElem.innerHTML = '';
        }, 3000);
    }
});
