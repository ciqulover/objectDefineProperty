近日读了Vue.js一部分源代码，倒也是感到道阻且长。其中最核心的一点就是数据绑定。
相比于Angular.js的脏值检查与React.js的虚拟DOM，Vue.js运用了Object.defineProperty来追踪数值的变化和依赖，相当于对数据的读取进行了“劫持”。
于是这篇文章就介绍一个最最简单的利用Object.defineProperty来实现数据的双向绑定的例子。
其中JS代码没超过50行，超级短是不是。


下面是用来展示的index.html


### index.html

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>

</head>
<body>
<label for="input">输入:</label>
<input type="text" id="input" model="someStr">
<br>
<span>输出:</span>
<span id="output"></span>

<script src="MVVM.js"></script>
<script>
    new MVVM({
        input:document.getElementById('input'),
        output:document.getElementById('output'),
        data:{
            someStr:'hello world'
        }
    })
</script>
</body>
</html>
```


MVVM构造函数（类）接收三个参数，分别是输入元素输出元素和data对象
注意到其中id为input的元素，其中有一个指令model，值为someStr，这个值将会被绑定到data对象中的someStr上。

### MVVM.js
```
class MVVM {
    constructor(options) {
        this.input = options.input
        this.output = options.output
        let data = this.data = options.data
        let key = null
        //解析节点，找到节点的model属性
        Array.from(this.input.attributes).forEach((attr) => {
            if (attr.name == 'model') {
                key = attr.value
            }
        })

        if (key && data[key]) {
            let value = data[key]
            this.input.value = value
            this.output.textContent = value
            //开始绑定
            this.defineReactive(data, key, value)
        }
    }

    defineReactive(data, key, val) {
        //对节点的值监听
        this.input.addEventListener('input', (e) => {
            this.data[key] = e.target.value
        }, false)
        //将data对象中的值转换为getter和setter
        Object.defineProperty(data, key, {
            enumerable: true,
            configurable: false,
            get: () => val,
            set: (newVal) => {
                if (newVal === val) {
                    return
                }
                val = newVal
                //通知视图更新
                this.notify(newVal)
            }
        })
    }
    notify(val) {
        this.output.textContent = val
    }
}
```


MVVM.js返回一个类，对传入的数据进行绑定。不过这个实在是再简单不过了，因为绑定的只只有一个，属性也只有model，甚至如果其中someStr不是数值而是对象也不能进行深层的绑定。
嘿不过用于演示Object.defineProperty的数据绑定最基本用法已经足够啦。
接下来如果有时间（呜呜快开学了），我想写一点读Vue.js核心代码的体会，看一看在Vue.js源码里Object.defineProperty的用法，那才是复杂的不像话。。。
