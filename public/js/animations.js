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
