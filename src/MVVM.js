import Directive from './Directive.js'
import directives from './directives.js'

const ATTR_REG = /^v\-(\w+)(:(\w+))*/i;
const ATTR_FOR_REG = /\s*(\w+)\s+in\s+(\w+)\s*/i;
class MVVM {
    constructor(selector, options) {
        if (Object.prototype.toString.call(selector) === '[object String]') {
            this.el = window.document.querySelector(selector);
        } else {
            this.el = selector;
        }
        this.data = {};
        this.bindings = {};
        this.parseNode(this.el);

        for (let key in options.data) {
            this.data[key] = options.data[key];
        }
    }

    parseNode(el) {
        this.parseDirectives(el);
        this.parseChild(el);
    }

    parseDirectives(el) {
        const attrs = el.attributes;
        for (let i = 0; i < attrs.length; i++) {
            const match = ATTR_REG.exec(attrs[i].name);
            if (match && match[1] && directives[match[1]]) {
                const directName = match[1];
                const directType = match[3];
                let dataKey = attrs[i].value;
                if (ATTR_FOR_REG.test(dataKey)) {
                    const keyMatch = ATTR_FOR_REG.exec(dataKey);
                    dataKey = keyMatch[2];
                }
                el.removeAttribute(attrs[i].name);
                this.bind(dataKey, directName, directType, el);
            }
        }
    }

    parseChild(el) {
        for (let i = 0; i < el.childNodes.length; i++) {
            const node = el.childNodes[i];
            // 节点
            if (node.nodeType === 1) {
                this.parseNode(node);
                // 文本节点
            } else if (node.nodeType === 3) {
                const match = /{{\s*(\w+)\s*}}/i.exec(node.textContent);
                if (match && match[1]) {
                    const directName = 'text';
                    const directType = '';
                    const dataKey = match[1];
                    this.bind(dataKey, directName, directType, node);
                }
            }
        }
    }

    bind(dataKey, directName, directType, node) {
        let directive = new Directive(directName, directType, node);
        directive.mvvm = this;

        if (this.bindings[dataKey]) {
            this.bindings[dataKey].directives.push(directive);
        } else {
            let binding = {
                value: '',
                directives: [directive]
            };
            this.bindings[dataKey] = binding;
            this.createAccessor(dataKey, binding);
        }
    }

    createAccessor(key, binding) {
        Object.defineProperty(this.data, key, {
            get: function () {
                return binding.value;
            },
            set: function (newVal) {
                binding.value = newVal;
                for (let i = 0; i < binding.directives.length; i++) {
                    const direct = binding.directives[i];
                    direct.update(this, newVal);
                }
            }
        });
    }

    destroy() {
        this.el.parentNode.removeChild(this.el);
        // for (let i = 0; i < binding.directives.length; i++) {
        //     const direct = binding.directives[i];
        //     direct.unbind && direct.unbind(this);
        // }
    }

}

export default MVVM;
