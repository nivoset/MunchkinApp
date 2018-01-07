var newPlayer = function (name) {
   var self = this;
   var mainPlayer = false;
   var hasClosed = false;

   this.name = name;

   this.customCardValue = 1;

   this.level = 1;
   this.items = new Array();

   this.killPower = 0;
   this.labelType = "success";


   this.customCardChange = function (value) {
      if (isNaN(value)) return;
      self.customCardValue += value;
      if (self.customCardValue == 0) self.customCardValue += value;
   }; 

   this.AddCard = function (bonus) {
      if (isNaN(bonus)) return;
      this.items.push({
         value: bonus,
         removeCard: function () {
            var currentCard = this;
            for (var i = 0; i < self.items.length; i++){
               if (self.items[i].value == currentCard.value) {
                  self.items.splice(i, 1);
                  break;
               }
            }
            self.updateScore();
         }
      });
      self.updateScore();
      
      if (hasClosed) {
         this.addCardWindowShow = false;  
         this.customCardValue = 1;
      }
   };
   this.levelUp = function (modifier) {
      if (this.level + modifier > 0)   this.level += modifier;
      if (this.level > 7)              this.labelType = 'danger';
      else if (this.level > 5)         this.labelType = 'warning';
      else                             this.labelType = 'success';
      this.updateScore();
      updateSave();
   },
   this.updateScore = function() {
      var score = 0;
      for (var items in this.items) {
         score += this.items[items].value;
      }
      this.killPower = score+this.level;
      updateSave();
   }

   this.toggleCardWindow = function() {
      hasClosed = true;
      this.addCardWindowShow = !this.addCardWindowShow;
   };
   //Initialize


   if (name == $scope.options.name) {
      this.level = $scope.currentGame.level;
      
      for (var card in $scope.currentGame.cards) {
         this.AddCard($scope.currentGame.cards[card].value);
      }
      mainPlayer = true;
   }

   this.levelUp(0);
   this.updateScore();
}