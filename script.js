function getDirectChildren(){
  var carousel = document.getElementById('carousel');
  var child_divs = carousel.getElementsByTagName('div');
  var direct_children = [];
  for (i=0; i<child_divs.length;i++){
    var className = child_divs[i].getAttribute("class")
    if (className == "visible result" || className == "hidden result"){
      direct_children.push(child_divs[i]);
    }
  }
  return direct_children;
}

function getCurrentResultIndex(){
  var direct_children = getDirectChildren();
  var current_index = -1;
  for (i=0; i<direct_children.length;i++){
    var div = direct_children[i];
    if(div.getAttribute("class") == "visible result"){
      current_index = i;
      break;
    }
  }
  return current_index;
}

function incrementResults(amount){
  var direct_children = getDirectChildren();
  var current_index = getCurrentResultIndex();
  var next_index = ((current_index+amount)%direct_children.length+direct_children.length)%direct_children.length;
  change_page(next_index);
}

function changeResults(destination){
  var direct_children = getDirectChildren();
  var current_index = getCurrentResultIndex();
  var diff = destination - current_index;
  incrementResults(diff);
}

function load(){
  var page_number = location.hash.split("#")[1];
  if(page_number == null){
    change_page(0);
    incrementResults(-1);
  }
  if(!isNaN(page_number)){
    change_page(parseInt(page_number));
  }
}

function change_page(page_number){
  if(page_number == "Chart"){
    window.location.replace("thumbs.html");
    return;
  }
  direct_children = getDirectChildren();
  for (i=0; i<direct_children.length;i++){
    var div = direct_children[i];
    div.className = "hidden result";
  }
  next_div = direct_children[page_number];
  next_div.className = "visible result";
  document.getElementById('selector').value = page_number.toString();
  location.hash = "#"+page_number.toString();
}
