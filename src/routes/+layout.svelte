<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

<nav>
    <ul>
		<li><a href="/">Home</a></li>
        <li><a href="/auth/login">Login</a></li>
        <li><a href="/auth/register">Register</a></li>
    </ul>
</nav>

{@render children()}
