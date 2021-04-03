<template>
  <div class="px-0 py-4 overflow-x-visible w-full mx-auto">
    <div class="p-2 overflow-x-visible w-full mx-auto">
      <h1 class="text-xl text-center font-semibold text-gray-600">
        Daily Report
      </h1>
      <p class="text-sm text-center font-semibold text-gray-600">
        {{ humanizeDate(today) }}
      </p>
      <p class="text-sm text-center font-normal text-gray-600 px-4">
        You spent approximately
        {{ humanizeDuration(total * 1000, { largest: 2 }) }} browsing today
      </p>
      <div
        class="inline-block min-w-full shadow rounded-lg overflow-hidden p-0 mt-4"
      >
        <table class="min-w-full leading-normal m-0">
          <thead>
            <tr>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase"
              >
                Origin
              </th>
              <th
                class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="entry in history" v-bind:key="entry.origin">
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <div class="flex items-center">
                  <p class="text-gray-900 whitespace-no-wrap">
                    {{ entry.origin }}
                  </p>
                </div>
              </td>
              <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ humanizeDuration(entry.totalTime * 1000, { largest: 2 }) }}
                </p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <a
        href="#"
        v-on:click="openOptionsPage"
        class="text-sm text-center font-semibold text-gray-600 block mt-4"
      >
        View full history
      </a>
    </div>
  </div>
</template>

<script src="./App.js"></script>
