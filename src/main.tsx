/**
 * @file Application entry point.
 *
 * Mounts the React app into the DOM, wrapping it with the Redux `Provider`
 * to make the store available to all descendant components.
 *
 * The import of `index.css` applies any global stylesheets.
 *
 * @see {@link App} — root application component
 * @see {@link store} — Redux store singleton
 */

import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { Provider } from 'react-redux';
import { store } from './stores/store';

createRoot(document.getElementById('root')!).render(
  <Provider store={store}>
      <App />
  </Provider>,
)
