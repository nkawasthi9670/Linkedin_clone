import { mailtrapClient, sender } from "../lib/mailtrap.js";
import { createCommentNotificationEmailTemplate, createConnectionAcceptedEmailTemplate, createWelcomeEmailTemplate } from "./emailTemplates.js";

export const sendWelcomeEmail = async (email, name, profileUrl) => {
    const recipient = [{ email }]

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to LinkedIn Clone",
            html: createWelcomeEmailTemplate(name, profileUrl),
            category: "welcome"
        })

        console.log("Welcome email sent successfully", response);
    } catch (error) {
        throw error;
    }
}

export const sendCommentNotificationEmail = async (recipientEmail,
    recipientName,
    commenterName,
    postUrl,
    commentContent) => {
        const recipient=[{email:recipientEmail}];
        try {
            const response=await mailtrapClient.send({
                from:sender,
                to:recipient,
                subject:"New comment on your post",
                html:createCommentNotificationEmailTemplate(recipientName,commenterName,
                    postUrl,commentContent
                ),
                category:"comment_notification"
            })
            console.log("Comment notification Email sent successfully",response );
        } catch (error) {
            throw error;
        }
}

export const sendConnectionAcceptedEmail=async(senderName,senderEmail,recipientName,profileUrl)=>{
    const recipient=[{email:senderEmail}];
    try {
        const response=await mailtrapClient.send({
            from:sender,
            to:recipient,
            subject:`${recipientName} accepted your connection request`,
            html:createConnectionAcceptedEmailTemplate(senderName,recipientName,profileUrl),
            category:"connection_accepted",
        })
    } catch (error) {
        
    }
}
