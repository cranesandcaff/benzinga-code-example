/**
 * @module overview
 * @name benzingaStockExchangeApp
 * @description Delcaration of the application and it's dependencies. This includes ngAnimate, Angular's animation library, not really needed for an app this small but it's flashy and fun. In reality we would need to take into account the Apps size to determine if it's really worth it in the end application, the same goes for the ngFx library which includes directives for animating portions of the view. {@link https://github.com/gsklee/ngStorage|ngStorage} is a third party library for interacting with session* and localStorage in an Angular way. That is, without getters and setters. In a larger application this would also include any route declarations however we don't really need more than the one page.
 * @requires ngAnimate
 * @requires ngSanitize
 * @requires ngStorage
 * @requires ngFx
 * @see module:Portfolio
 * @see module:PortfolioCtrl
 * @see module:FlashService
 */
angular.module('benzingaStockExchangeApp', [
    'ngAnimate',
    'ngSanitize',
    'ngStorage'
  ]);

(function(module) {
try {
  module = angular.module('benzingaStockExchangeApp');
} catch (e) {
  module = angular.module('benzingaStockExchangeApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('globalTemplates/header.html',
    '<header class="global"><h3>Simple Stock Exchange</h3><form ng-submit="marketSearch(symbol)" class="search" name="search"><input type="text" name="symbol_search" ng-model="symbol" placeholder="Enter Symbol"> <button name="lookup">Lookup</button></form></header>');
}]);
})();

(function(module) {
try {
  module = angular.module('benzingaStockExchangeApp');
} catch (e) {
  module = angular.module('benzingaStockExchangeApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('portfolio/templates/currentPortfolio.html',
    '<section class="portfolio"><header><h4>Current Portfolio</h4><h4 ng-bind="\'Cash: \'+ portfolio.balance"></h4></header><table class="table"><tr><th>Company</th><th>Quantity</th><th colspan="2">Price Paid</th></tr><tr ng-repeat="stock in portfolio.owned"><td ng-bind="stock.name"></td><td ng-bind="stock.quantity"></td><td ng-bind="stock.vwap | currency"></td><td><button ng-click="marketSearch(stock.symbol)">View Stock</button></td></tr></table></section>');
}]);
})();

(function(module) {
try {
  module = angular.module('benzingaStockExchangeApp');
} catch (e) {
  module = angular.module('benzingaStockExchangeApp', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('portfolio/templates/details.html',
    '<section class="details"><div ng-show="currentCompany"><header><h3 ng-bind="currentCompany.name"></h3></header><table class="table"><tr><th>Bid</th><th>Ask</th></tr><tr><td ng-bind="currentCompany.bid | currency"></td><td ng-bind="currentCompany.ask | currency"></td></tr></table><input type="number" name="symbol_search" ng-model="quantity" placeholder="Quantity" min="0"> <button name="buy" class="btn" ng-click="buy(currentCompany, quantity)">Buy</button> <button name="sell" class="btn" ng-click="sell(currentCompany, quantity)">Sell</button></div><div ng-hide="currentCompany" class="fx-fade-up"><h2>Search for a symbol in the upper right hand corner.</h2></div></section>');
}]);
})();

/**
 * @module Portfolio
 * @description Portfolio Factory returns the Portfolio object. In AngularJS a factory returns a value.
 * The portfolio object contains the users balance, their owned stock in an array under the owned property
 * and has the methods for interacting with itself.
 * @requires lodash
 * @requires $http
 * @requires FlashService
 * @requires $sessionStorage
 * @returns Portfolio Object
 */
