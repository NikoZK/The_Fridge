<script>
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'
  import { navigate } from 'svelte-routing'
  import { fetchPost } from '../util/fetchUtil'

  let email = ''
  let username = ''
  let password = ''

  async function signup(email, username, password) {
    const response = await fetchPost('/auth/signup', { email, username, password })
    return response
  }

  async function handleSignup() {
    try {
      const data = await signup(email, username, password)
      toastr.success(`Account created for ${data.user.username}!`)
      location.reload()
    } catch (error) {
      toastr.error(error.message)
    }
  }
</script>

<main id="center">
  <h1>Sign up</h1>

  <form on:submit|preventDefault={handleSignup}>
    <p>
        <br />
        <input type="email" name="email" placeholder="Email" bind:value={email} />
    </p>

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
      <button type="submit" class="btn">Sign Up</button>
    </p>
  </form>

  <p>
    Already have an account? <a href="/login" class="second-option">Login</a>
  </p>
</main>
