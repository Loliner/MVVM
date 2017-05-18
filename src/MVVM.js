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
        let attrs = el.attributes;
        for (let i = 0; i < attrs.length; i++) {
            let match = /^v\-(\w+)/i.exec(attrs[i].name);
            if (match && match[1] && directives[match[1]]) {
                let key = attrs[i].value;
                if (this.bindings[key]) {
                    this.bindings[key].directives.push(new Directive(match[1], el));
                } else {
                    this.createAccessor(attrs[i].value, match[1], el);
                }
            }
        }
    }

    parseChild(el) {
        for (let i = 0; i < el.childNodes.length; i++) {
            let node = el.childNodes[i];
            // 节点
            if (node.nodeType === 1) {
                this.parseNode(node);
                // 文本节点
            } else if (node.nodeType === 3) {
                let match = /{{\s*(\w+)\s*}}/i.exec(node.textContent);
                if (match && match[1]) {
                    let key = match[1];
                    if (this.bindings[key]) {
                        this.bindings[key].directives.push(new Directive('text', node));
                    } else {
                        this.createAccessor(key, 'text', node);
                    }
                }
            }
        }
    }

    createAccessor(key, directName, node) {
        let binding = {
            value: '',
            directives: [new Directive(directName, node)]
        };
        this.bindings[key] = binding;

        Object.defineProperty(this.data, key, {
            get: function (key) {
                return binding.value;
            },
            set: function (newVal) {
                binding.value = newVal;
                for (let i = 0; i < binding.directives.length; i++) {
                    let direct = binding.directives[i];
                    direct.update(this, newVal);
                }
            }
        });
    }

}

export default MVVM;
