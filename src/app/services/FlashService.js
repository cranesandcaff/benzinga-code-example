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
