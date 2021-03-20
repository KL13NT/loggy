import Vue from "vue";
import App from "./App.vue";

import "./style.css";

new Vue({
  el: "#app",
  render: (h) => h(App),
});

console.log("s");

// class App extends Component {
//   // state = {};

//   // async componentDidMount() {
//   //   const data = await browser.storage.local.get("data");
//   //   console.log(data);
//   // }

//   render() {
//     return (

//     );
//   }
// }

// render(<App />, document.body);

// browser.storage.local.get("data").then((data) => {
//   console.log(data);
//   render(<App />, log);
// });
