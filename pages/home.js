// import Keyfeatures from "./../components/home/key_features"
// import Link from 'next/link';
// import { useEffect, useState } from 'react';
// import ContactSection from "@/components/home/contact";

// export default function Home() {
//   const [textIndex, setTextIndex] = useState(0);
//   const sentence = "Revolutionizing Call Centers, with Conversational AI";
//   const paragraph = "AI-driven phone agents capable of understanding and responding to customer inquiries, similar to your traditional Call Center.";
//   const [displayText, setDisplayText] = useState("");
//   const [displayParagraph, setDisplayParagraph] = useState("");
//   const [navbarScrolled, setNavbarScrolled] = useState(false);

//   useEffect(() => {
//     const intervalId = setInterval(() => {
//       setDisplayText((prevText) => {
//         const words = sentence.split(" ");
//         const nextWord = words[textIndex];
//         if (nextWord) {
//           return prevText + " " + nextWord;
//         }
//         return prevText;
//       });
//       setTextIndex((prevIndex) => prevIndex + 1);
//     }, 300);

//     return () => clearInterval(intervalId);
//   }, [textIndex]);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 50) {
//         setNavbarScrolled(true);
//       } else {
//         setNavbarScrolled(false);
//       }
//     };

//     window.addEventListener('scroll', handleScroll);

//     return () => {
//       window.removeEventListener('scroll', handleScroll);
//     };
//   }, []);

//   return (
//     <div>
//       <nav
//         className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
//           navbarScrolled ? 'bg-white shadow-md' : 'bg-transparent'
//         } py-2 px-8`}
//       >
//         <div className="flex justify-between items-center mt-2 mb-2">
//           <div className="flex items-center">
//             <img src="/logo.png" alt="Agency Logo" className="h-8 w-8 mr-4" />
//             <h1 className="text-xl font-bold text-black"> SamparkAI</h1>
//           </div>
//           <ul className="flex space-x-8 text-black font-semibold">
//             <li>
//               <Link href="#home" className="hover:text-blue-500">Home</Link>
//             </li>
//             <li>
//               <Link href="#about" className="hover:text-blue-500">About Us</Link>
//             </li>
//             <li>
//               <Link href="#features" className="hover:text-blue-500">Features</Link>
//             </li>
//             <li>
//               <Link href="#pricing" className="hover:text-blue-500">Pricing</Link>
//             </li>
//             <li>
//               <Link href="#support" className="hover:text-blue-500">Support</Link>
//             </li>
//           </ul>
//           <div>
//             <Link href="/login">
//               <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
//                 Login
//               </button>
//             </Link>
//           </div>
//         </div>
//       </nav>

// <section id="home" className="relative hero bg-white h-screen flex items-center justify-center overflow-hidden">
//   <div className="absolute inset-0 z-0">
//     <video
//       autoPlay
//       muted
//       loop
//       playsInline
//       className="absolute top-0 left-0 w-full h-full object-cover"
//     >
//       <source src="assets\6153453-uhd_4096_2160_25fps.mp4" type="video/mp4" />
//       Your browser does not support the video tag.
//     </video>
//   </div>

//   <div className="text-center relative z-10">
//     <h1 className="text-5xl font-bold text-black transition-opacity duration-500 ease-in-out">
//       {displayText.trim()}
//     </h1>
//     <p className="mt-2 text-lg text-black transition-opacity duration-500 ease-in-out">
//       {displayParagraph.trim()}
//     </p>
//     <Link href="/login">
//       <button className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
//         Get Started
//       </button>
//     </Link>
//   </div>
// </section>

// <section id="about" className="about bg-white p-14 my-10 rounded-2xl mx-auto">
//   <div className="container mx-auto flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-10">
//     <div className="lg:w-1/2 w-full lg:pr-10">
//       <h2 className="text-4xl font-bold text-black mb-4">Brilliant solution for every industry.</h2>
//       <p className="text-lg text-gray-700 mb-4">
//         Enhance customer service across industries with an AI-powered ***REMOVED*** that delivers instant support and resolution. From resolving inquiries to escalating issues, our solution reduces response times, improves efficiency, and ensures consistent service quality. Send or receive millions of phone calls per day, using programmable voice agents that sound and feel human.
//       </p>
//       <p className="text-lg text-gray-700 mb-6">
//         Gain valuable insights into user behavior and engagement with our comprehensive analytics dashboard. Optimize operations with an AI ***REMOVED*** that facilitates communication and collaboration across the manufacturing and logistics supply chain. From tracking shipments to managing inventory, our solution improves efficiency, reduces errors, and enhances productivity.
//       </p>
//       <a href="#" className="inline-block bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-900">Know More</a>
//     </div>
//     <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
//       <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-100">
//         <img 
//           src="/assets/about-image-01.jpg" 
//           alt="About Us" 
//           className="w-full h-full object-cover"
//         />
//       </div>
//       <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
//         <img 
//           src="/assets/about-image-02.jpg" 
//           alt="About Us" 
//           className="w-full h-full object-cover"
//         />
//       </div>
//     </div>
//   </div>
// </section>

