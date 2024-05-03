import nodemailer from "nodemailer"
import { ApiError } from "./apiError.js";

export const sendMail = (email, subject, body, attachment) => {
    try{
            let transporter = nodemailer.createTransport({
                service : "gmail",
                port : 465,
                secure : true,
                auth:{
                    user: "bookshow1801@gmail.com",
                    pass: "kuevdkubzqrzoajb",
                }
            })
            
            const mailOptions = {
                from: "bookshow1801@gmail.com",
                to: `${email}`,
                subject: `${subject}`,
                text : `${body}`,
                attachments : [{
                    filename : "tickets.pdf",
                    content : attachment
                }]
              };

            transporter.sendMail(mailOptions, (error, info)=>{
                if(error){
                    throw new ApiError(500, error.message)
                }
                console.log(info);
            })
            
    }
    catch(error) {
        console.log(error.message);
    }
}