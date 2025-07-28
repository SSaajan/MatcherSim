
import { useState } from "react";
import GanttChartComponent from "./components/ganttChartComponent.jsx";

function App() {
  const RUNNING_TIME = 2; // Defining here temporarily to format data for Gantt chart
  const [message, setMessage] = useState("");
  const [simulationCompleted, setSimulationCompleted] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState("");
  const [ganttData, setGanttData] = useState([]);
  const [processFile, setProcessFile] = useState(null);
  const [resourceFile, setResourceFile] = useState(null);

  const worker = new Worker(new URL('../worker/worker.js?worker&inline', import.meta.url));
  
  const fileUploadHandler = (event) => {
    event.preventDefault();
    setProcessFile(event.target.processFile.files[0]);
    setResourceFile(event.target.resourceFile.files[0]);
    setMessage("Files uploaded successfully");
  }

  const simulate = () => {
    if(!processFile || !resourceFile) {
      setMessage("Please upload both files before simulating.");
      return;
    }
    worker.onmessage = (e) => {
      setSimulationCompleted(true);
      setMessage("Simulation completed successfully");
      const blob = new Blob([e.data.result], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      setDownloadUrl(url);
      formGanttData(e.data.result, e.data.processList);
    };
    worker.postMessage({processFile, resourceFile, RUNNING_TIME});
  }

  const downloadResults = () => {
    if (downloadUrl) {
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "simulation_results.csv";
      a.click();
      URL.revokeObjectURL(downloadUrl);
      setDownloadUrl(null);
      setMessage("Results downloaded successfully!");
    }
  }

  const formGanttData = (data, processList) => {
    //Processes the simulation result to get process_id -> matchedAt mapping
    const lines = data.split('\n').slice(1);
    const resultObj = {};
    
    lines.forEach(line => {
      const [process_id, resource_id, matchedAt, wait_time_secs, status] = line.split(',');
      if (process_id && matchedAt) {
        resultObj[process_id] = {
          matchedAt: matchedAt,
          wait_time_secs: wait_time_secs,
          status: status
        };
      }
    });

    //Combining processList and matchedAt data from simulation result for chart
    const ganttData = [];
    for(const process of processList) {
      let endTime;
      if(resultObj[process.process_id] === "-") {
        endTime = new Date((process.request_time + resultObj[process.process_id].wait_time_secs) * 1000);
      } else {
        endTime = new Date((Number(resultObj[process.process_id].matchedAt) + RUNNING_TIME) * 1000)
      }
      ganttData.push({
        id: process.process_id,
        name: process.process_id,
        start: new Date(process.request_time * 1000),
        end: endTime,
        progress: 50,
        status: resultObj[process.process_id].status
      });
    }
    setGanttData(ganttData);
  }

  const resetSim = () => {
    setSimulationCompleted(false);
    setDownloadUrl("");
    setGanttData([]);
    setProcessFile(null);
    setResourceFile(null);
    setMessage("");
  }

  return (
    <div className="parent-container">
      <h1>Matching Simulator</h1>
      <div>
        <form onSubmit={fileUploadHandler} className="file-upload-form">
          <h2>Upload Files</h2>
          <div>
            <label>Process File: </label>
            <input onClick={resetSim} type="file" name="processFile"/>
          </div>
          <div>
            <label className="input-label">Resource File:</label>
            <input onClick={resetSim} type="file" name="resourceFile"/>
          </div>
          <button type="submit">Upload</button>
        </form>
      </div>
      <p>{message}</p>
      <div className="button-container">
        <button onClick={simulate} disabled={!processFile || !resourceFile}>
          Simulate Now
        </button>
        {simulationCompleted && (
          <button onClick={downloadResults}>Download Results</button>
        )}
      </div>
      
      {simulationCompleted && ganttData.length > 0 && (
        <div className="gantt-container">
          <GanttChartComponent data={ganttData} />
        </div>
      )}
    </div>
  )
}

export default App
