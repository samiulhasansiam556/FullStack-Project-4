import UserNav from "../(nav-and-footer)/user-nav";
import Link from "next/link";

export default function Home() {
  return (
    <>
      {/* Sticky Navbar - sits on top of content */}
      <div className="sticky top-0 z-50">
        <UserNav/>
      </div>

      {/* Hero Section - content starts from top */}
      <main className="relative min-h-screen flex items-center justify-center text-center text-white bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500">
        {/* Hero Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Content */}
        <div className="relative z-10 px-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6">
            Share & Access University Materials Easily
          </h1>
          <p className="text-lg md:text-xl mb-8">
            UniShare is your go-to platform for sharing notes, assignments, and resources with your peers. Upload and download materials with ease.
          </p>
          <div className="flex justify-center gap-6">
            <Link
              href="/upload"
              className="bg-indigo-600 hover:bg-indigo-700 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold"
            >
              Upload
            </Link>
            <Link
              href="/download"
              className="bg-white text-indigo-700 hover:bg-gray-100 px-6 py-3 rounded-lg shadow-lg text-lg font-semibold"
            >
              Download
            </Link>
          </div>
        </div>
      </main>
      

    </>
  );
}