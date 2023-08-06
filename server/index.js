const server = require("./app")


server.listen(process.env.PORT || 5000 , ()=>{
    console.log(`server is running : http://localhost:${process.env.PORT}`);
})