export async function register({ username, email, password }) {
  try {
    const response = await fetch("https://interview-master-bwsh.onrender.com/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username,
        email,
        password,
      }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("Register Error:", error.message);
    throw error; // optional: aage handle karne ke liye
  }
}

export async function login({ email, password }) {
  try {
    const response = await fetch("https://interview-master-bwsh.onrender.com/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "something went wrong");
    }
    return data;
  } catch (error) {
    console.error("Login error", error.message);
    throw error;
  }
}

export async function getMe() {
  try {
    const response = await fetch("https://interview-master-bwsh.onrender.com/api/auth/get-me", {
      credentials: "include",
    });
      let data = {}
    try {
       data = await response.json();
    } catch {}

    if (!response.ok) {
      throw new Error(data.message || "something went wrong");
    }
    return data;
  } catch (error) {
    console.error("GetMe Error:", error.message);
    throw error;
  }
}

export async function logout() {
  try {
    const response = await fetch("https://interview-master-bwsh.onrender.com/api/auth/logout", {
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw Error(data.message);
    }
    return data;
  } catch (error) {
    console.error("GetMe Error:", error.message);
    throw error;
  }
}