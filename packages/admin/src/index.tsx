import { render } from "solid-js/web";
import "./app.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Route, Router } from "@solidjs/router";
import { AdminApp } from "./admin-app";
import { Bridge, Headstock, Jack, Knob, Model, Nut, Peg, Pickup, Switch } from "./pages/admin/entity-with-sprite.page";
import ModelEditor from "./pages/admin/model-editor/model-editor.page";
import BridgeEditor from "./pages/admin/bridge-editor/bridge-editor.page";
import JackEditor from "./pages/admin/jack-editor/jack-editor.page";
import KnobEditor from "./pages/admin/knob-editor/knob-editor.page";
import HeadstockEditor from "./pages/admin/headstock-editor/headstock-editor.page";
import PegEditor from "./pages/admin/peg-editor.ts/peg-editor.page";
import NutEditor from "./pages/admin/nut-editor/nut-editor.page";
import PickupEditor from "./pages/admin/pickup-editor/pickup-editor.page";
import SwitchEditor from "./pages/admin/switch-editor/switch-editor.page";
import { GuitarBuilder } from "./pages/guitar-builder/guitar-builder";
import { AdminHome } from "./pages/admin/admin-home";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Route path="/" component={GuitarBuilder} />
        <Route path="/admin" component={AdminApp}>
          <Route path="/" component={AdminHome} />
          <Route path="/guitar-models">
            <Route path="" component={Model} />
            <Route path=":id" component={ModelEditor} />
          </Route>
          <Route path="/bridges">
            <Route path="" component={Bridge} />
            <Route path=":id" component={BridgeEditor} />
          </Route>
          <Route path="/headstocks">
            <Route path="" component={Headstock} />
            <Route path=":id" component={HeadstockEditor} />
          </Route>
          <Route path="/jacks">
            <Route path="" component={Jack} />
            <Route path=":id" component={JackEditor} />
          </Route>
          <Route path="/knobs">
            <Route path="" component={Knob} />
            <Route path=":id" component={KnobEditor} />
          </Route>
          <Route path="/pegs">
            <Route path="" component={Peg} />
            <Route path=":id" component={PegEditor} />
          </Route>
          <Route path="/nuts">
            <Route path="" component={Nut} />
            <Route path=":id" component={NutEditor} />
          </Route>
          <Route path="/pickups">
            <Route path="" component={Pickup} />
            <Route path=":id" component={PickupEditor} />
          </Route>
          <Route path="/switchs">
            <Route path="" component={Switch} />
            <Route path=":id" component={SwitchEditor} />
          </Route>  
        </Route>
      </Router>
    </QueryClientProvider>
  ),
  document.getElementById("root")!
);