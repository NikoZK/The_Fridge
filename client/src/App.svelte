<script>
  import { Router, Link, Route } from "svelte-routing";
  import { onMount } from "svelte";
  import PrivateRouteGuard from "./components/Route_guards/PrivateRouteGuard.svelte";
  import Login from "./components/Login.svelte";
  import Signup from "./components/Signup.svelte";
  import Profile from "./components/Profile.svelte";
  import Fridge from "./components/Fridge.svelte";
  import About from "./components/About.svelte";
  import NotFound from "./components/NotFound.svelte";
  import Footer from "./components/footer/Footer.svelte";
  import ReversePrivateRouteGuard from "./components/Route_guards/ReversePrivateRouteGuard.svelte";
  import toastr from "toastr";
  import "toastr/build/toastr.min.css";

  let isLoggedIn = false;

  onMount(async () => {
    const response = await fetch("http://localhost:8080/auth/me", {
      credentials: "include",
    });
    isLoggedIn = response.ok;
  });

  async function logout() {
    const response = await fetch("http://localhost:8080/auth/logout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error);
    return data;
  }

  async function handleLogout() {
    try {
      const data = await logout();
      toastr.success("You have signed out!");
      location.reload();
    } catch (error) {
      toastr.error(error.message);
    }
  }
</script>

<div class={isLoggedIn ? "logged-in-bg" : "logged-out-bg"} id="outer-body" >
  <Router>
    <nav class="navbar">
      <div class="nav-left">
        <img src="/fridge.png" alt="logo" class="nav-logo" />
        <span class="nav-title">The Fridge</span>

        {#if isLoggedIn}
          <Link to="/profile">Profile</Link>
          <Link to="/fridge">Fridge</Link>
        {/if}

        <Link to="/about">About</Link>
      </div>

      <div class="nav-right">
        {#if !isLoggedIn}
          <Link to="/login">Login</Link>
          <Link to="/signup">Sign up</Link>
        {/if}

        {#if isLoggedIn}
          <Link on:click={handleLogout} to="/login">Logout</Link>
        {/if}
      </div>
    </nav>

    <main class="page-content">

    <Route path="/*" exact>
      <NotFound/>
    </Route>

    <Route path="/login">
      <ReversePrivateRouteGuard><Login /></ReversePrivateRouteGuard>
    </Route>

    <Route path="/signup">
      <ReversePrivateRouteGuard><Signup /></ReversePrivateRouteGuard>
    </Route>

    <Route path="/profile">
      <PrivateRouteGuard><Profile /></PrivateRouteGuard>
    </Route>

    <Route path="/fridge">
      <PrivateRouteGuard><Fridge /></PrivateRouteGuard>
    </Route>

    <Route path="/about"><About /></Route>

    </main>
  </Router>

  <Footer></Footer>
</div>
