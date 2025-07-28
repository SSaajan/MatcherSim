//Extracted matcher function for testing

export default function matchResourceToProcess(resourceData, processData) {
    const runningTime = 2;
    //Creating a resource pool for quick access
    const resourcePoolMap = {};
    const processDataMap = {};
    for(const res of resourceData) {
        resourcePoolMap[res.resource_id] = res;
    }
    for(const process of processData) {
        processDataMap[process.process_id] = process;
    }

    //Adding process IDs to a queue for processing
    let processQueue = processData.map(process => process.process_id).sort((a, b) => a.request_time - b.request_time);
    //Initializing the clock to the arrival time of the first process, assuming this is where the simulation starts
    let clock = processDataMap[processQueue[0]].request_time;

    while(processQueue.length > 0) {
        let procIndex = 0;
        for(; procIndex < processQueue.length; ) {
            const process = processDataMap[processQueue[procIndex]];
            //Processes which have not yet arrived are skipped to simulate real-time processing
            if(process.request_time > clock) {
                clock++;
                procIndex++;
                continue;
            }

            //Process has timed out -> dropped
            if(process.request_time + process.timeout <= clock) {
                processDataMap[process.process_id].status = "dropped";
                processDataMap[process.process_id].resource_id = "-";
                processDataMap[process.process_id].wait_time_secs = clock - processDataMap[process.process_id].request_time;
                processDataMap[process.process_id].matchedAt = "-";
                processQueue = processQueue.filter(p => p !== process.process_id);
                procIndex = 0; //Resetting index to start from the beginning of the queue since the queue has changed
                continue;
            }

            //Finding valid resources for the process
            const validResources = findResourceForProcess(process, resourceData);

            //If no valid resources found which satisfies the hard constraints, drop process from queue
            if(validResources.length == 0) {
                processDataMap[process.process_id].status = "dropped";
                processDataMap[process.process_id].resource_id = "-";
                processDataMap[process.process_id].wait_time_secs = -1;
                processDataMap[process.process_id].matchedAt = "-";
                processQueue = processQueue.filter(p => p !== process.process_id);
                procIndex = 0; //Resetting index to start from the beginning of the queue since the queue has changed
                continue;
            }

            let allotted = false;
            //Iterating through valid resources to find an available resource
            //Iterates from highest scoring resource to lowest, assigns the first available resource
            for(let resIdx = 0; resIdx < validResources.length; resIdx++) {
                const resId = validResources[resIdx].resource.resource_id;
                if(resourcePoolMap[resId].available_at <= clock) {
                    processDataMap[process.process_id].status = "matched";
                    processDataMap[process.process_id].resource_id = resId;
                    processDataMap[process.process_id].wait_time_secs = clock - processDataMap[process.process_id].request_time;
                    processDataMap[process.process_id].matchedAt = clock;
                    //Marking resource as unavailable - next_available_at will be used as parameter to determine resource availability
                    resourcePoolMap[resId].available_at = clock + runningTime;
                    //Removing matched process from queue since resource is found
                    processQueue = processQueue.filter(p => p !== process.process_id);
                    procIndex = 0; //Resetting index to start from the beginning of the queue since the queue has changed
                    allotted = true;
                    break;
                }
            }

            if(!allotted) {
                procIndex++;
            }

            //Stepping clock forward by 1 second to simulate processing time
            //Arbitarily chose 1 second as the lowest unit of time
            clock += 1;
        }
    }
    return processDataMap;
}

//Finds all valid resources for a process and orders rhem by soft score
function findResourceForProcess(process, resources) {
    let validResources = [];
    for(let j = 0; j < resources.length; j++) {
        const resource = resources[j];
        let resValid = 1;

        //Hard constraints check
        for(const constraint of Object.keys(process.constraints)) {
            if(resource.capabilities[constraint] 
                && resource.capabilities[constraint] != process.constraints[constraint]
            ) {
                //Hard constraint not met
                resValid = 0;
                break;
            }
        }

        //Hard constraints met, now checking soft constraints
        if (resValid) {
            let softScore = 0;
            for(const pref of Object.keys(process.preferences)) {
                const prefKey = Object.keys(process.preferences[pref]).find(k => k !== 'priority');
                if (resource.capabilities[pref] && resource.capabilities[pref] == process.preferences[pref][prefKey]) {
                    softScore += 1 / process.preferences[pref].priority;
                }
            }  

            //To return valid resources
            validResources.push({
                score: softScore, 
                resource: resource
            });
        }
    }
    return validResources.sort((a, b) => b.score - a.score);
}