// <section id="services" className="services-section bg-white py-20 px-12">
//   <div className="container mx-auto">
//     <h2 className="text-center font-bold text-4xl mb-6 text-blue-600">Services</h2>
//     <p className="text-center text-gray-600 mb-12">
//       Serving sectors including real estate, healthcare, logistics, financial services, alternative data, small business, and prospecting.
//     </p>
//     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
//       <div className="service-box bg-white p-6 rounded-lg">
//         <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
//           <i className="fas fa-phone text-3xl"></i>
//         </div>
//         <h3 className="font-bold text-lg text-gray-900 mb-2">Cold Calls & Surveys</h3>
//         <p className="text-gray-600 mb-4">
//           Qualify and collect data from small businesses, consumers, and everyone in between.
//         </p>
//         <a href="#" className="text-blue-500 font-medium">Learn More</a>
//       </div>

//       <div className="service-box bg-white p-6 rounded-lg">
//         <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
//           <i className="fas fa-arrow-up text-3xl"></i>
//         </div>
//         <h3 className="font-bold text-lg text-gray-900 mb-2">Inbound Sales</h3>
//         <p className="text-gray-600 mb-4">
//           Call website visitors immediately after form submission and live transfer to a salesperson.
//         </p>
//         <a href="#" className="text-blue-500 font-medium">Learn More</a>
//       </div>

//       <div className="service-box bg-white p-6 rounded-lg">
//         <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
//           <i className="fas fa-headset text-3xl"></i>
//         </div>
//         <h3 className="font-bold text-lg text-gray-900 mb-2">Customer Support</h3>
//         <p className="text-gray-600 mb-4">
//           Offer 24/7 support to answer customers’ questions and collect their contact info.
//         </p>
//         <a href="#" className="text-blue-500 font-medium">Learn More</a>
//       </div>

//       <div className="service-box bg-white p-6 rounded-lg">
//         <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
//           <i className="fas fa-chart-line text-3xl"></i>
//         </div>
//         <h3 className="font-bold text-lg text-gray-900 mb-2">Service</h3>
//         <p className="text-gray-600 mb-4">
//           Track key metrics, analyze patterns, and optimize ***REMOVED***'s performance for business growth.
//         </p>
//         <a href="#" className="text-blue-500 font-medium">Learn More</a>
//       </div>
//     </div>
//   </div>
// </section>

// <section id="features">
//   <Keyfeatures />
// </section>

// <div>
//   <ContactSection />
// </div>

// <style jsx>{`
//   .services-section {
//     background: url('') no-repeat center center fixed;
//     background-size: cover;
//   }
//   .about-section {
//     background: url('/assets/images/about-bg.jpg') no-repeat center center fixed;
//     background-size: cover;
//   }
//   .features-section {
//     background: url('/assets/images/features-bg.jpg') no-repeat center center fixed;
//     background-size: cover;
//   }
// `}</style>

// <footer className="bg-gray-800 p-4 text-center text-white">
//   <p>© 2024 Sampark AI. All Rights Reserved.</p>
// </footer>
//     </div>
//   );
// }



import Keyfeatures from "./../components/home/key_features"
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ContactSection from "@/components/home/contact";

