import si from "systeminformation";

export const collectMetrics = async()=>{

    const cpu = await si.currentLoad();

    const memory = await si.mem();

    const disk = await si.fsSize();

    const network = await si.networkStats();

    return {
        cpu: Number(cpu.currentLoad.toFixed(2)),
        memory: Number(((memory.used / memory.total) * 100).toFixed(2)),
        disk: Number((disk[0]?.use || 0).toFixed(2)),
        networkRx: network[0]?.rx_bytes || 0,
        networkTx: network[0]?.tx_bytes || 0
    };
};