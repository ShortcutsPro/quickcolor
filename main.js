//////////////////////////////////////////////////////
//
//.                QuickColor
//
//
function copyColor() {
  // Get latest selected color and array of saved colors
  let color = JSON.parse(sessionStorage.getItem('color'))
  let saved = sessionStorage.getItem('saved')
  
  // If previously selected colors exist, add new color to the list, else create new array
  if (saved != null) {
    saved = JSON.parse(saved)
    saved.push(color)
  } else {
    color = '\['+JSON.stringify(color)+'\]'
    saved = JSON.parse(color)
  }
  
  // Make sure array contains only unique colors and save to session storage.  This is required due to using mouseup as the listener event, which will trigger multiple times if the screen is tapped outside of the picker.
  saved = [ ...new Set(saved)]
  sessionStorage.setItem('saved',JSON.stringify(saved))

  let message = document.getElementById('message')
  
  // For each new, unique color, add a colored block on screen with the color hex code. 
  saved.forEach(c => {
    if (!document.getElementById(c.hex)) {
      let print = document.createElement('div')
      print.style = `background:${c.rgbaString}; display:block; border:2px solid white; width:20%; padding:0.5ex; margin:1px;`
      print.id = c.hex
      print.innerHTML = `${c.hex}`
      message.appendChild(print)
    }
  })
  
  // Prettify and copy array of selected colors to clipboard
  saved = JSON.stringify(saved,null,'\t')
  navigator.clipboard.writeText(saved)
  console.log(saved)
  return saved
}
//////////////////////////////////////////////////////
//
//.                QuickColor
//
//
function init() {
  "use strict";

  function $(selector, context) {
      return (context || document).querySelector(selector);
  }

  const parent = $('#picker')

  /* Basic example */
  const picker = new Picker({
    parent: parent,
    popup: false,
    editorFormat: 'hex',
    alpha: true,
    color: 'white',
    onChange: function (color) {
      
      // Output using the picker's 'color' object is missing most of the values, 
      // so recreate it from scratch.
      color = {
        'hex': color.hex.toUpperCase(),
        'rgbString': color.rgbString,
        'hslString': color.hslString,
        'rgbaString': color.rgbaString,
        'rgba': color.rgba,
        'hslaString': color.hslaString,
        'hsla': color.hsla
      }
      document.getElementById('theme').setAttribute('content', color.rgbString)
      document.body.style.backgroundColor = color.rgbaString;
      sessionStorage.setItem('color',JSON.stringify(color))
    }
  });
  picker.openHandler();
  const Q = new URL(window.location.href).searchParams
  let color = decodeURIComponent(Q.get('color')) || null
  if (color != null) {
    picker.setColor(color,false)
    document.write(copyColor())
  }
}