const { sendGridApiKey, emailAdressForSending } = require('../config/constants');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(sendGridApiKey);


/**
 * function takes care of sending
 * @param receiver
 * @param sender
 * @param resetLink
 * @returns {Promise<boolean>}
 */
const forgottenPasswordSend = async (receiver, resetLink) => {
    try {
        const res = await sgMail.send({
            to: receiver,
            from: emailAdressForSending,
            subject: 'Budget app - forgotten password',
            html: `<h1> your link for password reset: </h1> <br/> ${resetLink}</a> `
        });

        if (res[0].statusCode !== 202) {
            return false;
        }

        return true;

    } catch (e) {
        return false;
    }
}

module.exports = {  forgottenPasswordSend };