angular.module('benzingaStockExchangeApp')
  .factory('Portfolio', function ($http, $sessionStorage, FlashService) {
    return {
      /**
       * Initialize with a balance of 100,000
       * @property {number}  balance - The current balance in the users portfolio.
       */
      balance: 100000,
      /**
       * On init we are not viewing anything so this is set to false so that it hides the template.
       * There isn't a method to hide the method except on page reload. I couldn't really imagine
       * a scenario where it needed to be cleared or what would replace it.
       * @property {number | object}  potential - Either false on init or the current Stock being considered.
       * @default 100000
       */
      potential: false,
      /**
       * The array for owned stock to be placed in.
       * @property {array} owned Array of currently owned stock.
       */
      owned: [],
      /**
       * @this Portfolio
       * @description Check if there is anything in session storage under the name space. Uses lodash to {@link http://lodash.com/docs#merge|merge} the existing portfolio if it exists into
       */
      init: function(){
        var existingPortfolio = $sessionStorage.portfolio;
        _.merge(this, existingPortfolio);
      },
      /**
       * Use the ngStorage module and sessionStorage object to store the balance and stock owned.
       * Nothing else really needs to be serialized, unless we want to store the last stock watched.
       */
      store: function(){
        var portfolio = _.pick(this, ['balance', 'owned']);
        $sessionStorage.portfolio = portfolio;
      },
      /**
       * Use Angulars $http service to get stock data from Benzinga API
       * @param {string} sym Stock symbol user is searching for.
       * @this Portfolio
       * We bind the found portfolio the potential property of the PortfolioFactory
       */
      search: function(sym){
        return $http.get('http://data.benzinga.com/stock/' + sym).success(function(res){
          if(res.status === 'error'){
            FlashService.show('error', 'No results for that symbol, try again?');
          } else {
            this.potential = res;
          }
        }.bind(this));
      },
      /**
       * This calculates the Value Weighted Average Price
       * @param {object} stock The stock we are averaging the price for.
       * @description An {@link http://jsperf.com/jquery-foreach-vs-for/8|optimized for loop} iterates over the transaction history
       * It sums the transacted quantity into the stockMoved variable in order to divide over it later in the method
       * The average price is generated by adding the result of each transactions quanity by the price paid that time
       * The total amount of stock is generated by first checking to see if the transaction was a purchase
       * If it was we simply add the quantity, if it was not then it had we add the negative of the quantity.
       * It also sets the quantity on the stock object.
       * @returns the sum of the average price divided by the total amount of stock moved.
       */
      vwap: function(stock){
        var averagePrice = 0, totalStock = 0, stockMoved = 0;
        for (var i = 0, len = stock.transactionHistory.length; i < len; i++) {
            function transact(transaction){
              stockMoved   += transaction.quantity;
              averagePrice += transaction.quantity * parseFloat(transaction.price);
              totalStock   += transaction.purchase ? transaction.quantity : -transaction.quantity;
            }
            transact(stock.transactionHistory[i]);
        }
        stock.quantity = totalStock;
        return averagePrice / stockMoved;
      },
      /**
       * @param {object} stock The stock we are performing a transaction on.
       * @param {number} quantity Quantity specified in transaction
       * @param {bool} purchase Indicates which direction the transaction is going in.
       * @description Private function used by the Portfolio object.
       * We check to see if the stock symbol exists in Portfolio.owned array using lodash's {@link http://lodash.com/docs#some | some method}, if it exists we select it from the array.
       * If it does not exist we create a transactionHistory property as an empty array, we also push the transaction into Portfolio.owned
       * Once we have our stock object with the transactionHistory array we push the quantity, current asking price and the purchase boolean
       * into that array, finally we call the Portfolio.vwap function and assign the resulting Value Weighted Average Price to the vwap property of the stock object.
       */
      transaction: function(stock, quantity, purchase){
        var currentlyOwned = _.some(this.owned, {symbol: stock.symbol});
        if(currentlyOwned){
          stock = _.find(this.owned, stock);
        } else {
          stock.transactionHistory = [];
          this.owned.push(stock);
        }
        stock.transactionHistory.push({quantity: quantity, price: stock.ask, purchase: purchase});
        stock.vwap = this.vwap(stock);
      },
      /**
       * @param {object} stockDetails The details of the stock object.
       * @param {number} quantity Quantity specified in transaction
       * @description Public function used in controller. We create a new object by using lodash's {@link http://lodash.com/docs#pick|pick} method to select the stock symbol, name, asking and bidding price.
       * The remaining information from the API is assigned to a details property on the stock object, in case it is needed in the future. We create the new object to help prevent API changes from causing future breakages. An unversioned API and lack of control over it still leaves the app very vulnerable to third party changes.
       * If the balance following the transaction would be less than 0 we use the {@link module:FlashService|FlashService} to create an error message.
       * Following a successful transaction we run the Portfolio.store() method to save the portfolio to sessionStorage         .
       */
      buy: function(stockDetails, quantity){
        var stock = _.pick(stockDetails, ['symbol', 'name', 'ask', 'bid']);
        stock.details = stockDetails;
        var transactionTotal = stock.ask * quantity;
        var postBalance = this.balance - transactionTotal;
        if(postBalance > 0){
          this.transaction(stock, quantity, true);
          this.balance = postBalance;
          this.store();
        } else {
          FlashService.show('error', 'You don\'t have enough money to purchase this amount.');
        }
      },
      /**
       * @param {object} stockDetails The details of the stock object.
       * @param {number} quantity Quantity specified in transaction
       * @description Public function used in controller.
       * We need to check that the user owns the stock they intend to sell, after that we need to check that they have enough stock to sell the amount in question.
       * This is somewhat duplicative, as the transaction method also checks to see if the stock is owned. I considered some solutions to decrease this duplication
       * however nothing really struck out as a way to reduce this duplication, at least not in the timeframe I wanted to finish the project in.
       * We flash an error message if they don't have enough of the stock or if they don't own the stock at all.
       * Following a successful transaction we run the Portfolio.store() method to save the portfolio to sessionStorage.
       */
      sell: function(stockDetails, quantity){
        var transactionTotal = stockDetails.bid * quantity;
        var currentlyOwned = _.some(this.owned, {symbol: stockDetails.symbol});
        if(currentlyOwned){
          var stock = _.find(this.owned, {symbol: stockDetails.symbol});
          var postBalance = this.balance + transactionTotal;
          var postQuantity = stock.quantity - quantity;
          if(postQuantity >= 0){
            this.transaction(stock, quantity, false);
            if(stock.quantity <= 0){
              _.remove(this.owned, stock);
            }
            this.balance = postBalance;
            this.store();
          } else {
            FlashService.show('error', 'You don\'t have that much stock to sell.');
          }
        } else {
          FlashService.show('error', 'You don\'t own that stock.');
        }
      }
    };
  });

