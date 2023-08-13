function changeScale(a) {
    let b = a.split(':')
    let c = b.map(item => {
        return parseInt(item, 16).toString(2)
    })
    for (let i in c) {
        if (c[i].length < 16) {
            let n = 16 - c[i].length
            let str = ''
            for (let j = 0; j < n; j++) {
                str += 0
            }
            c[i] = str + c[i]
        }
    }
    return c
}
function changeCode(b) {
    let code = Number(b)
    let str = ''
    for (let k = 0; k < code; k++) {
        str += 1
        if (code < 128) {
            let n = 128 - code
            var zero = ''
            for (let o = 0; o < n; o++) {
                zero += 0
            }
        }
    }
    let bb = str + zero
    if (bb.length > 128) {
        bb = bb.slice(0, 128)
    }
    let r = bb.length % 16
    let len = bb.length

    let cc = bb.slice(r, len).match(/\d{16}/g).join(",");
    return cc.split(',')
}
function bin_to_hex(str) {

    let hex_array = [{ key: 0, val: "0000" }, { key: 1, val: "0001" }, { key: 2, val: "0010" }, { key: 3, val: "0011" }, { key: 4, val: "0100" }, { key: 5, val: "0101" }, { key: 6, val: "0110" }, { key: 7, val: "0111" },
    { key: 8, val: "1000" }, { key: 9, val: "1001" }, { key: 'a', val: "1010" }, { key: 'b', val: "1011" }, { key: 'c', val: "1100" }, { key: 'd', val: "1101" }, { key: 'e', val: "1110" }, { key: 'f', val: "1111" }]
    let value = ''
    let list = []

    if (str.length % 4 !== 0) {
        let a = "0000"
        let b = a.substring(0, 4 - str.length % 4)
        str = b.concat(str)
    }

    while (str.length > 4) {
        list.push(str.substring(0, 4))
        str = str.substring(4);
    }
    list.push(str)

    for (let i = 0; i < list.length; i++) {
        for (let j = 0; j < hex_array.length; j++) {
            if (list[i] == hex_array[j].val) {
                value = value.concat(hex_array[j].key)
                break
            }
        }
    }

    return value
}
export function compareIPV6(ip, code) {
    let arrIp = changeScale(ip)
    let arrCode = changeCode(code)

    let a = ''
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 16; j++) {
            if (arrIp[i][j] != arrCode[i][j]) {
                a += 0
            } else {
                a += arrIp[i][j]
            }
        }
    }

    let bb = a

    let r = bb.length % 16
    let len = bb.length
    let cc = bb.slice(r, len).match(/\d{16}/g).join(",");

    let nn = cc.split(',').map(item => bin_to_hex(item))
    return nn.join(':')
}