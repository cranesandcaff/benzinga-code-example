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
