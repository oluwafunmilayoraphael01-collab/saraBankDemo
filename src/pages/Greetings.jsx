
const Greetings = () => {
    const hour = new Date().getHours();
    let greetings;
    if (hour < 12){
        greetings = "Good Morning";
    }else if (hour < 17){
        greetings = "Good Afternoon";
    } else  if (hour < 21){
        greetings = "Good Evening";
    } else {
        greetings = "Good Night";
    }
  return (
    <div>
      <h2>{greetings}.</h2>
    </div>
  )
}

export default Greetings
