$(document).ready(function(){

    function resize(){
        $('.wrapper').css('min-height',$(window).height());
        $('.wrapper figure.bg').css('min-height',$(window).height());
    }

    resize();

    $(window).resize(function(){
        resize();
    });

    //swiper
    var swiper1 = new Swiper(".wrapper__products .swiper", {
        slidesPerView: 2,
        spaceBetween: 32,
        speed: 700,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        breakpoints: {
            0: {
                slidesPerView: 2,
                spaceBetween:12
            },
            576: {
                slidesPerView: 2,
                spaceBetween:12
            },
            991: {
                slidesPerView: 2,
                spaceBetween:20
            },
            1199: {
                slidesPerView: 2,
                spaceBetween:32
            }
        }
    });
});