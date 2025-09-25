import { Link, NavLink, useNavigate } from "react-router-dom";
import { auth, provider } from "../firebase/config";
import { signInWithPopup, signOut } from "firebase/auth";
import { useState } from "react";
import Swal from "sweetalert2";

export const Headerr = () => {
  const [isAuth, setIsAuth] = useState(
    JSON.parse(localStorage.getItem("isAuth")) || false
  );
  const [hidden, setHidden] = useState(true);
  const navigate = useNavigate();
  const activeClass = "text-blue-600 font-bold";
  const inactiveClass = "text-gray-700 hover:text-blue-600 transition duration-300";

  function handleLogin() {
    signInWithPopup(auth, provider)
      .then((result) => {
        setIsAuth(true);
        localStorage.setItem("isAuth", true);
        Swal.fire({
          title: "Logged In Successfully",
          icon: "success",
          confirmButtonText: "Cool!",
        });
      })
      .catch((error) => {
        Swal.fire({
          title: "Login Failed",
          icon: "error",
          confirmButtonText: "Okay",
        });
      });
  }

  function handleLogout() {
    signOut(auth);
    setIsAuth(false);
    navigate("/");
    localStorage.setItem("isAuth", false);
    Swal.fire({
      title: "Logged Out Successfully!",
      icon: "success",
      confirmButtonText: "Okay",
    });
  }

  return (
    <header>
      <nav className="font-serif z-50 relative bg-Bluee shadow-md px-4 py-1">
        <div className="max-w-screen-xl flex items-center justify-between mx-auto">
          <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <div className="h-10"></div>
            <div className="flex flex-col items-start">
              <span className="text-2xl font-bold text-blue-600 tracking-wide">
                Plan<span className="text-blue-800">O</span>rama
              </span>
              <span className="text-xs font-medium text-gray-600">
                Explore. Plan. Live.
              </span>
            </div>
          </Link>

          <button
            onClick={() => setHidden(!hidden)}
            className="md:hidden p-2 rounded-lg bg-blue-700 text-white hover:bg-blue-600 transition duration-300"
          >
            <svg className="w-6 h-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>

          <div className="hidden md:flex items-center space-x-8">
            {[
              { path: "/", label: "Home" },
              { path: "/about", label: "About" },
              { path: "/contact", label: "Contact" },
              { path: "/faqs", label: "FAQs" },
              ...(isAuth ? [{ path: "/mydashboard", label: "Dashboard" }] : []),
            ].map(({ path, label }) => (
              <NavLink key={path} to={path} className={({ isActive }) => (isActive ? activeClass : inactiveClass)}>
                {label}
              </NavLink>
            ))}
            <div className="text-black hover:text-blue-600 transition duration-300">
              {!isAuth ? (
                 <button onClick={handleLogin} className="border-2 py-1 px-0 pr-3 border-gray-950 rounded-full ">
                 <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-google " viewBox="0 0 16 16">
                   <path d="M15.545 6.558a9.4 9.4 0 0 1 .139 1.626c0 2.434-.87 4.492-2.384 5.885h.002C11.978 15.292 10.158 16 8 16A8 8 0 1 1 8 0a7.7 7.7 0 0 1 5.352 2.082l-2.284 2.284A4.35 4.35 0 0 0 8 3.166c-2.087 0-3.86 1.408-4.492 3.304a4.8 4.8 0 0 0 0 3.063h.003c.635 1.893 2.405 3.301 4.492 3.301 1.078 0 2.004-.276 2.722-.764h-.003a3.7 3.7 0 0 0 1.599-2.431H8v-3.08z" />
                 </svg>Login
               </button>
              ) : (
                <button onClick={handleLogout}>
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="currentColor" className="bi bi-door-closed border-2 p-1 border-gray-950" viewBox="0 0 16 16">
                  <path d="M3 2a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v13h1.5a.5.5 0 0 1 0 1h-13a.5.5 0 0 1 0-1H3zm1 13h8V2H4z" />
                  <path d="M9 9a1 1 0 1 0 2 0 1 1 0 0 0-2 0" />
                </svg>
              </button>
              )}
            </div>
          </div>
        </div>

       <div
  className={`absolute left-0 top-full w-full bg-Bluee shadow-lg md:hidden transition-all duration-300 ${
    hidden ? "hidden" : "block"
  }`}
>
  <ul className="flex flex-col items-start space-y-3 text-black  p-4">
    {[
      { path: "/", label: "Home" },
      { path: "/about", label: "About" },
      { path: "/contact", label: "Contact" },
      { path: "/faqs", label: "FAQs" },
      ...(isAuth ? [{ path: "/mydashboard", label: "Dashboard" }] : []),
    ].map(({ path, label }) => (
      <NavLink
        key={path}
        to={path}
        onClick={() => setHidden(true)}
        className={({ isActive }) =>
          ` px-4 py-1  rounded-md text-black transition  ${
            isActive ? "border-2 border-black px-4 py-2  font-semibold" : " text-black"
          }`
        }
      >
        {label}
      </NavLink>
    ))}

            <div className="mobile-nav-link">
  {!isAuth ? (
    <button 
      onClick={handleLogin} 
      className="px-4 py-2  ml-2 bg-blue-600 text-white rounded-lg hover:bg-blue-600 transition"
    >
      Login
    </button>
  ) : (
    <button 
      onClick={handleLogout} 
      className="px-4 py-2  ml-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
    >
      Logout
    </button>
  )}
</div>

          </ul>
        </div>
      </nav>
    </header>
  );
};
