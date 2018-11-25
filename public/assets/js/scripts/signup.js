//signup.js

redirectIfLoggedIn();

$(() => {
    $('form').submit((event) => {
        event.preventDefault();
        const user = getUserFromForm();

        signup(user).then(result=> {
            setIdRedirect(result);
        })
    });
});

function signup(user) {
    return $.post(`${AUTH_URL}/signup`, user)
    .fail(function (xhr) {
        const $errorMessage = $('#errorMessage');
        $errorMessage[0].textContent=xhr.statusText;
        $errorMessage.show
    })
}

