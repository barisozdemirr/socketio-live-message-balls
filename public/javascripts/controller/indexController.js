app.controller("indexController", ["$scope", "indexFactory", ($scope, indexFactory) => {
    
    $scope.messages = [];
    $scope.players = {};

    // Kullanıcı Adı Girişi
    $scope.init = () => {
        const username = prompt("Lütfen Kullanıcı Adınızı Giriniz");

        if(username){
            initSocket(username);
        } else {
            return false;
        }
    }

    function scrollTop() {
        setTimeout(() => {
            const element = document.getElementById("chat-area");
            element.scrollTop = element.scrollHeight;
        });
    };

    function showBubble(id, message) {
        $("#" + id).find(".message").show().html(message);

        setTimeout(() => {
            $("#" + id).find(".message").hide();
        },2000)
    }
    
    // Bağlantı
    function initSocket (username)  {
        indexFactory.connectSocket("http://localhost:3000", {
            reconnectionAttempts : 3,
            reconnectionDelay : 500
        }).then((socket) => {
            socket.emit("newUser", { username } )

            socket.on("initPlayers", (players) => {
                $scope.players=  players;
                $scope.$apply();
            });

            //Kullanıcı Giriş Yaptığı Zaman
            socket.on("newUser", (data) => {
                const messageData = {
                    type : {
                        code : 0,
                        message: 1
                    },
                    username : data.username
                };

                $scope.messages.push(messageData);
                $scope.players[data.id] = data;
                scrollTop();
                $scope.$apply();

            });

            // Kullanıcı Çıktığı Zaman
            socket.on("disUser", (data) => {
                const messageData = {
                    type : {
                        code : 0,
                        message: 0
                    },
                    username : data.username
                };
                $scope.messages.push(messageData);
                delete $scope.players[data.id];
                scrollTop();
                $scope.$apply();
            });

            socket.on("animate", data => {
                $("#" + data.socketId).animate({ "left" : data.x, "top" : data.y }, () => {
                    animate = false;
                });
            });


            socket.on("newMessage", message => {
                $scope.messages.push(message);
                $scope.$apply();
                showBubble(message.socketId, message.text);
                scrollTop();
            });

            //Animasyon İşlemini Burada Yaptım.
            let animate = false;
            $scope.onClickPlayer = ($event) => {
                if(!animate){
                    let x = $event.offsetX;
                    let y = $event.offsetY;

                    socket.emit("animate", { x, y })

                    animate = true;
                    $("#" + socket.id).animate({ "left" : x, "top" : y }, () => {
                        animate = false;
                    });
                };  
            };


            $scope.newMessage = (data) => {
                let message = $scope.message;
                const messageData = {
                    type : {
                        code : 1,
                    },
                    username : username,
                    text : message
                };

                $scope.messages.push(messageData);
                $scope.message = null;

                socket.emit("newMessage", messageData);
                showBubble(socket.id, message);
                scrollTop();

            };

        }).catch((err) => {
            console.log(err);
        });
    }
    
}]);