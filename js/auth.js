// ShopNow — auth.js (Lab 5, Part B)
// Supabase Auth: register, login, logout, navbar state and "login required" pages.
// Loaded on every page, right after the Supabase CDN tag and config.js.

// One shared Supabase client for the whole page (app.js and product-detail.js use it too).
// It is called supabaseClient, not supabase, because the CDN script already
// uses the global name "supabase" for the library itself.
const supabaseClient =
  window.supabase && typeof SUPABASE_URL !== "undefined" && !SUPABASE_URL.includes("YOUR-PROJECT-REF")
    ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
    : null;

// ---------- Step 6: show auth state in the navbar ----------
async function updateNavForAuth() {
  const navSlot = document.getElementById("auth-nav-slot");
  if (!navSlot || !supabaseClient) return;

  const { data: { user } } = await supabaseClient.auth.getUser();
  if (user) {
    navSlot.innerHTML = `<span class="nav-user">Hi, ${escapeHTML(user.email)}</span> <a href="#" onclick="logout(); return false;">Log out</a>`;
  } else {
    navSlot.innerHTML = `<a href="login.html">Login</a> <a href="register.html">Register</a>`;
  }
}

async function logout() {
  await supabaseClient.auth.signOut();
  window.location.href = "index.html";
}

// ---------- Step 7: pages that need a logged-in customer ----------
async function requireLogin() {
  if (!supabaseClient) {
    window.location.href = "login.html";
    return null;
  }
  const { data: { user } } = await supabaseClient.auth.getUser();
  if (!user) window.location.href = "login.html";
  return user;
}

// Shows a success / error message under a form (instead of alert pop-ups)
function showFormMessage(text, type) {
  const box = document.getElementById("form-message");
  box.textContent = text;
  box.className = `form-message ${type}`;
}

// ---------- Step 5: register.html ----------
const registerForm = document.getElementById("register-form");
if (registerForm) {
  registerForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
      showFormMessage(error.message, "error");
    } else if (!data.session) {
      // "Confirm email" is still ON in Supabase -> user must click the email link first
      showFormMessage("Account created — check your inbox to confirm your email, then log in.", "success");
    } else {
      // signUp logs the user in straight away; sign out so they log in on the next page
      await supabaseClient.auth.signOut();
      showFormMessage("Account created — you can now log in. Redirecting...", "success");
      setTimeout(() => { window.location.href = "login.html"; }, 1500);
    }
  });
}

// ---------- Step 5: login.html ----------
const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", async e => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) showFormMessage(error.message, "error");
    else window.location.href = "index.html";
  });
}

updateNavForAuth();
