// import React from 'react';

// export default function ContactSection() {
//   return (
//     <div className="py-20 px-12">
//       <div className="container mx-auto px-4">
//         <h2 className="text-3xl font-bold text-center mb-8">CONTACT</h2>
//         <div className="border-b-4 border-yellow-500 w-24 mx-auto mb-12"></div>

//         <div className="flex flex-wrap -mx-4">
//           {/* Google Map */}
//           <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
//             <div className="aspect-w-16 aspect-h-9">
//               <iframe
//                 src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.090985132192!2d-122.41990768467772!3d37.77927677975651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581536c8a0ff9%3A0x20e285b8dd55000a!2sCivic%20Center%2C%20San%20Francisco%2C%20CA%2094102%2C%20USA!5e0!3m2!1sen!2sin!4v1636845223739!5m2!1sen!2sin"
//                 width="750"
//                 height="450"
//                 style={{ border: 0 }}
//                 allowFullScreen=""
//                 loading="lazy"
//                 title="Map"
//               ></iframe>
//             </div>
//           </div>

//           {/* Contact Form */}
//           <div className="w-full lg:w-1/3 px-4">
//             <div className="mb-8">
//               <h3 className="text-lg font-bold mb-4">Inquiries</h3>
//               <p className="mb-4">For any inquiries, questions or commendations, please call: 123-456-7890 or fill out the following form</p>
//             </div>

//             <form>
//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">First Name*</label>
//                 <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" required />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Last Name*</label>
//                 <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" required />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Email*</label>
//                 <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded" required />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Subject</label>
//                 <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
//               </div>

//               <div className="mb-4">
//                 <label className="block text-sm font-medium mb-1">Message</label>
//                 <textarea className="w-full px-3 py-2 border border-gray-300 rounded h-32"></textarea>
//               </div>

//               <div>
//                 <button type="submit" className="px-6 py-2 bg-yellow-600 text-white font-bold rounded">
//                   Submit
//                 </button>
//               </div>
//             </form>
//           </div>

//           {/* Contact Info */}
//           <div className="w-full lg:w-1/3 px-4 lg:pl-12">
//             <h3 className="text-lg font-bold mb-4">Head Office</h3>
//             <p>500 Terry Francine Street</p>
//             <p>San Francisco, CA 94158</p>
//             <p className="mb-4">info@mysite.com</p>
//             <p>Tel: 123-456-7890</p>
//             <p>Fax: 123-456-7890</p>

//             <h3 className="text-lg font-bold mb-4 mt-8">Employment</h3>
//             <p>To apply for a job with Sphere Constructions, please send a cover letter together with your C.V. to: info@mysite.com</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React from 'react';

export default function ContactSection() {
  return (
    <div className="py-20 px-12">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">CONTACT</h2>
        <div className="border-b-4 border-yellow-500 w-24 mx-auto mb-12"></div>

        <div className="flex flex-wrap -mx-4">
          {/* Google Map */}
          <div className="w-full lg:w-2/3 px-4 mb-8 lg:mb-0">
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.090985132192!2d-122.41990768467772!3d37.77927677975651!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x808581536c8a0ff9%3A0x20e285b8dd55000a!2sCivic%20Center%2C%20San%20Francisco%2C%20CA%2094102%2C%20USA!5e0!3m2!1sen!2sin!4v1636845223739!5m2!1sen!2sin"
                width="750"
                height="450"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title="Map"
              ></iframe>
            </div>
          </div>

          {/* Contact Form */}
          <div className="w-full lg:w-1/3 px-4">
            <div className="mb-8">
              <h3 className="text-lg font-bold mb-4">Inquiries</h3>
              <p className="mb-4">For any inquiries, questions or commendations, please call: 123-456-7890 or fill out the following form</p>
            </div>

            <form>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">First Name*</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Last Name*</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Email*</label>
                <input type="email" className="w-full px-3 py-2 border border-gray-300 rounded" required />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Subject</label>
                <input type="text" className="w-full px-3 py-2 border border-gray-300 rounded" />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Message</label>
                <textarea className="w-full px-3 py-2 border border-gray-300 rounded h-32"></textarea>
              </div>

              <div>
                <button type="submit" className="px-6 py-2 bg-yellow-600 text-white font-bold rounded">
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Contact Info */}
          <div className="w-full lg:w-1/3 px-4 lg:pl-12">
            <h3 className="text-lg font-bold mb-4">Head Office</h3>
            <p>500 Terry Francine Street</p>
            <p>San Francisco, CA 94158</p>
            <p className="mb-4">info@mysite.com</p>
            <p>Tel: 123-456-7890</p>
            <p>Fax: 123-456-7890</p>

            <h3 className="text-lg font-bold mb-4 mt-8">Employment</h3>
            <p>To apply for a job with Sphere Constructions, please send a cover letter together with your C.V. to: info@mysite.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}
