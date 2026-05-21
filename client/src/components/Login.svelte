<script>
  import toastr from "toastr"
  import "toastr/build/toastr.min.css"
    import { fetchPost } from "../util/fetchUtil";

  let username = ""
  let password = ""

  async function login(username, password) {
    const response = await fetchPost("/auth/login", { username, password })
    return response
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
      <button type="submit" class="btn">Login</button>
    </p>

  </form>

</main>
