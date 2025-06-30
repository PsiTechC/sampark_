
// import React from 'react';

// export default function KeyFeatures() {
//   return (
//     <div className="container mx-auto py-20 px-24 mb-12"> {/* Increased px from 12 to 24 for more space on the sides */}
//       <div className="-mx-4 flex flex-wrap">
//         <div className="w-full px-4">
//           <div className="mx-auto mb-[60px] max-w-[600px] text-center">
//             <span className="mb-2 block text-lg font-semibold text-primary">
//               Features
//             </span>
//             <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]">
//               Key Features
//             </h2>
//             <p className="mx-auto max-w-[600px] text-base text-body-color dark:text-dark-6">
//               Phone calling features using programming voice agents involve leveraging voice recognition and <br />synthesis technologies to enable communication between users and a system through spoken language.
//             </p>
//           </div>
//         </div>
//       </div>
//       <div className="-mx-4 flex flex-wrap">
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-700 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Voice_Recognition.png" alt="Voice Recognition" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Voice Recognition
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Speech-to-Text Conversion-</b> Convert spoken words into text to understand user input.<br />
//                 <b>Keyword Spotting-</b> Identify specific keywords or phrases to trigger certain actions or responses.
//               </p>
//             </div>
//           </div>
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Natural_Language.png" alt="Natural Language Understanding" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Natural Language Understanding (NLU)
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Intent Recognition-</b> Determine the user's intention or request from their spoken input.<br />
//                 <b>Entity Recognition-</b> Extract relevant information (entities) from user utterances, such as names, dates, and locations.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Dialogue_Management.png" alt="Dialogue Management" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Dialogue Management
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Context Handling-</b> Maintain context across the conversation to provide more coherent and relevant responses.<br />
//                 <b>Multi-turn Conversations-</b> Support complex interactions involving multiple turns in the conversation.
//               </p>
//             </div>
//           </div>
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Voice_Synthesis.png" alt="Voice Synthesis" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Voice Synthesis
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Text-to-Speech Conversion-</b> Transform system responses or prompts into spoken language for the user.<br />
//                 <b>Emotion and Tone-</b> Adjust the tone and emotional expression of the synthesized voice for a more natural conversation.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Interactive_Prompts.png" alt="Interactive Prompts and Responses" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Interactive Prompts and Responses
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Ask Questions-</b> Pose questions to the user and wait for responses.<br />
//                 <b>Provide Information-</b> Share information with the user through spoken language.
//               </p>
//             </div>
//           </div>
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/User_Authentication.png" alt="User Authentication and Verification" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 User Authentication and Verification
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Voice Biometrics-</b> Use voiceprints for user authentication and verification.<br />
//                 <b>PIN or Passphrase Verification-</b> Implement additional security measures through spoken passwords or phrases.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Error_Handling.png" alt="Error Handling" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Error Handling and Recovery
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Misinterpretation Handling-</b> Detect and address misunderstandings in user input.<br />
//                 <b>Fallback Mechanisms-</b> Provide alternative responses or prompts in case of errors or uncertainties.
//               </p>
//             </div>
//           </div>
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/User_Feedback.png" alt="User Feedback" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 User Feedback and Confirmation
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Confirmation Requests-</b> Seek user confirmation for critical actions or information.<br />
//                 <b>Feedback Handling-</b> Process and adapt to user feedback during the conversation.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Integration.png" alt="Integration with External Systems" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Integration with External Systems
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>API Calls-</b> Integrate with external databases or services to fetch or update information during the call.<br />
//                 <b>Third-party Service Integration-</b> Incorporate external services like weather updates, news, or location-based services.
//               </p>
//             </div>
//           </div>
//         </div>
//         <div className="w-full px-4 lg:w-1/2">
//           <div className="mb-12 flex lg:mb-[70px]">
//             <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-500 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
//               <img width="32" height="32" src="/assets/features/Privacy.png" alt="Privacy and Security" />
//             </div>
//             <div className="w-full">
//               <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
//                 Privacy and Security
//               </h3>
//               <p className="text-base text-body-color dark:text-dark-6">
//                 <b>Data Encryption-</b> Ensure secure communication and storage of sensitive information.<br />
//                 <b>User Consent-</b> Implement mechanisms to obtain user consent for data usage and storage.
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React from 'react';

