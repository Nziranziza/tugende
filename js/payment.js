$(".form-tel-mob").keyup(function() {
  if (this.valuelength == this.maxlength && this.value) {
    $(this)
      .next(".form-tel-mob")
      .focus();
  }
});
