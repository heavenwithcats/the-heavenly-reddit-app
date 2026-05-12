import React, {useState, useEffect} from "react";
import { lightsaberInactive } from './lightsaber-like-inactive.png'
import { lightsaberActive } from './lightsaber-like.png'

const App = () => {
    const [lightsaberToggle, setLightsaberToggle] = useState(false)
  
  useEffect(() => {
    

    if(lightsaberToggle) {
    
    lightsaber = `url(${lightsaberActive})`
    
   
  }else{
     
     lightsaber = `url(${lightsaberInactive})`
    
  
    }
  
  }, [lightsaberToggle]);

  return (
    <img onClick={() => setWolfToggle(!wolfToggle)} url={lightsaber}/>
  )
}


