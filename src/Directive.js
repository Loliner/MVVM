import directives from './directives.js'

class Directive {

    constructor(name, type, node) {
        const direct = directives[name];
        if (Object.prototype.toString.call(direct) === '[object Function]') {
            this._update = direct;
            this.type = type;
            this.node = node;
        } else if (Object.prototype.toString.call(direct) === '[object Object]') {
            this._update = direct.update;
            this._bind = direct.bind;
            this.type = type;
            this.node = node;
        }
    }

    update(mvvm, newVal) {
        this._update(this.node, newVal);
    }

    bind(mvvm) {
        this._bind(this.node, newVal);
    }
}

export default Directive;