<template>
  <div class="px-0 py-4 overflow-x-visible w-full mx-auto">
    <div class="p-2 overflow-x-visible w-full mx-auto">
      <h1 class="text-xl text-center font-semibold text-gray-600">
        Daily Report
      </h1>
      <p class="text-sm text-center font-semibold text-gray-600">{{ today }}</p>
      <p class="text-sm text-center font-normal text-gray-600">
        You spent approximately {{ total }} browsing today
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
                  {{ entry.totalTime }}
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
      <!-- <a
        href="#"
        v-on:click="openSettingsPage"
        class="text-sm text-center font-semibold text-gray-600 block mt-4"
      >
        Or go to settings
      </a>-->
    </div>
  </div>
</template>

<script>
import humanizeDuration from "humanize-duration";
import { isValidDate, compare, humanizeEntry, humanizeDate } from "../utils.js";

export default {
  name: "app",
  data: function () {
    return {
      history: [],
      today: humanizeDate(new Date()),
      total: 0,
    };
  },
  mounted: async function () {
    const year = new Date().getFullYear();
    const month = new Date().getMonth();
    const day = new Date().getDate();

    const { data } = await browser.storage.local.get("data");

    if (!data) return;

    const history = Object.keys(data)
      .filter((key) => data[key][year][month][day]) // make sure to only display websites visited today
      .map((key) => {
        return {
          origin: key,
          ...data[key],
          totalTime: data[key][year][month][day],
        };
      })
      .sort((a, b) => compare(a.totalTime, b.totalTime, "totalTime", false))
      .slice(0, 5);

    this.history = history.map(humanizeEntry);

    const total = history.reduce((t, c) => t + c.totalTime, 0);
    this.total = humanizeDuration(total * 1000, { largest: 1 });
  },
  methods: {
    openOptionsPage: () => browser.runtime.openOptionsPage(),
  },
};
</script>
