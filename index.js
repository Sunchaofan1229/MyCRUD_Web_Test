const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json()); // 用于解析JSON格式的请求体

// MongoDB连接
mongoose.connect('mongodb://mongo:woaita123@124.222.56.247:22/HUAWEI', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));

const phoneSchema = new mongoose.Schema({
    model: String,
    specifications: {
        processor: String,
        screenSize: String,
        battery: String,
        camera: {
            rear: String,
            front: String
        },
        storage: {
            RAM: String,
            ROM: String
        },
        OS: String
    },
    price: Number,
    stock: Number
});

const Phone = mongoose.model('Phone', phoneSchema);

// CRUD API
// 获取所有手机
app.get('/phones', async (req, res) => {
    try {
        const phones = await Phone.find();
        res.json(phones);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 创建新手机
app.post('/phones', async (req, res) => {
    const phone = new Phone(req.body);
    try {
        const newPhone = await phone.save();
        res.status(201).json(newPhone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 获取指定手机
app.get('/phones/:id', async (req, res) => {
    try {
        const phone = await Phone.findById(req.params.id);
        if (!phone) {
            return res.status(404).json({ message: '无法找到该手机' });
        }
        res.json(phone);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 更新手机
app.put('/phones/:id', async (req, res) => {
    try {
        const updatedPhone = await Phone.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPhone);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// 删除手机
app.delete('/phones/:id', async (req, res) => {
    try {
        const phone = await Phone.findByIdAndDelete(req.params.id);
        if (!phone) {
            return res.status(404).json({ message: '无法找到该手机' });
        }
        res.json({ message: '手机已删除' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`服务器正在运行在端口${PORT}`));
