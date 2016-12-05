$(document).ready(function() {
    var user_id = null

    var lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
        auth: {
            params: {
                scope: 'openid email'
            } //Details: https://auth0.com/docs/scopes
        }
    });

    $('.btn-login').click(function(e) {
        e.preventDefault();
        lock.show();
    });

    $('.btn-logout').click(function(e) {
        e.preventDefault();
        logout();
    })

    lock.on("authenticated", function(authResult) {
        lock.getProfile(authResult.idToken, function(error, profile) {
            if (error) {
                // Handle error
                return;
            }
            localStorage.setItem('id_token', authResult.idToken);
            localStorage.setItem('access_token', authResult.accessToken);

            // Display user information
            show_profile_info(profile);
        });
    });

    //retrieve the profile:
    var retrieve_profile = function() {
        var id_token = localStorage.getItem('id_token');
        var access_token = localStorage.getItem('access_token');
        if (id_token) {
            lock.getProfile(id_token, function (err, profile) {
                if (err) {
                    return alert('There was an error getting the profile: ' + err.message);
                }

                $.ajax({
                    url: "http://localhost:8081/wallet/" + profile.user_id,
                    method: 'PUT',
                    data: 'id_token=' + id_token,
                    success: function( result ) {
                        console.log(result);
                    }
                });

                query_account();

                // Display user information
                show_profile_info(profile);
            });
        }
    };

    var query_account = function() {
        var access_token = localStorage.getItem('access_token');
        if (access_token) {
            $.ajax({
                url: "http://localhost:8081/query/account",
                method: "GET",
                xhrFields: {
                    withCredentials: false
                },
                headers: {
                    Authorization: 'Bearer ' + access_token
                },
                success: function(response){
                    console.log(response)
                }
            });
        }
    }

    var show_profile_info = function(profile) {
        $('.nickname').text(profile.nickname);
        $('.btn-login').hide();
        $('.avatar').attr('src', profile.picture).show();
        $('.btn-logout').show();
    };

    var logout = function() {
        localStorage.removeItem('id_token');
        window.location.href = "/";
    };

    retrieve_profile();
});
