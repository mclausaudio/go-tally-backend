exports.handler = async function (event: any) {
  console.log("request:", JSON.stringify(event, undefined, 2));

  var response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/html"
    },
    body: "Hello world!"
  };
  return response;
  
};
