<template>
    <div>
      <!-- Table Wrapper -->
      <div class="overflow-x-auto">
        <!-- Table -->
        <table class="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              <!-- Table Headers -->
              <th
                v-for="(label, index) in labels"
                :key="index"
                class="px-4 py-2 border-b bg-gray-100 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {{ label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Table Rows -->
            <tr v-for="(row, index) in rows" :key="index" class="hover:bg-gray-50">
              <!-- Table Cells -->
              <td
                v-for="(header, colIndex) in headers"
                :key="colIndex"
                class="px-4 py-2 border-b text-sm text-gray-700"
              >
                <!-- Scoped Slot for Custom Cell Content -->
                <slot :name="'cell-' + colIndex" :row="row">
                  {{ row[header] }}
                </slot>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ReusableTable',
    props: {
      labels: {
        type: Array,
        required: true
      },
      // Array of column headers
      headers: {
        type: Array,
        required: true
      },
      // Array of row data, where each row is an object
      rows: {
        type: Array,
        required: true
      }
    }
  };
  </script>
  