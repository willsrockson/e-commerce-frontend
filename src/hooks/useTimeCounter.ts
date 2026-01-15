
import { useEffect, useState } from 'react'

type TimeCounter = {
    inputMinutes: number;
    inputSeconds?: number;
    type: 'down'|'up';
}

export default function useTimeCounter({inputMinutes = 1, inputSeconds = 59, type}: TimeCounter) { 
    const [seconds, setSeconds] = useState(inputSeconds);
    const [minute, setMinute] = useState(inputMinutes - 1);
    const [open, setOpen] = useState(false);


         useEffect(() => {
            if (open === false) return;
            console.log('m:'+minute, 's:'+ seconds);
            
            const timer = setInterval(() => { 
                  if (type === 'down') {
                     if (seconds === 0) {
                        setMinute((prev)=>{
                             if(prev !== 0){
                                return prev = prev - 1
                             }
                             return 0
                        })
                        setSeconds(60)
                     }
                    setSeconds((prev)=> prev - 1)
                    if(minute === 0 && seconds <= 1) {
                        //setIsOtpIn(false);
                        setOpen(false);
                        setMinute(inputMinutes - 1);
                        setSeconds(inputSeconds);
                    } 
                  }
                
            }, 1000);
     
            return () => clearInterval(timer);
         }, [inputMinutes, inputSeconds, minute, open, seconds, type]);
     return {
             open,
             message:`${(minute > 0) ? minute +":" :''}${seconds.toString().length == 1 ? "0" + seconds : seconds}`,
             openModal: () => setOpen(true), 
             closeModal: () => setOpen(false),
             resetTimer: ()=> {setSeconds(0); setMinute(0)}
            }
}
