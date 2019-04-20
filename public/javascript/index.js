$(document).ready(function () {
    $(window).resize(updateUI());
    initEventHandlers();
});

function updateUI() {
    let offset = 43;
    let maxWidth = 1226;
    let windowHeight = $(window).height();
    let windowWidth = $(window).width();
    // console.log("Window Height = " + windowHeight + "\nWindow Width=" + windowWidth);
    let expected = (offset * windowWidth) / maxWidth;
    $(".video-overlay").css('height', expected + 'em');
    if (windowWidth <= 515 && windowHeight <= 377) {
        $("#info-text").css('visibility', 'hidden');
    } else {
        $("#info-text").css('visibility', 'visible');
    }
}

function initEventHandlers() {
    $('.inner-dropdown').on('click', 'li', function () {
        let clickedContent = $(this).find('a').attr('href');
        let clickedContentStr = clickedContent.toString();
        let contentNumber = parseInt(clickedContentStr.charAt(clickedContentStr.length - 1));
        $("#tab" + contentNumber).prop("checked", true);
        location.href = clickedContent;
    });

    $("#register").on('click', function () {
        processSignUpData();
    });

    $("#login-button").on('click', function () {
        processLoginData();
    });

    $('body').on('keypress', '#form-body', function (args) {
        if (args.keyCode === 13) {
            if ($('#register-tab').hasClass('active')) {
                $('#register').click();
            } else {
                $('#login-button').click();
            }
        }
    });
}

$(window, document, undefined).ready(function () {
    $('.input').blur(function () {
        var $this = $(this);
        if ($this.val())
            $this.addClass('used');
        else
            $this.removeClass('used');
    });

});

function processLoginData() {
    let email = $("#email").val();
    let password = $("#pwd").val();
    if (email === "") {
        alert("Please enter a valid email address");
        return;
    }
    if (password === "" || password.length < 6) {
        // noinspection SpellCheckingInspection
        $("#login-password-error").css('display', 'block');
        return;
    }
    // noinspection JSJQueryEfficiency
    $("#login-password-error").css('display', 'none');
    $("#reg-btn").click();
    $("#proceed").click();
    setTimeout(function () {
        $("#proceed").click();
        window.location = "profile.html";
    }, 3000);
}

// noinspection JSJQueryEfficiency
function processSignUpData() {
    let fullName = $("#name").val();
    let email = $("#newemail").val();
    let newPassword = $("#newpwd").val();
    let passwordRepeat = $("#newpwd_repeat").val();
    if (fullName === "") {
        $("#name-error").css('display', 'block');
        return;
    }
    // noinspection JSJQueryEfficiency
    $('#name-error').css('display', 'none');
    if (email === "") {
        // noinspection SpellCheckingInspection
        $("#newemail-error").css('display', 'block');
        return;
    }
    // noinspection SpellCheckingInspection,JSJQueryEfficiency
    $("#newemail-error").css('display', 'none');
    if (newPassword === "" || newPassword.length < 6) {
        // noinspection SpellCheckingInspection
        $("#newpwd-error").css('display', 'block');
        return;
    }
    // noinspection JSJQueryEfficiency
    $("#newpwd-error").css('display', 'none');
    if (newPassword !== passwordRepeat) {
        // noinspection SpellCheckingInspection
        $("#newpwd-repeat-error").css('display', 'block');
        return;
    }
    // noinspection JSJQueryEfficiency
    $("#newpwd-repeat-error").css('display', 'none');
    //If we ever get here, it then means everything went well, let's display a progress dialog here
    $("#reg-btn").click();
    $("#proceed").click();
    signUpUserOnFireBase(fullName, email, newPassword);
    setTimeout(function () {
        $("#proceed").click();
        window.location = "profile.html";
    }, 3000);
}

function signUpUserOnFireBase(fullName, email, password) {
    let auth = firebase.auth();
    let realTDB = firebase.database();
    //Sign Up user her
    auth.createUserWithEmailAndPassword(email, password).then(function (data) {
        console.log("User Created!!!" + JSON.stringify(data));
        let userData = new Map();
        userData.set("full_name", fullName);
        userData.set("email", email);
        userData.set("password", CryptoJS.SHA256(password));
        //Then push data to real time database
        realTDB.ref('users/').set(userData);
    }).catch(function (error) {
        let errorMessage = error.message;
        alert(errorMessage);
    });
}

function logInUser(email, password) {
    let auth = firebase.auth();
    auth.signInWithEmailAndPassword(email, password).then(function (data) {

    }).catch(function (error) {
        let errorMessage = error.message;
        alert(errorMessage);
    });
}
