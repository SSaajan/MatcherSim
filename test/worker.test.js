import matchResourceToProcess from "../src/utils/matcher";

//Defining a single base case here to basic testing
describe('MatcherSim Tests', () => {
    it('should work for base case', () => {
        const resourceData = [
            {resource_id: "RES001", available_at: 1753696740, capabilities: {resource_type: "GPU", os: "Linux", location: "zone-1", capacity_class: "high"}},
            {resource_id: "RES002", available_at: 1753696740, capabilities: {resource_type: "CPU", os: "Windows", location: "zone-2", capacity_class: "medium"}},
            {resource_id: "RES003", available_at: 1753696740, capabilities: {resource_type: "TPU", os: "Linux", location: "zone-3", capacity_class: "low"}},
            {resource_id: "RES004", available_at: 1753696748, capabilities: {resource_type: "FPGA", os: "MacOS", location: "zone-4", capacity_class: "medium"}},
            {resource_id: "RES005", available_at: 1753696740, capabilities: {resource_type: "CPU", os: "Linux", location: "zone-5", capacity_class: "high"}}
        ]

        const processData = [
            {process_id: "PROC001", request_time: 1753696740, timeout: 4, constraints: {resource_type: "GPU", os: "Linux"}, preferences: {location: {zone: "zone-1", priority: 1}, capacity_class: {class: "high", priority: 2}}},
            {process_id: "PROC002", request_time: 1753696743, timeout: 4, constraints: {resource_type: "CPU", os: "Windows"}, preferences: {location: {zone: "zone-2", priority: 1}, capacity_class: {class: "medium", priority: 2}}},
            {process_id: "PROC003", request_time: 1753696743, timeout: 4, constraints: {resource_type: "TPU", os: "Linux"}, preferences: {location: {zone: "zone-3", priority: 1}, capacity_class: {class: "low", priority: 2}}},
            {process_id: "PROC004", request_time: 1753696744, timeout: 4, constraints: {resource_type: "FPGA", os: "MacOS"}, preferences: {location: {zone: "zone-4", priority: 1}, capacity_class: {class: "medium", priority: 2}}},
            {process_id: "PROC005", request_time: 1753696744, timeout: 4, constraints: {resource_type: "CPU", os: "Linux"}, preferences: {location: {zone: "zone-5", priority: 1}, capacity_class: {class: "high", priority: 2}}},
            {process_id: "PROC006", request_time: 1753696744, timeout: 4, constraints: {resource_type: "GPU", os: "Linux"}, preferences: {location: {zone: "zone-1", priority: 1}, capacity_class: {class: "high", priority: 2}}},
            {process_id: "PROC007", request_time: 1753696745, timeout: 4, constraints: {resource_type: "CPU", os: "Windows"}, preferences: {location: {zone: "zone-2", priority: 1}, capacity_class: {class: "medium", priority: 2}}},
            {process_id: "PROC008", request_time: 1753696745, timeout: 4, constraints: {resource_type: "TPU", os: "Linux"}, preferences: {location: {zone: "zone-3", priority: 1}, capacity_class: {class: "low", priority: 2}}},
            {process_id: "PROC009", request_time: 1753696748, timeout: 4, constraints: {resource_type: "FPGA", os: "MacOS"}, preferences: {location: {zone: "zone-4", priority: 1}, capacity_class: {class: "medium", priority: 2}}},
            {process_id: "PROC010", request_time: 1753696748, timeout: 4, constraints: {resource_type: "CPU", os: "Linux"}, preferences: {location: {zone: "zone-5", priority: 1}, capacity_class: {class: "high", priority: 2}}}
        ]

        const result = matchResourceToProcess(resourceData, processData);
        expect(result).toBeDefined([
            {process_id:"PROC001",request_time:1753696740,timeout:4,constraints:{resource_type:"GPU",os:"Linux"},preferences:{location:{zone:"zone-1",priority:1},capacity_class:{class:"high",priority:2}},status:"matched",resource_id:"RES001",wait_time_secs:0,matchedAt:1753696740},
            {process_id:"PROC002",request_time:1753696743,timeout:4,constraints:{resource_type:"CPU",os:"Windows"},preferences:{location:{zone:"zone-2",priority:1},capacity_class:{class:"medium",priority:2}},status:"matched",resource_id:"RES002",wait_time_secs:2,matchedAt:1753696745},
            {process_id:"PROC003",request_time:1753696743,timeout:4,constraints:{resource_type:"TPU",os:"Linux"},preferences:{location:{zone:"zone-3",priority:1},capacity_class:{class:"low",priority:2}},status:"matched",resource_id:"RES003",wait_time_secs:3,matchedAt:1753696746},
            {process_id:"PROC004",request_time:1753696744,timeout:4,constraints:{resource_type:"FPGA",os:"MacOS"},preferences:{location:{zone:"zone-4",priority:1},capacity_class:{class:"medium",priority:2}},status:"dropped",resource_id:"-",wait_time_secs:4,matchedAt:"-"},
            {process_id:"PROC005",request_time:1753696744,timeout:4,constraints:{resource_type:"CPU",os:"Linux"},preferences:{location:{zone:"zone-5",priority:1},capacity_class:{class:"high",priority:2}},status:"matched",resource_id:"RES005",wait_time_secs:0,matchedAt:1753696744},
            {process_id:"PROC006",request_time:1753696744,timeout:4,constraints:{resource_type:"GPU",os:"Linux"},preferences:{location:{zone:"zone-1",priority:1},capacity_class:{class:"high",priority:2}},status:"dropped",resource_id:"-",wait_time_secs:4,matchedAt:"-"},
            {process_id:"PROC007",request_time:1753696745,timeout:4,constraints:{resource_type:"CPU",os:"Windows"},preferences:{location:{zone:"zone-2",priority:1},capacity_class:{class:"medium",priority:2}},status:"matched",resource_id:"RES002",wait_time_secs:3,matchedAt:1753696748},
            {process_id:"PROC008",request_time:1753696745,timeout:4,constraints:{resource_type:"TPU",os:"Linux"},preferences:{location:{zone:"zone-3",priority:1},capacity_class:{class:"low",priority:2}},status:"dropped",resource_id:"-",wait_time_secs:4,matchedAt:"-"},
            {process_id:"PROC009",request_time:1753696748,timeout:4,constraints:{resource_type:"FPGA",os:"MacOS"},preferences:{location:{zone:"zone-4",priority:1},capacity_class:{class:"medium",priority:2}},status:"matched",resource_id:"RES004",wait_time_secs:1,matchedAt:1753696749},
            {process_id:"PROC010",request_time:1753696748,timeout:4,constraints:{resource_type:"CPU",os:"Linux"},preferences:{location:{zone:"zone-5",priority:1},capacity_class:{class:"high",priority:2}},status:"matched",resource_id:"RES005",wait_time_secs:2,matchedAt:1753696750}
        ]);
    });

    it('should handle process not having a valid resource', () => {
        const resourceData = [
            {resource_id: "RES001", available_at: 1753696740, capabilities: {resource_type: "GPU", os: "Linux", location: "zone-1", capacity_class: "high"}},
        ]
        const processData = [
            {process_id: "PROC001", request_time: 1753696740, timeout: 4, constraints: {resource_type: "CPU", os: "Linux"}, preferences: {location: {zone: "zone-1", priority: 1}, capacity_class: {class: "high", priority: 2}}},
        ]
        const result = matchResourceToProcess(resourceData, processData);
        expect(result['PROC001']).toEqual(
            {process_id:"PROC001",request_time:1753696740,timeout:4,constraints:{resource_type:"CPU",os:"Linux"},preferences:{location:{zone:"zone-1",priority:1},capacity_class:{class:"high",priority:2}},status:"dropped",resource_id:"-",wait_time_secs:-1,matchedAt:'-'},
        );
    });
})