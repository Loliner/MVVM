export default {
    text: function (el, value) {
        el.textContent = value;
    },
    show: function (el, value) {
        if (value) {
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    },
    on: function () {

    }
}