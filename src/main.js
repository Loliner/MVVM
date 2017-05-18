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
        let attrs = el.attributes;
        for (let i = 0; i < attrs.length; i++) {
            let match = /^v\-(\w+)/i.exec(attrs[i].name);
            if (match && match[1] && ['text'].indexOf(match[1]) > -1) {
                let key = attrs[i].value;
                if (this.bindings[key]) {
                    this.bindings[key].nodes.push(el);
                } else {
                    this.createAccessor(attrs[i].value, el);
                }
            }
        }
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
                        this.bindings[key].nodes.push(node);
                    } else {
                        this.createAccessor(key, node);
                    }
                }
            }
        }
    }

    createAccessor(key, node) {
        let binding = {
            value: '',
            nodes: [node]
        };
        this.bindings[key] = binding;
        Object.defineProperty(this.data, key, {
            get: function (key) {
                return binding.value;
            },
            set: function (newVal) {
                binding.value = newVal;
                let nodes = binding.nodes;
                for (let i = 0; i < nodes.length; i++) {
                    nodes[i].textContent = newVal;
                }
            }
        });
    }

}

export default MVVM;
