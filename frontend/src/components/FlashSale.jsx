
import { useEffect, useState } from "react";
function FlashSale() {
  const[time,setTime]=useState({
    hours:1,
    minutes:40,
    seconds:10,
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
<div className="w-full min-h-[20px] sm:min-h-[50px] bg-[#85866A] text-white flex items-center justify-center gap-4 sm:gap-8 px-2 sm:px-4">  
  <div className="flex items-center gap-1 sm:gap-3 whitespace-nowrap">
      <strong className="text-sm sm:text-lg md:text-[18px] font-bold">
      Flash Sale: Buy 1 Get 1 Free
      </strong>
    </div>
      <div className="flex items-center gap-1 sm:gap-2 shrink-0">

    <div className="flex flex-col items-center leading-none pb-2">
      <strong className="text-lg sm:text-xl md:text-[20px]">
        {String(time.hours).padStart(2, "0")}
      </strong>
      <small className="text-[6px] sm:text-[8px] md:text-[8px]">
          HRS
        </small>
      </div>
    <span className="text-lg sm:text-xl md:text-[18px] font-bold">
     :
   </span>
   {/* minutes */}
       <div className="flex flex-col items-center leading-none pb-2">
      <strong className="text-lg sm:text-xl md:text-[20px]">
        {String(time.minutes).padStart(2, "0")}
      </strong>

      <small className="text-[6px] sm:text-[8px] md:text-[8px]">
        MINS
      </small>
    </div>

    <span className="text-lg sm:text-xl md:text-[18px] font-bold">
      :
    </span>

    <div className="flex flex-col items-center leading-none pb-2">
      <strong className="text-lg sm:text-xl md:text-[20px]">
        {String(time.seconds).padStart(2, "0")}
      </strong>

      <small className="text-[6px] sm:text-[8px] md:text-[8px]">
        SECS
      </small>
    </div>

  </div>

</div>
  );
}

export default FlashSale;