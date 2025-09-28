export default function Contact() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-white to-gray-100 text-gray-800">
      <div className="max-w-2xl w-full">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-center">
          Contact Us
        </h1>
        <p className="text-lg text-center mb-8">
          Have questions or feedback? We’d love to hear from you!  
          Fill out the form below and we’ll get back to you soon.
        </p>

        <form className="bg-white shadow-md rounded-xl p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea
              placeholder="Write your message..."
              rows={4}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}
