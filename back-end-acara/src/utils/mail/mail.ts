import nodemailer from "nodemailer"
import {
    EMAIL_SMTP_SERVICE_NAME,
    EMAIL_SMTP_HOST,
    EMAIL_SMTP_PORT,
    EMAIL_SMTP_SECURE,
    EMAIL_SMTP_USER,
    EMAIL_SMTP_PASS,
} from "../env"

const tranporter = nodemailer.createTransport({
    service  : EMAIL_SMTP_SERVICE_NAME,
    host : EMAIL_SMTP_HOST,
    port : EMAIL_SMTP_PORT,
    secure : EMAIL_SMTP_SECURE,
    auth :{
        user : EMAIL_SMTP_USER,
        pass : EMAIL_SMTP_PASS
    },
    requireTLS :true 

})