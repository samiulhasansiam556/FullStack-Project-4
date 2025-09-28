export default function About() {
  return (
    <section className="min-h-screen flex flex-col items-center justify-center px-6 py-12 bg-gradient-to-b from-gray-50 to-gray-100 text-gray-800">
      <div className="max-w-3xl text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          Welcome to our <span className="font-semibold">Material Sharing Platform</span> 
          for university students. Our mission is to simplify how students 
          share, upload, and download course resources.  
        </p>
        <p className="text-lg leading-relaxed mb-6">
          Whether you need lecture notes, assignments, or project files — 
          this platform connects learners and encourages knowledge exchange 
          in the academic community.
        </p>
        <p className="text-lg leading-relaxed font-medium">
          Built with ❤️ by students, for students.
        </p>
      </div>
    </section>
  );
}
