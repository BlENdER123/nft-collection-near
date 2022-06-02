import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { createStore } from 'redux';

import Extensions from "./index";

export default {
  component: Extensions,
  decorators: [(story) => <BrowserRouter>{story()}</BrowserRouter>],
  title: 'Pages/Swap',
};

// eslint-disable-next-line react/prop-types
const Template = (store, args) => (
  <Provider store={store}>
    <Extensions {...args} />
  </Provider>
);
//
// export const WithoutWallet = Template.bind({}, createStore(rootReducer));
//
// export const WithoutTokens = Template.bind(
//   {},
//   createStore(rootReducer, {
//     appReducer: { walletIsConnected: true },
//     tonData: {
//       pairs: values(pairs),
//       tokens: [],
//     },
//   }),
// );
//
// export const WithoutPairs = Template.bind(
//   {},
//   createStore(rootReducer, {
//     appReducer: { walletIsConnected: true },
//     tonData: {
//       pairs: [],
//       tokens: values(tokens),
//     },
//   }),
// );
//
// export const WithPairsAndTokens = Template.bind(
//   {},
//   createStore(rootReducer, {
//     appReducer: { walletIsConnected: true },
//     tonData: {
//       pairs: values(pairs),
//       tokens: values(tokens),
//     },
//   }),
// );
