import React, { useState } from "react";

export default function AdminAuth({ onLoginSuccess }) {
  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter email and password.");
      return;
    }

    /*
      TEMPORARY FRONTEND LOGIN

      Replace this with your backend API later.
    */

    const adminEmail = localStorage.getItem("admin_email");
    const adminPassword = localStorage.getItem("admin_password");

    if (
      adminEmail &&
      adminPassword &&
      email === adminEmail &&
      password === adminPassword
    ) {
      localStorage.setItem("admin_logged_in", "true");

      onLoginSuccess();
    } else {
      setError("Invalid admin email or password.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter admin name.");
      return;
    }

    if (!email.trim()) {
      setError("Please enter admin email.");
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

    /*
      TEMPORARY FRONTEND REGISTRATION

      In the real application, this information
      should be stored securely in your backend.
    */

    localStorage.setItem("admin_name", name);
    localStorage.setItem("admin_email", email);
    localStorage.setItem("admin_password", password);

    localStorage.setItem("admin_logged_in", "true");

    setSuccess("Admin account created successfully.");

    setTimeout(() => {
      onLoginSuccess();
    }, 700);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ================= HEADER ================= */}

      <header className="h-[58px] border-t border-[#222] border-b border-[#eeeeee] bg-white">

        <div className="mx-auto flex h-full max-w-[960px] items-center justify-between px-5">

          {/* AACHHO LOGO */}

          <div className="flex items-center">

            <span className="text-[21px] font-normal tracking-[-0.5px] text-[#222]">
              AACHHO
            </span>

            <span className="ml-[2px] mt-[-10px] text-[7px] text-[#333]">
              ®
            </span>

          </div>


          {/* ADMIN ACCOUNT */}

          <div className="flex items-center gap-[10px]">

            <span className="text-[13px] text-[#222]">
              Admin Account
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


      {/* ================= MAIN ================= */}

      <main className="flex min-h-[calc(100vh-58px)] flex-col items-center bg-white">

        {/* Heading */}

        <h1 className="mt-[65px] text-[14px] font-normal text-[#4b4b4b]">
          {mode === "login"
            ? "Admin Login"
            : "Create Admin Account"}
        </h1>


        {/* ================= CARD ================= */}

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

          <form
            onSubmit={
              mode === "login"
                ? handleLogin
                : handleRegister
            }
          >

            {/* NAME - REGISTER ONLY */}

            {mode === "register" && (
              <div className="mb-[14px]">

                <label
                  htmlFor="admin-name"
                  className="mb-[7px] block text-[11px] text-[#555]"
                >
                  Admin Name
                </label>

                <input
                  id="admin-name"
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter Admin Name"
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
            )}


            {/* EMAIL */}

            <div className="mb-[14px]">

              <label
                htmlFor="admin-email"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Admin Email
              </label>

              <input
                id="admin-email"
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Enter Admin Email"
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
                htmlFor="admin-password"
                className="mb-[7px] block text-[11px] text-[#555]"
              >
                Password
              </label>

              <input
                id="admin-password"
                type="password"
                value={password}
                onChange={(e) =>
                  setPassword(e.target.value)
                }
                placeholder="Enter Password"
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

            {mode === "register" && (
              <div className="mb-[18px]">

                <label
                  htmlFor="admin-confirm-password"
                  className="mb-[7px] block text-[11px] text-[#555]"
                >
                  Confirm Password
                </label>

                <input
                  id="admin-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm Password"
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
            )}


            {/* ERROR */}

            {error && (
              <div className="mb-[14px] text-center text-[11px] text-[#d65c5c]">
                {error}
              </div>
            )}


            {/* SUCCESS */}

            {success && (
              <div className="mb-[14px] text-center text-[11px] text-green-600">
                {success}
              </div>
            )}


            {/* BUTTON */}

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
              {mode === "login"
                ? "ADMIN LOGIN"
                : "CREATE ADMIN ACCOUNT"}
            </button>

          </form>


          {/* ================= SWITCH ================= */}

          <div className="mt-[22px] text-center">

            {mode === "login" ? (
              <>
                <span className="text-[11px] text-[#777]">
                  Don't have an admin account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode("register");
                    setError("");
                    setSuccess("");
                  }}
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
              </>
            ) : (
              <>
                <span className="text-[11px] text-[#777]">
                  Already have an admin account?
                </span>

                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setSuccess("");
                  }}
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
              </>
            )}

          </div>

        </div>

      </main>

    </div>
  );
}