// loading header and footer
$('header').load('../Pages/header.html', function () {
    $('#joinme').addClass('active');
});
$('footer').load('../Pages/footer.html');
$('#success').hide();

// toggling permanent address
$("#permAddr").hide();
$('#checkAddress').change(function () {
    if (this.checked)
        $('input[name=perm]').attr('required', false);
    else
        $('input[name=perm]').attr('required', true);
    $('#permAddr').toggle();
});

// ajax call: http://api.zippopotam.us/
// auto population of city and state
function callAPI() {
    let zip = $('#zipcode').val();
    let country = $('#country').val();
    let url = 'http://api.zippopotam.us/' + country + '/' + zip;
    let request = new XMLHttpRequest();
    request.open('GET', url);
    request.onreadystatechange = function (e) {
        if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
            let response = this.responseText;
            if (response !== null && response !== "" && response !== undefined) {
                populateCityState(response);
            }
        }
    }
    request.send();
}

function populateCityState(jsonResponse) {
    jsonResponse = JSON.parse(jsonResponse);
    document.querySelector("#state").value = jsonResponse.places[0]["state"];
    document.querySelector("#city").value = jsonResponse.places[0]["place name"];
}

function checkZip() {
    if ($("#zipcode").val() !== "")
        callAPI();
}

document.querySelector('#zipcode').addEventListener('blur', checkZip);
document.querySelector('#country').addEventListener('change', checkZip);

// telephone/country library: https://github.com/jackocnr/intl-tel-input
// get the country data from the plugin
var countryData = $.fn.intlTelInput.getCountryData();
var telInput = $('#phone');
var countryDropdown = $('#country');
var pCountryDropdown = $('#pcountry');

// init plugin
telInput.intlTelInput({
    utilsScript: '../myscripts/utils.js' // just for formatting/placeholders etc
});

// populate the country dropdown
$.each(countryData, function (i, country) {
    countryDropdown.append($('<option></option>').attr('value', country.iso2).text(country.name));
    pCountryDropdown.append($('<option></option>').attr('value', country.iso2).text(country.name));
});

// set it's initial value
var initialCountry = telInput.intlTelInput('getSelectedCountryData').iso2;
countryDropdown.val(initialCountry);
pCountryDropdown.val(initialCountry);

// listen to the telephone input for changes
telInput.on("countrychange", function (e, countryData) {
    countryDropdown.val(countryData.iso2);
});

// listen to the address dropdown for changes
countryDropdown.change(function () {
    telInput.intlTelInput('setCountry', $(this).val());
});

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

// input field validations
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

// serialize form data to json
// can use formdata as well (probably doesn't support third party library)
// link: https://stackoverflow.com/questions/11661187/form-serialize-javascript-no-framework
// ajax call to API (http post to insert into db)
$('#joinmeform').submit(function (e) {
    e.preventDefault();
    var valid = validate();
    var telValid = telInput.intlTelInput('isValidNumber');
    console.log(valid + " " + telValid);
    if (valid && telValid) {
        //var url = 'http://localhost:53763/contactdir/post/joinme';
        var dialCode = $('#phone').intlTelInput('getSelectedCountryData').dialCode;
        var obj = {
            'Pid': -1,
            'FirstName': $('#firstname').val(),
            'LastName': $('#lastname').val(),
            'Age': Number($('#age').val()),
            'Gender': $('input[name=gender]:checked').val(),
            'Address': {
                'Pid': -1,
                'HouseNum': $('#housenum').val(),
                'Street': $('#street').val(),
                'City': $('#city').val(),
                'State': $('#state').val(),
                'Country': $('#country').val().toUpperCase(),
                'ZipCode': $('#zipcode').val()
            },
            'Phone': {
                'Pid': -1,
                'CountryCode': Number(dialCode),
                'Number': Number($('#phone').intlTelInput('getNumber').replace('+'.concat(dialCode), '')),
                'Ext': function () {
                    var ext = Number($('#phone').intlTelInput('getExtension'));
                    return isNaN(ext) ? null : ext;
                }
            },
            'Email': {
                'Pid': -1,
                'EmailAddress': $('#email').val()
            }
        }
        $.ajax({
            type: 'POST',
            url: 'https://chancunysps.azurewebsites.net/api/contactdir/post/joinme',
            crossDomain: true,
            data: JSON.stringify(obj),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            success: function (result) {
                console.log(result);
                $('#formcontainer').hide();
                $('#success').show();
                //window.location.href = "http://www.google.com";
            },
            error: function (xhr, resp, text) {
                console.log(xhr, resp, text);
            }
        });
        return true;
    }
    return false;
});


//function check() {
//    let checked = checkAddr.checked;
//    let permAddr = document.querySelector("#permAddr");
//    let mailAddr = document.querySelector("#mailAddr");
//    if (!checked) {
//        let legend = document.createElement("legend");
//        legend.innerText = "Permanent Address";
//        permAddr.appendChild(legend);
//        for (let i = 1; i <= 5; i++) {
//            let d = document.createElement("div");
//            d.className = "form-group";
//            var label, input;
//            switch (i) {
//                case 1:
//                    label = document.createElement("label");
//                    label.htmlFor = "zipcode";
//                    label.innerText = "Zip Code";
//                    input = document.createElement("input");
//                    input.id = "zipcodeperm";
//                    input.placeholder = "Zip Code";
//                    break;
//                case 2:
//                    label = document.createElement("label");
//                    label.htmlFor = "country";
//                    label.innerText = "Country";
//                    input = document.createElement("select");
//                    input.id = "countryperm";
//                    break;
//                case 3:
//                    label = document.createElement("label");
//                    label.htmlFor = "state";
//                    label.innerText = "State";
//                    input = document.createElement("input");
//                    input.id = "stateperm";
//                    input.placeholder = "State";
//                    break;
//                case 4:
//                    label = document.createElement("label");
//                    label.htmlFor = "city";
//                    label.innerText = "City";
//                    input = document.createElement("input");
//                    input.id = "cityperm";
//                    input.placeholder = "City";
//                    break;
//                case 5:
//                    label = document.createElement("label");
//                    label.htmlFor = "address";
//                    label.innerText = "Address";
//                    input = document.createElement("input");
//                    input.id = "addressperm";
//                    input.placeholder = "Address";
//                    break;
//            }
//            input.className = "form-control";
//            input.required = "true";
//            if (i == 1) {
//                input.nodeType = "number";
//                input.min = "0";
//                input.oninput = "validity.valid||(value='');"
//            }
//            else if (i != 2)
//                input.nodeType = "text";
//            d.appendChild(label);
//            d.appendChild(input);
//            permAddr.appendChild(d);
//        }
//        var countryDropdown2 = $("#countryperm");
//        $.each(countryData, function (i, country) {
//            countryDropdown2.append($("<option></option>").attr("value", country.iso2).text(country.name));
//        });
//        countryDropdown2.val(initialCountry);
//    }
//    else {
//        while (permAddr.firstChild) {
//            permAddr.removeChild(permAddr.firstChild);
//        }
//    }
//}

//var checkAddr = document.querySelector("#checkAddress");
//if (addEventListener) {
//    checkAddr.addEventListener("change", check);
//}
//else {
//    checkAddr.onchange = check;
//}