


import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function Home() {
  const [textIndex, setTextIndex] = useState(0);
  const sentence = "Revolutionizing Call Centers, with Conversational AI";
  const paragraph = "AI-driven phone agents capable of understanding and responding to customer inquiries, similar to your traditional Call Center.";
  const [displayText, setDisplayText] = useState("");
  const [displayParagraph, setDisplayParagraph] = useState("");
  const [navbarScrolled, setNavbarScrolled] = useState(false);

  useEffect(() => {
    // Word-by-word smooth animation for heading
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
    }, 300); // Adjust the delay (300ms) for smoother transitions

    return () => clearInterval(intervalId);
  }, [textIndex]);

  // Navbar scroll effect
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
      {/* Sticky Navbar */}
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
          <ul className="flex space-x-8 text-white font-semibold">
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
          <div>
            <Link href="/login">
              <button className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-700">
                Login
              </button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section with Parallax and Word-by-Word Animation */}
      {/* <section id="home" className="relative hero bg-white h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-black transition-opacity duration-500 ease-in-out">
            {displayText.trim()}
          </h1>
          <p className="mt-2 text-lg text-black transition-opacity duration-500 ease-in-out">
            {displayParagraph.trim()}
          </p>
          <Link href="/login">
            <button className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
              Get Started
            </button>
          </Link>
        </div>
      </section> */}


      {/* Hero Section with Parallax and Word-by-Word Animation */}
{/* <section id="home" className="relative hero bg-white h-screen flex items-center justify-center overflow-hidden">

  <div className="absolute inset-0 z-[-1]">
  <video
  autoPlay
  muted
  loop
  playsInline
  className="absolute top-0 left-0 w-full h-full object-cover z-[-1]"
>
  <source src="/assets/854325-hd_1280_720_25fps.mp4" type="video/mp4" />
  Your browser does not support the video tag.
</video>

  </div>

  
  <div className="text-center z-10">
    <h1 className="text-5xl font-bold text-black transition-opacity duration-500 ease-in-out">
      {displayText.trim()} 
    </h1>
    <p className="mt-2 text-lg text-black transition-opacity duration-500 ease-in-out">
      {displayParagraph.trim()}
    </p>
    <Link href="/login">
      <button className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
        Get Started
      </button>
    </Link>
  </div>
</section> */}



<section id="home" className="relative hero bg-white h-screen flex items-center justify-center overflow-hidden">
  {/* Background Video */}
  <div className="absolute inset-0 z-0">
    <video
      autoPlay
      muted
      loop
      playsInline
      className="absolute top-0 left-0 w-full h-full object-cover"
    >
      {/* <source src="assets\2325093-hd_1920_1080_25fps.mp4" type="video/mp4" /> */}
      <source src="assets\4984216-uhd_3840_2160_30fps.mp4" type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  </div>

  {/* Text Content */}
  <div className="text-center relative z-10"> {/* Keep this as z-10 to make sure it's above the video */}
    <h1 className="text-5xl font-bold text-white transition-opacity duration-500 ease-in-out">
      {displayText.trim()}
    </h1>
    <p className="mt-2 text-lg text-black transition-opacity duration-500 ease-in-out">
      {displayParagraph.trim()}
    </p>
    <Link href="/login">
      <button className="mt-8 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800">
        Get Started
      </button>
    </Link>
  </div>
</section>





      <section id="about" className="about bg-white p-14 my-10 rounded-2xl mx-auto">
  <div className="container mx-auto flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-10">
    
    {/* Text Section */}
    <div className="lg:w-1/2 w-full lg:pr-10">
      <h2 className="text-4xl font-bold text-black mb-4">Brilliant solution for every industry.</h2>
      <p className="text-lg text-gray-700 mb-4">
        Enhance customer service across industries with an AI-powered ***REMOVED*** that delivers instant support and resolution. From resolving inquiries to escalating issues, our solution reduces response times, improves efficiency, and ensures consistent service quality. Send or receive millions of phone calls per day, using programmable voice agents that sound and feel human.
      </p>
      <p className="text-lg text-gray-700 mb-6">
        Gain valuable insights into user behavior and engagement with our comprehensive analytics dashboard. Optimize operations with an AI ***REMOVED*** that facilitates communication and collaboration across the manufacturing and logistics supply chain. From tracking shipments to managing inventory, our solution improves efficiency, reduces errors, and enhances productivity.
      </p>
      <a href="#" className="inline-block bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600">Know More</a>
    </div>
    
    {/* Image Section */}
    <div className="lg:w-1/2 w-full grid grid-cols-2 gap-4">
      <div className="rounded-lg overflow-hidden">
        <img 
          src="/assets/about-image-01.jpg" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="rounded-lg overflow-hidden">
        <img 
          src="/assets/about-image-02.jpg" 
          alt="About Us" 
          className="w-full h-full object-cover"
        />
      </div>
      {/* <div className="rounded-lg bg-blue-500 text-white flex flex-col justify-center items-center p-8">
        <h3 className="text-4xl font-bold">09</h3>
        <p className="text-lg">We have</p>
        <p className="text-lg">Years of experience</p>
      </div> */}
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
      
      {/* Service 1 */}
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

      {/* Service 2 */}
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

      {/* Service 3 */}
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

      {/* Service 4 */}
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



