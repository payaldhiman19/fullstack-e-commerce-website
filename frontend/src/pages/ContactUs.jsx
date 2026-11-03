
import { useEffect, useState } from "react";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "instant",
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const response = await fetch(
        "http://localhost:5000/api/contact",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setFeedback("Thank you! Your message has been received.");

      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      setFeedback(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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
            <p className="mt-1">Rivana Fashion Store, India</p>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-xl"
        >
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Your Email"
            required
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Your Message"
            rows={5}
            required
            className="mb-4 w-full border border-gray-300 px-4 py-3 outline-none"
          />

          {feedback && (
            <p className="mb-4 text-sm text-gray-700">
              {feedback}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-black px-8 py-3 text-sm uppercase tracking-widest text-white disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
