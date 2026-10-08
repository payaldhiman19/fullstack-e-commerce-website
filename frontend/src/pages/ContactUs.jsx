function ContactUs() {
  return (
    <div className="min-h-screen bg-[#fffaf7] px-6 py-16">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-8 text-3xl font-semibold text-gray-800">
          Contact Us
        </h1>

        <p className="mb-8 leading-7 text-gray-600">
          Have a question or need help? Get in touch with the Rivana team.
        </p>

        <div className="space-y-5 text-gray-700">
          <div>
            <h2 className="font-semibold">Email</h2>
            <p className="mt-1">support@rivana.com</p>
          </div>

          <div>
            <h2 className="font-semibold">Phone</h2>
            <p className="mt-1">+91 98765 43210</p>
          </div>

          <div>
            <h2 className="font-semibold">Address</h2>
            <p className="mt-1">
              Rivana Fashion Store, India
            </p>
          </div>
        </div>

        <form className="mt-10 max-w-xl">
          <input
            type="text"
            placeholder="Your Name"
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          <input
            type="email"
            placeholder="Your Email"
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          <textarea
            placeholder="Your Message"
            rows="5"
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          <button
            type="button"
            onClick={() => alert("Thank you! Your message has been received.")}
            className="bg-black px-8 py-3 text-sm uppercase tracking-widest text-white"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;