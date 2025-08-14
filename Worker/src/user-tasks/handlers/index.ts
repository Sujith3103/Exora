import { sendLoginAlert } from "../../utils/nodemailer";

export async function handleOnLogin(jobData: any) {
    console.log('Handling login job with data:', jobData);
}

export const handleLoginAlert = async (jobData: any) => {

    const {email} = jobData
    await sendLoginAlert(email)
        .then(() => console.log("sent mail"))
        .catch((err) => console.error("mail not sent", err))

    // sendLoginAlert()

}
