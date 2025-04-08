//@ts-ignore-next-line
function handler(event: any) { 
    console.error("ERROR: this CF function should not be used, something likely went wrong in deploy-template-aws-lambda-s3-cloudfront");
    return event.request; 
}