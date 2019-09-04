var n = 1;

function decrementSeats() {
  if (n > 1) {
    n--;
    $("#numberOfSeats").val(n);
  }
}
function incrementSeats() {
  n++;
  $("#numberOfSeats").val(n);
}
