import { render } from "solid-js/web";
import "./app.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Route, Router } from "@solidjs/router";
import { App } from "./app";
import { Home } from "./pages/home";
import { Bridge, Jack, Knob, Model, Nut, Pickup, Switch } from "./pages/entity-with-sprite.page";
import ModelEditor from "./pages/model-editor/model-editor.page";
import BridgeEditor from "./pages/bridge-editor/bridge-editor.page";
import JackEditor from "./pages/jack-editor/jack-editor.page";
import KnobEditor from "./pages/knob-editor/knob-editor.page";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route component={App}>
          <Route path="/" component={Home} />
          <Route path="/guitar-models">
            <Route path="" component={Model} />
            <Route path=":id" component={ModelEditor} />
          </Route>
          <Route path="/bridges">
            <Route path="" component={Bridge} />
            <Route path=":id" component={BridgeEditor} />
          </Route>
          <Route path="/jacks">
            <Route path="" component={Jack} />
            <Route path=":id" component={JackEditor} />
          </Route>
          <Route path="/knobs">
            <Route path="" component={Knob} />
            <Route path=":id" component={KnobEditor} />
          </Route>
          <Route path="/nuts">
            <Route path="" component={Nut} />
            {/* */}
          </Route>
          <Route path="/pickups">
            <Route path="" component={Pickup} />
            {/* */}
          </Route>
          <Route path="/switchs">
            <Route path="" component={Switch} />
            {/* */}
          </Route>  
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!
);