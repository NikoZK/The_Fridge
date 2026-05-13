<script>
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'


    async function logout() {
    const response = await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok) throw new Error(data.error)
    return data
  }

  async function handleLogout() {
    try {
      const data = await logout()
      toastr.success('You have signed out!')
      location.reload()
    } catch (error) {
      toastr.error(error.message)
    }
  }
</script>

<main id=center>

<h1>Profile</h1>

<h2>Hello and welcome, you are now logged in!</h2>

<p>
    <button on:click={handleLogout} type="button" class="counter">Logout</button>
</p>

</main>