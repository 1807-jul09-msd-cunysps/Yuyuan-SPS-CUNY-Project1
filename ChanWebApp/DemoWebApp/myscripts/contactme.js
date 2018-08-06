$('header').load('../Pages/header.html', function () {
    $('#contactme').addClass('active');
});
$('footer').load('../Pages/footer.html');

// Example starter JavaScript for disabling form submissions if there are invalid fields
(function () { // from bootstrap form validation documentation
    'use strict';
    window.addEventListener('load', function () {
        // Fetch all the forms we want to apply custom Bootstrap validation styles to
        var forms = document.getElementsByClassName('needs-validation');
        // Loop over them and prevent submission
        var validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
})();

function validate() {
    var input = document.querySelectorAll('input.form-control');
    var feedback = document.querySelectorAll('div.invalid-feedback');
    for (let i = 0; i < feedback.length; i++) {
        feedback[i].innerText = '';
        if (!input[i].checkValidity()) {
            feedback[i].innerText = input[i].validationMessage;
            return false;
        }
    }
    return true;
}

$('#joinmeform').submit(function (e) {
    e.preventDefault();
    var valid = validate();
    console.log(valid);
    if (valid) {
        var obj = {
            'Name': $('#name').val(),
            'Email': $('#email').val(),
            'Message': $('#message').val()
        }
        fetch('https://chancunysps.azurewebsites.net/api/contactdir/post/contactme', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(obj)
        }).then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(response => console.log('Success:', response));
        return true;
    }
    return false;
});