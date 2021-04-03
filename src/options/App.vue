<template>
  <div class="px-4 sm:px-8 py-4 overflow-x-auto w-11/12 mx-auto">
    <div class="inline-block min-w-full shadow rounded-lg overflow-hidden py-4">
      <label class="ml-4">Search By Origin</label>
      <input
        type="text"
        class="ml-4 px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 tracking-wider"
        v-model="search"
      />
      <span class="ml-4 text-xs xs:text-sm text-gray-900">
        Showing {{ result.length }} Entries
      </span>
      <table class="min-w-full leading-normal mt-4">
        <thead>
          <tr>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-1/3"
            >
              Origin
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              First Visit
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Last Visit
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in result" v-bind:key="entry.origin">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div class="flex items-center">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ entry.origin }}
                </p>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ humanizeDate(entry.sessions[0].date) }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{
                  humanizeDate(entry.sessions[entry.sessions.length - 1].date)
                }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ humanizeDuration(entry.totalTime * 1000) }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
      >
        <span class="text-xs xs:text-sm text-gray-900">
          Showing {{ result.length }} Entries
        </span>
      </div>
    </div>
  </div>
</template>

<script src="./App.js"></script>
