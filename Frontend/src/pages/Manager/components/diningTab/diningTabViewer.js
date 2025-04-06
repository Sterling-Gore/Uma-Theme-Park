import React, { useState, useRef, useEffect } from 'react';
import HandleDining from './handleDining';
import CreateDining from './createDining';
import '../../ManagerPortal.css';

function DiningTabViewer() {
  const [innerActiveTab, setInnerActiveTab] = useState('handleDining');

  function swapTabs(switchToHandle)
    {
      if(switchToHandle !== (innerActiveTab ===  "handleDining"))
      {
        //setShowActiveLog(isActiveLog);
        if(switchToHandle)
        {
          setInnerActiveTab("handleDining");
        }
        else
        {
          setInnerActiveTab("createDining");
        }
        
      }
    }

  

  return (
    <>
    <div className="dashboard-container">
        <div className="content-header">
            <h2>Dinings</h2>
            <div className="filter-buttons">
              <button
                className={innerActiveTab ===  "handleDining" ? "active-filter" : ""}
                onClick={() => swapTabs(true)}
              >
                View Dinings
              </button>
              <button
                className={innerActiveTab ===  "createDining" ? "active-filter" : ""}
                onClick={() => swapTabs(false)}
              >
                Create Dining
              </button>
            </div>
        </div>
    {innerActiveTab === 'handleDining' && <HandleDining setInnerActiveTab={setInnerActiveTab} />}
    {innerActiveTab === 'createDining' && <CreateDining setInnerActiveTab={setInnerActiveTab} />}
    </div>
    </>
    
  );
}

export default DiningTabViewer;