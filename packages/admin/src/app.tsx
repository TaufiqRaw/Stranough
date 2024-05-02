
import { Route, Router } from "@solidjs/router";
import "./app.css";
import BodyEditor from "./pages/BodyEditor";
import Home from "./pages/Home";
import { render } from "solid-js/web";
import Body from "./pages/Body";

function App(props : any) {
  return <div class="flex flex-row">
    <nav class="bg-util p-3 text-white-950 flex flex-col gap-3 h-screen">
      <a href="/">Home</a>
      <a href="/body">Body</a>
    </nav>
    <div class="flex-grow p-3">
      {props.children}
    </div>
  </div>
}

render(() => <Router>
  <Route component={App}>
    <Route path="/" component={Home} />
    <Route path="/body" component={Body} />
  </Route>
  <Route path="/body/editor" component={BodyEditor} />
</Router>  
, document.getElementById('root')!)