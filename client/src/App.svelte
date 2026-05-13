<script>
  import { Router, Link, Route } from 'svelte-routing'
  import { onMount } from 'svelte'
  import PrivateRouteGuard from './components/PrivateRouteGuard.svelte';
  import Login from './components/Login.svelte'
  import Signup from './components/Signup.svelte'
  import Profile from './components/Profile.svelte'
  import Fridge from './components/Fridge.svelte';
  import About from './components/About.svelte'
  import ReversePrivateRouteGuard from './components/ReversePrivateRouteGuard.svelte';

  let isLoggedIn = false

  onMount(async () => {
    const response = await fetch('http://localhost:8080/auth/me', {
      credentials: 'include'
    })
    isLoggedIn = response.ok
  })
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
    {/if}

    <Link to="/about">About</Link>
  </nav>


<Route path="/login"> <ReversePrivateRouteGuard> <Login/> </ReversePrivateRouteGuard></Route>
<Route path="/signup"> <ReversePrivateRouteGuard> <Signup/> </ReversePrivateRouteGuard></Route>

<Route path="/profile"> <PrivateRouteGuard> <Profile /> </PrivateRouteGuard></Route>
<Route path="/fridge"> <PrivateRouteGuard> <Fridge /> </PrivateRouteGuard></Route>

<Route path="/about"><About/> </Route>


</Router>