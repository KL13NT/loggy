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
        Showing {{ history.length }} Entries
      </span>
      <table class="min-w-full leading-normal mt-4">
        <thead>
          <tr>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              data-sortby="origin"
              v-on:click="sort"
							v-on:keyup.enter="sort"
							v-on:keyup.space="sort"
              tabindex="0"
              aria-label="sort by origin"
            >
              Origin
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              data-sortby="lastVisit"
              v-on:click="sort"
							v-on:keyup.enter="sort"
							v-on:keyup.space="sort"
              tabindex="0"
              aria-label="sort by last visit"
            >
              Last Visit
            </th>
            <th
              class="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider cursor-pointer"
              data-sortby="totalTime"
              v-on:click="sort"
							v-on:keyup.enter="sort"
							v-on:keyup.space="sort"
              tabindex="0"
              aria-label="sort by total time"
            >
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="entry in sortedHistory" v-bind:key="entry.origin">
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <div class="flex items-center">
                <p class="text-gray-900 whitespace-no-wrap">
                  {{ entry.origin }}
                </p>
              </div>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ entry.lastVisit }}
              </p>
            </td>
            <td class="px-5 py-5 border-b border-gray-200 bg-white text-sm">
              <p class="text-gray-900 whitespace-no-wrap">
                {{ entry.totalTime }}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
      <div
        class="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between"
      >
        <span class="text-xs xs:text-sm text-gray-900">
          Showing {{ history.length }} Entries
        </span>
        <!--
        <div class="inline-flex mt-2 xs:mt-0">
          <button
            class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l"
          >
            Prev
          </button>
          <button
            class="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r"
          >
            Next
          </button>
        </div>
				-->
      </div>
    </div>
  </div>
</template>

<script>
import { isValidDate, compare, humanizeEntry } from "../utils.js";

export default {
  name: "app",
  data: function () {
    return {
      history: [],
      sortby: "totalTime",
      ascending: false,
      search: "",
    };
  },
  mounted: async function () {
    const { data } = await browser.storage.local.get("data");

    this.history = Object.keys(data).map((key) => {
      return {
        origin: key,
        ...data[key],
      };
    });
  },
  computed: {
    sortedHistory: function () {
      return Array.from(this.history)
        .sort((a, b) => {
          const keyA = a[this.sortby];
          const keyB = b[this.sortby];

          return compare(keyA, keyB, this.sortby, this.ascending);
        })
        .map(humanizeEntry)
        .filter(
          (entry) =>
            (this.search && entry.origin.includes(this.search)) || !this.search,
        );
    },
  },
  methods: {
    sort: function (event) {
      const sortby = event.currentTarget.dataset.sortby;

      this.ascending = this.sortby === sortby && !this.ascending;
      this.sortby = sortby;
    },
  },
};
</script>
