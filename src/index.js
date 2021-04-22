import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import './ckeditor.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloLink, concat } from 'apollo-boost';
import { createUploadLink } from 'apollo-upload-client';
import * as serviceWorker from './serviceWorkerRegistration';

const uploadLink = createUploadLink({
    uri: 'https://61si4rkyc6.execute-api.ap-northeast-2.amazonaws.com/dev/graphql',
    // uri: 'http://172.31.99.49:4000',
});

const authMiddleware = new ApolloLink((operation, forward) => {
    if (localStorage.getItem('accessToken')) {
        operation.setContext({
            headers: {
                authorization: localStorage.getItem('accessToken'),
            },
        });
    }

    return forward(operation);
});

const client = new ApolloClient({
    link: concat(authMiddleware, uploadLink),
    cache: new InMemoryCache(),
});

ReactDOM.render(
    <ApolloProvider client={client}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
);
serviceWorker.unregister();

reportWebVitals();
