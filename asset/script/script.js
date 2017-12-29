(function() {

  $(function() {
    console.log('this');
    return $('.nav li a').click(function(e) {
      e.preventDefault();
      return $(this).tab('show');
    });
  });

}).call(this);
