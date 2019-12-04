import http = require('http');

/* class obj {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    public x: number;
    public y: number;
} */

class IC{
    protected age:number = 0;
    protected name:string = '';

    constructor(){
        this.age = 100;
        this.name = 'IC';
    }
}
class Child extends IC{
    protected weight:number = 0;
    public getWeight():number{
        return this.weight;
    }
    public setWeight(val:number):void{
        this.weight = val;
    }
    constructor(){
        super();
        this.weight = 1000;
    }
}

class httpAsync {
    constructor() {

/*         let arr: Array<number> = [0, 1, 2, 3, 4];
        let objs: Array<obj> = [new obj(0, 1), new obj(1, 2), new obj(2, 3)]
        arr.forEach(e => { e += 1 })
        console.log(arr);//[0, 1, 2, 3, 4]
        arr.forEach(e => { e = 1 });
        console.log(arr);//[0, 1, 2, 3, 4]

        objs.forEach(e => { e.x += 1 });
        console.log(objs);//[{1, 1},{2, 2},{3, 4}]
        objs.forEach(e => { e = new obj(100, 100) })
        console.log(objs);//[{1, 1},{2, 2},{3, 4}] */

        //let child:Child = new Child();

    }

    public async GetAsync(url: string): Promise<http.IncomingMessage> {
        let promise = new Promise<http.IncomingMessage>(resolve => {
            http.get(url, res => {
                resolve(res);
            })
        })
        return promise;
    }
}

async function test() {
    let ha = new httpAsync();

    let res = await ha.GetAsync("http://localhost:7456");
    console.log('the first Status :' + res.statusCode);
    /*     res = await ha.GetAsync("https://www.163.com");
        console.log('the first Status :' + res.statusCode);
        res = await ha.GetAsync("https://www.sina.com");
        console.log('the first Status :' + res.statusCode); */
}

//test();