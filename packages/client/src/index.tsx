import { render } from "solid-js/web";
import "./app.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import { QueryClient, QueryClientProvider } from "@tanstack/solid-query";
import { Route, Router } from "@solidjs/router";
import { AdminApp } from "./admin-app";
import { Bridge, Headstock, Knob, ElectricModel, Nut, Peg, Pickguard, Pickup } from "./pages/admin/entity-with-sprite.page";
import ElectricModelEditor from "./pages/admin/electric-model-editor/electric-model-editor.page";
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
import 'swiper/css';
import PickguardEditor from "./pages/admin/pickguard-editor/pickguard-editor.page";
import { AcousticModelEditorGui } from "./pages/admin/acoustic-model-editor/components/acoustic-model-editor-gui";
import AcousticGuitarModelEditor from "./pages/admin/acoustic-model-editor/acoustic-guitar-model-editor.page";
import { Assets, ExtensionType, LoaderParser, Texture, extensions } from "pixi.js";
import axios from "axios";
import { AuthProvider } from "./commons/contexts/auth.context";
import { Login } from "./pages/auth/login";
import { Orders } from "./pages/admin/orders";
import { PixiLoadedAssetProvider } from "./commons/contexts/pixi-loaded-asset-counter.context";
import { RequireLogin } from "./pages/auth/require-login";
import { Register } from "./pages/auth/register";
import { NotFound } from "./pages/auth/not-found";
import { Unauthorized } from "./pages/auth/unauthorized";
import { UserDashboard } from "./pages/user/dashboard";
import { OnRouteChangeClearAssets } from "./pages/on-route-change-clear-assets";

const queryClient = new QueryClient();

render(
  () => (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PixiLoadedAssetProvider>
          <Router>
            <Route path="/" component={OnRouteChangeClearAssets}>
              <Route path="/builder" component={GuitarBuilder} />
              <Route path="/" component={(props)=><RequireLogin>{props.children}</RequireLogin>}>
                <Route path="/" component={UserDashboard} />
                <Route path="/builder/:id" component={GuitarBuilder} />
              </Route>
              <Route path="/admin" component={
                (props)=><RequireLogin adminOnly>
                  <AdminApp>
                    {props.children}
                  </AdminApp>
                </RequireLogin>
              }>
                <Route path="/" component={AdminHome} />
                {/* <Route path="/acoustic-guitar-models">
                  <Route path="" component={AcousticGuitarModel} />
                  <Route path=":id" component={AcousticGuitarModelEditor} />
                </Route> */}
                <Route path="/electric-guitar-models">
                  <Route path="" component={ElectricModel} />
                  <Route path=":id" component={ElectricModelEditor} />
                </Route>
                <Route path="/bridges">
                  <Route path="" component={Bridge} />
                  <Route path=":id" component={BridgeEditor} />
                </Route>
                <Route path="/headstocks">
                  <Route path="" component={Headstock} />
                  <Route path=":id" component={HeadstockEditor} />
                </Route>
                {/* <Route path="/jacks">
                  <Route path="" component={Jack} />
                  <Route path=":id" component={JackEditor} />
                </Route> */}
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
                {/* <Route path="/switchs">
                  <Route path="" component={Switch} />
                  <Route path=":id" component={SwitchEditor} />
                </Route>   */}
                <Route path="/pickguards">
                  <Route path="" component={Pickguard} />
                  <Route path=":id" component={PickguardEditor} />
                </Route>
                <Route path="/orders">
                  <Route path="" component={Orders}/>
                </Route>
              </Route>
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/unauthorized" component={Unauthorized} />
              <Route path="*" component={NotFound} />
            </Route>
          </Router>
        </PixiLoadedAssetProvider>
      </AuthProvider>
    </QueryClientProvider>
  ),
  document.getElementById("root")!
);