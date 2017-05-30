import MVVM from './MVVM.js'

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
    },
    for: {
        update: function (el, value) {debugger;

            if (!this.container) {
                this.container = el.parentNode;
                this.container.innerHTML = '';
                this.childMVVM = [];
            }

            if (this.childMVVM && this.childMVVM.length) {
                this.childMVVM.forEach(function (item) {
                    item.destroy();
                });
                this.childMVVM = [];
            }

            // let parent = el.parentNode;
            const attrs = el.attributes;
            // parent.innerHTML = '';
            for (let i = 0; i < value.length; i++) {
                let node = document.createElement(el.tagName);
                for (let j = 0; j < attrs.length; j++) {
                    node.setAttribute(attrs[j].name, attrs[j].value);
                }
                const mvvm = new MVVM(node, {
                    data: value[i]
                });
                this.childMVVM.push(mvvm);
                value[i] = mvvm.data;
                this.container.appendChild(node);
            }
        }
    }
}
