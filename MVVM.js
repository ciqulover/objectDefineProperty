class MVVM {
    constructor(options) {
        this.input = options.input
        this.output = options.output

        let data = this.data = options.data
        let key = null

        Array.from(this.input.attributes).forEach((attr)=> {
            if (attr.name == 'model') {
                key = attr.value
            }
        })

        if (key && data[key]) {
            let value = data[key]
            this.input.value = value
            this.output.textContent = value
            this.defineReactive(data, key, value)
        }
    }

    defineReactive(data, key, val) {

        this.input.addEventListener('input', (e)=> {
            this.data[key] = e.target.value
        }, false)

        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: ()=> {
                return val
            },
            set: (newVal)=> {
                if (newVal === val) {
                    return
                }
                val = newVal
                this.notify(newVal)
            }
        })
    }

    notify(val) {
        this.output.textContent = val
    }
}