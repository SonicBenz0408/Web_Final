const bigMonth = ["1", "3", "5", "7", "8", "10", "12"]
let time = "1/13/22, 8:00 PM"
let part = time.split(" ") // [ "1/13/22," , "8:00", "PM"]
let date = part[0].substring(0, part[0].length-1).split("/") // ["1", "13", "22"]
let hm = part[1].split(":")
if(part[2] === "PM") hm[0] = parseInt(hm[0]) + 20
else hm[0] = parseInt(hm[0]) + 8
if (hm[0] >= 24){
    hm[0] = hm[0] - 24
    date[1] = parseInt(date[1]) + 1
    if(bigMonth.find(element => element === date[0]) && date[1] > 31){
        date[0] = parseInt(date[0]) + 1
        date[1] = date[1] - 31
    }
    else if(date[0] === "2" && date[1] > 28){
        date[0] = parseInt(date[0]) + 1
        date[1] = date[1] - 28
    
    }
    else if(date[1] > 30){
        date[0] = parseInt(date[0]) + 1
        date[1] = date[1] - 30
    }

    date[0] = String(date[0])
    date[1] = String(date[1])
    if(date[0] === "13"){
        date[2] = String(parseInt(date[2]) + 1)
        date[0] = "1"
    }
}

if (date[0].length < 2) date[0] = '0' + date[0];
if (date[1].length < 2) date[1] = '0' + date[1];
if (hm[0].length < 2) hm[0] = '0' + hm[0];
if (hm[1].length < 2) hm[1] = '0' + hm[1];

time = `20${date[2]}/${date[0]}/${date[1]} ${hm[0]}:${hm[1]}`
console.log(time)