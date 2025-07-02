<script lang="ts">
    let {data}= $props();
</script>

<h1>📦 Products</h1>
<button><a href="/products/create">Create Product</a></button>
{#if data.products.length === 0}
  <p>No products available.</p>
{:else}
  <!-- <form method="GET">
    <label for="page_size">Items per page: </label>
    <select name="page_size" id="page_size" onchange={(e) => SubmitEvent()} >
      <option value="1" selected={data.pageSize === 1}>1</option>
      <option value="10" selected={data.pageSize === 10}>10</option>
      <option value="20" selected={data.pageSize === 20}>20</option>
    </select>
    <input type="hidden" name="page" value="1" />
  </form> -->
  <table border="1" cellpadding="8">
    <thead>
      <tr>
        <th>Name</th>
        <th>SKU</th>
        <th>Description</th>
        <th>Quantity</th>
        <th>Detail</th>
      </tr>
    </thead>
    <tbody>
      {#each data.products as product}
        <tr>
            <td>{product.name}</td>
            <td>{product.sku}</td>
            <td>{product.description}</td>
            <td>{product.quantity}</td>
            <td><a href="/products/{product.id}">Detail</a></td>
        </tr>
      {/each}
    </tbody>
  </table>
{/if}
{#if data.count > 10}
  <nav style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
    {#if data.previous}
      <a href="?page={data.page - 1}">⬅️ Prev</a>
    {/if}

    <span>Page {data.page}</span>

    {#if data.next}
      <a href="?page={data.page + 1}">Next ➡️</a>
    {/if}
  </nav>
{/if}