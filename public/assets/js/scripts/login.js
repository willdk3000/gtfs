//login 
//const AUTH_URL = `${API_URL}/auth`

redirectIfLoggedIn();

$(() => {
    $('form').submit((event)=> {
        event.preventDefault(); //permet d'empêcher la fonction d'envoi par défaut
        const user = getUserFromForm();

        login(user).then(result=> {
            setIdRedirect(result);
        })

    });
});

function login(user) {
    return $.post(`${AUTH_URL}/login`, user)
        .fail(function (xhr) {
            const $errorMessage = $('#errorMessage');
            $errorMessage[0].textContent=xhr.responseJSON.message;
            $errorMessage.show
        })
};

