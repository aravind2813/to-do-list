
exports.dateFunction=function(){
  var date = new Date();
  options={
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  var day = date.toLocaleDateString("en-US",options);
  return day;
}
