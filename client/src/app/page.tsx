"use client";

import Homes from "@/components/(ui)/home";
import UserNav from "@/components/(nav-and-footer)/user-nav";
import Footer from "@/components/(nav-and-footer)/footer";

export default function Home() {
  return (
    <>
      
     
      {/* Add padding to prevent content from being hidden behind fixed nav */}
      <div className=""> 
        <Homes/>
      </div>
      
      <Footer/>
    </>
  );
}

