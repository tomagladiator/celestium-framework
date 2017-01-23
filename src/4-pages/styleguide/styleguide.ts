/// <reference path="../../5-else/ts/libs/jquery.d.ts" />
// P--styleguide
$('h2.sg--h2').each(function(i) {
    let current = $(this);
    current.attr('id', 'title' + i);
    $('.sg--left ul').append('<li><a id="link' + i + '" href="#title' + i + '" title="' + current.attr('tagName') + '">' + current.html() + '</a></li>');
});
