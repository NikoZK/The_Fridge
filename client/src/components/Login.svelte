<script>
  import toastr from "toastr"
  import "toastr/build/toastr.min.css"

  let username = ""
  let password = ""

  async function login(username, password) {
    const response = await fetch("http://localhost:8080/auth/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  }

  async function handleLogin() {
    try {
      const data = await login(username, password)
      toastr.success(`Welcome, ${data.user.username}!`)
      location.reload()
    } catch (error) {
      toastr.error(error.message, "Login Failed")
    }
  }
</script>

<main id="center">

  <h1>Login</h1>

  <form on:submit|preventDefault={handleLogin}>
    <p>
      <label>
        Username
        <br />
        <input
          type="text"
          name="username"
          placeholder="user123"
          bind:value={username}
        />
      </label>
    </p>

    <p>
      <label>
        Password
        <br />
        <input
          type="password"
          name="password"
          placeholder="********"
          bind:value={password}
        />
      </label>
    </p>

    <p>
      <br />
      <button type="submit" class="counter">Login</button>
    </p>

  </form>

</main>
