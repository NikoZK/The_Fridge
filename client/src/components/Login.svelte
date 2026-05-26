<script>
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'
  import { fetchPost } from '../util/fetchUtil'

  let username = ''
  let password = ''

  async function login(username, password) {
    const response = await fetchPost('/auth/login', { username, password })
    return response
  }

  async function handleLogin() {
    try {
      const data = await login(username, password)
      toastr.success(`Welcome, ${data.user.username}!`)
      location.reload()
    } catch (error) {
      toastr.error('Login Failed, wrong username or password')
    }
  }
</script>
<svelte:head>
   <title>The Fridge | Login</title>
</svelte:head>

<main id="center">
  <h1>Login</h1>

  <form on:submit|preventDefault={handleLogin}>
    <p>
        <br />
        <input type="text" name="username" placeholder="Username" bind:value={username} />
    </p>

    <p>
        <br />
        <input type="password" name="password" placeholder="Password" bind:value={password} />
    </p>

    <p>
      <br />
      <button type="submit" class="btn">Login</button>
    </p>
  </form>

  <p>
    Dont have an account? <a href="/signup" class="second-option">Sign up</a>
  </p>
</main>
