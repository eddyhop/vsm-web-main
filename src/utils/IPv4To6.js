export function IPv4ToIPv6(IP){
    var mask = IP.split('/')[0]
    var code = 1*(IP.split('/')[1])+96
    
    var result = mask.split('.');    
    result[0]= (Array(8).join(0) + parseInt(result[0]).toString(2)).slice(-8);
    result[1]= (Array(8).join(0) + parseInt(result[1]).toString(2)).slice(-8);
    result[2]= (Array(8).join(0) + parseInt(result[2]).toString(2)).slice(-8);
    result[3]= (Array(8).join(0) + parseInt(result[3]).toString(2)).slice(-8);
    
    var result2=[];
    result2[0]=(Array(4).join(0) + parseInt(''+result[0]+result[1],2).toString(16)).slice(-4);
    result2[1]=(Array(4).join(0) + parseInt(''+result[2]+result[3],2).toString(16)).slice(-4);
    
    return 'fd01::'+result2[0]+':'+result2[1]+'/'+code;
}