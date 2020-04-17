app.controller("indexController", ["$scope", "indexFactory", ($scope, indexFactory) => {
    
    $scope.init = () => {
        const username = prompt("Lütfen Kullanıcı Adınızı Giriniz");

        if(username){
            initSocket(username);
        } else {
            return false;
        }
    };
    
    function initSocket (username)  {
        indexFactory.connectSocket("http://localhost:3000", {
            reconnectionAttempts : 3,
            reconnectionDelay : 500
        }).then((socket) => {
            socket.emit("newUser", { username } )
        }).catch((err) => {
            console.log(err);
        });
    }
    
}]);