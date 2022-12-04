// // import { Fido2Lib } from "fido2-lib";
// import { z } from "zod";
// import { t } from ".";

// // const getFido = (env: Bindings) => {
// //   return new Fido2Lib({
// //     timeout: 42,
// //     rpId: env.WEBAUTHN_RP_ID,
// //     rpName: "Guzzler",
// //     rpIcon:
// //       "https://emojipedia-us.s3.dualstack.us-west-1.amazonaws.com/thumbs/240/apple/325/saluting-face_1fae1.png",
// //     // challengeSize: 128,
// //     // attestation: "none",
// //     // cryptoParams: [-7, -257],
// //     // authenticatorAttachment: "platform",
// //     // authenticatorRequireResidentKey: false,
// //     // authenticatorUserVerification: "required",
// //   });
// // };

// const authRouter = t.router({
//   //   getRegistrationChallenge: t.procedure.mutation(async ({ ctx }) => {
//   //     const fido = getFido(ctx.env);
//   //     const options = await fido.assertionOptions();
//   //     console.log(options);
//   //     return options;
//   //   }),
// });

// export default authRouter;
