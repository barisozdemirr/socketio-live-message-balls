app.controller("indexController", ["$scope", "indexFactory", ($scope, indexFactory) => {
    indexFactory.connectSocket("http://localhost:3000", {
        reconnectionAttempts : 3,
        reconnectionDelay : 500
    }).then((socket) => {
        console.log("Bağlantı Gerçekleşti!", socket);
    }).catch((err) => {
        console.log(err);
    });
}]);