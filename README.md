Benzinga Coding Example
============

# Coding example for Benzinga.
"For this challenge, you will be creating a simple portfolio system that allows a user to buy and sell stock according to the the top bid and ask in the order book. When a user lands on the page they will be given $100,000.00 in cash to create their portfolio with (this can just be stored in a cookie or session). They will be able to lookup stocks by symbol and then buy shares of that particular stock at the current ask price. Once bought, stocks will appear in their portfolio and the total cost of the trade will be deducted from their cash balance. When they sell shares, the shares will be sold at the current bid price and the quantity sold will be taken out of their portfolio (removed completely if all shares sold) and the total amount from the sale will be added to their cash balance.

The only required external connection is for our stock data API. Below we provide you with the endpoint for the REST API that you will use to pull down the bid and ask for a symbol as JSON. If a symbol is not found, an error will be returned and you should display to users on your frontend that the symbol they requested was not found.

We will not be taking the bid and ask sizes into effect and instead will be assuming that there are an infinite amount of shares available at the current bid and ask prices. Users should be prevented from placing trades that would cause their total cash balance to go negative. Users should not be allowed to sell more shares than the currently have available in their portfolio (For those familliar with shorting, this challenge is only for long stock trades).

The way the completed project actually functions is entirely up to you. You could build out the interface with a Javascript MVC and use websockets for exchanging data or you could just use simple HTML pages with standard POST and GET requests. You should treat this challenge as a chance to showcase your knowledge and expertise. If you don't know anything about websockets, we don't want you to spend 8 hours hacking together a solution that will work with that. We'd much rather see you complete this challenge quickly and effeciently using the skillset you know best."

## Start

```bash
npm install
```
```bash
bower install
```

Requires gulp, nodejs, sass, bower.
## Development

To start developing in the project run:

```bash
gulp serve
```

Then head to `http://localhost:3000` in your browser.

The `serve` tasks starts a static file server, which serves the AngularJS application, and a watch task which watches all files for changes and lints, builds and injects them into the index.html accordingly.

## Tests

To run tests run:

```bash
gulp test
```

**Or** first inject all test files into `karma.conf.js` with:

```bash
gulp karma-conf
```

Then you're able to run Karma directly. Example:

```bash
karma start --single-run
```

## Production ready build - a.k.a. dist

To make the app ready for deploy to production run:

```bash
gulp dist
```

Now there's a `./dist` folder with all scripts and stylesheets concatenated and minified, also third party libraries installed with bower will be concatenated and minified into `vendors.min.js` and `vendors.min.css` respectively.