export default function KeyFeatures() {
  return (
    <div className="container mx-auto py-20 px-24 mb-12">
      <div className="-mx-4 flex flex-wrap">
        <div className="w-full px-4">
          <div className="mx-auto mb-[60px] max-w-[600px] text-center">
            <span className="mb-2 block text-lg font-semibold text-primary">
              Features
            </span>
            <h2 className="mb-3 text-3xl font-bold leading-[1.2] text-dark dark:text-white sm:text-4xl md:text-[40px]">
              Key Features
            </h2>
            <p className="mx-auto max-w-[600px] text-base text-body-color dark:text-dark-6">
              Phone calling features using programming voice agents involve leveraging voice recognition and <br />synthesis technologies to enable communication between users and a system through spoken language.
            </p>
          </div>
        </div>
      </div>
      <div className="-mx-4 flex flex-wrap">
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Voice_Recognition.png" alt="Voice Recognition" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Voice Recognition
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Speech-to-Text Conversion-</b> Convert spoken words into text to understand user input.<br />
                <b>Keyword Spotting-</b> Identify specific keywords or phrases to trigger certain actions or responses.
              </p>
            </div>
          </div>
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Natural_Language.png" alt="Natural Language Understanding" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Natural Language Understanding (NLU)
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Intent Recognition-</b> Determine the user's intention or request from their spoken input.<br />
                <b>Entity Recognition-</b> Extract relevant information (entities) from user utterances, such as names, dates, and locations.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Dialogue_Management.png" alt="Dialogue Management" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Dialogue Management
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Context Handling-</b> Maintain context across the conversation to provide more coherent and relevant responses.<br />
                <b>Multi-turn Conversations-</b> Support complex interactions involving multiple turns in the conversation.
              </p>
            </div>
          </div>
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Voice_Synthesis.png" alt="Voice Synthesis" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Voice Synthesis
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Text-to-Speech Conversion-</b> Transform system responses or prompts into spoken language for the user.<br />
                <b>Emotion and Tone-</b> Adjust the tone and emotional expression of the synthesized voice for a more natural conversation.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Interactive_Prompts.png" alt="Interactive Prompts and Responses" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Interactive Prompts and Responses
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Ask Questions-</b> Pose questions to the user and wait for responses.<br />
                <b>Provide Information-</b> Share information with the user through spoken language.
              </p>
            </div>
          </div>
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/User_Authentication.png" alt="User Authentication and Verification" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                User Authentication and Verification
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Voice Biometrics-</b> Use voiceprints for user authentication and verification.<br />
                <b>PIN or Passphrase Verification-</b> Implement additional security measures through spoken passwords or phrases.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Error_Handling.png" alt="Error Handling" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Error Handling and Recovery
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Misinterpretation Handling-</b> Detect and address misunderstandings in user input.<br />
                <b>Fallback Mechanisms-</b> Provide alternative responses or prompts in case of errors or uncertainties.
              </p>
            </div>
          </div>
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/User_Feedback.png" alt="User Feedback" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                User Feedback and Confirmation
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Confirmation Requests-</b> Seek user confirmation for critical actions or information.<br />
                <b>Feedback Handling-</b> Process and adapt to user feedback during the conversation.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Integration.png" alt="Integration with External Systems" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Integration with External Systems
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>API Calls-</b> Integrate with external databases or services to fetch or update information during the call.<br />
                <b>Third-party Service Integration-</b> Incorporate external services like weather updates, news, or location-based services.
              </p>
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/2">
          <div className="mb-12 flex lg:mb-[70px]">
            <div className="mr-4 flex h-[50px] w-full max-w-[50px] items-center justify-center rounded-xl bg-blue-800 text-white sm:mr-6 sm:h-[60px] sm:max-w-[60px]">
              <img width="32" height="32" src="/assets/features/Privacy.png" alt="Privacy and Security" />
            </div>
            <div className="w-full">
              <h3 className="mb-6 text-xl font-semibold text-dark dark:text-white sm:text-2xl lg:text-xl xl:text-2xl">
                Privacy and Security
              </h3>
              <p className="text-base text-body-color dark:text-dark-6">
                <b>Data Encryption-</b> Ensure secure communication and storage of sensitive information.<br />
                <b>User Consent-</b> Implement mechanisms to obtain user consent for data usage and storage.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
