const express=require('express');
const {upload}=require('../../../lib/fileUploadHelper');
const router=express.Router();
const controller=require('../../../controllers/upload');

router.post('/singleFile',upload.single('file',controller.singleFileUpload))
    .post('/multipleFiles',upload.array('files',controller.multipleFileUpload))
    .get('/getSingleFile',controller.getAllSingleFiles)
    .get('/getMultipleFies',controller.getAllMultipleFiles)
    .delete('/single/:id',controller.deleteSingleFile)
    .delete('/mutiple/:id',controller.deleteMultipleFiles)

module.exports=router