import React, { useState } from "react";

export default function RegisterPopup({
  isOpen,
  onClose,
  onLogin,
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) {
    return null;
  }

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    console.log("Registration successful:", {
      name,
      email,
      password,
    });

    /*
      Temporary registration.

      Later this will be replaced by your
      backend registration API.
    */

    localStorage.setItem(
      "aachho_logged_in",
      "true"
    );

    localStorage.setItem(
      "aachho_user_name",
      name
    );

    localStorage.setItem(
      "aachho_user_email",
      email
    );

    onClose();
  };

  return (
    <div className="fixed inset-0 z-[99999] min-h-screen bg-white">

      {/* ================= HEADER ================= */}

      <header className="h-[58px] border-t border-[#222] border-b border-[#eeeeee] bg-white">

        <div className="mx-auto flex h-full max-w-[960px] items-center justify-between px-5">

          {/* LOGO */}

          <div className="flex items-center">

            <span className="text-[21px] font-normal tracking-[-0.5px] text-[#222]">
              AACHHO
            </span>

            <span className="ml-[2px] mt-[-10px] text-[7px] text-[#333]">
              ®
            </span>

          </div>


          {/* MY ACCOUNT */}

          <div className="flex items-center gap-[10px]">

            <span className="text-[13px] text-[#222]">
              My Account
            </span>

            <svg
              width="18"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="7" r="4" />
              <path d="M5.5 21c0-4 2.7-7 6.5-7s6.5 3 6.5 7" />
            </svg>

          </div>

        </div>

      </header>


      {/* ================= REGISTER CONTENT ================= */}

      <main className="flex min-h-[calc(100vh-58px)] flex-col items-center bg-white">

        {/* Heading */}

        <h1 className="mt-[60px] text-[14px] font-normal text-[#4b4b4b]">
          Create Your Aachho Account
        </h1>


        {/* REGISTER CARD */}

        <div
          className="
            mt-[17px]
            w-[400px]
            rounded-[11px]
            bg-white
            px-[20px]
            py-[25px]
            shadow-[0_2px_14px_rgba(0,0,0,0.10)]
          "
        >

          <form onSubmit={handleRegister}>

            {/* NAME */}

            <div className="mb-[14px]">

              <label
                htmlFor="register-name"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Name
              </label>

              <input
                id="register-name"
                type="text"
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
                placeholder="Enter Your Name"
                required
                className="
                  h-[40px]
                  w-full
                  rounded-none
                  border
                  border-[#d3d3d3]
                  bg-white
                  px-[12px]
                  text-[12px]
                  text-[#555]
                  outline-none
                  placeholder:text-[#999]
                  focus:border-[#aaa]
                "
              />

            </div>


            {/* EMAIL */}

            <div className="mb-[14px]">

              <label
                htmlFor="register-email"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Email Address
              </label>

              <input
                id="register-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter Your Email Address"
                required
                className="
                  h-[40px]
                  w-full
                  rounded-none
                  border
                  border-[#d3d3d3]
                  bg-white
                  px-[12px]
                  text-[12px]
                  text-[#555]
                  outline-none
                  placeholder:text-[#999]
                  focus:border-[#aaa]
                "
              />

            </div>


            {/* PASSWORD */}

            <div className="mb-[14px]">

              <label
                htmlFor="register-password"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Password
              </label>

              <input
                id="register-password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter Your Password"
                required
                className="
                  h-[40px]
                  w-full
                  rounded-none
                  border
                  border-[#d3d3d3]
                  bg-white
                  px-[12px]
                  text-[12px]
                  text-[#555]
                  outline-none
                  placeholder:text-[#999]
                  focus:border-[#aaa]
                "
              />

            </div>


            {/* CONFIRM PASSWORD */}

            <div className="mb-[18px]">

              <label
                htmlFor="register-confirm-password"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Confirm Password
              </label>

              <input
                id="register-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                placeholder="Confirm Your Password"
                required
                className="
                  h-[40px]
                  w-full
                  rounded-none
                  border
                  border-[#d3d3d3]
                  bg-white
                  px-[12px]
                  text-[12px]
                  text-[#555]
                  outline-none
                  placeholder:text-[#999]
                  focus:border-[#aaa]
                "
              />

            </div>


            {/* ERROR */}

            {error && (
              <div className="mb-[14px] text-center text-[11px] text-[#d65c5c]">
                {error}
              </div>
            )}


            {/* REGISTER BUTTON */}

            <button
              type="submit"
              className="
                h-[40px]
                w-full
                border-none
                bg-[#D97676]
                text-[13px]
                font-normal
                text-white
                transition
                hover:bg-[#CD5C5C]
              "
            >
              CREATE ACCOUNT
            </button>

          </form>


          {/* LOGIN LINK */}

          <div className="mt-[20px] text-center">

            <span className="text-[11px] text-[#777]">
              Already have an account?
            </span>

            <button
              type="button"
              onClick={onLogin}
              className="
                ml-[5px]
                text-[11px]
                text-[#444]
                underline
                underline-offset-2
                hover:text-black
              "
            >
              Login
            </button>

          </div>

        </div>

      </main>

    </div>
  );
}