{/* <section id="about-solution" className="about-section bg-white py-20">
  <div className="container flex flex-wrap items-center">
    <div className="w-full lg:w-1/2">
      <h2 className="text-4xl font-bold mb-6">Brilliant solution for every industry</h2>
      <p className="text-lg mb-4">
        Enhance customer service with AI-powered ***REMOVED***s that deliver instant support. Improve efficiency, response times, and ensure consistent service quality.
      </p>
      <p className="text-lg mb-6">
        Gain valuable insights and optimize operations across industries from customer support to supply chain management.
      </p>
      
    </div>
    <div className="w-full lg:w-1/2 flex gap-4">
      <img src="/assets/images/solution-1.jpg" alt="solution-1" className="rounded-lg shadow-md w-1/2" />
      <img src="/assets/images/solution-2.jpg" alt="solution-2" className="rounded-lg shadow-md w-1/2" />
    </div>
  </div>
</section> */}

{/* Key Features Section */}
<section id="features" className="features-section bg-light py-20 px-12">
  <div className="container mx-auto">
    <h2 className="text-center font-bold text-4xl mb-6">Key Features</h2>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
      
      {/* Feature 1 */}
      <div className="feature-box">
        <div className="icon bg-blue-500 text-white p-4 rounded-full">
          <i className="fas fa-microphone"></i>
        </div>
        <h3 className="font-bold text-lg mt-4">Voice Recognition</h3>
        <p>Convert spoken words into text and identify specific keywords to trigger responses.</p>
      </div>
      
      {/* Feature 2 */}
      <div className="feature-box">
        <div className="icon bg-blue-500 text-white p-4 rounded-full">
          <i className="fas fa-comments"></i>
        </div>
        <h3 className="font-bold text-lg mt-4">Dialogue Management</h3>
        <p>Maintain context across conversations for more coherent and relevant responses.</p>
      </div>
      
      {/* Feature 3 */}
      <div className="feature-box">
        <div className="icon bg-blue-500 text-white p-4 rounded-full">
          <i className="fas fa-brain"></i>
        </div>
        <h3 className="font-bold text-lg mt-4">Natural Language Understanding</h3>
        <p>Extract relevant information from spoken language and recognize intents.</p>
      </div>
      
      {/* Feature 4 */}
      <div className="feature-box">
        <div className="icon bg-blue-500 text-white p-4 rounded-full">
          <i className="fas fa-robot"></i>
        </div>
        <h3 className="font-bold text-lg mt-4">Voice Synthesis</h3>
        <p>Transform system responses into natural, spoken language with emotional tone adjustments.</p>
      </div>

    </div>
  </div>
</section>


{/* Parallax Background Styles */}
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

{/* Contact Section */}
<section id="contact" className="contact bg-gray-100 p-8">
  <div className="container mx-auto">
    <div className="max-w-xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden p-8">
      <h2 className="text-4xl font-bold text-black text-center mb-6">Contact Us</h2>
      
      <form className="space-y-4">
        {/* Name Input */}
        <div className="relative">
          <input 
            type="text" 
            placeholder="Name" 
            className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Email Input */}
        <div className="relative">
          <input 
            type="email" 
            placeholder="Email" 
            className="w-full p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Message Textarea */}
        <div className="relative">
          <textarea 
            placeholder="Message" 
            className="w-full p-4 h-32 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <button 
            type="submit" 
            className="bg-blue-500 text-white px-8 py-3 rounded hover:bg-blue-600 transition duration-300"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  </div>
</section>


{/* Footer */}
<footer className="bg-gray-800 p-4 text-center text-white">
  <p>© 2024 Sampark AI. All Rights Reserved.</p>
</footer>

  
    </div>
  );
}
