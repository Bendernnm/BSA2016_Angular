var module = angular.module('ChatModule', []);
module.controller('ChatCtrl', ChatCtrl);

function ChatCtrl($scope, $http) {
    this.messages = [
        {name: "Bender", text: "hello!"}
    ];
    this.showForm = () => (this.userName ? './view/chat_form.html' : './view/login_form.html');
    this.sendUserName = function () {
        let valid = !!this.userNameText.search(regUserName);
        if (valid) {
            this.userName = this.userNameText;
        }
    };
    this.sendMessage = function () {
        let url = '/messages';
        let data = {
            name: this.userName, text: this.message
        };
        let config = {
            headers: {
                'Content-Type': 'application/json'
            }
        };

        $http.post(url, data, config);
        this.message = '';
        this.getMessages();
    };
    this.getMessages = function () {
        let url = '/getchat';
        let vm = this;
        setInterval(function () {
                $http.get(url)
                    .then((response) => vm.messages = response.data);
            }, 3000
        )
        ;
    };
}