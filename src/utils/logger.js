function formatConsoleDate () {
    var date = new Date();
    var hour = date.getHours();
    var minutes = date.getMinutes();
    var seconds = date.getSeconds();
    var milliseconds = date.getMilliseconds();

    return  ((hour < 10) ? '0' + hour: hour) +
           ':' +
           ((minutes < 10) ? '0' + minutes: minutes) +
           ':' +
           ((seconds < 10) ? '0' + seconds: seconds) +
           '.' +
           ('00' + milliseconds).slice(-3);
}

export function info(message){
    console.log("[INFO] ["+formatConsoleDate()+"] "+message);
}

export function error(message){
    console.log("[ERROR] ["+formatConsoleDate()+"] "+message);
}