/**
 * @module PortfolioCtrl
 * @description The PortfolioCtrl handles the view in Angular's MVVM structure.
 * @requires $scope
 * @requires $filter
 */
angular.module('benzingaStockExchangeApp')
  .controller('portfolioCtrl', function ($scope, $filter, Portfolio) {
    /**
     * @memberof module:PortfolioCtrl
     * @function Portfolio.init
     * @description We run the {@link module:Portfolio|Portfolio.init} method, this will check to see if there is anything in the sessionStorage and bring it into scope.
     */
    Portfolio.init();
  /**
   * @memberof module:PortfolioCtrl
   * @function checkBalance
   * @description This just updates the portfolio balance in the scope, it uses Angular's $filter service to format it as a filter.
   */
    function checkBalance(){
      $scope.portfolio.balance = $filter('currency')(Portfolio.balance);
    }
    /**
     * @memberof module:PortfolioCtrl
     * @namespace PortfolioScope
     * @description The $scope is an Angular concept, it refers to the Application model
     * @property {object} portfolio The object we want to place in scope.
     * @property {string} portfolio.balance We use $filter to create a string number formatted as currency. I could have called the checkBalance method, however I think the explicit assignment is preferable.
     * @property {array} portfolio.owned The array from our Portfolio, we assign it to the scope so that our view can iterate over it in ng-repeat.
     * @property {string} symbol The model for the search from in our view. Used in the marketSearch method.
     * @property {object} currentCompany the company whose stock is currently being considered. It has all of the properties gathered from the API.
     */
    $scope.portfolio = {};
    $scope.portfolio.balance = $filter('currency')(Portfolio.balance);
    $scope.portfolio.owned = Portfolio.owned;
    $scope.symbol = '';
    /**
     * @memberof module:PortfolioCtrl
     * @function marketSearch
     * @param {string} sym
     * @description uses the $scope.symbol string which is passed in from the view to call the Portfolio.search method. It hooks into the same success call as that method to assign the currentCompany to our view.
     * This is called by either clicking on the 'View Stock' button or using the search form.
     */
    $scope.marketSearch = function(sym){
      Portfolio.search(sym).success(function(){
        $scope.currentCompany = Portfolio.potential;
      });
    };

    /**
     * @memberof module:PortfolioCtrl
     * @function buy
     * @param {object} stockDetails The information from the stock API. $scope.currentCompany.
     * @param {number} quantity The number from $scope.quantity.
     * @description Assign the buy function to the scope, it receives it's data from the $scope.quantity and $scope.currentCompany in the view.
     * After the transaction we call the checkBalance function to update our balance into the scope.
     */
    $scope.buy = function(stockDetails, quantity){
      Portfolio.buy(stockDetails, quantity);
      checkBalance();
    };
    /**
     * @memberof module:PortfolioCtrl
     * @function sell
     * @param {object} stockDetails The information from the stock API. $scope.currentCompany.
     * @param {number} quantity The number from $scope.quantity.
     * @description Assign the sell function to the scope, it receives it's data from the $scope.quantity and $scope.currentCompany in the view.
     * After the transaction we call the checkBalance function to update our balance into the scope.
     */
    $scope.sell = function(stockDetails, quantity){
      Portfolio.sell(stockDetails, quantity);
      checkBalance();
    };
  });

/**
 * @module FlashService
 * @description Used to create or remove flash messages. Only one viewable at a time. The execution, (css included), is probably a bit in your face when used and would probably be a bit better as a tooltip. Angular 1.3 adds an ngMessages module that is built for this purpose.
 * # flash
 * Factory in the benzingaStockExchangeApp.
 */
angular.module('benzingaStockExchangeApp').factory('FlashService', function($rootScope){
    return {
      /**
       * Show assigns the created object to the rootScope flash propety with unread as true, also
       * creates the remove flash method on the root scope to change unread to false.
       * @param {string} type The type of flash message to create.
       * @param {string} message The message to display to the user.
       */
      show: function(type, flashback) {
        $rootScope.flash = { type: type, message: flashback, unread: true};
        $rootScope.removeFlash = function(){
          $rootScope.flash = { unread:false };
        };
      },
      /**
       * Would be used to progmatically remove a flash message.
       */
      remove: function() {
        $rootScope.flash = {unread:false};
      }
    };
  });
