import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-white mb-3">UniShare</h3>
          <p className="text-sm">
            A materials sharing platform for university students. Upload,
            download, and grow together.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="hover:text-indigo-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-indigo-400">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-indigo-400">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/download" className="hover:text-indigo-400">
                Download
              </Link>
            </li>
            <li>
              <Link href="/upload" className="hover:text-indigo-400">
                Upload
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-indigo-400">
                Dashboard
              </Link>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p>Email: samiulhasansiam556@gmail.com</p>
          <p>Phone: +880 1704479730</p>
        </div>
      </div>
      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} UniShare. All rights reserved.
      </div>
    </footer>
  );
}
