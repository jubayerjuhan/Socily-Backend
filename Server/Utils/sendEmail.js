import Mailjet from "node-mailjet";

const mailjet = new Mailjet({
  apiKey: process.env.MJ_APIKEY_PUBLIC,
  apiSecret: process.env.MJ_APIKEY_PRIVATE,
});

export const sendEmail = (name, email, otp) => {
  const request = mailjet.post("send", { version: "v3.1" }).request({
    Messages: [
      {
        From: {
          Email: "davidjuhan23@gmail.com",
          Name: "Socily",
        },
        To: [
          {
            Email: email,
            Name: name,
          },
        ],
        TemplateID: 4139752,
        TemplateLanguage: true,
        Subject: "Socily Email Verification",
        Variables: {
          otpcode: otp,
        },
      },
    ],
  });

  request
    .then((result) => {
      console.log(result.body);
    })
    .catch((err) => {
      console.log(err.statusCode);
    });
};
