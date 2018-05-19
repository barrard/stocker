function handle_animation(element, animation) {
  if(element.length){
    element.forEach(el => {
      function remove_animation_class() {
        console.log('animation over')
        el.classList.remove('animated', animation)
        el.removeEventListener('animationend', remove_animation_class)
      }

      el.addEventListener('animationend', remove_animation_class)

      el.classList.add('animated', animation)
    });

  }else{
    function remove_animation_class() {
      console.log('animation over')
      element.classList.remove('animated', animation)
      element.removeEventListener('animationend', remove_animation_class)
    }

    element.addEventListener('animationend', remove_animation_class)

    element.classList.add('animated', animation)
  }

}
// Toast.TYPE_INFO
// Toast.TYPE_MESSAGE
// Toast.TYPE_WARNING
// Toast.TYPE_ERROR
// Toast.TYPE_DONE
function toast(msg, type){
  var type = String(type).toUpperCase()
  new Toast(msg,  Toast[`TYPE_${type}`], Toast.TIME_NORMAL);
}
