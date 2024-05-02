/* @refresh reload */
import { render } from 'solid-js/web'

import './app.css'
import App from './app'
import { UserDataProvider } from './contexts/UserDataContext'

const root = document.getElementById('root')

render(() => <>
  <UserDataProvider>
    <App />
  </UserDataProvider>
</>
, root!)
