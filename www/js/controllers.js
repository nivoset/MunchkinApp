angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  $scope.playerOptions = JSON.parse(localStorage.getItem('playerOptions'));
  $scope.players = new Array();

  // JSON.parselocalStorage.getItem('currentGame'));


  var updateAndSaveGame = function () {
    localStorage.setItem('playerOptions', JSON.stringify($scope.playerOptions));
    localStorage.setItem('currentGame',   JSON.stringify({
       level: $scope.players[0].level,
       cards: $scope.players[0].cards
     }));
  };

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope, $stateParams) {
   $scope.currentGame = JSON.parse(localStorage.getItem('currentGame'));
   $scope.playerOptions = JSON.parse(localStorage.getItem('playerOptions'));
   $scope.players = new Array();
   //console.log(localStorage.getItem('currentGame'));
   var updateSave = function () {
      if ($scope && $scope.players && $scope.players[0]) {
         localStorage.setItem('playerOptions', JSON.stringify($scope.playerOptions));
         localStorage.setItem('currentGame',   JSON.stringify({
            level: $scope.players[0].level,
            cards: $scope.players[0].items
         }));
      }
   };
   
   var newPlayer = function (name, reset) {
      var self = this;
      var mainPlayer = false;
      var hasClosed = false;
      
      this.name = name;
      
      this.customCardValue = 1;
      self.showOptionsMenu = true;
      
      this.level = 1;
      this.items = new Array();
      
      this.killPower = 0;
      this.labelType = "success";
      
      
      this.customCardChange = function (value) {
         if (isNaN(value) && value != 0) return;
         self.customCardValue += value;
         if (self.customCardValue == 0) self.customCardValue += value;
      }; 
      
      this.AddCard = function (bonus) {
         if (isNaN(bonus)) return;
         this.items.push({
            value: bonus,
            removeCard: function () {
              console.log(self);
                this.deleteCard = true;
                /*
               var currentCard = this;
               for (var i = 0; i < self.items.length; i++){
                  if (self.items[i].value == currentCard.value) {
                     self.items.splice(i, 1);
                     break;
                  }
               } //*/
               self.updateScore();
            }
         });
         self.updateScore();
         
         if (hasClosed) {
            $scope.addCardWindowShow = false;  
            this.customCardValue = 1;
         }
      };

      this.levelUp = function (modifier) {
        if (this.level + modifier > 0)   
            this.level += modifier;
        if (this.level > 7)              
          this.labelType = 'assertive';
        else if (this.level > 5)         
          this.labelType = 'energized';
        else                             
          this.labelType = 'balanced';
        this.updateScore();
      },

      this.updateScore = function() {
         var score = 0;
         for (var items in this.items) {
            if (!this.items[items].deleteCard) {
              score += this.items[items].value;
            }
         }
         this.killPower = score+this.level;
         updateSave();
      }
      
      this.toggleCardWindow = function() {
        hasClosed = true;
        self.showOptionsMenu = !self.showOptionsMenu;
        console.log("toggleWindow! " + self.showOptionsMenu);
      };
      //Initialize
      
      
      if (name == $scope.playerOptions.name) {
        if (!reset) {
          this.level = $scope.currentGame.level;
          for (var card in $scope.currentGame.cards) {
            if (!$scope.currentGame.cards[card].deleteCard) {
              this.AddCard($scope.currentGame.cards[card].value);
            }
          }
        }
         mainPlayer = true;
      }
      
      this.levelUp(0);
   }
      
   $scope.resetPlayer = function() {
      $scope.players[0] = new newPlayer(($scope.playerOptions.name)?$scope.playerOptions.name:"Player", true);
   };
   
   $scope.players.push(new newPlayer(($scope.playerOptions.name)?$scope.playerOptions.name:"Player"));
     
   $scope.showOptionsMenu = true;
});

