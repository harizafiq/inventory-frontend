<script lang="ts">
	import '../app.css';
  const title = import.meta.env.VITE_PUBLIC_APP_NAME;
	let { children, data } = $props();
</script>
<svelte:head>
	<title>{title}</title>
	<meta name="description" content="This is where the description goes for SEO" />
</svelte:head>
<div class="drawer" data-sveltekit-reload><!-- Needed for reload at layout svelte -->
  <input id="my-drawer-3" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content flex flex-col">
    <!-- Navbar -->
    <div class="navbar bg-base-300 w-full">
      <div class="flex-none lg:hidden">
        <label for="my-drawer-3" aria-label="open sidebar" class="btn btn-square btn-ghost">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            class="inline-block h-6 w-6 stroke-current"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
      <div class="mx-2 flex-1 px-2">Inventory Management Ha</div>
      <div class="hidden flex-none lg:block">
        <ul class="menu menu-horizontal">
            <!-- Navbar menu content here -->
            {#if !data.isAuthenticated}
                <li><a href="/">Home</a></li>
                <li><a href="/auth/login">Login</a></li>
                <li><a href="/auth/register">Register</a></li>
            {:else}
                <li><a href="/dashboard">Dashboard</a></li>
                <li><a href="/products">Products</a></li>
                {#if data.user.role === 'admin'}
                    <li><a href="/audit">Audit</a></li>
                {/if}
                <li><a href="/logout">Logout</a></li>
            {/if}
        </ul>
      </div>
    </div>
    <!-- Page content here -->
  </div>
  <div class="drawer-side">
    <label for="my-drawer-3" aria-label="close sidebar" class="drawer-overlay"></label>
    <ul class="menu bg-base-200 min-h-full w-80 p-4">
      <!-- Sidebar content here -->
       {#if !data.isAuthenticated}
            <li><a href="/">Home</a></li>
            <li><a href="/auth/login">Login</a></li>
            <li><a href="/auth/register">Register</a></li>
        {:else}
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/products">Products</a></li>
            <li><a href="/audit">Audit</a></li>
            <li><a href="/logout">Logout</a></li>
        {/if}
    </ul>
  </div>
</div>

{@render children()}
