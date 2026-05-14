<script>
  import { Router, Link, Route } from 'svelte-routing'
  import { onMount } from 'svelte'
  import PrivateRouteGuard from './components/PrivateRouteGuard.svelte';
  import Login from './components/Login.svelte'
  import Signup from './components/Signup.svelte'
  import Profile from './components/Profile.svelte'
  import Fridge from './components/Fridge.svelte';
  import About from './components/About.svelte'
  import Footer from './components/footer/Footer.svelte'
  import ReversePrivateRouteGuard from './components/ReversePrivateRouteGuard.svelte';
  import toastr from 'toastr'
  import 'toastr/build/toastr.min.css'

  let isLoggedIn = false

  onMount(async () => {
    const response = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    })
    isLoggedIn = response.ok
  })


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

<Router> 
  <nav> 
    {#if !isLoggedIn}
      <Link to="/login">Login</Link> 
      <Link to="/signup">Sign up</Link> 
    {/if}

    {#if isLoggedIn}
      <Link to="/profile">Profile</Link> 
      <Link to="/fridge">Fridge</Link> 
      <Link on:click={handleLogout} type="button" to="/login" >Logout</Link>
    {/if}

    <Link to="/about">About</Link>
  </nav>


<Route path="/login"> <ReversePrivateRouteGuard> <Login/> </ReversePrivateRouteGuard></Route>
<Route path="/signup"> <ReversePrivateRouteGuard> <Signup/> </ReversePrivateRouteGuard></Route>

<Route path="/profile"> <PrivateRouteGuard> <Profile /> </PrivateRouteGuard></Route>
<Route path="/fridge"> <PrivateRouteGuard> <Fridge /> </PrivateRouteGuard></Route>

<Route path="/about"><About/> </Route>


</Router>

<Footer></Footer>