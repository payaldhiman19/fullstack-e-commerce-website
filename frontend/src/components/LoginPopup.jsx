import React, { useState } from "react";

export default function LoginPopup({
  isOpen,
  onClose,
  onRegister,
}) {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  if (!isOpen) {
    return null;
  }

  const handleSendOtp = (e) => {
    e.preventDefault();

    if (!email.trim()) {
      return;
    }

    console.log("OTP requested for:", email);

    // Temporary OTP simulation
    setOtpSent(true);
  };

  const handleSignIn = (e) => {
    e.preventDefault();

    if (!otp.trim()) {
      return;
    }

    console.log("Login successful:", {
      email,
      otp,
    });

    // Save login status
    localStorage.setItem("aachho_logged_in", "true");
    localStorage.setItem("aachho_user_email", email);

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


      {/* ================= LOGIN CONTENT ================= */}

      <main className="flex min-h-[calc(100vh-58px)] flex-col items-center bg-white">

        {/* Heading */}

        <h1 className="mt-[72px] text-[14px] font-normal text-[#4b4b4b]">
          Welcome to Aachho
        </h1>


        {/* LOGIN CARD */}

        <div
          className="
            mt-[17px]
            w-[400px]
            rounded-[11px]
            bg-white
            px-[20px]
            py-[20px]
            shadow-[0_2px_14px_rgba(0,0,0,0.10)]
          "
        >

          <form
            onSubmit={
              otpSent
                ? handleSignIn
                : handleSendOtp
            }
          >

            {/* EMAIL */}

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
                text-center
                text-[12px]
                text-[#555]
                outline-none
                placeholder:text-[#777]
                focus:border-[#aaa]
              "
            />


            {/* OTP */}

            {otpSent && (
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) =>
                  setOtp(
                    e.target.value.replace(/\D/g, "")
                  )
                }
                placeholder="Enter OTP"
                required
                className="
                  mt-[12px]
                  h-[40px]
                  w-full
                  rounded-none
                  border
                  border-[#d3d3d3]
                  bg-white
                  px-[12px]
                  text-center
                  text-[12px]
                  text-[#555]
                  outline-none
                  placeholder:text-[#777]
                  focus:border-[#aaa]
                "
              />
            )}


            {/* BUTTON */}

            <button
              type="submit"
              className={`
                w-full
                border-none
                bg-[#D97676]
                text-[13px]
                font-normal
                text-white
                transition
                hover:bg-[#CD5C5C]
                ${
                  otpSent
                    ? "mt-[12px] h-[40px]"
                    : "mt-[30px] h-[39px]"
                }
              `}
            >
              {otpSent
                ? "SIGN IN"
                : "Send Otp!"}
            </button>

          </form>


          {/* OTP MESSAGE */}

          {otpSent && (
            <div className="mt-[12px] text-center text-[11px] text-[#777]">
              OTP sent to {email}
            </div>
          )}


          {/* REGISTER */}

          <div className="mt-[20px] text-center">

            <span className="text-[11px] text-[#777]">
              Don't have an account?
            </span>

            <button
              type="button"
              onClick={onRegister}
              className="
                ml-[5px]
                text-[11px]
                text-[#444]
                underline
                underline-offset-2
                hover:text-black
              "
            >
              Register
            </button>

          </div>

        </div>

      </main>


      {/* CHAT BUTTON */}

      <button
        type="button"
        className="
          fixed
          bottom-[95px]
          right-[20px]
          flex
          h-[41px]
          w-[41px]
          items-center
          justify-center
          rounded-full
          bg-[#D65C5C]
          text-white
          shadow-[0_3px_12px_rgba(0,0,0,0.18)]
        "
      >

        <svg
          width="19"
          height="19"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.4 8.4 0 0 1-9 8.5 9.6 9.6 0 0 1-4-.9L3 21l1.9-4A8.4 8.4 0 0 1 3 11.5 8.5 8.5 0 0 1 12 3a8.5 8.5 0 0 1 9 8.5Z" />
          <path d="M8 11h8" />
          <path d="M8 14h5" />
        </svg>

      </button>

    </div>
  );
}