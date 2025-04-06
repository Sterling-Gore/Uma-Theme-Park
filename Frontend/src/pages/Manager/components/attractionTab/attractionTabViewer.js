import React, { useState, useRef, useEffect } from 'react';
import HandleAttraction from './handleAttraction';
import CreateAttraction from './createAttraction';
import '../../ManagerPortal.css';

function AttractionTabViewer() {
  const [innerActiveTab, setInnerActiveTab] = useState('handleAttractions');

  function swapTabs(switchToHandle)
    {
      if(switchToHandle !== (innerActiveTab ===  "handleAttractions"))
      {
        //setShowActiveLog(isActiveLog);
        if(switchToHandle)
        {
          setInnerActiveTab("handleAttractions");
        }
        else
        {
          setInnerActiveTab("createAttraction");
        }
        
      }
    }

  

  return (
    <>
    <div className="dashboard-container">
        <div className="content-header">
            <h2>Attractions</h2>
            <div className="filter-buttons">
              <button
                className={innerActiveTab ===  "handleAttractions" ? "active-filter" : ""}
                onClick={() => swapTabs(true)}
              >
                View Attractions
              </button>
              <button
                className={innerActiveTab ===  "createAttraction" ? "active-filter" : ""}
                onClick={() => swapTabs(false)}
              >
                Create Attraction
              </button>
            </div>
        </div>
    {innerActiveTab === 'handleAttractions' && <HandleAttraction setInnerActiveTab={setInnerActiveTab} />}
    {innerActiveTab === 'createAttraction' && <CreateAttraction setInnerActiveTab={setInnerActiveTab} />}
    </div>
    </>
    
  );
}

export default AttractionTabViewer;