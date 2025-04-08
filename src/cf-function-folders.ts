//@ts-ignore-next-line
function handler(event: any) { 
    var request = event.request; 
    if (request.uri !== "/" && (request.uri.endsWith("/") || request.uri.lastIndexOf(".") < request.uri.lastIndexOf("/"))) { 
       request.uri = request.uri.endsWith("/") ? request.uri.concat("index.html") : request.uri.concat("/index.html"); 
    } 
    return request; 
}