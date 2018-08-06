//var product = [
//    "iphoneX: 999.00",
//    "Chips: 10.00",
//    "Earphone: 100.00",
//    "Case: 15.00",
//    "gum: 10.00"
//]
//var cost = 0;
//for (p in product) {
//    cost += Number(product[p].split(": ")[1]);
//}

$('header').load('../Pages/header.html', function () {
    $('#home').addClass('active');
});
$('footer').load('../Pages/footer.html');