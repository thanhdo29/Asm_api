const express = require('express');
const router = express.Router();
const path = require('path');

const mongoose = require('mongoose');
const carModel = require('../carModel');
const multer = require('multer'); // Thêm thư viện multer để xử lý tải ảnh lên
const fs = require('fs'); // Thêm thư viện fs để xử lý file


const uploadDir = path.join(__dirname, 'uploads');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage: storage });

router.post('/add_car', upload.single('image'), async (req, res) => { // Thay đổi endpoint và tên hàm thành 'add_car'
    const { ten, namSx, hang, gia } = req.body; // Thay đổi tên biến tương ứng với dữ liệu xe
    const image=req.file;
    try {
        // Tạo một đối tượng Car mới từ dữ liệu nhận được
        const newCar = new carModel({
            ten:ten,
            namSx:namSx,
            hang:hang,
            gia:gia,
            image: image? image.filename: 'default.jpg' // Lưu tên tệp ảnh vào cơ sở dữ liệu
        });

        // Lưu đối tượng Car mới vào cơ sở dữ liệu
        await newCar.save();

        // Trả về thông báo và đối tượng Car vừa thêm thành công
        res.status(201).json({ message: 'Car added successfully', car: newCar });
    } catch (error) {
        // Xử lý lỗi nếu có bất kỳ lỗi nào xảy ra
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
router.get('/list', async (req, res) => {
    try {
        const cars = await carModel.find();
        res.send(cars);
    } catch (error) {
        handleError(res, error);
    }
});



router.put('/update_xe/:id', upload.single('image'), async (req, res) => { // Thêm hỗ trợ tải ảnh lên trong yêu cầu PUT
    try {
        const carId = req.params.id;
        const updatedData = req.body;
        if (req.file) {
            updatedData.imageUrl = req.file.path; // Lưu đường dẫn của ảnh vào cơ sở dữ liệu nếu có ảnh mới được tải lên
        }
        const updatedCar = await carModel.findByIdAndUpdate(carId, updatedData, { new: true });
        if (updatedCar) {
            res.status(200).json(updatedCar);
        } else {
            res.status(404).send("Không tìm thấy xe");
        }
    } catch (error) {
        handleError(res, error);
    }
});

router.delete('/delete_xe/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedItem = await carModel.findByIdAndDelete(id);
        if (!deletedItem) {
            return res.status(404).json({ message: 'Không tìm thấy item để xóa' });
        }
        // Xóa ảnh từ thư mục 'uploads/' khi xóa sản phẩm
        if (deletedItem.imageUrl) {
            fs.unlinkSync(deletedItem.imageUrl);
        }
        res.json({ message: 'Đã xóa thành công', deletedItem });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/search-car', async (req, res) => {
    try {
        const key = req.query.key;
        const data = await carModel.find({ ten: { "$regex": key, "$options": "i" } });
        res.json({
            status: 200,
            messenger: "Thành công",
            data: data || []
        });
    } catch (error) {
        handleError(res, error);
    }
});

router.get('/sort-car', async (req, res) => {
    try {
        const sortBy = req.query.sortBy; 
        let sortCriteria = {};
        
        if (sortBy === 'asc') {
            sortCriteria = { gia: 1 }; 
        } else if (sortBy === 'desc') {
            sortCriteria = { gia: -1 }; 
        } else {
            return res.status(400).json({ message: 'Tiêu chí sắp xếp không hợp lệ' });
        }
        
        const sortedCars = await carModel.find().sort(sortCriteria);
        res.json(sortedCars);
    } catch (error) {
        handleError(res, error);
    }
});

module.exports = router;
