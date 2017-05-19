import Directive from './Directive.js'
import directives from './directives.js'

class MVVM {
    constructor(selector, options) {
        this.el = window.document.querySelector(selector);
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
            const match = /^v\-(\w+)(:(\w+))*/i.exec(attrs[i].name);
            if (match && match[1] && directives[match[1]]) {
                const directName = match[1];
                const directType = match[3];
                const dataKey = attrs[i].value;
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
        if (this.bindings[dataKey]) {
            let directive = new Directive(directName, directType, node);
            directive.mvvm = this;
            this.bindings[dataKey].directives.push(directive);
        } else {
            let directive = new Directive(directName, directType, node);
            directive.mvvm = this;
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

}

export default MVVM;
