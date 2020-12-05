/*===== SHOW NAVBAR  =====*/
const showNavbar = (toggleId, navId, bodyId, headerId) =>{
    const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId)

    // Validate that all variables exist
    if(toggle && nav && bodypd && headerpd){
        toggle.addEventListener('click', ()=>{
            // show navbar
            nav.classList.toggle('show')
            // change icon
            toggle.classList.toggle('bx-x')
            // add padding to body
            bodypd.classList.toggle('body-pd')
            // add padding to header
            headerpd.classList.toggle('body-pd')
        })
    }
}

showNavbar('header-toggle','nav-bar','body-pd','header')

/*===== LINK ACTIVE  =====*/
const linkColor = document.querySelectorAll('.nav__link')

function colorLink(){
    if(linkColor){
        linkColor.forEach(l=> l.classList.remove('active'))
        this.classList.add('active')
    }
}
linkColor.forEach(l=> l.addEventListener('click', colorLink))


//Efecto icono de ojo.*************To close the eye icon and hide the pass*************
function close_eye(pass,icono){
    var inputPass2 = document.getElementById(pass),
        iconeye = document.getElementById(icono);

       iconeye.onclick = function () {

         if(inputPass2.type == 'password') {
            inputPass2.setAttribute('type', 'text');
            iconeye.className = 'fa fa-eye iconeye';
            inputPass2.className = 'input--style-3 text-white';

         } else {
            inputPass2.setAttribute('type', 'password');
            iconeye.className = 'fa fa-eye-slash text-muted iconeye';
            inputPass2.className = 'input--style-3 text-white active';
        }

       }
}

close_eye('pass1','iconeye1');
close_eye('pass2','iconeye2');
close_eye('pass3','iconeye3');
close_eye('pass4','iconeye4');
