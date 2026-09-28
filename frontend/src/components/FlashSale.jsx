
import { useEffect, useState } from "react";
function FlashSale() {
  const[time,setTime]=useState({
    hours:0,
    minutes:50,
    seconds:13,
  });
  useEffect(()=>{
     const timer=setInterval(() => {
       setTime((prev) => {

      let { hours, minutes, seconds } = prev;

      if (seconds > 0) {
        seconds--;
      }else{
        seconds=59;
        if(minutes>0){
          minutes--;
        }else{
          minutes=59;
          if(hours>0){
            hours--;
          }else{
            hours=23;
          }
        }
      }
return {
    hours,
    minutes,
    seconds,
  };
     });
     }, 1000);
       return () => clearInterval(timer);
  }, []);

  return (
<div className="w-full min-h-[60px] sm:min-h-[75px] bg-pink-600 text-white flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-4">
  <div className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
      <strong className="text-sm sm:text-lg md:text-[23px] font-bold">
      Flash Sale: Buy 1 Get 1 Free
      </strong>
    <span className="text-[10px] sm:text-sm md:text-base">
         (Grab Fast)
      </span>
    </div>
    {/* timer */}
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">

    <div className="flex flex-col items-center leading-none">
      <strong className="text-lg sm:text-2xl md:text-[30px]">
        {String(time.hours).padStart(2, "0")}
      </strong>
      <small className="text-[6px] sm:text-[8px] md:text-[10px]">
          HRS
        </small>
      </div>
    <span className="text-lg sm:text-2xl md:text-[28px] font-bold">
     :
   </span>
   {/* minutes */}
       <div className="flex flex-col items-center leading-none">
      <strong className="text-lg sm:text-2xl md:text-[30px]">
        {String(time.minutes).padStart(2, "0")}
      </strong>

      <small className="text-[6px] sm:text-[8px] md:text-[10px]">
        MINS
      </small>
    </div>

    <span className="text-lg sm:text-2xl md:text-[28px] font-bold">
      :
    </span>

    <div className="flex flex-col items-center leading-none">
      <strong className="text-lg sm:text-2xl md:text-[30px]">
        {String(time.seconds).padStart(2, "0")}
      </strong>

      <small className="text-[6px] sm:text-[8px] md:text-[10px]">
        SECS
      </small>
    </div>

  </div>

</div>
  );
}

export default FlashSale;