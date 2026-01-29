const loginToggle = document.getElementById("loginToggle");
const signupToggle = document.getElementById("signupToggle");
const glider = document.getElementById("glider");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");
const formsFrame = document.querySelector(".forms-frame");

// Toast notification helper
function showToast(message, type = "success") {
  Toastify({
    text: message,
    duration: 3500,
    gravity: "top",
    position: "center",
    stopOnFocus: true,
    style: {
      background: type === "success" 
        ? "linear-gradient(to right, #00b09b, #96c93d)" 
        : "linear-gradient(to right, #ff5f6d, #ffc371)",
      fontSize: "16px",
      padding: "16px 24px",
      borderRadius: "8px",
      minWidth: "300px",
      textAlign: "center",
    },
  }).showToast();
}

// Toggle between login and signup
signupToggle.addEventListener("click", () => {
  glider.style.transform = "translateX(100%)";
  signupToggle.classList.add("active");
  loginToggle.classList.remove("active");
  loginForm.classList.remove("active-form");
  loginForm.style.transform = "translateX(-20px)";

  setTimeout(() => {
    signupForm.classList.add("active-form");
    signupForm.style.transform = "translateX(0)";
  }, 100);
});

loginToggle.addEventListener("click", () => {
  glider.style.transform = "translateX(0)";
  loginToggle.classList.add("active");
  signupToggle.classList.remove("active");
  signupForm.classList.remove("active-form");
  signupForm.style.transform = "translateX(20px)";

  setTimeout(() => {
    loginForm.classList.add("active-form");
    loginForm.style.transform = "translateX(0)";
  }, 100);
});

// Set initial mode
if (mode === "signup") {
  glider.style.transform = "translateX(100%)";
  signupToggle.classList.add("active");
  loginToggle.classList.remove("active");
  loginForm.classList.remove("active-form");
  loginForm.style.transform = "translateX(-20px)";

  setTimeout(() => {
    signupForm.classList.add("active-form");
    signupForm.style.transform = "translateX(0)";
  }, 100);
}

// Handle Login Form Submission
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const submitBtn = loginForm.querySelector('.submit-btn');
  const email = loginForm.querySelector('input[name="email"]').value.trim();
  const password = loginForm.querySelector('input[name="password"]').value;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Logging in...";
  
  try {
    const response = await fetch("/api/users/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
      credentials: 'same-origin' // Important for cookies
    });
    
    const data = await response.json();
    
    if (data.isStatus) {
      showToast(data.msg, "success");
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } else {
      showToast(data.msg, "error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error("Login error:", error);
    showToast("Network error. Please check your connection.", "error");
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

// Handle Signup Form Submission
signupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const submitBtn = signupForm.querySelector('.submit-btn');
  const username = signupForm.querySelector('input[name="username"]').value.trim();
  const email = signupForm.querySelector('input[name="email"]').value.trim();
  const password = signupForm.querySelector('input[name="password"]').value;
  
  // Disable button and show loading
  submitBtn.disabled = true;
  const originalText = submitBtn.textContent;
  submitBtn.textContent = "Creating Account...";
  
  try {
    const response = await fetch("/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password }),
      credentials: 'same-origin' // Important for cookies
    });
    
    const data = await response.json();
    
    if (data.isStatus) {
      showToast(data.msg, "success");
      signupForm.reset();
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } else {
      showToast(data.msg, "error");
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  } catch (error) {
    console.error("Signup error:", error);
    showToast("Network error. Please check your connection.", "error");
    submitBtn.disabled = false;
    submitBtn.textContent = originalText;
  }
});

