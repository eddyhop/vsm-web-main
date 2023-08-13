function changeScale(a){
    let b = a.split('.')
    let c= b.map(item=>{
        return Number(item).toString(2)
    })
    for(let i in c){
        if(c[i].length<8){
           let n = 8-c[i].length
           let str = ''
           for(let j=0 ; j<n;j++){
               str+=0
           }
           c[i] = str+c[i]
        }
    }
    return c
}

function changeCode(b){
    let code = Number(b)
    let str = ''
    for(let k=0;k<code;k++){
        str+=1
        if(code<32){
            let n = 32-code
            var zero = ''
            for(let o=0;o<n;o++){
                zero+=0
            }
        }
    }
    let bb = str+zero
    let r = bb.length%8
    let len = bb.length
    let cc = r>0?bb.slice(0,r)+","+bb.slice(r,len).match(/\d{3}/g).join(","):bb.slice(r,len).match(/\d{8}/g).join(",");  
    return cc.split(',')
}

export function compare(ip,code){
    let arrIp = changeScale(ip)
    let arrCode = changeCode(code)
    let a = ''
    for(let i=0;i<4;i++){
        for(let j = 0;j<8;j++){
            if(arrIp[i][j]!=arrCode[i][j]){
                a+=0
            }else{
                a+=arrIp[i][j]
            }
        }
    }
    let bb = a
    let r = bb.length%8
    let len = bb.length
    let cc = r>0?bb.slice(0,r)+","+bb.slice(r,len).match(/\d{3}/g).join(","):bb.slice(r,len).match(/\d{8}/g).join(",");  
    let nn = cc.split(',').map(item=>parseInt(item,2))
    return nn.join('.')
}