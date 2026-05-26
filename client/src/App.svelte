<script>
  import { Router, Link, Route } from 'svelte-routing'
  import { onMount } from 'svelte'
  import PrivateRouteGuard from './components/Route_guards/PrivateRouteGuard.svelte'
  import Login from './components/Login.svelte'
  import Signup from './components/Signup.svelte'
  import Home from './components/Home.svelte'
  import Fridge from './components/Fridge.svelte'
  import About from './components/About.svelte'
  import Dinner from './components/Dinner.svelte'
  import NotFound from './components/NotFound.svelte'
  import PrivacyPolicy from './components/PrivacyPolicy.svelte'
  import Footer from './components/footer/Footer.svelte'
  import Account from './components/Account.svelte'
  import ReversePrivateRouteGuard from './components/Route_guards/ReversePrivateRouteGuard.svelte'
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'

  import { userStore } from './components/stores/userStore'

  let isLoggedIn = false

  onMount(async () => {
    const response = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    })
    isLoggedIn = response.ok

    const data = await response.json()
    if (response.ok) {
      userStore.set({
        email: data.user.email,
        username: data.user.username
      })
    }
  })

  async function logout() {
    const response = await fetch('http://localhost:8080/auth/logout', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      credentials: 'include'
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

<div class={isLoggedIn ? 'logged-in-bg' : 'logged-out-bg'} id="outer-body">
  <Router>
    <nav class="navbar">
      <div class="nav-left">
        <Link to="/home" class="logo"><img src="/fridge.png" alt="logo" class="nav-logo" /></Link>
        <span class="nav-title">The Fridge</span>

        {#if isLoggedIn}
          <Link to="/home">Home</Link>
          <Link to="/fridge">Fridge</Link>
          <Link to="/dinner">Dinner</Link>
        {/if}

        <Link to="/about">About</Link>
        <Link to="/privacyPolicy">Privacy Policy</Link>
      </div>

      <div class="nav-right">
        {#if !isLoggedIn}
          <Link class="loggedOut" to="/login">Login</Link>
          <Link class="loggedOut" to="/signup">Sign up</Link>
        {/if}

        {#if isLoggedIn}
          <p>Logged in as:</p>
          <Link to="/account">{$userStore.email}</Link>
          <Link class="loggedIn" on:click={handleLogout} to="/login">Logout</Link>
        {/if}
      </div>
    </nav>

    <main class="page-content">
      <Route path="/" exact>
        <Login />
      </Route>

      <Route path="/*" exact>
        <NotFound />
      </Route>

      <Route path="/login">
        <ReversePrivateRouteGuard><Login /></ReversePrivateRouteGuard>
      </Route>

      <Route path="/signup">
        <ReversePrivateRouteGuard><Signup /></ReversePrivateRouteGuard>
      </Route>

      <Route path="/home">
        <PrivateRouteGuard><Home /></PrivateRouteGuard>
      </Route>

      <Route path="/dinner">
        <PrivateRouteGuard><Dinner /></PrivateRouteGuard>
      </Route>

      <Route path="/fridge">
        <PrivateRouteGuard><Fridge /></PrivateRouteGuard>
      </Route>

      <Route path="/account">
        <PrivateRouteGuard><Account /></PrivateRouteGuard>
      </Route>

      <Route path="/about"><About /></Route>
      <Route path="/privacyPolicy"><PrivacyPolicy /></Route>
    </main>
  </Router>

  <Footer></Footer>
</div>
