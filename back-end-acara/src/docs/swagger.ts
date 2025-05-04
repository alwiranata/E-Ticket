import swaggerAutogen from "swagger-autogen";

const doc = {
    info : {
        version : "v0.0.1",
        title : "Dokumentasi API ACARA",
        descriptiom : "Dokumentasi API ACARA"
    } ,
    servers :  [
        {
            url : "http://localhost:3000/api",
            description : "Local Server"
        },
        {
            url : "https://back-end-acara-tawny-sigma.vercel.app/",
            description : "Deploy Derver"
        }
    ],
    components : {
        securitySchemes : {
            bearerAuth:{
                type : "http",
                scheme : "bearer",
            },
        },
    },

    schemas : {
        LoginRequest :{
            identifier : "aldp@gmail.com",
            password : " 12345678"
        }
    }
    

}
const outputFile = "./swagger_output.json"
const endpointFiles = ["../routes/api.ts"]

swaggerAutogen({
    openapi : "3.0.0",
})(outputFile , endpointFiles ,doc)