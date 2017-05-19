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
    on: {
        update: function (el, handler) {
            const type = this.type;
            handler = handler.bind(this.mvvm);
            el.addEventListener(type, handler, false);
        }
    }
}