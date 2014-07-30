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
