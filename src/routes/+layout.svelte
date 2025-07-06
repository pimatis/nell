<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

<style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    :global(body) {
        font-family: 'Inter', sans-serif;
        margin: 0;
        padding: 0;
        justify-content: center;
        background-color: #120f15;
        color: #ffffff;
    }
</style>
