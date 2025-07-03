<script lang="ts">
  import QRCode from 'qrcode';
  import JsBarcode from 'jsbarcode';

  let {data, form} = $props();
  //qr code
  let qrUrl = $state('');
  const product = data.product;
  // Encode product ID or SKU or URL
  const text = `Product SKU: ${product.sku}`;

  QRCode.toDataURL(text)
    .then(url => {
      qrUrl = url;
    })
    .catch(err => {
      console.error(err);
  });

  //barcode
  // let svg = $state(document.getElementById('barcode'));
  // // Generate barcode
  // if (svg && product.sku) {
  //   JsBarcode(svg, product.sku, {
  //     format: 'CODE128',
  //     lineColor: '#000',
  //     width: 2,
  //     height: 60,
  //     displayValue: true
  //   });
  // }
  let modalEl: HTMLDialogElement;
  function openModal() {
    modalEl.showModal();
  }
  let isDisabled = $state(true);
  // console.log(form?.error?.quantity);
</script>
<div class="p-2">
  <h1 class="text-3xl lg:text-5xl font-bold text-gray-800 mb-4">Product Detail</h1>

  <div class="flex flex-col lg:flex-row justify-center">
    <div class="px-2">
      <form method="POST" action="?/edit">
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Product Name</legend>
          <input class="input input-bordered" type="text" id="name" name="name" value={data.product.name} required disabled={isDisabled}/>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">SKU</legend>
          <input class="input input-bordered" type="text" id="sku" name="sku" value={data.product.sku} required disabled={isDisabled}/>
        </fieldset>
        <fieldset class="fieldset">
          <legend class="fieldset-legend">Description</legend>
          <input class="input input-bordered" type="text" id="description" name="description" value={data.product.description} required disabled={isDisabled}/>
        </fieldset>
        <button class="btn btn-primary" type="submit" hidden={isDisabled}>Save Changes</button>
        <button type="button" class="btn" onclick={() => isDisabled = !isDisabled} hidden={!isDisabled}>Edit</button>
        <button type="button" class="btn" onclick={() => isDisabled = !isDisabled} hidden={isDisabled}>Cancel</button>
        <button type="button" class="btn btn-warning" onclick="{() => openModal()}" hidden={!isDisabled}>Delete</button>
      </form>
    </div>
    <div>
      <dialog id="my_modal_1" class="modal" bind:this={modalEl}>
        <div class="modal-box">
          <h3 class="text-lg font-bold">Warning Delete Product!</h3>
          <p class="py-4">Are you sure want to delete this product?</p>
          <div class="modal-action">
            <form method="POST" action="?/delete">
                <button type="submit" class="btn btn-error">Yes, Delete</button>
            </form>
            <form method="dialog">
              <button class="btn">Close</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
    <div class="px-2">
      <h2>🧾 Product QR Code</h2>
      {#if qrUrl}
        <img src={qrUrl} alt="QR Code" />
        <p><small>Encodes: {text}</small></p>
      {:else}
        <p>Loading QR code...</p>
      {/if}
    </div>
  </div>
  <!-- <h2>🏷️ Product Barcode</h2>
  {#if product.sku}
    <svg id="barcode"></svg>
    <p><small>Barcode for SKU: {product.sku}</small></p>
  {:else}
    <p>No SKU available for barcode.</p>
  {/if} -->

  <div class="flex flex-col lg:flex-row lg:justify-between p-2">
    <!-- Add inbound -->
    <form method="POST" action="?/inbound">
      <h3>Inbound</h3>
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">Inbound details</legend>

        <label class="label" for="quantity_in">Quantity</label>
        <input type="number" class="input" id="quantity_in" name="quantity_in" placeholder="0" />
        {#if form?.fields === 'quantity_in'}
        <small class="text-red-500">{form?.error?.quantity}</small>
        {/if}

        <label class="label" for="notes_in">Notes</label>
        <input type="text" class="input" id="notes_in" name="notes_in" placeholder="..." />
        <button class="btn btn-primary" type="submit">+ Inbound</button>
      </fieldset>
      <h2>📥 Inbound History</h2>
      {#if data.inbound.length > 0}
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>Qty</th>
              <th>Notes</th>
              <th>By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#each data.inbound as entry}
              <tr>
                <td>{entry.quantity}</td>
                <td>{entry.notes}</td>
                <td>{entry.created_by}</td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if data.inboundPagination.count > 10}
          <nav style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
            {#if data.inboundPagination.previous}
              <a href="?inbound_page={data.inboundPagination.page - 1}&page_size={data.inboundPagination.pageSize}">⬅️ Prev</a>
            {/if}
            <span>Page {data.inboundPagination.page}</span>
            {#if data.inboundPagination.next}
              <a href="?inbound_page={data.inboundPagination.page + 1}&page_size={data.inboundPagination.pageSize}">Next ➡️</a>
            {/if}
          </nav>
        {/if}
      </div>
      {:else}
        <p>No inbound records yet.</p>
      {/if}
    </form>

    <!-- Add outbound -->
    <form method="POST" action="?/outbound">
      <h3>Outbound</h3>
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">Outbound details</legend>

        <label class="label" for="quantity_out">Quantity</label>
        <input type="number" class="input" id="quantity_out" name="quantity_out" placeholder="0" />
        {#if form?.fields === 'quantity_out'}
          <small class="text-red-500">{form?.error?.quantity}</small>
        {/if}

        <label class="label" for="notes_out">Notes</label>
        <input type="text" class="input" id="notes_out" name="notes_out" placeholder="..." />
        <button class="btn btn-primary" type="submit">- Outbound</button>
      </fieldset>
      <h2>📤 Outbound History</h2>
      {#if data.outbound.length > 0}
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>Qty</th>
              <th>Notes</th>
              <th>By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#each data.outbound as entry}
              <tr>
                <td>{entry.quantity}</td>
                <td>{entry.notes}</td>
                <td>{entry.created_by}</td>
                <td>{new Date(entry.created_at).toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if data.outbound.count > 10}
          <nav style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
            {#if data.outboundPagination.previous}
              <a href="?outbound_page={data.outboundPagination.page - 1}&page_size={data.outboundPagination.pageSize}">⬅️ Prev</a>
            {/if}
            <span>Page {data.outboundPagination.page}</span>
            {#if data.outboundPagination.next}
              <a href="?outbound_page={data.outboundPagination.page + 1}&page_size={data.outboundPagination.pageSize}">Next ➡️</a>
            {/if}
          </nav>
        {/if}
      </div>
      {:else}
        <p>No outbound records yet.</p>
      {/if}

    </form>

    <form method="POST" action="?/cycle">
      <h3>🔁 Cycle Count</h3>
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
        <legend class="fieldset-legend">Cycle Counts</legend>

        <label class="label" for="counted_quantity">Counted Quantity</label>
        <input type="number" class="input" id="counted_quantity" name="counted_quantity" placeholder="0" />

        <label class="label" for="notes_cycle">Notes</label>
        <input type="text" class="input" id="notes_cycle" name="notes_cycle" placeholder="eg monthly check" />
        <button class="btn btn-primary" type="submit">Update Stock</button>
      </fieldset>
      <h2>🔁 Cycle Count History</h2>
      {#if data.cycleCounts.length > 0}
      <div class="overflow-x-auto">
        <table class="table table-zebra">
          <!-- head -->
          <thead>
            <tr>
              <th>Counted</th>
              <th>Old Qty</th>
              <th>Diff</th>
              <th>Notes</th>
              <th>By</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {#each data.cycleCounts as count}
              <tr>
                <td>{count.counted_quantity}</td>
                <td>{count.previous_quantity}</td>
                <td>{count.difference}</td>
                <td>{count.notes}</td>
                <td>{count.created_by}</td>
                <td>{new Date(count.created_at).toLocaleString()}</td>
              </tr>
            {/each}
          </tbody>
        </table>
        {#if data.cycleCounts.count > 10}
          <nav style="margin-top: 1rem; display: flex; gap: 1rem; align-items: center;">
            {#if data.cyclePagination.previous}
              <a href="?cycle_page={data.cyclePagination.page - 1}&page_size={data.cyclePagination.pageSize}">⬅️ Prev</a>
            {/if}
            <span>Page {data.cyclePagination.page}</span>
            {#if data.cyclePagination.next}
              <a href="?cycle_page={data.cyclePagination.page + 1}&page_size={data.cyclePagination.pageSize}">Next ➡️</a>
            {/if}
          </nav>
        {/if}
      </div>
      {:else}
        <p>No cycle counts yet.</p>
      {/if}
    </form>
  </div>
</div>