export default function Home() {
  const [textIndex, setTextIndex] = useState(0);
  const sentence = "Revolutionizing Call Centers, with Conversational AI";
  const paragraph = "AI-driven phone agents capable of understanding and responding to customer inquiries, similar to your traditional Call Center.";
  const [displayText, setDisplayText] = useState("");
  const [displayParagraph, setDisplayParagraph] = useState("");
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setDisplayText((prevText) => {
        const words = sentence.split(" ");
        const nextWord = words[textIndex];
        if (nextWord) {
          return prevText + " " + nextWord;
        }
        return prevText;
      });
      setTextIndex((prevIndex) => prevIndex + 1);
    }, 300);

    return () => clearInterval(intervalId);
  }, [textIndex]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setNavbarScrolled(true);
      } else {
        setNavbarScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div>
      <nav
        className={`fixed top-0 left-0 right-0 z-10 transition-all duration-300 ${
          navbarScrolled ? 'bg-white shadow-md' : 'bg-transparent'
        } py-2 px-8`}
      >
        <div className="flex justify-between items-center mt-2 mb-2">
          <div className="flex items-center">
            <img src="/logo.png" alt="Agency Logo" className="h-8 w-8 mr-4" />
            <h1 className="text-xl font-bold text-black"> SamparkAI</h1>
          </div>
          <ul className="flex space-x-8 text-black font-semibold">
            <li>
              <Link href="#home" className="hover:text-blue-500">Home</Link>
            </li>
            <li>
              <Link href="#about" className="hover:text-blue-500">About Us</Link>
            </li>
            <li>
              <Link href="#features" className="hover:text-blue-500">Features</Link>
            </li>
            <li>
              <Link href="#pricing" className="hover:text-blue-500">Pricing</Link>
            </li>
            <li>
              <Link href="#support" className="hover:text-blue-500">Support</Link>
            </li>
          </ul>
          {/* <div>
            <Link href="/login">
              <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                Login
              </button>
            </Link>
          </div> */}
        </div>
      </nav>

<section id="home" className="relative hero bg-white h-screen flex items-center justify-center overflow-hidden">
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    >
      {/* <source src="assets\6153453-uhd_4096_2160_25fps.mp4" type="video/mp4" /> */}
      <source src="assets\6153453-uhd_4096_2160_25fps.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  <div className="text-center relative z-10">
    <h1 className="text-5xl font-bold text-black transition-opacity duration-500 ease-in-out">
      {displayText.trim()}
    </h1>
    <p className="mt-2 text-lg text-black transition-opacity duration-500 ease-in-out">
      {displayParagraph.trim()}
    </p>
    <Link href="/register">
      <button className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
        Get Started
      </button>
    </Link>
  </div>
</section>

<section id="about" className="about bg-white p-14 my-10 rounded-2xl mx-auto">
  <div className="container mx-auto flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-10">
    <div className="lg:w-1/2 w-full lg:pr-10">
      <h2 className="text-4xl font-bold text-black mb-4">Brilliant solution for every industry.</h2>
      <p className="text-lg text-gray-700 mb-4">
        Enhance customer service across industries with an AI-powered ***REMOVED*** that delivers instant support and resolution. From resolving inquiries to escalating issues, our solution reduces response times, improves efficiency, and ensures consistent service quality. Send or receive millions of phone calls per day, using programmable voice agents that sound and feel human.
      </p>
      <p className="text-lg text-gray-700 mb-6">
        Gain valuable insights into user behavior and engagement with our comprehensive analytics dashboard. Optimize operations with an AI ***REMOVED*** that facilitates communication and collaboration across the manufacturing and logistics supply chain. From tracking shipments to managing inventory, our solution improves efficiency, reduces errors, and enhances productivity.
      </p>
      <a href="#" className="inline-block bg-blue-800 text-white py-3 px-6 rounded-md hover:bg-blue-900">Know More</a>
    </div>
    <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
      <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-100">
        <img 
          src="/assets/about-image-01.jpg" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="rounded-lg overflow-hidden transform transition-transform duration-300 hover:scale-105">
        <img 
          src="/assets/about-image-02.jpg" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  </div>
</section>

<section id="services" className="services-section bg-white py-20 px-12">
  <div className="container mx-auto">
    <h2 className="text-center font-bold text-4xl mb-6 text-blue-600">Services</h2>
    <p className="text-center text-gray-600 mb-12">
      Serving sectors including real estate, healthcare, logistics, financial services, alternative data, small business, and prospecting.
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      <div className="service-box bg-white p-6 rounded-lg">
        <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
          <i className="fas fa-phone text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Cold Calls & Surveys</h3>
        <p className="text-gray-600 mb-4">
          Qualify and collect data from small businesses, consumers, and everyone in between.
        </p>
        <a href="#" className="text-blue-500 font-medium">Learn More</a>
      </div>

      <div className="service-box bg-white p-6 rounded-lg">
        <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
          <i className="fas fa-arrow-up text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Inbound Sales</h3>
        <p className="text-gray-600 mb-4">
          Call website visitors immediately after form submission and live transfer to a salesperson.
        </p>
        <a href="#" className="text-blue-500 font-medium">Learn More</a>
      </div>

      <div className="service-box bg-white p-6 rounded-lg">
        <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
          <i className="fas fa-headset text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Customer Support</h3>
        <p className="text-gray-600 mb-4">
          Offer 24/7 support to answer customers’ questions and collect their contact info.
        </p>
        <a href="#" className="text-blue-500 font-medium">Learn More</a>
      </div>

      <div className="service-box bg-white p-6 rounded-lg">
        <div className="icon bg-blue-100 text-blue-500 p-4 rounded-full inline-block mb-4">
          <i className="fas fa-chart-line text-3xl"></i>
        </div>
        <h3 className="font-bold text-lg text-gray-900 mb-2">Service</h3>
        <p className="text-gray-600 mb-4">
          Track key metrics, analyze patterns, and optimize ***REMOVED***'s performance for business growth.
        </p>
        <a href="#" className="text-blue-500 font-medium">Learn More</a>
      </div>
    </div>
  </div>
</section>

<section id="features">
  <Keyfeatures />
</section>

<div>
  <ContactSection />
</div>

<style jsx>{`
  .services-section {
    background: url('') no-repeat center center fixed;
    background-size: cover;
  }
  .about-section {
    background: url('/assets/images/about-bg.jpg') no-repeat center center fixed;
    background-size: cover;
  }
  .features-section {
    background: url('/assets/images/features-bg.jpg') no-repeat center center fixed;
    background-size: cover;
  }
`}</style>

<footer className="bg-gray-800 p-4 text-center text-white">
  <p>© 2024 Sampark AI. All Rights Reserved.</p>
</footer>
    </div>
  );
}




