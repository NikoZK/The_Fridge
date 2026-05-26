<script>
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'
  import { fetchPost } from '../util/fetchUtil'

  let email = ''
  let username = ''
  let password = ''
  let confirmPassword = ''

  async function signup(email, username, password) {
    const response = await fetchPost('/auth/signup', { email, username, password })
    return response
  }

  async function handleSignup() {
    if (username.length < 4 || username.includes(' ')) {
      toastr.warning('Username must be atleast 4 characters and contain no spaces')
      return
    }

    if (password.length < 8 || password.includes(' ')) {
      toastr.warning('Password must be atleast 8 characters and contain no spaces')
      return
    }

    if (password !== confirmPassword) {
      toastr.warning('Passwords must match')
      return
    }

    try {
      const data = await signup(email, username, password)
      toastr.success(`Account created for ${data.user.username}`)
      location.replace('/login')
      window.open(data.previewUrl, '_blank')
    } catch (error) {
      toastr.error(error, 'Fields are not filled out correctly')
    }
  }
</script>

<svelte:head>
  <title>The Fridge | Sign up</title>
</svelte:head>

<main id="center">
  <h1>Sign up</h1>

  <form on:submit|preventDefault={handleSignup}>
    <p>
      <br />
      <input type="email" name="email" placeholder="Email" bind:value={email} required />
    </p>

    <p>
      <br />
      <input type="text" name="username" placeholder="Username" bind:value={username} required />
    </p>

    <p>
      <br />
      <input type="password" name="password" placeholder="Password" bind:value={password} required />
    </p>

    <p>
      <br />
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        bind:value={confirmPassword}
        required
      />
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
