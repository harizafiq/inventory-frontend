<script lang="ts">
  let {data} = $props();
</script>

<h1>📋 Audit Log</h1>
<div class="flex flex-col">
  <div class="overflow-x-auto">
    {#if data.logs.length > 0}
    <!-- <form method="GET">
      <label for="page_size">Items per page: </label>
      <select name="page_size" id="page_size" onchange={(e) => SubmitEvent()} >
        <option value="1" selected={data.pageSize === 1}>1</option>
        <option value="10" selected={data.pageSize === 10}>10</option>
        <option value="20" selected={data.pageSize === 20}>20</option>
      </select>
      <input type="hidden" name="page" value="1" />
    </form> -->
    <table class="table table-zebra">
      <!-- head -->
      <thead>
        <tr>
          <th>Type</th>
          <th>Product</th>
          <th>Qty</th>
          <th>User</th>
          <th>Notes</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {#each data.logs as log}
          <tr>
            <td>{log.type}</td>
            <td>{log.product}</td>
            <td>{log.quantity}</td>
            <td>{log.user}</td>
            <td>{log.notes}</td>
            <td>{new Date(log.created_at).toLocaleString()}</td>
          </tr>
        {/each}
      </tbody>
    </table>
    {:else}
      <p>No activity yet.</p>
    {/if}
  </div>
  <!-- {#if data.count > 10}
    <nav style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
      {#if data.previous}
        <a href="?page={data.page - 1}">⬅️ Prev</a>
      {/if}

      <span>Page {data.page}</span>

      {#if data.next}
        <a href="?page={data.page + 1}">Next ➡️</a>
      {/if}
    </nav>
  {/if} -->
</div>