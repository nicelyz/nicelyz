// backend/controllers/adminController.js
const Device = require('../models/Device');

exports.createDevice = async (req, res) => {
    const { name, zone, ipAddress, probability, videoStreamURL } = req.body;
    if (!name || !zone || !ipAddress) {
        return res.status(400).json({ message: 'name、zone、ipAddress为必填字段' });
    }

    // 检查ipAddress是否唯一
    const existing = await Device.findOne({ ipAddress });
    if (existing) {
        return res.status(400).json({ message: '该IP地址已存在' });
    }

    const newDevice = new Device({
        name,
        zone,
        ipAddress,
        probability: probability || 100,
        status: 'idle',
        videoStreamURL: videoStreamURL || ''
    });

    await newDevice.save();
    return res.status(201).json({ message: '设备创建成功', deviceId: newDevice._id.toString() });
};

exports.getDevices = async (req, res) => {
    // 可根据需要添加过滤参数
    const devices = await Device.find({});
    return res.status(200).json(devices);
};

exports.getDeviceById = async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
        return res.status(404).json({ message: '设备不存在' });
    }
    return res.status(200).json(device);
};

exports.updateDevice = async (req, res) => {
    const { id } = req.params;
    const { name, zone, ipAddress, probability, videoStreamURL, status } = req.body;

    const device = await Device.findById(id);
    if (!device) {
        return res.status(404).json({ message: '设备不存在' });
    }

    if (ipAddress && ipAddress !== device.ipAddress) {
        // 检查新的ipAddress是否冲突
        const existing = await Device.findOne({ ipAddress });
        if (existing) {
            return res.status(400).json({ message: '该IP地址已存在' });
        }
    }

    if (name !== undefined) device.name = name;
    if (zone !== undefined) device.zone = zone;
    if (ipAddress !== undefined) device.ipAddress = ipAddress;
    if (probability !== undefined) device.probability = probability;
    if (videoStreamURL !== undefined) device.videoStreamURL = videoStreamURL;
    if (status !== undefined) {
        if (!['idle', 'occupied', 'fault'].includes(status)) {
            return res.status(400).json({ message: '状态无效，必须为idle、occupied或fault' });
        }
        device.status = status;
        if (status === 'idle') {
            device.currentHolder = null; // 如果状态为idle则清空持有者
        }
    }

    await device.save();
    return res.status(200).json({ message: '设备更新成功' });
};

exports.deleteDevice = async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id);
    if (!device) {
        return res.status(404).json({ message: '设备不存在' });
    }

    await Device.deleteOne({ _id: id });
    return res.status(200).json({ message: '设备已删除' });
};
