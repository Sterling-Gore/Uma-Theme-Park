import React, { useState, useRef, useEffect } from 'react';
import HandleMerchandise from './HandleMerchandise';
import CreateMerchandise from './createMerchandise';
import '../../ManagerPortal.css';

function MerchandiseTabViewer() {
  const [innerActiveTab, setInnerActiveTab] = useState('handleMerchandise');

  function swapTabs(switchToHandle)
    {
      if(switchToHandle !== (innerActiveTab ===  "handleMerchandise"))
      {
        //setShowActiveLog(isActiveLog);
        if(switchToHandle)
        {
          setInnerActiveTab("handleMerchandise");
        }
        else
        {
          setInnerActiveTab("createMerchandise");
        }
        
      }
    }

  

  return (
    <>
    <div className="dashboard-container">
        <div className="content-header">
            <h2>Merchandise</h2>
            <div className="filter-buttons">
              <button
                className={innerActiveTab ===  "handleMerchandise" ? "active-filter" : ""}
                onClick={() => swapTabs(true)}
              >
                View Merchandise
              </button>
              <button
                className={innerActiveTab ===  "createMerchandise" ? "active-filter" : ""}
                onClick={() => swapTabs(false)}
              >
                Create Merchandise
              </button>
            </div>
        </div>
    {innerActiveTab === 'handleMerchandise' && <HandleMerchandise setInnerActiveTab={setInnerActiveTab} />}
    {innerActiveTab === 'createMerchandise' && <CreateMerchandise setInnerActiveTab={setInnerActiveTab} />}
    </div>
    </>
    
  );
}

export default MerchandiseTabViewer;