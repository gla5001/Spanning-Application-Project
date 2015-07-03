# Spanning-Application-Project

Greg's ATM
=========

Here is the ATM homework assignment (ui version). This was written using angularJS (and html and css). It uses a stubbed backend for user interaction (below you'll find a list of pins that can be used). The app mocks a RESTful api service by using a get request to fetch a json file with account information. Once an account is fetched a user session is created using sessionStorage. Data is persisted (to mock REST service) by using localStorage, so users can log in and out and see correct balances after transactions.


Installation
--------------
You'll need to run the application on a local web server (ie apache). Once the project is imported into a local environment and local web server is started, run index.html.

Tested Browsers
---------------
I have tested in the following browsers.

* Firefox 32.0.1
* Chrome 37
* IE 10

How to Use
-----------

Here are a list of pins that can be used to test accounts. You are able to check balance, withdraw, and deposit funds.

* 1111 - Peter Parker
* 2222 - Bob Belcher
* 3333, 4444 - Homer and Marge Simpson. This is a shared account.
* 1212 - Krusty
