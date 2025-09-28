export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">UniShare</h3>
          <p className="text-sm">
            A materials sharing platform for university students. Upload, download, and grow together.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><a href="/" className="hover:text-indigo-400">Home</a></li>
            <li><a href="/about" className="hover:text-indigo-400">About</a></li>
            <li><a href="/contact" className="hover:text-indigo-400">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p>Email: support@unishare.com</p>
          <p>Phone: +880 1234 567890</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} UniShare. All rights reserved.
      </div>
    </footer>
  );
}
