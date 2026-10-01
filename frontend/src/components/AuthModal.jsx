import { useState } from "react";

function AuthModal({ onClose, setUser }) {
  const [isLogin, setIsLogin] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };


  // Login / Register
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = isLogin
      ? "http://localhost:5000/api/auth/login"
      : "http://localhost:5000/api/auth/register";

    try {
      const response = await fetch(url, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(formData),
      });

      const data = await response.json();

      console.log("Backend response:", data);


      // SUCCESS
      if (response.ok) {

        alert(data.message);

        if (isLogin) {

          // Save JWT token
          localStorage.setItem("token", data.token);

          // Save user information
          localStorage.setItem(
            "user",
            JSON.stringify(data.user)
          );

          // Update React state immediately
          setUser(data.user);

          // Close modal
          onClose();
        }

        else {

          // Clear form
          setFormData({
            name: "",
            email: "",
            password: "",
          });

          // Switch to login
          setIsLogin(true);
        }

      }


      // ERROR FROM BACKEND
      else {
        alert(data.message);
      }

    } catch (error) {

      console.error("Auth error:", error);

      alert("Unable to connect to server");
    }
  };


  // Switch Login ↔ Signup
  const switchMode = () => {

    setIsLogin(!isLogin);

    // Clear old form data
    setFormData({
      name: "",
      email: "",
      password: "",
    });
  };


  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50">

      <div className="relative w-[400px] rounded-xl bg-white p-8">

        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute right-4 top-3 text-2xl"
        >
          ×
        </button>


        {/* HEADING */}
        <h2 className="mb-6 text-center text-2xl font-bold">
          {isLogin ? "Login" : "Create Account"}
        </h2>


        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {/* NAME - only for signup */}
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="mb-4 w-full rounded-lg border p-3"
            />
          )}


          {/* EMAIL */}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="mb-4 w-full rounded-lg border p-3"
          />


          {/* PASSWORD */}
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="mb-4 w-full rounded-lg border p-3"
          />


          {/* LOGIN / SIGNUP BUTTON */}
          <button
            type="submit"
            className="w-full rounded-lg bg-black p-3 text-white"
          >
            {isLogin ? "Login" : "Sign Up"}
          </button>
             

             <div className="my-4 flex items-center gap-3">
  <div className="h-px flex-1 bg-gray-300"></div>

  <span className="text-sm text-gray-500">
    OR
  </span>

  <div className="h-px flex-1 bg-gray-300"></div>
</div>

<button
  type="button"
  className="flex w-full items-center justify-center gap-2 rounded-lg border p-3"
>
  Continue with Google
</button>

        </form>


        {/* SWITCH LOGIN / SIGNUP */}
        <p className="mt-5 text-center text-sm">

          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            onClick={switchMode}
            className="ml-1 font-semibold underline"
          >
            {isLogin ? "Sign Up" : "Login"}
          </button>

        </p>

      </div>

    </div>
  );
}

export default AuthModal;